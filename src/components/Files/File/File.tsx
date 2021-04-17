import css from "./File.module.scss";
import React from "react";
import { convertFileSize, FileI } from "@lib";
import FileIcon from "./FileIcon";

interface Props {
  file: FileI;
}

export function File({ file }: Props): JSX.Element {
  if (file.type === "header") {
    return (
      <div className={`${css.file} ${css.header}`}>
        <div className={css.fileWrapper}>
          <div className={css.fileIcon}></div>
          <div className={css.name}>Name</div>
          <div className={css.size}>Size</div>
          <div className={css.dateSingleLine}>Date</div>
        </div>
      </div>
    );
  }

  return (
    <div className={css.file} data-file={JSON.stringify(file)}>
      <div className={css.fileWrapper}>
        <FileIcon file={file}></FileIcon>
        <div className={css.name}>{file.name}</div>
        <div className={css.size}>{convertFileSize(file.size, 1)}</div>
        <div className={css.date}>
          {file.modified ? (
            <>
              {file.modified.toLocaleDateString()}
              <br />
              {file.modified.toLocaleTimeString()}
            </>
          ) : (
            "n/a"
          )}
        </div>
      </div>
    </div>
  );
}

export default File;
