export enum ROUTES {
  LOGIN = "/login",
  REGISTER = "/register",
  FILES = "/files",
  SETTINGS = "/settings",
  FILE = "/file"
}

export function getFilesURL(path?: string): string {
  path = path || window.location.pathname;
  path = path.replace(ROUTES.FILES, "");
  return path;
}

export function getCurrentFilesPath(): string {
  return getFilesURL(undefined);
}