import { PermissionE, UserI } from "@models";
import { RootDispatch, RootState } from "@store";
import { createUser, setUserPrompt } from "@store/user";
import React, { Component, createRef } from "react";
import { connect, ConnectedProps } from "react-redux";
import css from "./ManageUsers.module.scss";
import { Permission } from "./Permission";

const mapState = ({ userReducer: { userPromptOpen } }: RootState) => ({
  userPromptOpen,
});

const mapDispatch = (dispatch: RootDispatch) => ({
  createUser: (user: UserI) => dispatch(createUser(user)),
  setUserPrompt: (prompt: boolean) => dispatch(setUserPrompt(prompt)),
});

const connector = connect(mapState, mapDispatch);

type PropsFromState = ConnectedProps<typeof connector>;
type Props = PropsFromState;

interface State {
  username: string;
  password: string;
  passwordAgain: string;
  permissions: PermissionE[];
  listening: boolean;
  canSubmit: boolean;
}

class CreateUserPromptUI extends Component<Props, State> {
  input = createRef<HTMLInputElement>();
  constructor(props: Props) {
    super(props);
    this.state = {
      password: "",
      permissions: [PermissionE.READ],
      username: "",
      passwordAgain: "",
      canSubmit: false,
      listening: false,
    };
  }

  componentDidUpdate(prevProps: Props, prevState: State): void {
    const { userPromptOpen } = this.props;
    if (!prevProps.userPromptOpen && userPromptOpen) {
      this.setState({
        password: "",
        permissions: [PermissionE.READ],
        username: "",
        passwordAgain: "",
        canSubmit: false,
      });
      this.input.current?.focus();
    }

    if (userPromptOpen && !this.state.listening) {
      this.setState({
        listening: true,
      });
      document.addEventListener("keydown", this.onKeyDown);
    }

    if (!userPromptOpen && this.state.listening) {
      document.removeEventListener("keydown", this.onKeyDown);
      this.setState({ listening: false });
    }

    const { password, passwordAgain, permissions, username } = this.state;
    if (
      prevState.password !== password ||
      prevState.passwordAgain !== passwordAgain ||
      prevState.permissions !== permissions ||
      prevState.username !== username
    ) {
      this.setState({
        canSubmit:
          Boolean(username) &&
          Boolean(password) &&
          Boolean(passwordAgain) &&
          password === passwordAgain &&
          permissions.length > 0,
      });
    }
  }

  componentWillUnmount(): void {
    document.removeEventListener("keydown", this.onKeyDown);
  }

  onKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement> | KeyboardEvent
  ): void => {
    if (event.key === "Escape") {
      this.props.setUserPrompt(false);
      document.removeEventListener("keydown", this.onKeyDown);
    }
  };

  onSubmit = (e: React.FormEvent): void => {
    e.stopPropagation();
    e.preventDefault();
    const { permissions, username, password, canSubmit } = this.state;
    if (!canSubmit) return;
    this.props.createUser({
      permissions,
      username,
      password,
    });
    this.props.setUserPrompt(false);
  };

  changePerm = (perm: PermissionE): void => {
    const { permissions } = this.state;
    let perms = [...permissions];
    if (permissions.includes(perm)) {
      perms = perms.filter((p) => p !== perm);
    } else {
      perms.push(perm);
    }
    this.setState({ permissions: perms });
  };

  render(): JSX.Element {
    const { password, passwordAgain, permissions, username, canSubmit } =
      this.state;
    return (
      <div
        className={`${css.promptWrapper} ${
          this.props.userPromptOpen ? css.promptShown : ""
        }`}
      >
        <div
          className={css.promptBG}
          onClick={() => this.props.setUserPrompt(false)}
        ></div>
        <form className={css.prompt} onSubmit={this.onSubmit}>
          <h1>Create User</h1>
          <div className={css.input}>
            Username
            <input
              ref={this.input}
              type="text"
              name="Username"
              placeholder="bob"
              onChange={(e) => this.setState({ username: e.target.value })}
              value={username}
              onKeyDown={this.onKeyDown}
            />
          </div>
          <div className={css.input}>
            Password
            <input
              type="password"
              name="Password"
              placeholder="password"
              onChange={(e) => this.setState({ password: e.target.value })}
              value={password}
              onKeyDown={this.onKeyDown}
            />
          </div>
          <div className={css.input}>
            Enter the password Again
            <input
              type="password"
              name="Password Again"
              placeholder="password"
              onChange={(e) => this.setState({ passwordAgain: e.target.value })}
              value={passwordAgain}
              onKeyDown={this.onKeyDown}
            />
          </div>
          <div className={css.input}>
            Permissions
            <div className={`${css.permissions} ${css.createPerms}`}>
              {Object.keys(PermissionE).map((p) => (
                <Permission
                  key={p}
                  p={p as PermissionE}
                  perms={permissions}
                  change={this.changePerm}
                ></Permission>
              ))}
            </div>
          </div>
          <div className={css.buttons}>
            <button
              type="button"
              className={css.cancel}
              onClick={() => this.props.setUserPrompt(false)}
            >
              Cancel
            </button>
            <button type="submit" className={css.save} disabled={!canSubmit}>
              Create
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export const CreateUserPrompt = connector(CreateUserPromptUI);
export default CreateUserPrompt;
