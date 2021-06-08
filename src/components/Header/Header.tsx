import React, { useRef, useState } from "react";
import css from "./Header.module.scss";
import {
  faBars,
  faCog,
  faDownload,
  faFile,
  faFolder,
  faSave,
  faSearch,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import HeaderSearch from "./HeaderSearch/HeaderSearch";
import { IconButton } from "@components";
import { RootState, useAppDispatch } from "@store";
import { addBubble, setSearch, setSidebar } from "@store/app";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Endpoints,
  FileI,
  getCurrentFilesPath,
  normalizeURL,
  onFileDownload,
  onFilesDownload,
  onFolderDownload,
  ROUTES,
} from "@lib";
import { useSelector } from "react-redux";
import { getFolder } from "@store/files";

export const Header = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadState, setUploadState] = useState(false);
  const { selected, editorReady, editor } = useSelector(
    ({
      filesReducer: {
        selection: { selected },
      },
      router: {
        location: { pathname },
      },
      editorReducer: { editorReady, editor },
    }: RootState) => ({ selected, pathname, editorReady, editor })
  );

  const setDirectory = (dir: boolean) => {
    const dirAttr = [
      "webkitdirectory",
      "directory",
      "mozdirectory",
      "nwdirectory",
    ];
    if (dir) {
      for (const attr of dirAttr) {
        fileRef.current?.setAttribute(attr, "true");
      }
    } else {
      for (const attr of dirAttr) {
        fileRef.current?.removeAttribute(attr);
      }
    }
  };

  const fileChange = async (e: React.FormEvent) => {
    if (!fileRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    const files = fileRef.current.files;
    if (!files || files.length === 0) {
      setUploadState(false);
      return;
    }
    for (const file of files) {
      const req = await Endpoints.getInstance().uploadFile(
        file,
        normalizeURL(getCurrentFilesPath(), false)
      );
      // upload progress event
      req.upload.addEventListener("progress", function (e) {
        // upload progress as percentage
        const percent_completed = (e.loaded / e.total) * 100;
        console.log(percent_completed);
      });

      // req finished event
      req.addEventListener("load", function () {
        // HTTP status message (200, 404 etc)
        console.log(req.status);

        // req.response holds response from the server
        console.log(req.response);
        console.log(file);
        dispatch(getFolder(undefined, false) as any);
      });

      req.addEventListener("error", function () {
        dispatch(
          addBubble(`upload-error-${file.name}`, {
            title: `Could not upload ${file.name}`,
            type: "ERROR",
          })
        );
      });
    }
  };

  const chooseUpload = (type: "file" | "folder") => {
    if (type === "file") {
      setDirectory(false);
    } else {
      setDirectory(true);
    }
    fileRef.current?.click();
    setUploadState(false);
    // TODO listen to click outside and remove if not on buttons
  };

  const onDownload = () => {
    if (selected.size === 0) return;
    if (selected.size === 1) {
      const file: FileI = selected.values().next().value;
      if (file.type === "FILE") {
        onFileDownload(file);
      } else if (file.type === "FOLDER") {
        onFolderDownload(file);
      }
      return;
    }

    onFilesDownload(selected);
  };

  return (
    <header className={css.header}>
      <IconButton
        className={css.iconBtn}
        icon={faBars}
        onClick={() => dispatch(setSidebar("TOGGLE"))}
        name="Menu"
      ></IconButton>
      <HeaderSearch></HeaderSearch>
      {window.location.pathname.startsWith(ROUTES.FILES) && (
        <>
          <IconButton
            className={css.iconBtn}
            icon={faDownload}
            name="Download"
            onClick={onDownload}
            disabled={selected.size == 0}
          ></IconButton>
          <label>
            <input
              type="file"
              hidden
              ref={fileRef}
              onChange={fileChange}
              multiple
            />
            <IconButton
              className={css.iconBtn}
              icon={faUpload}
              onClick={() => setUploadState(!uploadState)}
              name="Upload"
            ></IconButton>
            <div
              className={`${css.uploadChooser} ${
                uploadState ? css.chooserOpen : ""
              }`}
            >
              <button onClick={() => chooseUpload("file")}>
                <FontAwesomeIcon icon={faFile}></FontAwesomeIcon>
                <span hidden>Files</span>
              </button>
              <button onClick={() => chooseUpload("folder")}>
                <FontAwesomeIcon icon={faFolder}></FontAwesomeIcon>
                <span hidden>Directory</span>
              </button>
            </div>
          </label>
          <IconButton
            name="Search"
            className={css.iconBtn}
            icon={faSearch}
            onClick={() =>
              dispatch(
                setSearch({
                  searching: true,
                  shouldFocus: true,
                })
              )
            }
          ></IconButton>
        </>
      )}
      {window.location.pathname.startsWith(ROUTES.EDITOR) && (
        <>
          <IconButton
            name="Save file"
            className={css.iconBtn}
            icon={faSave}
            disabled={!editorReady}
            onClick={() => {
              editor?.getAction("save")?.run();
              // editor?.getDomNode()?.dispatchEvent(
              //   new KeyboardEvent("keydown", {
              //     key: "s",
              //     ctrlKey: true,
              //   })
              // );
            }}
          ></IconButton>
        </>
      )}
      <IconButton
        className={css.iconBtn}
        icon={faCog}
        name="settings"
      ></IconButton>
    </header>
  );
};
