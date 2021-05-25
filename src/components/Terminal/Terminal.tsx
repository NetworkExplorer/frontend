import css from "./Terminal.module.scss";
import React, { Component } from "react";
import { RootDispatch, RootState } from "@store";
import { connect, ConnectedProps } from "react-redux";
import { setTerminal, TerminalActions } from "@store/app";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { findElInTree } from "@lib";

const mapState = ({ appReducer: { terminalOpen } }: RootState) => ({
  terminalOpen,
});

const mapDispatch = (dispatch: RootDispatch) => ({
  setTerminal: (action: TerminalActions) => dispatch(setTerminal(action)),
});

const connector = connect(mapState, mapDispatch);

type PropsFromState = ConnectedProps<typeof connector>;
type Props = PropsFromState;

class TerminalUI extends Component<Props> {
  handleToggle = (
    e?: React.MouseEvent<HTMLButtonElement | HTMLDivElement>
  ): void => {
    e?.stopPropagation();
    e?.preventDefault();
    this.props.setTerminal("TOGGLE");
  };

  handleDoubleClick = (e: MouseEvent): void => {
    const target: HTMLElement = e.target as HTMLElement;
    const termEl = findElInTree(css.topPart, target);

    if (!termEl) return;

    this.handleToggle(undefined);
  };

  componentDidMount() {
    window.addEventListener("dblclick", this.handleDoubleClick);
  }

  componentWillUnmount() {
    window.removeEventListener("dblclick", this.handleDoubleClick);
  }

  render(): JSX.Element {
    const { terminalOpen } = this.props;
    return (
      <div className={`${css.terminal} ${terminalOpen ? css.opened : ""}`}>
        <div className={css.topPart}>
          <p>Terminal</p>
          <button className={css.toggleBtn} onClick={this.handleToggle}>
            <div className={css.iconWrapper}>
              <FontAwesomeIcon icon={faAngleUp}></FontAwesomeIcon>
            </div>
          </button>
          {/* <button className={css.closeBtn}>
            <div className={css.iconWrapper}>
              <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
            </div>
          </button> */}
        </div>
        <div className={css.content}>
          Content here
          {/* TODO implement xtermjs */}
        </div>
      </div>
    );
  }
}

export const Terminal = connector(TerminalUI);
export default Terminal;
