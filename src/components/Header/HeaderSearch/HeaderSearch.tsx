import { RootDispatch, RootState } from "@store";
import { push } from "connected-react-router";
import React, { Component } from "react";
import { connect, ConnectedProps } from "react-redux";
import css from "./HeaderSearch.module.scss";

// eslint-disable-next-line
const mapState = ({ router: { location } }: RootState) => ({ location });

const mapDispatch = (dispatch: RootDispatch) => ({
  push: (url: string) => dispatch(push(url)),
});

const connector = connect(mapState, mapDispatch);

type PropsFromState = ConnectedProps<typeof connector>;
type Props = PropsFromState;

interface State {
  path: string;
  focused: boolean;
}

class HeaderSearchUI extends Component<Props, State> {
  inputRef = React.createRef<HTMLInputElement>();

  constructor(props: Props) {
    super(props);
    this.state = {
      path: this.props.location.pathname,
      focused: false,
    };
  }

  componentDidUpdate() {
    if (
      !this.state.focused &&
      this.state.path != decodeURI(window.location.pathname)
    ) {
      this.setState({ path: decodeURI(window.location.pathname) });
    }
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (this.state.path != this.props.location.pathname) {
      this.inputRef.current?.blur();
      this.setState({ focused: false }, () => {
        this.props.push(this.state.path.trim());
      });
    }
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
          <label className={css.path}>
            <input
              ref={this.inputRef}
              // className={css.path}
              value={path}
              onChange={this.handlePath}
              onFocus={() => this.setState({ focused: true })}
              onBlur={() => this.setState({ focused: false })}
            />
          </label>
          <div className={css.results}></div>
        </form>
      </div>
    );
  }
}

export const HeaderSearch = connector(HeaderSearchUI);
export default HeaderSearch;
