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

class HeaderSearchUI extends Component<Props, State> {
  inputRef = React.createRef<HTMLInputElement>();
  timeout = -1;

  constructor(props: Props) {
    super(props);
    this.state = {
      path: this.props.location.pathname,
      focused: false,
      position: -1,
    };
  }

  componentDidUpdate() {
    if (
      !this.state.focused &&
      this.state.path != decodeURI(window.location.pathname)
    ) {
      this.setState({ path: decodeURI(window.location.pathname) });
      this.props.clearSuggestions();
    }
    if (this.props.suggestions.length === 0 && this.state.position !== -1) {
      this.setState({ position: -1 });
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
    });
    this.setState({ position: -1 });
    this.props.clearSuggestions();
    clearTimeout(this.timeout);
    this.timeout = setTimeout(this.getSuggestions, 500) as unknown as number;
  };

  getSuggestions = () => {
    this.props.fetchSuggestions(this.state.path);
    this.setState({ position: -1 });
  };

  onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    const len = this.props.suggestions.length;
    if (len > 0) {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e?.preventDefault();
        e?.stopPropagation();
        if (this.state.position === -1) {
          if (e.key === "ArrowDown") {
            this.setState({ position: 0 });
          } else {
            this.setState({ position: len - 1 });
          }
        } else {
          let change = 0;
          if (e.key === "ArrowDown") change = 1;
          else change = -1;
          const newPosition = (len + this.state.position + change) % len;
          this.setState({ position: newPosition });
        }
      } else if (e.key === "Escape") {
        this.setState({ position: -1 });
      }
    }
  };

  loadSuggestion(i?: number) {
    const index = i || this.state.position;
    let path = this.state.path;
    if (index > -1) {
      path = this.props.suggestions[index] || path;
    }

    this.inputRef.current?.blur();
    this.setState({ focused: false }, () => {
      this.props.push(path.trim());
    });
  }

  render(): JSX.Element {
    const { path } = this.state;
    console.log(this.props.suggestions);
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
              onBlur={() => this.setState({ focused: false })}
              onKeyDown={this.onKeyDown}
            />
          </label>
          <div
            className={`${css.results} ${
              this.props.suggestions.length > 0 ? css.resultsOpen : ""
            }`}
            style={
              {
                "--items": this.props.suggestions.length,
                "--position":
                  this.state.position === -1 ? -2 : this.state.position,
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
