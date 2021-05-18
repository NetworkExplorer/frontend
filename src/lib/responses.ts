import { FileI, FileTypes } from "./types";

export interface DefRes {
  statusCode: number;
  data: unknown;
  message: string;
}

export interface FolderResInner {
  name: string;
  size: number;
  type: FileTypes;
  files: FileI[];
}

export interface FolderRes extends DefRes {
  data: FolderResInner;
}
