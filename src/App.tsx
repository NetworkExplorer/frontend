import React from "react";
import { RootDispatch, RootState } from "@store";
import { AppActionTypes } from "@store/app";
import { useDispatch, useSelector } from "react-redux";
import css from "./App.module.scss";

export function App(): JSX.Element {
  const state = useSelector((state: RootState) => ({
    loading: state.appReducer.loading,
  }));
  const dispatch = useDispatch<RootDispatch>();
  const handleChange = () =>
    dispatch({
      type: AppActionTypes.SET_LOADING,
      payload: !state.loading,
    });

  return (
    <div className={css.App}>
      <button onClick={handleChange}>
        {state.loading ? "asjdjksajhks" : "hdjdj"}
      </button>
    </div>
  );
}

export default App;
