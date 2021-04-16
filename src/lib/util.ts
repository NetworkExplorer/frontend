import { FileI } from "./types";

export function convertFileSize(size: number, decimals = 1): string {
  if (size === 0) return "";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(size) / Math.log(k));

  return `${parseFloat((size / Math.pow(k, i)).toFixed(dm))}${sizes[i]}`;
}

export function convertFiles(files: FileI[]): FileI[] {
  return files
    .map((f) => ({
      ...f,
      created: f.created ? new Date(f.created) : undefined,
      modified: f.modified ? new Date(f.modified) : undefined
    }))
    .sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }
      if (a.type === "FOLDER") {
        return -1;
      }
      return 1;
    });
}