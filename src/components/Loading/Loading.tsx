import React from "react";

import css from "./Loading.module.scss";

interface Props {
  loading: boolean;
  className?: string;
}

export function Loading({ loading, className }: Props): JSX.Element {
  return (
    <div
      className={`${css.loadingWrapper} ${className} ${
        loading ? css.loading : ""
      }`}
    >
      <div className={css["lds-ring"]}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default Loading;
