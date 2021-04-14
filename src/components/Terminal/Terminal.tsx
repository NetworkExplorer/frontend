import css from "./Terminal.module.scss";
import React, { Component } from "react";

export class Terminal extends Component {
  render(): JSX.Element {
    return <div className={css.terminal}></div>;
  }
}

export default Terminal;
