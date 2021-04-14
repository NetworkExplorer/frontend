import { Files, Header, Sidebar, Terminal } from "@components";
import React from "react";
import css from "./Main.module.scss";

const MainPageUI = (): JSX.Element => {
  return (
    <div id={css.main}>
      <Header></Header>
      <div className={css.mainContent}>
        <Sidebar></Sidebar>
        <Files></Files>
        <Terminal></Terminal>
      </div>
    </div>
  );
};

export const MainPage = MainPageUI;
export default MainPage;
