import { RootDispatch, RootState } from "@store";
import React, { Component } from "react";
import { connect, ConnectedProps } from "react-redux";
import css from "./SearchBox.module.scss";

const mapState = (state: RootState) => ({});

const mapDispatch = (dispatch: RootDispatch) => ({});

const connector = connect(mapState, mapDispatch);

type PropsFromState = ConnectedProps<typeof connector>;
type Props = PropsFromState;

class SearchBoxUI extends Component<Props> {
  render(): JSX.Element {
    return <div className={css.searchBox}></div>;
  }
}

export const SearchBox = SearchBoxUI;
export default SearchBox;
