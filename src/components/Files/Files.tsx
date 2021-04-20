import { RootDispatch, RootState } from "@store";
import { clearSelection, getFolder } from "@store/files";
import React, { Component } from "react";
import { connect, ConnectedProps } from "react-redux";
import { File } from "./File/File";
import css from "./Files.module.scss";
import fileCSS from "./File/File.module.scss";
import { FileI } from "@lib";
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
    const fileEl = this.findFileEl(target);
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
        this.props.push(`${window.location.pathname}/${file.name}`);
      }
    }
  };

  findFileEl = (el?: HTMLElement | null): HTMLElement | undefined => {
    if (!el || el === document.documentElement) {
      return undefined;
    }
    if (el.classList.contains(fileCSS.file)) {
      return el;
    }
    return this.findFileEl(el.parentElement);
  };

  handleClick = (ev: React.MouseEvent<HTMLDivElement>) => {
    if (!this.props.isOpen) {
      ev.stopPropagation();
      ev.preventDefault();
      this.props.clearSelection();
    }
  };

  render(): JSX.Element {
    return (
      <div className={css.wrapper}>
        <div className={css.files} onClick={this.handleClick}>
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
