import { Bubbles, Files, Header, Sidebar, Terminal } from "@components";
import { normalizeURL } from "@lib";
import { RootDispatch, RootState } from "@store";
import { getFolder } from "@store/files";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import css from "./Main.module.scss";
import { HotKeys, KeyMap } from "react-hotkeys";
import { setSearch } from "@store/app";

const keyMap: KeyMap = {
  DELETE_NODE: ["del", "backspace"],
  SEARCH: "Control+f",
};

const MainPageUI = (): JSX.Element => {
  const state = useSelector(({ router: { location } }: RootState) => ({
    location,
  }));
  const dispatch = useDispatch<RootDispatch>();
  useEffect(() => {
    dispatch(getFolder(normalizeURL(window.location.pathname)));
  }, [state.location]);

  const handlers: {
    [key: string]: (keyEvent?: KeyboardEvent) => void;
  } = {
    DELETE: (e) => {
      //
    },
    SEARCH: (e) => {
      e?.preventDefault();
      e?.stopPropagation();
      dispatch(
        setSearch({
          searching: true,
        })
      );
    },
  };

  return (
    <HotKeys id={css.main} keyMap={keyMap} handlers={handlers}>
      <Header></Header>
      <div className={css.mainContent}>
        <Sidebar></Sidebar>
        <div className={css.right}>
          <Files></Files>
          <Terminal></Terminal>
        </div>
      </div>
      <Bubbles></Bubbles>
    </HotKeys>
  );
};

export const MainPage = MainPageUI;
export default MainPage;
