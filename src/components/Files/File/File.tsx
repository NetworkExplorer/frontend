import css from "./File.module.scss";
import React from "react";
import { convertFileSize, FileI } from "@lib";
import FileIcon from "./FileIcon";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@store";
import {
  addSelection,
  removeSelection,
  selectFile,
  setContextMenu,
  shiftSelection,
} from "@store/files";

interface Props {
  file: FileI;
}

export function File({ file }: Props): JSX.Element {
  const { selected } = useSelector(
    ({
      filesReducer: {
        selection: { selected },
      },
    }: RootState) => ({ selected })
  );
  const dispatch = useAppDispatch();
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

  function handleClick(ev: React.MouseEvent<HTMLDivElement>) {
    if (file.name === "..") return;

    ev.stopPropagation();
    ev.preventDefault();
    if (ev.ctrlKey) {
      if (selected.has(file.name)) {
        dispatch(removeSelection(file.name));
      } else {
        dispatch(addSelection(file.name));
      }
    } else if (ev.shiftKey) {
      dispatch(shiftSelection(file.name));
    } else {
      dispatch(selectFile(file.name));
    }
  }

  function onContextMenu(ev: React.MouseEvent<HTMLDivElement>) {
    ev.preventDefault();
    ev.stopPropagation();
    dispatch(
      setContextMenu({
        isOpen: true,
        file: file,
        x: ev.clientX,
        y: ev.clientY,
      })
    );
    if (!selected.has(file.name)) {
      dispatch(selectFile(file.name));
    }
  }

  return (
    <div className={css.file} data-file={JSON.stringify(file)}>
      <div
        className={`${css.fileWrapper} ${
          selected.has(file.name) ? css.selected : ""
        }`}
        onClick={handleClick}
        onContextMenu={onContextMenu}
      >
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
