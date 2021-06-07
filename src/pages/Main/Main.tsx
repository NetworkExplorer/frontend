import { Files, Layout, PromptProps, Terminal } from "@components";
import { getCurrentFilesPath, normalizeURL, onDelete, ROUTES } from "@lib";
import { RootDispatch, RootState } from "@store";
import { getFolder } from "@store/files";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
    if (!window.location.pathname.startsWith(ROUTES.FILES)) return;
    dispatch(getFolder(normalizeURL(getCurrentFilesPath())));
  }, [location]);
  const [listening, setListening] = useState<typeof selected | undefined>(
    new Set()
  );

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
      dispatch(getFolder());
    }
  };
  useEffect(() => {
    document.removeEventListener("keyup", keyUp);
    if (listening != selected && selected.size > 0) {
      document.addEventListener("keyup", keyUp);
      setListening(listening);
    }
    return () => {
      document.removeEventListener("keyup", keyUp);
    };
  }, [selected]);
  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (e.key === "F5") {
        e.preventDefault();
        e.stopPropagation();
        dispatch(getFolder());
      }
    };
    document.addEventListener("keydown", keydown);
    return () => document.removeEventListener("keydown", keydown);
  }, []);

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
    <HotKeys keyMap={keyMap} handlers={handlers}>
      <Layout>
        <Files></Files>
        <Terminal></Terminal>
        <Search></Search>
      </Layout>
    </HotKeys>
  );
};

export const MainPage = MainPageUI;
export default MainPage;
