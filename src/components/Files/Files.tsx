import { FileI } from "@lib";
import { RootDispatch, RootState } from "@store";
import { getFolder } from "@store/files";
import React, { Component } from "react";
import { connect, ConnectedProps } from "react-redux";
import { File } from "./File/File";
import css from "./Files.module.scss";

const mapState = ({
  filesReducer: { folder },
  router: {
    location: { pathname },
  },
}: RootState) => ({
  folder,
  pathname,
});

const mapDispatch = (dispatch: RootDispatch) => ({
  getFolder: (path: string) => dispatch(getFolder(path)),
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
  }

  componentDidUpdate() {
    // TODO
  }

  // shouldComponentUpdate(nextProps: Props, nextState: any, nextContent: any) {
  // TODO
  // }

  render(): JSX.Element {
    return (
      <div className={css.files}>
        <File file={{ name: "", owner: "", size: 0, type: "header" }}></File>
        {this.props?.folder?.files.map((f) => (
          <File key={f.name} file={f}></File>
        ))}
      </div>
    );
  }
}

export const Files = connector(FilesUI);
export default Files;
export * from "./File/File";
