export interface FileI {
  type: "dir" | "file" | "header";
  name: string;
  modified?: Date;
  owner: string;
  size: number;
}