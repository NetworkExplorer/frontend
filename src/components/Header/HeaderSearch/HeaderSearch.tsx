import { getCurrentFilesPath, normalizeURL, ROUTES } from "@lib";
import { RootDispatch, RootState } from "@store";
import { clearSuggestions, fetchSuggestions } from "@store/app";
import { push } from "connected-react-router";
import React, { Component } from "react";
import { connect, ConnectedProps } from "react-redux";
import css from "./HeaderSearch.module.scss";

// eslint-disable-next-line
const mapState = ({
  router: { location },
  appReducer: { suggestions },
}: RootState) => ({ location, suggestions });

const mapDispatch = (dispatch: RootDispatch) => ({
  push: (url: string) => dispatch(push(url)),
  fetchSuggestions: (path: string, max = 5) =>
    dispatch(fetchSuggestions(path, max)),
  clearSuggestions: () => dispatch(clearSuggestions()),
});

const connector = connect(mapState, mapDispatch);

type PropsFromState = ConnectedProps<typeof connector>;
type Props = PropsFromState;

interface State {
  path: string;
  focused: boolean;
  position: number;
}

const EMPTY_POSITION = -2;
class HeaderSearchUI extends Component<Props, State> {
  inputRef = React.createRef<HTMLInputElement>();
  timeout = -1;

  constructor(props: Props) {
    super(props);
    this.state = {
      path: decodeURI(normalizeURL(getCurrentFilesPath(), false, true)),
      focused: false,
      position: EMPTY_POSITION,
    };
  }

  componentDidUpdate() {
    if (
      !this.state.focused &&
      this.state.path !=
        decodeURI(normalizeURL(getCurrentFilesPath(), false, true))
    ) {
      this.setState({
        path: decodeURI(normalizeURL(getCurrentFilesPath(), false, true)),
      });
      this.props.clearSuggestions();
    }
    if (
      this.props.suggestions.length === 0 &&
      this.state.position !== EMPTY_POSITION
    ) {
      this.setState({ position: EMPTY_POSITION });
    }
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    this.loadSuggestion();
  };

  handlePath = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      path: e.target.value,
      position: EMPTY_POSITION,
    });
    // this.props.clearSuggestions();
    clearTimeout(this.timeout);
    this.timeout = setTimeout(this.getSuggestions, 500) as unknown as number;
  };

  getSuggestions = () => {
    if (!this.state.focused) return;
    this.props.fetchSuggestions(this.state.path);
    this.setState({ position: EMPTY_POSITION });
  };

  onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    const len = this.props.suggestions.length;
    if (len > 0) {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e?.preventDefault();
        e?.stopPropagation();
        if (this.state.position < 0) {
          if (e.key === "ArrowDown") {
            this.setState({ position: 0 });
          } else {
            this.setState({ position: len - 1 });
          }
        } else if (this.state.position === 0 && e.key === "ArrowUp") {
          this.setState({ position: EMPTY_POSITION });
        } else {
          let change = 0;
          if (e.key === "ArrowDown") change = 1;
          else change = -1;
          const newPosition = (len + this.state.position + change) % len;
          this.setState({ position: newPosition });
        }
      } else if (e.key === "Escape") {
        this.setState({ position: EMPTY_POSITION });
      }
    }
  };

  loadSuggestion(i?: number) {
    const index = i || this.state.position;
    let path = this.state.path;
    if (index > EMPTY_POSITION) {
      path = this.props.suggestions[index] || path;
    }

    this.inputRef.current?.blur();
    this.setState({ focused: false }, () => {
      this.props.push(ROUTES.FILES + path.trim());
    });
    // TODO check if relative path
  }

  render(): JSX.Element {
    const { path } = this.state;
    return (
      <div className={css.searchBox}>
        <form className={css.form} onSubmit={this.handleSubmit}>
          <label className={css.path}>
            <input
              ref={this.inputRef}
              // className={css.path}
              value={path}
              onChange={this.handlePath}
              onFocus={() => this.setState({ focused: true })}
              onBlur={() =>
                this.setState({ focused: false, position: EMPTY_POSITION })
              }
              onKeyDown={this.onKeyDown}
              disabled={!window.location.pathname.startsWith(ROUTES.FILES)}
            />
          </label>
          <div
            className={`${css.results} ${
              this.props.suggestions.length > 0 && this.state.focused
                ? css.resultsOpen
                : ""
            }`}
            style={
              {
                "--items": this.props.suggestions.length,
                "--position": this.state.position,
              } as React.CSSProperties
            }
          >
            {this.props.suggestions.map((s, i) => (
              <div key={s} onClick={() => this.loadSuggestion(i)}>
                {s}
              </div>
            ))}
          </div>
        </form>
      </div>
    );
  }
}

export const HeaderSearch = connector(HeaderSearchUI);
export default HeaderSearch;
