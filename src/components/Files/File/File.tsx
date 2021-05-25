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
  const { selected, search } = useSelector(
    ({
      filesReducer: {
        selection: { selected },
      },
      appReducer: { search },
    }: RootState) => ({ selected, search })
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

  if (search.searching && !file.name.includes(search.searchText || "")) {
    return <></>;
  }

  function handleClick(ev: React.MouseEvent<HTMLDivElement>) {
    if (file.name === "..") return;

    ev.stopPropagation();
    ev.preventDefault();
    if (ev.ctrlKey) {
      if (selected.has(file)) {
        dispatch(removeSelection(file));
      } else {
        dispatch(addSelection(file));
      }
    } else if (ev.shiftKey) {
      dispatch(shiftSelection(file));
    } else {
      dispatch(selectFile(file));
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
    if (!selected.has(file)) {
      dispatch(selectFile(file));
    }
  }

  return (
    <div className={css.file}>
      <div
        className={`${css.fileWrapper} ${
          selected.has(file) ? css.selected : ""
        }`}
        onClick={handleClick}
        onContextMenu={onContextMenu}
        data-file={JSON.stringify(file)}
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
