import { RootDispatch, RootState } from "@store";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import Bubble from "./Bubble/Bubble";
import css from "./Bubbles.module.scss";

const mapState = ({ appReducer: { bubbles } }: RootState) => ({
  bubbles,
});

// eslint-disable-next-line
const mapDispatch = (dispatch: RootDispatch) => ({
  // addBubble: (key: string, bubble: BubbleModel) =>
  // dispatch(addBubble(key, bubble)),
});

const connector = connect(mapState, mapDispatch);

type PropsFromState = ConnectedProps<typeof connector>;
type Props = PropsFromState;

const BubblesUI = ({ bubbles }: Props): JSX.Element => {
  const keys = [];
  for (const k of bubbles.keys()) {
    keys.push(k);
  }
  return (
    <div id={css.bubbles}>
      {keys.map((k, i) => (
        <Bubble
          key={k}
          k={k}
          i={i}
          bubble={bubbles.get(k)}
          timeout={20000}
        ></Bubble>
      ))}
    </div>
  );
};

export const Bubbles = connector(BubblesUI);
export default Bubbles;
