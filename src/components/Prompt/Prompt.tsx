import { RootDispatch, RootState } from "@store";
import { setPrompt } from "@store/app";
import React, { createRef } from "react";
import { connect, ConnectedProps } from "react-redux";
import css from "./Prompt.module.scss";

const mapState = ({ appReducer: { prompt } }: RootState) => ({ prompt });

const mapDispatch = (dispatch: RootDispatch) => ({
  setPrompt: (prompt?: PromptProps) => dispatch(setPrompt(prompt)),
});

const connector = connect(mapState, mapDispatch);

type PropsFromState = ConnectedProps<typeof connector>;
type Props = PropsFromState;

export interface PromptProps {
  callback: (value: string) => void;
  fieldName: string;
  initial?: string;
}

interface State {
  initial?: string;
  value: string;
}

class PromptUI extends React.Component<Props, State> {
  input = createRef<HTMLInputElement>();
  constructor(props: Props) {
    super(props);
    this.state = {
      value: "",
      initial: undefined,
    };
  }

  componentDidUpdate() {
    const { prompt } = this.props;
    prompt && this.input.current?.focus();
    if (prompt && prompt.initial && prompt.initial !== this.state.initial) {
      this.setState({
        initial: prompt.initial,
        value: prompt.initial,
      });
    } else if (!prompt && this.state.value) {
      this.setState({
        initial: undefined,
        value: "",
      });
      this.input.current && this.input.current.blur();
    }
  }

  onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      value: event.target.value,
    });
  };

  onKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      this.props.setPrompt(undefined);
    }
  };

  render() {
    const {
      state: { value },
      props: { prompt, setPrompt },
    } = this;

    return (
      <div className={`${css.wrapper} ${prompt ? css.shown : ""}`}>
        <div
          className={css.background}
          onClick={() => setPrompt(undefined)}
        ></div>
        <form
          className={css.prompt}
          onSubmit={(e) => {
            e.stopPropagation();
            e.preventDefault();
            prompt?.callback(value);
            setPrompt(undefined);
          }}
        >
          <div className={css.top}>Enter a value for {prompt?.fieldName}!</div>
          <div className={css.input}>
            <input
              type="text"
              name={prompt?.fieldName}
              placeholder={prompt?.fieldName}
              ref={this.input}
              onChange={this.onChange}
              value={value}
              onKeyUp={this.onKeyUp}
            />
          </div>
          <div className={css.buttons}>
            <button type="submit" className={css.save}>
              Save
            </button>
            <button
              type="button"
              className={css.cancel}
              onClick={() => setPrompt(undefined)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export const Prompt = connector(PromptUI);
export default Prompt;
