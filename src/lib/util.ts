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
      modified: f.modified ? new Date(f.modified) : undefined,
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

export function findElInTree(
  className: string,
  el?: HTMLElement | null
): HTMLElement | undefined {
  if (!el || el === document.documentElement) {
    return undefined;
  }
  if (el.classList.contains(className)) {
    return el;
  }
  return findElInTree(className, el.parentElement);
}

export function normalizeURL(url: string, endingSlash = true, leadingSlash = false): string {
  url = url.trim();
  if (url === "/") {
    if (!leadingSlash && !endingSlash) return "";
  }
  if (leadingSlash && !url.startsWith("/")) url = "/" + url;
  if (!leadingSlash && url.startsWith("/")) url = url.substring(1);
  if (endingSlash && !url.endsWith("/")) url = url + "/";
  return url;
}
