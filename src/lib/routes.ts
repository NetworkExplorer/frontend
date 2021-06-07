export enum ROUTES {
  LOGIN = "/login",
  REGISTER = "/register",
  FILES = "/files",
  SETTINGS = "/settings",
  EDITOR = "/editor"
}

export function getFilesURL(path?: string): string {
  path = path || window.location.pathname;
  path = path.replace(ROUTES.FILES, "");
  path = path.replace(ROUTES.EDITOR, "");
  return path;
}

export function getCurrentFilesPath(): string {
  return getFilesURL(undefined);
}