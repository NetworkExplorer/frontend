import {
  Bubbles,
  Files,
  Header,
  PromptProps,
  Sidebar,
  Terminal,
} from "@components";
import { normalizeURL, onDelete } from "@lib";
import { RootDispatch, RootState } from "@store";
import { getFolder } from "@store/files";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import css from "./Main.module.scss";
import { HotKeys, KeyMap } from "react-hotkeys";
import { addBubble, setPrompt, setSearch } from "@store/app";
import { Search } from "@components/Search/Search";
import { BubbleI } from "@models";

const keyMap: KeyMap = {
  // DELETE: ["del", "backspace"],
  SEARCH: "Control+f",
};

type HandlerType = {
  [key: string]: (keyEvent?: KeyboardEvent) => void;
};

const MainPageUI = (): JSX.Element => {
  const { location, selected } = useSelector(
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
  }, [location]);
  const [listening, setListening] = useState(false);

  const keyUp = async (e: KeyboardEvent) => {
    if (e?.target) {
      const el = e.target as HTMLElement;
      if (el.tagName === "input" || el.isContentEditable) return;
    }
    if (e.key === "Backspace" || e.key === "Delete") {
      e?.preventDefault();
      e?.stopPropagation();
      await onDelete(
        selected,
        (prompt?: PromptProps) => dispatch(setPrompt(prompt)),
        (key: string, bubble: BubbleI) => dispatch(addBubble(key, bubble))
      );
      console.log("d");
      dispatch(getFolder());
    }
  };
  useEffect(() => {
    if (!listening && selected.size > 0) {
      setListening(true);
      document.addEventListener("keyup", keyUp);
    } else if (listening && selected.size === 0) {
      document.removeEventListener("keyup", keyUp);
      setListening(false);
    }
  }, [selected]);

  const handlers: HandlerType = {
    SEARCH: (e) => {
      e?.preventDefault();
      e?.stopPropagation();
      setSearch({
        searching: true,
        shouldFocus: true,
      });
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
