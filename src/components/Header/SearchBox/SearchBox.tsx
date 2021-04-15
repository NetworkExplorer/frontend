import { RootDispatch, RootState } from "@store";
import React, { Component } from "react";
import { connect, ConnectedProps } from "react-redux";
import css from "./SearchBox.module.scss";

// eslint-disable-next-line
const mapState = (state: RootState) => ({});

// eslint-disable-next-line
const mapDispatch = (dispatch: RootDispatch) => ({});

const connector = connect(mapState, mapDispatch);

type PropsFromState = ConnectedProps<typeof connector>;
type Props = PropsFromState;

interface State {
  path: string;
}

class SearchBoxUI extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      path: "/some/path",
    };
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    e.stopPropagation();
  };

  handlePath = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      path: e.target.value,
    });
  };

  render(): JSX.Element {
    const { path } = this.state;
    return (
      <div className={css.searchBox}>
        <form className={css.form} onSubmit={this.handleSubmit}>
          <input className={css.path} value={path} onChange={this.handlePath} />
          <div className={css.results}></div>
        </form>
      </div>
    );
  }
}

export const SearchBox = SearchBoxUI;
export default SearchBox;
