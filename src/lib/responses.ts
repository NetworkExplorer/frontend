import { FileI, FileTypes } from "./types";

export interface FolderRes {
  name: string;
  size: number;
  type: FileTypes;
  files: FileI[];
}