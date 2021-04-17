import css from "./Terminal.module.scss";
import React, { Component } from "react";
import { RootDispatch, RootState } from "@store";
import { connect, ConnectedProps } from "react-redux";
import { setTerminal, TerminalActions } from "@store/app";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faTimes } from "@fortawesome/free-solid-svg-icons";

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
    e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>
  ): void => {
    e.stopPropagation();
    e.preventDefault();
    this.props.setTerminal("TOGGLE");
  };

  render(): JSX.Element {
    const { terminalOpen } = this.props;
    return (
      <div className={`${css.terminal} ${terminalOpen ? css.opened : ""}`}>
        <div className={css.topPart} onDoubleClick={this.handleToggle}>
          <p>Terminal</p>
          <button className={css.toggleBtn} onClick={this.handleToggle}>
            <div className={css.iconWrapper}>
              <FontAwesomeIcon icon={faAngleUp}></FontAwesomeIcon>
            </div>
          </button>
          <button className={css.closeBtn}>
            <div className={css.iconWrapper}>
              <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
            </div>
          </button>
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
