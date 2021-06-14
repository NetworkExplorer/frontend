import { PromptProps } from "@components";
import { BubbleI, ProgressFileI } from "@models";
import Endpoints from "./Endpoints";
import { getCurrentFilesPath } from "./routes";
import { FileI } from "./file";
import { normalizeURL } from "./util";

type PFunc = (prompt?: PromptProps) => void;
type BFunc = (key: string, bubble: BubbleI) => void;
type AddPFunc = (files: ProgressFileI[]) => void;
type UpdatePFunc = (file: ProgressFileI) => void;

/**
 * helper function for renaming a file/folder
 * @param file the file/folder that should be renamed
 * @param setPrompt a dispatcher function for getting the new name
 * @param addBubble a dispatcher function for showing errors, if there are any
 * @returns a promise which resolves when the rename is done
 */
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

/**
 * helper function for creating a folder
 * @param setPrompt dispatcher function for getting the name of the folder
 * @param addBubble function for showing errors, if there are any
 * @returns a promise which resolves when the folder is created
 */
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

/**
 * helper function when multiple files are selected that should be downloaded
 * @param selected the selected files to be downloaded
 * @returns nothing
 */
export function onFilesDownload(selected: Set<FileI>): void {
	if (selected.size <= 0) return;
	const url = normalizeURL(getCurrentFilesPath());

	const urls = [];
	for (const f of selected) {
		urls.push(url + f.name);
	}
	Endpoints.getInstance().getFiles(urls);
}

/**
 * helper function for moving files/folders
 * @param files the files/folders that should be moved
 * @param folder the folder to which they should be moved to
 * @param addBubble function to show errors, if there are any
 * @returns a promise which resolves when all files were moved
 */
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

/**
 * helper function for deleting files/folders
 * @param selected the files/folders that should be deleted
 * @param setPrompt prompt for asking the user if he is sure
 * @param addBubble function to show errors, if there are any
 * @returns a promise which resolves when the files/folders are delted
 */
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

/**
 * helper function for downloading a selected file
 * @param file the selected file that should be downloaded
 * @returns nothing
 */
export function onFileDownload(file: FileI): void {
	if (!file) return;
	const url = normalizeURL(getCurrentFilesPath());
	Endpoints.getInstance().getFile(url + file.name, file.name);
}

/**
 * helper function for download a selected folder
 * @param file the folder that should be downloaded
 * @returns nothing
 */
export function onFolderDownload(file: FileI): void {
	if (!file) return;
	const url = normalizeURL(getCurrentFilesPath());
	Endpoints.getInstance().getFiles([url + file.name], `${file.name}.zip`);
}

/**
 * helper function for upload dragged in files/folders
 * @param entry the file system entry for a file/folder
 * @param addBubble function to show errors, if there are any
 * @param getFolder function to update the folder view of the user
 * @param addProgress function to add a file to the upload progress status
 * @param updateProgress function to update the upload status of a file
 * @param relativePath the relativePath (for nested directories)
 * @returns a promise which resolves when all files/folders are uploaded/created
 */
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
				addProgress([{
					cwd: folder,
					name: file.name,
					progress: 0,
					total: file.size
				}])
				Endpoints.getInstance().uploadFile(file, folder, (e) => // upload progress as percentage
					updateProgress({
						cwd: folder,
						name: file.name,
						progress: e.loaded,
						total: e.total
					})
					, () => {
						updateProgress({
							cwd: folder,
							name: file.name,
							progress: file.size,
							total: file.size
						})
						if (normalizeURL(folder, false, true) === normalizeURL(base, false, true)) {
							getFolder();
						}
						resolve();
					}, () => {
						addBubble(`upload-error-${file.name}`, {
							title: `Could not upload ${file.name}`,
							type: "ERROR",
						})
						resolve()
					});
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

/**
 * a wrapper function for the FileSystemFileEntry.file() function
 * @param item the file systementry which should be converted
 * @returns a promise which resolves with the file object
 */
function getFile(item: FileSystemFileEntry): Promise<File> {
	return new Promise((resolve, reject) => {
		item.file((f) => resolve(f), reject);
	});
}

/**
 * gets all files/folders in a folder
 * @param dir the folder that should be listed
 * @returns a promise with the contents of a directory
 */
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
