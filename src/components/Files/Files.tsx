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
import { FileI, findElInTree } from "@lib";
import { push } from "connected-react-router";
import { ContextMenu, Loading, Prompt } from "@components";

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
  getFolder: (path: string) => dispatch(getFolder(path)),
  push: (path: string) => dispatch(push(path)),
  clearSelection: () => dispatch(clearSelection()),
  setContextMenu: (menu: ContextMenuProps) => dispatch(setContextMenu(menu)),
});

const connector = connect(mapState, mapDispatch);

type PropsFromState = ConnectedProps<typeof connector>;
type Props = PropsFromState;

class FilesUI extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    this.props.getFolder(this.props.pathname);
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
      if (window.location.pathname === "/") {
        this.props.push(`/${file.name}`);
      } else {
        let url = window.location.pathname;
        if (url.endsWith("/")) url = url.substring(0, url.length - 1);
        this.props.push(`${url}/${file.name}`);
      }
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

  render(): JSX.Element {
    return (
      <div className={css.wrapper}>
        <div
          className={css.files}
          onClick={this.handleClick}
          onContextMenu={this.handleContextMenu}
        >
          <File
            file={{
              name: "",
              owner: "",
              size: 0,
              type: "header",
            }}
          ></File>
          {window.location.pathname != "/" && (
            <File
              file={{
                name: "..",
                owner: "",
                size: 0,
                type: "FOLDER",
              }}
            ></File>
          )}
          {this.props?.folder?.files.map((f) => (
            <File key={f.name} file={f}></File>
          ))}
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
