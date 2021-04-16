import { RootDispatch, RootState } from "@store";
import { push } from "connected-react-router";
import React, { Component } from "react";
import { connect, ConnectedProps } from "react-redux";
import css from "./SearchBox.module.scss";

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

class SearchBoxUI extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    console.log(this.props.location);
    this.state = {
      path: this.props.location.pathname,
      focused: false,
    };
  }

  componentDidUpdate() {
    if (
      !this.state.focused &&
      this.state.path != this.props.location.pathname
    ) {
      this.setState({ path: this.props.location.pathname });
    }
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (this.state.path != this.props.location.pathname) {
      this.props.push(this.state.path.trim());
    }
  };

  handlePath = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      path: e.target.value.trim(),
    });
  };

  render(): JSX.Element {
    const { path } = this.state;
    return (
      <div className={css.searchBox}>
        <form className={css.form} onSubmit={this.handleSubmit}>
          <label className={css.path}>
            <input
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

export const SearchBox = connector(SearchBoxUI);
export default SearchBox;
