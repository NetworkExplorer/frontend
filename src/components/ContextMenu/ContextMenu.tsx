import React, { useEffect, useRef, useState } from "react";
import css from "./ContextMenu.module.scss";
import { RootDispatch, RootState } from "@store";
import { connect, ConnectedProps } from "react-redux";
import { ContextMenuProps, getFolder, setContextMenu } from "@store/files";
import { PromptProps } from "@components/Prompt/Prompt";
import { setPrompt, addBubble } from "@store/app";
import { BubbleI } from "@models";
import {
  faDownload,
  faFileDownload,
  faFolder,
  faFolderOpen,
  faFolderPlus,
  faICursor,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import {
  Endpoints,
  normalizeURL,
  onCreateFolder,
  onFileDownload,
  onRename,
  onDelete,
  onFilesDownload,
  onFolderDownload,
} from "@lib";

const mapState = ({
  filesReducer: {
    menu,
    selection: { selected },
  },
}: RootState) => ({
  menu,
  selected,
});

const mapDispatch = (dispatch: RootDispatch) => ({
  setContextMenu: (contextMenu: ContextMenuProps) =>
    dispatch(setContextMenu(contextMenu)),
  setPrompt: (prompt?: PromptProps) => dispatch(setPrompt(prompt)),
  addBubble: (key: string, bubble: BubbleI) => dispatch(addBubble(key, bubble)),
  getFolder: (path?: string) => dispatch(getFolder(path)),
});

const connector = connect(mapState, mapDispatch);

type PropsFromState = ConnectedProps<typeof connector>;
type Props = PropsFromState;

const ContextMenuUI = ({
  menu: { x, y, file, isOpen },
  setContextMenu,
  setPrompt,
  addBubble,
  selected,
  getFolder,
}: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const ownRef = useRef<HTMLDivElement>(null);
  const [listening, setListening] = useState<boolean>(false);

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

  const chooseUpload = (type: "file" | "folder") => {
    if (type === "file") {
      setDirectory(false);
    } else {
      setDirectory(true);
    }
    fileRef.current?.click();
  };

  let items = [
    {
      label: "Create folder",
      func: () => onCreateFolder(setPrompt, addBubble),
      name: css.createFolder,
      icon: faFolderOpen,
    },
    {
      label: "Upload file(s)",
      func: () => chooseUpload("file"),
      name: css.uploadFile,
      icon: faFileDownload,
    },
    {
      label: "Upload folder(s)",
      func: () => chooseUpload("folder"),
      name: css.uploadFolder,
      icon: faFolderPlus,
    },
  ];

  const withReload = async (func: Promise<any>) => {
    await func;
    getFolder();
  };

  if (selected.size > 1) {
    items = [
      ...items,
      {
        label: "Download Files/Folders",
        func: () => onFilesDownload(selected),
        icon: faDownload,
        name: css.downloadFiles,
      },
      {
        label: "Delete Files/Folders",
        func: () => withReload(onDelete(selected, addBubble)),
        icon: faDownload,
        name: css.downloadFiles,
      },
    ];
  } else if (file?.type === "FOLDER") {
    items = [
      ...items,
      {
        label: "Download folder",
        func: () => onFolderDownload(file),
        name: css.download,
        icon: faFolder,
      },
      {
        label: "Rename folder",
        func: () => withReload(onRename(file, setPrompt, addBubble)),
        name: css.rename,
        icon: faICursor,
      },
      {
        label: "Delete folder",
        func: () => withReload(onDelete(selected, addBubble)),
        name: css.delete,
        icon: faTrashAlt,
      },
    ];
  } else if (file?.type === "FILE") {
    items = [
      ...items,
      {
        label: "Download file",
        func: () => onFileDownload(file),
        name: css.downloadFile,
        icon: faFileDownload,
      },
      {
        label: "Rename file",
        func: () => withReload(onRename(file, setPrompt, addBubble)),
        name: css.rename,
        icon: faICursor,
      },
      {
        label: "Delete file",
        func: () => withReload(onDelete(selected, addBubble)),
        name: css.delete,
        icon: faTrashAlt,
      },
    ];
  }

  let contextStyles = {
    "--items": items.length,
  } as any;
  if (x && y) {
    if (ownRef.current) {
      const parent = document.documentElement;
      const rect = parent.getBoundingClientRect();
      const own = ownRef.current.getBoundingClientRect();
      const em = parseFloat(getComputedStyle(ownRef.current).fontSize) * 2.75;
      if (x + own.width > rect.width) {
        x = x - own.width + (rect.width - x) - 30;
      }
      if (y + em * contextStyles["--items"] > rect.height) {
        y = y - em * contextStyles["--items"] + (rect.height - y) - 30;
      }
    }
    contextStyles = {
      ...contextStyles,
      left: `${x}px`,
      top: `${y}px`,
      position: "fixed",
    };
  }
  const click = () => {
    if (isOpen) {
      setContextMenu({ isOpen: false });
      document.removeEventListener("click", click);
      document.removeEventListener("keyup", keyUp);
      setListening(false);
    }
  };

  const keyUp = (ev: KeyboardEvent) => {
    if (isOpen && ev.key === "Escape") {
      setContextMenu({ isOpen: false });
      document.removeEventListener("click", click);
      document.removeEventListener("keyup", keyUp);
      setListening(false);
    }
  };
  useEffect(() => {
    if (!listening && isOpen) {
      document.addEventListener("click", click);
      document.addEventListener("keyup", keyUp);
      setListening(true);
    }
  });

  const fileChange = async (e: React.FormEvent) => {
    if (!fileRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    const files = fileRef.current.files;
    if (!files || files.length === 0) {
      return;
    }
    for (const file of files) {
      const req = await Endpoints.getInstance().uploadFile(
        file,
        normalizeURL(window.location.pathname, false)
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
      });
    }
  };

  return (
    <div
      id={css.contextMenu}
      className={`${isOpen ? css.opened : ""}`}
      style={contextStyles}
      ref={ownRef}
    >
      {items.map((i) => (
        <button key={i.label} onClick={() => i.func()} className={i.name}>
          <div className={css.icon}>
            <FontAwesomeIcon icon={i.icon}></FontAwesomeIcon>
          </div>
          <div className={css.text}>{i.label}</div>
        </button>
      ))}
      <input type="file" hidden ref={fileRef} onChange={fileChange} multiple />
    </div>
  );
};

export const ContextMenu = connector(ContextMenuUI);

export default ContextMenu;
