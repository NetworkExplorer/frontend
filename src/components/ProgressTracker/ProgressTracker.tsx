import FileIcon from "@components/Files/File/FileIcon";
import {
  faAngleDown,
  faTimes,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ProgressFileI } from "@models";
import { RootDispatch, RootState } from "@store";
import { removeProgressFiles } from "@store/files";
import React, { useEffect, useState } from "react";
import { connect, ConnectedProps, useDispatch } from "react-redux";
import css from "./ProgressTracker.module.scss";

const mapState = ({ filesReducer: { progressFiles } }: RootState) => ({
  progressFiles,
});

const mapDispatch = (dispatch: RootDispatch) => ({
  removeProgressFiles: (files: ProgressFileI[]) =>
    dispatch(removeProgressFiles(files)),
});

const connector = connect(mapState, mapDispatch);

type PropsFromState = ConnectedProps<typeof connector>;
type Props = PropsFromState;

function ProgressTrackerUI({ progressFiles }: Props): JSX.Element {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const files: ProgressFileI[] = [];
  for (const f of progressFiles.values()) {
    files.push(f);
  }
  useEffect(() => {
    if (open && files.length == 0) setOpen(false);
  }, [files]);

  return (
    <div className={css.tracker}>
      {progressFiles.size > 0 && (
        <div className={`${css.part} ${open ? css.open : ""}`}>
          <button className={css.btn} onClick={() => setOpen(true)}>
            <FontAwesomeIcon icon={faUpload}></FontAwesomeIcon>
          </button>
          <div className={css.contentWrapper}>
            <div className={css.content}>
              <div className={css.partHeader}>
                <p>Uploads</p>
                <button onClick={() => setOpen(false)}>
                  <FontAwesomeIcon icon={faAngleDown}></FontAwesomeIcon>
                </button>
                <button
                  className={css.partCancel}
                  onClick={() => dispatch(removeProgressFiles(files))}
                >
                  <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
                </button>
              </div>
              {files.map((f) => (
                <ProgressFile file={f} key={f.cwd + f.name}></ProgressFile>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ProgressFileProps {
  file: ProgressFileI;
}
const ProgressFile = ({ file }: ProgressFileProps) => {
  const dispatch = useDispatch();
  return (
    <div
      className={css.file}
      style={
        {
          "--progress":
            file.progress === 0 && file.total === 0
              ? 1
              : file.progress / file.total,
        } as React.CSSProperties
      }
    >
      <FileIcon
        file={{
          name: file.name,
          size: file.total,
          type: "FILE",
          owner: "",
        }}
        className={css.type}
      ></FileIcon>
      <p className={css.name}>{file.name}</p>
      <div className={css.right}>
        <button
          className={css.fileCancel}
          onClick={() => dispatch(removeProgressFiles([file]))}
        >
          <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
        </button>
      </div>
    </div>
  );
};

export const ProgressTracker = connector(ProgressTrackerUI);
export default ProgressTracker;
