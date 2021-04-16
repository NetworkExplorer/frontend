import { FileI } from "@lib";
import React, { Component } from "react";
import { File } from "./File/File";
import css from "./Files.module.scss";

export class Files extends Component {
  files: FileI[] = [
    {
      type: "file",
      name: "yo.ts",
      owner: "me",
      size: 20000,
      modified: new Date(),
    },
    {
      type: "dir",
      name: "yod.txt",
      owner: "me",
      size: 20000,
      modified: new Date(),
    },
    {
      type: "file",
      name: "yo.css",
      owner: "me",
      size: 20000,
      modified: new Date(),
    },
  ];
  render(): JSX.Element {
    return (
      <div className={css.files}>
        <File file={{ name: "", owner: "", size: 0, type: "header" }}></File>
        {this.files.map((f) => (
          <File key={f.name} file={f}></File>
        ))}
      </div>
    );
  }
}

export default Files;
export * from "./File/File";
