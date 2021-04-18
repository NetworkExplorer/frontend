import Loading from "@components/Loading/Loading";
import { RootDispatch, RootState } from "@store";
import { getFolder } from "@store/files";
import React, { Component } from "react";
import { connect, ConnectedProps } from "react-redux";
import { File } from "./File/File";
import css from "./Files.module.scss";
import fileCSS from "./File/File.module.scss";
import { FileI } from "@lib";
import { push } from "connected-react-router";

const mapState = ({
  filesReducer: { folder, loading },
  router: {
    location: { pathname },
  },
}: RootState) => ({
  folder,
  pathname,
  loading,
});

const mapDispatch = (dispatch: RootDispatch) => ({
  getFolder: (path: string) => dispatch(getFolder(path)),
  push: (path: string) => dispatch(push(path)),
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
        this.props.push(`./${file.name}`);
      } else {
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

  render(): JSX.Element {
    return (
      <div className={css.files}>
        <File file={{ name: "", owner: "", size: 0, type: "header" }}></File>
        {window.location.pathname != "/" && (
          <File
            file={{ name: "..", owner: "", size: 0, type: "FOLDER" }}
          ></File>
        )}
        {this.props?.folder?.files.map((f) => (
          <File key={f.name} file={f}></File>
        ))}
        <Loading loading={this.props.loading} className={css.loading}></Loading>
      </div>
    );
  }
}

export const Files = connector(FilesUI);
export default Files;
export * from "./File/File";
