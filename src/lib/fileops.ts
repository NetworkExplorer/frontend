import { PromptProps } from "@components";
import { BubbleI, ProgressFileI } from "@models";
import { addProgressFiles, updateProgressFile } from "@store/files";
// import { FileSystemEntry } from "@models/file";
import Endpoints from "./Endpoints";
import { getCurrentFilesPath } from "./routes";
import { FileI } from "./types";
import { normalizeURL } from "./util";

type PFunc = (prompt?: PromptProps) => void;
type BFunc = (key: string, bubble: BubbleI) => void;
type AddPFunc = (files: ProgressFileI[]) => void;
type UpdatePFunc = (file: ProgressFileI) => void;

export function onRename(
  file: FileI,
  setPrompt: PFunc,
  addBubble: BFunc
): Promise<void> {
  return new Promise((resolve) => {
    if (!file) return;
    setPrompt({
      fieldName: file.type === "FILE" ? "file name" : "folder name",
      initial: file.name,
      type: "INPUT",
      callback: (val) => {
        if (file.type !== "header") {
          const base = normalizeURL(getCurrentFilesPath());
          try {
            Endpoints.getInstance().move(base + file.name, base + val);
            resolve();
          } catch (err) {
            addBubble("rename-error", {
              title: `Could not rename ${file.type === "FILE" ? "file" : "folder"
                }`,
              type: "ERROR",
              message: `renaming of ${file.name} failed`,
            });
            resolve();
          }
        }
      },
    });
  });
}

export function onCreateFolder(
  setPrompt: PFunc,
  addBubble: BFunc
): Promise<void> {
  return new Promise((resolve) => {
    setPrompt({
      fieldName: "folder name",
      initial: "",
      type: "INPUT",
      callback: async (value: string) => {
        try {
          await Endpoints.getInstance().mkdir(
            normalizeURL(getCurrentFilesPath()) + value
          );
        } catch (err) {
          addBubble("mkdir-error", {
            title: `Failed to create directory "${value}"`,
            message: err.message,
            type: "ERROR",
          });
        }
        resolve();
      },
    });
  });
}

export function onFilesDownload(selected: Set<FileI>): void {
  if (selected.size <= 0) return;
  const url = normalizeURL(getCurrentFilesPath());

  const urls = [];
  for (const f of selected) {
    urls.push(url + f.name);
  }
  Endpoints.getInstance().getFiles(urls);
}

export async function onMove(
  files: FileI[],
  folder: FileI,
  addBubble: BFunc
): Promise<void> {
  if (files.length <= 0) return;

  const base = normalizeURL(getCurrentFilesPath());
  try {
    await Promise.all(
      files.map((f) =>
        Endpoints.getInstance().move(
          base + f.name,
          `${base}${folder.name}/${f.name}`
        )
      )
    );
  } catch (e) {
    addBubble("move-error", {
      title: "Could not move files/folders",
      type: "ERROR",
      message: e.msg,
    });
  }
}

export function onDelete(
  selected: Set<FileI>,
  setPrompt: PFunc,
  addBubble: BFunc
): Promise<void> {
  if (selected.size <= 0) return Promise.resolve();

  return new Promise((resolve) => {
    setPrompt({
      fieldName: "delete",
      type: "DELETE",
      callback: async (value: string | "true") => {
        if (value === "true") {
          const files: string[] = [];
          for (const file of selected) {
            const n = normalizeURL(getCurrentFilesPath(), false, false);
            files.push(
              (n === "" ? "" : n + "/") + file.name
            );
          }

          try {
            await Endpoints.getInstance().delete(files);
          } catch (err) {
            addBubble("mkdir-error", {
              title: `Failed to files/folders"`,
              message: err.message,
              type: "ERROR",
            });
          }
        }
        resolve();
      },
    });
  });
}

export function onFileDownload(file: FileI): void {
  if (!file) return;
  const url = normalizeURL(getCurrentFilesPath());
  Endpoints.getInstance().getFile(url + file.name, file.name);
}

export function onFolderDownload(file: FileI): void {
  if (!file) return;
  const url = normalizeURL(getCurrentFilesPath());
  Endpoints.getInstance().getFiles([url + file.name], `${file.name}.zip`);
}

export async function onFileUpload(
  entry: FileSystemEntry | null,
  addBubble: BFunc,
  getFolder: () => void,
  addProgress: AddPFunc,
  updateProgress: UpdatePFunc,
  relativePath?: string,
): Promise<void> {
  if (!entry) return;
  const base = normalizeURL(getCurrentFilesPath(), false, false) === "" ? "" : normalizeURL(getCurrentFilesPath(), true, false);
  const folder = `${base}${relativePath ? relativePath + "/" : ""}`;
  try {
    if (entry.isDirectory) {
      const dir = entry as FileSystemDirectoryEntry;
      await Endpoints.getInstance().mkdir(`${folder}${entry.name}`);
      const files = await listFilesInDirectory(dir);
      if (normalizeURL(folder, false, true) === normalizeURL(base, false, true)) {
        getFolder();
      }
      await Promise.all(
        files.map((f) =>
          onFileUpload(
            f,
            addBubble,
            getFolder,
            addProgress,
            updateProgress,
            (relativePath ? relativePath + "/" : "") + dir.name
          )
        )
      );
    } else if (entry.isFile) {
      const fileEntry = entry as FileSystemFileEntry;
      const file = await getFile(fileEntry);
      return new Promise((resolve) => {
        const req = Endpoints.getInstance().uploadFile(file, folder);
        // upload progress event
        req.upload.addEventListener("progress", function (e) {
          // upload progress as percentage
          // const percent_completed = (e.loaded / e.total) * 100;
          addProgressFiles([{
            cwd: folder,
            name: file.name,
            progress: e.loaded,
            total: e.total
          }])
        });

        // req finished event
        req.addEventListener("load", function () {
          updateProgressFile({
            cwd: folder,
            name: file.name,
            progress: file.size,
            total: file.size
          })
          if (normalizeURL(folder, false, true) === normalizeURL(base, false, true)) {
            getFolder();
          }
          resolve();
        });

        req.addEventListener("error", function () {
          addBubble(`upload-error-${file.name}`, {
            title: `Could not upload ${file.name}`,
            type: "ERROR",
          })
          // TODO add error progress
          resolve()
        })
      })
    }
  } catch (e) {
    addBubble(`file-error-${entry.name}`, {
      title: `Could not upload ${entry.name}`,
      type: "ERROR",
      message: e.msg,
    });
  }
}

function getFile(item: FileSystemFileEntry): Promise<File> {
  return new Promise((resolve, reject) => {
    item.file((f) => resolve(f), reject);
  });
}

function listFilesInDirectory(
  dir: FileSystemDirectoryEntry
): Promise<FileSystemEntry[]> {
  return new Promise((resolve, reject) => {
    const r = dir.createReader();
    const files: FileSystemEntry[] = [];
    const doBatch = () => {
      r.readEntries((entries) => {
        if (entries.length > 0) {
          entries.forEach((e) => files.push(e));
          doBatch();
        } else {
          resolve(files);
        }
      }, reject);
    };
    doBatch();
  });
}
