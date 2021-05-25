import { Bubbles, Files, Header, Sidebar, Terminal } from "@components";
import { normalizeURL } from "@lib";
import { RootDispatch, RootState } from "@store";
import { getFolder } from "@store/files";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import css from "./Main.module.scss";
import { HotKeys, KeyMap } from "react-hotkeys";
import { setSearch } from "@store/app";
import { Search } from "@components/Search/Search";

const keyMap: KeyMap = {
  DELETE_NODE: ["del", "backspace"],
  SEARCH: "Control+f",
};

const MainPageUI = (): JSX.Element => {
  const state = useSelector(
    ({
      router: { location },
      filesReducer: {
        selection: { selected },
      },
    }: RootState) => ({
      location,
      selected,
    })
  );
  const dispatch = useDispatch<RootDispatch>();
  useEffect(() => {
    dispatch(getFolder(normalizeURL(window.location.pathname)));
  }, [state.location]);

  const handlers: {
    [key: string]: (keyEvent?: KeyboardEvent) => void;
  } = {
    DELETE: (e) => {
      e?.preventDefault();
      e?.stopPropagation();
    },
    SEARCH: (e) => {
      e?.preventDefault();
      e?.stopPropagation();
      dispatch(
        setSearch({
          searching: true,
          shouldFocus: true,
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
          <Search></Search>
        </div>
      </div>
      <Bubbles></Bubbles>
    </HotKeys>
  );
};

export const MainPage = MainPageUI;
export default MainPage;
