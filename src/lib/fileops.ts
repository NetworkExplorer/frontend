import { PromptProps } from "@components";
import { BubbleI } from "@models";
import Endpoints from "./Endpoints";
import { FileI } from "./types";
import { normalizeURL } from "./util";

type PFunc = (prompt?: PromptProps) => void;
type BFunc = (key: string, bubble: BubbleI) => void;

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
      callback: (val) => {
        if (file.type !== "header") {
          const base = normalizeURL(window.location.pathname);
          try {
            Endpoints.getInstance().move(base + file.name, base + val);
            resolve();
          } catch (err) {
            addBubble("rename-error", {
              title: `Could not rename ${
                file.type === "FILE" ? "file" : "folder"
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

export function onCreateFolder(setPrompt: PFunc, addBubble: BFunc): void {
  setPrompt({
    fieldName: "folder name",
    initial: "",
    //eslint-disable-next-line
    callback: async (value: string) => {
      try {
        await Endpoints.getInstance().mkdir(
          normalizeURL(window.location.pathname) + value
        );
      } catch (err) {
        addBubble("mkdir-error", {
          title: `Failed to create directory "${value}"`,
          message: err.message,
          type: "ERROR",
        });
      }
    },
  });
}

export function onFilesDownload(selected: Set<FileI>): void {
  if (selected.size <= 0) return;
  const url = normalizeURL(window.location.pathname);

  const urls = [];
  for (const f of selected) {
    urls.push(url + f.name);
  }
  Endpoints.getInstance().getFiles(urls);
}

export async function onDelete(
  selected: Set<FileI>,
  addBubble: BFunc
): Promise<void> {
  if (selected.size <= 0) return;

  const files: string[] = [];
  for (const file of selected) {
    files.push(normalizeURL(window.location.pathname, false) + file.name);
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

export function onFileDownload(file: FileI): void {
  if (!file) return;
  const url = normalizeURL(window.location.pathname);
  Endpoints.getInstance().getFile(url + file.name, file.name);
}

export function onFolderDownload(file: FileI): void {
  if (!file) return;
  const url = normalizeURL(window.location.pathname);
  Endpoints.getInstance().getFile(url + file.name, `${file.name}.zip`);
}
