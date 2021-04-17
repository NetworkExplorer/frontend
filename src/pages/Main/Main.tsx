import { Bubbles, Files, Header, Sidebar, Terminal } from "@components";
import { RootDispatch, RootState } from "@store";
import { getFolder } from "@store/files";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import css from "./Main.module.scss";

const MainPageUI = (): JSX.Element => {
  const state = useSelector(({ router: { location } }: RootState) => ({
    location,
  }));
  const dispatch = useDispatch<RootDispatch>();
  useEffect(() => {
    dispatch(getFolder(state.location.pathname));
  }, [state.location]);
  return (
    <div id={css.main}>
      <Header></Header>
      <div className={css.mainContent}>
        <Sidebar></Sidebar>
        <div className={css.right}>
          <Files></Files>
          <Terminal></Terminal>
        </div>
      </div>
      <Bubbles></Bubbles>
    </div>
  );
};

export const MainPage = MainPageUI;
export default MainPage;
