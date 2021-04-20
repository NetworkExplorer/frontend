import React, { useEffect, useRef, useState } from "react";
import css from "./ContextMenu.module.scss";
import { RootDispatch, RootState } from "@store";
import { connect, ConnectedProps } from "react-redux";
import { ContextMenuProps, setContextMenu } from "@store/files";
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
}: Props) => {
  const ownRef = useRef<HTMLDivElement>(null);
  const [listening, setListening] = useState<boolean>(false);
  let items = [
    {
      label: "Create folder",
      func: onCreateFolder,
      name: css.createFolder,
      icon: faFolderOpen,
    },
    {
      label: "Upload file(s)",
      func: onFileUpload,
      name: css.uploadFile,
      icon: faFileDownload,
    },
    {
      label: "Upload folder(s)",
      func: onFolderUpload,
      name: css.uploadFolder,
      icon: faFolderPlus,
    },
  ];
  if (selected.size > 1) {
    items = [
      ...items,
      {
        label: "Download Files/Folders",
        func: onFileDownload,
        icon: faDownload,
        name: css.downloadFiles,
      },
      {
        label: "Delete Files/Folders",
        func: onFileDownload,
        icon: faDownload,
        name: css.downloadFiles,
      },
    ];
  } else if (file?.type === "FOLDER") {
    items = [
      ...items,
      {
        label: "Download folder",
        func: onFolderDownload,
        name: css.download,
        icon: faFolder,
      },
      {
        label: "Rename folder",
        func: onFolderRename,
        name: css.rename,
        icon: faICursor,
      },
      {
        label: "Delete folder",
        func: onFolderDelete,
        name: css.delete,
        icon: faTrashAlt,
      },
    ];
  } else if (file?.type === "FILE") {
    items = [
      ...items,
      {
        label: "Download file",
        func: onFileDownload,
        name: css.downloadFile,
        icon: faFileDownload,
      },
      {
        label: "Rename file",
        func: onFileRename,
        name: css.rename,
        icon: faICursor,
      },
      {
        label: "Delete file",
        func: onFileDelete,
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
        x = x - own.width + (rect.width - x) - 20;
      }
      if (y + em * contextStyles["--items"] > rect.height) {
        y = y - em * contextStyles["--items"] + (rect.height - y) - 20;
      }
    }
    contextStyles = {
      ...contextStyles,
      left: `${x}px`,
      top: `${y}px`,
      position: "fixed",
    };
  }
  const click = (e: MouseEvent) => {
    // TODO also listen to escape
    if (isOpen) {
      setContextMenu({ isOpen: false });
      document.removeEventListener("click", click);
      setListening(false);
    }
  };
  useEffect(() => {
    if (!listening && isOpen) {
      document.addEventListener("click", click);
      setListening(true);
    }
  });

  function onFolderRename(): void {
    if (!file) return;
    setPrompt({
      fieldName: "folder name",
      initial: file.name,
      callback: (val) => {
        // addBubble("rename-error", {
        //   title: "Could not rename folder",
        //   type: "ERROR",
        //   message: `renaming of ${file.name} failed`,
        // })
        // TODO folder rename
      },
    });
  }

  function onFileRename(): void {
    if (!file) return;
    setPrompt({
      fieldName: "file name",
      initial: file.name,
      callback: (val) => {
        // TODO rename
        // addBubble("rename-error", {
        //   title: "Could not rename folder",
        //   type: "ERROR",
        //   message: `renaming of ${file.name} failed`,
        // })
      },
    });
  }

  async function onFolderUpload(): Promise<void> {
    try {
      // const res = await remote.dialog.showOpenDialog({
      //   properties: ["openDirectory", "multiSelections"],
      // });
      // if (res.canceled) return;
      // client.putFolders(res.filePaths);
      // TODO folder upload
    } catch (err) {
      addBubble("upload-error", {
        title: "Could not upload folder",
        message: err.message,
        type: "ERROR",
      });
    }
  }

  async function onFileUpload(): Promise<void> {
    try {
      // const res = await remote.dialog.showOpenDialog({
      //   properties: ["openFile", "multiSelections"],
      // });
      // if (res.canceled) return;
      // client.putFiles(res.filePaths);
      // TODO file upload
    } catch (err) {
      addBubble("upload-error", {
        title: "Could not upload file",
        message: err.message,
        type: "ERROR",
      });
    }
  }

  function onCreateFolder(): void {
    setPrompt({
      fieldName: "folder name",
      initial: "",
      callback: (value: string) => {
        // addBubble("mkdir-error", {
        //   title: err.title || "Failed to create directory",
        //   message: err.message,
        //   type: "ERROR",
        // });
        // TODO create folder
      },
    });
  }

  function onFilesDownload(): void {
    // TODO multiple files download
  }

  function onFilesDelete(): void {
    // TODO multiple files delete
  }

  function onFileDownload(): void {
    // TODO file download
  }

  function onFolderDownload(): void {
    // TODO folder download
  }

  function onFileDelete(): void {
    if (!file) return;
    // TODO file delete
    addBubble("delete-error", {
      title: `Could not delete file`,
      type: "ERROR",
      message: `failed on: ${file.name}`,
    });
  }

  function onFolderDelete(): void {
    if (!file) return;
    // TODO folder delete
    addBubble("delete-error", {
      title: `Could not delete folder`,
      type: "ERROR",
      message: `failed on: ${file.name}`,
    });
  }

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
    </div>
  );
};

export const ContextMenu = connector(ContextMenuUI);

export default ContextMenu;
