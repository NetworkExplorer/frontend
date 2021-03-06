import { faBell } from "@fortawesome/free-regular-svg-icons";
import {
  faCheck,
  faChevronDown,
  faExclamation,
  faInfo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BubbleI } from "@models";
import { RootDispatch } from "@store";
import { removeBubble } from "@store/app";
import React, { Component, CSSProperties } from "react";
import { connect, ConnectedProps } from "react-redux";
import css from "./Bubble.module.scss";

const mapState = () => ({});

const mapDispatch = (dispatch: RootDispatch) => ({
  removeBubble: (key: string) => dispatch(removeBubble(key)),
});

const connector = connect(mapState, mapDispatch);

type PropsFromState = ConnectedProps<typeof connector>;
type Props = PropsFromState & {
  k: string;
  bubble?: BubbleI;
  timeout: number;
  i: number;
};

interface State {
  fading: boolean;
  expanded: boolean;
}

class BubbleUI extends Component<Props, State> {
  private FADE = "250ms";
  private timeout1 = -1;
  private timeout2 = -1;

  constructor(props: Props) {
    super(props);
    this.state = {
      fading: false,
      expanded: false,
    };
  }

  componentDidMount(): void {
    const { timeout } = this.props;
    this.startRemove(timeout);
  }

  shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
    return (
      nextProps.k != this.props.k ||
      nextProps.i != this.props.i ||
      nextState.fading != this.state.fading ||
      nextState.expanded != this.state.expanded
    );
  }

  componentWillUnmount() {
    clearTimeout(this.timeout1);
    clearTimeout(this.timeout2);
  }

  startRemove = (timeout: number) => {
    const { k, removeBubble } = this.props;
    clearTimeout(this.timeout1);
    clearTimeout(this.timeout2);
    this.timeout1 = window.setTimeout(() => {
      this.setState({ fading: true });
    }, timeout + 1);
    this.timeout2 = window.setTimeout(() => {
      removeBubble(k);
    }, timeout + Number(this.FADE.replace("ms", "")));
  };

  toggleExpand = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): boolean => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ expanded: !this.state.expanded });
    return true;
  };

  render(): JSX.Element {
    if (!this.props.bubble) return <></>;
    const {
      timeout,
      bubble: { message, title, type },
      i,
    } = this.props;
    const { fading, expanded } = this.state;
    const style = {
      "--timeout": `${timeout}ms`,
      "--fade": this.FADE,
      "--index": i,
    } as CSSProperties;
    return (
      <div
        className={`${css.wrapper} ${fading ? css.fading : ""} ${
          css[type.toLowerCase()]
        } ${expanded ? css.expanded : ""}`}
        style={style}
        onClick={() => this.startRemove(0)}
      >
        <div className={css.content}>
          <div className={css.icon}>
            {type === "ERROR" && (
              <FontAwesomeIcon icon={faExclamation}></FontAwesomeIcon>
            )}
            {type === "WARNING" && (
              <FontAwesomeIcon icon={faBell}></FontAwesomeIcon>
            )}
            {type === "INFORMATION" && (
              <FontAwesomeIcon icon={faInfo}></FontAwesomeIcon>
            )}
            {type === "SUCCESS" && (
              <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
            )}
          </div>
          <div className={css.title}>{title}</div>
          {message?.trim() && (
            <button
              className={`${css.icon} ${css.expand}`}
              onClick={this.toggleExpand}
            >
              <FontAwesomeIcon
                icon={faChevronDown}
                className="no-background"
              ></FontAwesomeIcon>
            </button>
          )}
        </div>
        {message?.trim() && <div className={css.message}>{message}</div>}
      </div>
    );
  }
}
export const Bubble = connector(BubbleUI);
export default Bubble;
