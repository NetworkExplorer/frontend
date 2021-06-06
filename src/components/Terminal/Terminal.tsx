import css from "./Terminal.module.scss";
import React, { Component } from "react";
import { RootDispatch, RootState } from "@store";
import { connect, ConnectedProps } from "react-redux";
import { setTerminal, TerminalActions } from "@store/app";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { Endpoints, findElInTree, getCurrentFilesPath, WSData } from "@lib";
import { XTerm as XTermEl } from "@termftp/react-xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";

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
}

class TerminalUI extends Component<Props, State> {
  xtermRef: React.RefObject<XTermEl> = React.createRef();
  fitAddon = new FitAddon();
  webLinksAddon = new WebLinksAddon();

  constructor(props: Props) {
    super(props);
    this.state = {
      executing: false,
      value: "",
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
    // this.resize();
    (window as any).fit = this.fitAddon.fit.bind(this.fitAddon);
    if (this.xtermRef.current) {
      const t = this.xtermRef.current.getTerminal();
      t.write("$ ");
      t.onKey(
        (({ key, domEvent }: { key: string; domEvent: KeyboardEvent }) => {
          if (!this.state.executing) {
            if (domEvent.key === "Enter") {
              this.setState({ executing: true });
              t.writeln("");
              t.writeln("");
              // TODO send command
              Endpoints.getInstance().startExec(
                getCurrentFilesPath(),
                this.state.value,
                this.onMessage,
                this.onError
              );
              return;
            } else if (domEvent.key.toLowerCase() === "c" && domEvent.ctrlKey) {
              console.log("ctrl+c");
              // TODO add cancel
            } else if (domEvent.key === "Backspace") {
              if (this.state.value.length > 0) {
                this.setState({
                  value: this.state.value.substring(
                    0,
                    this.state.value.length - 1
                  ),
                });
                t.write("\b \b");
              }
            } else if (domEvent.key.length == 1) {
              // check if character is writeable
              this.setState({ value: this.state.value + domEvent.key });
              t.write(key);
            }
          }
        }).bind(this)
      );
    }
  }

  onMessage = (ev: MessageEvent) => {
    const res: WSData = JSON.parse(ev.data);
    const t = this.xtermRef.current?.getTerminal();
    if (!t) return;
    if (res.error) {
      t.writeln(
        "An error occured. The development console contains more information"
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
