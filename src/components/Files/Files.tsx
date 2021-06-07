import { RootDispatch, RootState } from "@store";
import {
  clearSelection,
  ContextMenuProps,
  getFolder,
  setContextMenu,
} from "@store/files";
import React, { Component } from "react";
import { connect, ConnectedProps } from "react-redux";
import { File } from "./File/File";
import css from "./Files.module.scss";
import fileCSS from "./File/File.module.scss";
import {
  FileI,
  findElInTree,
  getCurrentFilesPath,
  normalizeURL,
  onFileDragUpload,
  ROUTES,
} from "@lib";
import { push } from "connected-react-router";
import { ContextMenu, Loading, Prompt } from "@components";
import { BubbleI } from "@models";
import { addBubble } from "@store/app";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

const mapState = ({
  filesReducer: {
    folder,
    loading,
    menu: { isOpen },
  },
  router: {
    location: { pathname },
  },
}: RootState) => ({
  folder,
  pathname,
  loading,
  isOpen,
});

const mapDispatch = (dispatch: RootDispatch) => ({
  getFolder: (path?: string, loading?: boolean) =>
    dispatch(getFolder(path, loading)),
  push: (path: string) => dispatch(push(path)),
  clearSelection: () => dispatch(clearSelection()),
  setContextMenu: (menu: ContextMenuProps) => dispatch(setContextMenu(menu)),
  addBubble: (key: string, bubble: BubbleI) => dispatch(addBubble(key, bubble)),
});

const connector = connect(mapState, mapDispatch);

type PropsFromState = ConnectedProps<typeof connector>;
type Props = PropsFromState;

interface State {
  dragging: boolean;
}

class FilesUI extends Component<Props, State> {
  counter = 0;

  constructor(props: Props) {
    super(props);
    this.state = {
      dragging: false,
    };
  }

  componentDidMount() {
    document.addEventListener("dblclick", this.doubleClick);
  }

  componentWillUnmount() {
    document.removeEventListener("dblclick", this.doubleClick);
  }

  doubleClick = (e: MouseEvent) => {
    const target: HTMLElement = e.target as HTMLElement;
    const fileEl = findElInTree(fileCSS.fileWrapper, target);
    if (!fileEl) return;

    const dataAttr = fileEl.getAttribute("data-file");
    if (!dataAttr) return;
    const file: FileI = JSON.parse(dataAttr);
    if (file.type === "FOLDER") {
      if (getCurrentFilesPath() === "") {
        this.props.push(`${ROUTES.FILES}/${file.name}`);
      } else {
        // let url = window.location.pathname;
        // if (url.endsWith("/")) url = url.substring(0, url.length - 1);
        this.props.push(
          `${normalizeURL(window.location.pathname, true, true)}${file.name}`
        );
      }
      this.props.setContextMenu({
        isOpen: false,
        file: undefined,
        x: undefined,
        y: undefined,
      });
    } else {
      this.props.push(
        `${ROUTES.EDITOR}${normalizeURL(
          normalizeURL(getCurrentFilesPath(), false, true),
          true,
          true
        )}${file.name}`
      );
    }
  };

  handleClick = (ev: React.MouseEvent<HTMLDivElement>) => {
    if (!this.props.isOpen) {
      ev.stopPropagation();
      ev.preventDefault();
      this.props.clearSelection();
    }
  };

  handleContextMenu = (ev: React.MouseEvent<HTMLDivElement>) => {
    ev.stopPropagation();
    ev.preventDefault();
    this.props.setContextMenu({
      isOpen: true,
      file: undefined,
      x: ev.clientX,
      y: ev.clientY,
    });
  };

  onDragEnter = (e: React.DragEvent<HTMLDivElement>): void => {
    const actual = document.elementFromPoint(e.pageX, e.pageY);
    const closest = actual?.closest(`.${fileCSS.fileWrapper}`);
    if (
      e.dataTransfer.types.includes("app/file-transfer") ||
      (closest && closest.getAttribute("data-dir") === "true")
    ) {
      this.setState({ dragging: false });
      this.counter = 1;
      return;
    }
    if (!e.dataTransfer.types.includes("Files")) return;
    e.preventDefault();
    e.stopPropagation();
    this.counter++;
    this.setState({ dragging: true });
  };

  onDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    const actual = document.elementFromPoint(e.pageX, e.pageY);
    const closest = actual?.closest(`.${fileCSS.fileWrapper}`);
    if (
      e.dataTransfer.types.includes("app/file-transfer") ||
      (closest && closest.getAttribute("data-dir") === "true")
    ) {
      this.counter = 1;
      this.setState({ dragging: false });
      return;
    }
    if (!e.dataTransfer.types.includes("Files")) return;
    e.preventDefault();
    e.stopPropagation();
    this.counter--;
    if (this.counter <= 0) {
      this.setState({ dragging: false });
      this.counter = 0;
    }
  };

  onDrop = async (e: React.DragEvent<HTMLDivElement>): Promise<void> => {
    const actual = document.elementFromPoint(e.pageX, e.pageY);
    const closest = actual?.closest(`.${fileCSS.fileWrapper}`);
    if (
      e.dataTransfer.types.includes("app/file-transfer") ||
      (closest && closest.getAttribute("data-dir") === "true")
    ) {
      this.setState({ dragging: false });
      return;
    }
    if (!e.dataTransfer.types.includes("Files")) return;
    e.preventDefault();
    e.stopPropagation();
    this.counter = 0;
    this.setState({ dragging: false });
    for (const file of e.dataTransfer.items) {
      if (!file.webkitGetAsEntry) {
        addBubble("drop-error", {
          title: "Not supported",
          type: "WARNING",
          message:
            "we don't support your browser for dragging files at the moment",
        });
        return;
      }
      onFileDragUpload(
        file.webkitGetAsEntry(),
        (key, bubble) => this.props.addBubble(key, bubble),
        () => this.props.getFolder(undefined, false)
      );
    }
  };

  render(): JSX.Element {
    return (
      <div className={css.wrapper}>
        <div
          className={css.files}
          onClick={this.handleClick}
          onContextMenu={this.handleContextMenu}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={this.onDragEnter}
          onDragLeave={this.onDragLeave}
          onDrop={this.onDrop}
        >
          <File
            file={{
              name: "",
              owner: "",
              size: 0,
              type: "header",
            }}
          ></File>
          {normalizeURL(getCurrentFilesPath(), true, true) != "/" && (
            <File
              file={{
                name: "..",
                owner: "",
                size: 0,
                type: "FOLDER",
              }}
            ></File>
          )}
          {this.props?.folder?.files?.map((f) => (
            <File key={f.name} file={f}></File>
          ))}
        </div>
        <div
          className={`${css.drag} ${this.state.dragging ? css.dragging : ""}`}
        >
          <FontAwesomeIcon
            icon={faUpload}
            className={css.dragIcon}
          ></FontAwesomeIcon>
          Drag files to upload
        </div>
        <Loading loading={this.props.loading} className={css.loading}></Loading>
        <ContextMenu></ContextMenu>
        <Prompt></Prompt>
      </div>
    );
  }
}

export const Files = connector(FilesUI);
export default Files;
export * from "./File/File";
