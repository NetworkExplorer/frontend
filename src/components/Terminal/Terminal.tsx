import css from "./Terminal.module.scss";
import React, { Component } from "react";
import { RootDispatch, RootState } from "@store";
import { connect, ConnectedProps } from "react-redux";
import { setTerminal, TerminalActions } from "@store/app";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import {
  Endpoints,
  findElInTree,
  getCurrentFilesPath,
  normalizeURL,
  WSData,
} from "@lib";
import { XTerm as XTermEl } from "@termftp/react-xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";
import { Terminal as XTerminal } from "xterm";

const mapState = ({ appReducer: { terminalOpen } }: RootState) => ({
  terminalOpen,
});

const mapDispatch = (dispatch: RootDispatch) => ({
  setTerminal: (action: TerminalActions) => dispatch(setTerminal(action)),
});

const connector = connect(mapState, mapDispatch);

type PropsFromState = ConnectedProps<typeof connector>;
type Props = PropsFromState;

interface State {
  executing: boolean;
  value: string;
  actualValue: string;
  currentPosition: number;
}

class TerminalUI extends Component<Props, State> {
  xtermRef: React.RefObject<XTermEl> = React.createRef();
  fitAddon = new FitAddon();
  webLinksAddon = new WebLinksAddon();
  history: string[] = [];

  constructor(props: Props) {
    super(props);
    this.state = {
      executing: false,
      value: "",
      currentPosition: -1,
      actualValue: "",
    };
  }

  handleToggle = (
    e?: React.MouseEvent<HTMLButtonElement | HTMLDivElement>
  ): void => {
    e?.stopPropagation();
    e?.preventDefault();
    this.props.setTerminal("TOGGLE");
    this.resize();
  };

  handleDoubleClick = (e: MouseEvent): void => {
    const target: HTMLElement = e.target as HTMLElement;
    const termEl = findElInTree(css.topPart, target);

    if (!termEl) return;

    this.handleToggle(undefined);
  };

  componentDidMount() {
    window.addEventListener("dblclick", this.handleDoubleClick);
    window.addEventListener("resize", this.resize);
    this.xtermRef.current?.getTerminal().setOption("theme", {
      background: "#343b47",
    });
    // this.resize();
    (window as any).fit = this.fitAddon.fit.bind(this.fitAddon);
    if (this.xtermRef.current) {
      const t = this.xtermRef.current.getTerminal();
      t.write("$ ");
      t.onKey(this.onKey);
    }
  }

  onKey = ({ key, domEvent }: { key: string; domEvent: KeyboardEvent }) => {
    const t = this.xtermRef.current?.getTerminal();
    if (!t) return;
    if (domEvent.key.toLowerCase() === "c" && domEvent.ctrlKey) {
      t.write("^C");
      Endpoints.getInstance().cancelExec();
      return;
    }
    if (!this.state.executing) {
      if (domEvent.key === "Enter") {
        t.writeln("");
        t.writeln("");
        this.history.push(this.state.value);

        Endpoints.getInstance().startExec(
          normalizeURL(getCurrentFilesPath(), false, true),
          this.state.value,
          this.onMessage,
          this.onError
        );
        this.setState({
          executing: true,
          currentPosition: this.history.length,
          value: "",
          actualValue: "",
        });
      } else if (domEvent.key === "Backspace") {
        if (this.state.value.length > 0) {
          const s = this.state.actualValue.substring(
            0,
            this.state.actualValue.length - 1
          );
          this.setState({
            value: s,
            actualValue: s,
            currentPosition: -1,
          });
          t.write("\b \b");
        }
      } else if (domEvent.key.length == 1) {
        // check if character is writeable
        this.setState({
          value: this.state.actualValue + domEvent.key,
          actualValue: this.state.actualValue + domEvent.key,
          currentPosition: -1,
        });
        t.write(key);
      } else if (domEvent.key === "ArrowUp") {
        let newPos = this.state.currentPosition;
        if (this.state.currentPosition < 0) {
          newPos = this.history.length;
        }
        newPos -= 1;
        if (newPos >= 0) {
          this.removeCurrent(t, this.history[newPos]);
          t.write(this.history[newPos]);
          this.setState({
            currentPosition: newPos,
            actualValue: this.history[newPos],
          });
        }
      } else if (domEvent.key === "ArrowDown") {
        let newPos = this.state.currentPosition;
        newPos += 1;
        if (newPos < this.history.length) {
          this.removeCurrent(t, this.history[newPos]);
          t.write(this.history[newPos]);
          this.setState({
            currentPosition: newPos,
            actualValue: this.history[newPos],
          });
        } else if (newPos >= this.history.length) {
          this.removeCurrent(t, this.state.actualValue);
          t.write(this.state.value);
          this.setState({
            actualValue: this.state.value,
            currentPosition: this.history.length,
          });
        }
      }
    }
  };

  removeCurrent(t: XTerminal, newValue: string) {
    if (this.state.currentPosition === -1) {
      for (let i = 0; i < this.state.value.length; i++) {
        this.backspace(t);
      }
    } else {
      for (let i = 0; i < newValue.length; i++) {
        this.backspace(t);
      }
    }
  }

  backspace(t: XTerminal) {
    t.write("\b \b");
  }

  onMessage = (ev: MessageEvent) => {
    const res: WSData = JSON.parse(ev.data);
    const t = this.xtermRef.current?.getTerminal();
    if (!t) return;
    if (res.error) {
      t.writeln(
        "An error occurred. The development console contains more information"
      );
      console.error(res);
    } else if (res.end) {
      this.setState({ executing: false, value: "" });
      t.writeln("");
      t.write("$ ");
    } else {
      t.writeln(res.result);
    }
  };

  //eslint-disable-next-line
  onError = (ev: Event) => {
    const t = this.xtermRef.current?.getTerminal();
    if (!t) return;
    t.writeln("The connection was closed.");
    console.error(ev);
  };

  resize = (): void => {
    this.fitAddon.fit();
  };

  componentWillUnmount() {
    window.removeEventListener("dblclick", this.handleDoubleClick);
    window.removeEventListener("resize", this.resize);
  }

  render(): JSX.Element {
    const { terminalOpen } = this.props;
    const { executing } = this.state;
    return (
      <div className={`${css.terminal} ${terminalOpen ? css.opened : ""}`}>
        <div className={css.topPart}>
          <p>{executing ? "Terminal (running)" : "Terminal"}</p>
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
          <XTermEl
            ref={this.xtermRef}
            addons={[this.fitAddon, this.webLinksAddon]}
            options={{
              convertEol: true,
              fontFamily: `"JetBrains Mono", "monospace"`,
              rendererType: "dom",
            }}
            className={css.xterm}
          />
          {/* TODO implement xtermjs */}
        </div>
      </div>
    );
  }
}

export const Terminal = connector(TerminalUI);
export default Terminal;
