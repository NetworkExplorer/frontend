import css from "./File.module.scss";
import React, { useState } from "react";
import { convertFileSize, FileI, onFileDragUpload, onMove } from "@lib";
import FileIcon from "./FileIcon";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@store";
import {
  addSelection,
  getFolder,
  removeSelection,
  selectFile,
  setContextMenu,
  setLoading,
  shiftSelection,
} from "@store/files";
import { addBubble } from "@store/app";

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
        <div className={css.fileWrapperWrapper}>
          <div className={css.fileWrapper}>
            <div className={css.fileIcon}></div>
            <div className={css.name}>Name</div>
            <div className={css.size}>Size</div>
            <div className={css.dateSingleLine}>Date</div>
          </div>
        </div>
      </div>
    );
  }

  if (search.searching && !file.name.includes(search.searchText || "")) {
    return <></>;
  }

  let counter = 0;
  const [dragOver, setDragOver] = useState({
    over: false,
    shouldBeHighlighted: false,
  });

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

  function onDragStart(e: React.DragEvent<HTMLDivElement>) {
    // e.stopPropagation();
    // e.preventDefault();
    if (!selected.has(file)) selectFile(file);
    const s: FileI[] = [];
    for (const f of selected.values()) {
      s.push(f);
    }
    e.dataTransfer.setData("app/file-transfer", JSON.stringify(s));
    e.dataTransfer.dropEffect = "move";
  }

  function onDragOver(e: React.DragEvent<HTMLDivElement>) {
    if (file.type !== "FOLDER") return;
    if (
      e.dataTransfer.types.includes("app/file-transfer") ||
      e.dataTransfer.types.includes("Files")
    ) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (
      !dragOver.over &&
      (e.dataTransfer.types.includes("app/file-transfer") ||
        e.dataTransfer.types.includes("Files"))
    ) {
      counter++;
      setDragOver({ over: true, shouldBeHighlighted: !selected.has(file) });
    }
  }

  async function onDrop(e: React.DragEvent<HTMLDivElement>) {
    if (file.type !== "FOLDER") return;
    if (e.dataTransfer.types.includes("app/file-transfer")) {
      e.preventDefault();
      e.stopPropagation();
      if (selected.has(file)) return;
      const data: FileI[] = JSON.parse(
        e.dataTransfer.getData("app/file-transfer")
      );
      dispatch(setLoading(true));
      await onMove(data, file, (key, bubble) =>
        dispatch(addBubble(key, bubble))
      );
      dispatch(getFolder() as any);
    } else if (e.dataTransfer.types.includes("Files")) {
      e.preventDefault();
      e.stopPropagation();

      for (const f of e.dataTransfer.items) {
        if (!f.webkitGetAsEntry) {
          addBubble("drop-error", {
            title: "Not supported",
            type: "WARNING",
            message:
              "we don't support your browser for dragging files at the moment",
          });
          break;
        }
        onFileDragUpload(
          f.webkitGetAsEntry(),
          (key, bubble) => dispatch(addBubble(key, bubble)),
          () => dispatch(getFolder(undefined, false) as any),
          file.name
        );
      }
    }
    setDragOver({ over: false, shouldBeHighlighted: false });
  }

  function onDragLeave() {
    counter--;
    if (counter <= 0) {
      counter = 0;
      setDragOver({ over: false, shouldBeHighlighted: false });
    }
  }

  return (
    <div className={css.file}>
      <div className={css.fileWrapperWrapper}>
        <div
          className={`${css.fileWrapper} ${
            selected.has(file) ? css.selected : ""
          } ${dragOver.shouldBeHighlighted ? css.dragover : ""}`}
          onClick={handleClick}
          onContextMenu={onContextMenu}
          data-file={JSON.stringify(file)}
          draggable={true}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          data-dir={file.type === "FOLDER"}
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
    </div>
  );
}

export default File;
