import React from "react";
import css from "./Transition.module.scss";
import logo from "@images/logo.png";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import { LOGIN_DURATION } from "@lib";

export function Transition(): JSX.Element {
  const { transition } = useSelector(
    ({ appReducer: { transition } }: RootState) => ({ transition })
  );
  if (transition === "hidden") return <></>;
  const style: React.CSSProperties = {
    animationDuration: `${LOGIN_DURATION}ms`,
  };
  return (
    <div
      className={`${css.transition} ${
        transition === "running" ? "" : css.paused
      }`}
      style={style}
    >
      <div className={css.background} style={style}></div>
      <div className={css.transitionWrapper} style={style}>
        <img src={logo} alt="NetworkExplorer logo"></img>
      </div>
    </div>
  );
}

export default Transition;
