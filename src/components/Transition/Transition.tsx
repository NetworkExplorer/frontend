import React from "react";
import css from "./Transition.module.scss";
import logo from "@images/logo.png";

export function Transition(): JSX.Element {
  return (
    <div className={css.transition}>
      <div className={css.background}></div>
      <div className={css.transitionWrapper}>
        <img src={logo} alt="NetworkExplorer logo"></img>
      </div>
    </div>
  );
}

export default Transition;
