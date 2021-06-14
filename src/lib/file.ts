export type FileTypes = "FOLDER" | "FILE" | "header";

export interface FileI {
  type: FileTypes;
  name: string;
  modified?: Date;
  created?: Date;
  owner: string;
  size: number;
}