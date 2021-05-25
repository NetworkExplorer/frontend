import { PromptProps } from "@components";
import { BubbleI, SearchI } from "@models";
import {
  AppActionTypes,
  AppAddBubble,
  AppRemoveBubble,
  AppSetPrompt,
  AppSetSearch,
  AppSetSidebar,
  AppSetTerminal,
  SidebarActions,
  TerminalActions,
} from "./types";

export const setSidebar = (action: SidebarActions): AppSetSidebar => ({
  type: AppActionTypes.SET_SIDEBAR,
  payload: action,
});

export const setTerminal = (action: TerminalActions): AppSetTerminal => ({
  type: AppActionTypes.SET_TERMINAL,
  payload: action,
});

export const addBubble = (key: string, bubble: BubbleI): AppAddBubble => {
  bubble.when = new Date();
  return {
    type: AppActionTypes.ADD_BUBBLE,
    payload: {
      key,
      bubble,
    },
  };
};

export const removeBubble = (key: string): AppRemoveBubble => ({
  type: AppActionTypes.REMOVE_BUBBLE,
  payload: key,
});

export const setPrompt = (prompt?: PromptProps): AppSetPrompt => ({
  type: AppActionTypes.SET_PROMPT,
  payload: prompt,
});

export const setSearch = (search: SearchI): AppSetSearch => ({
  type: AppActionTypes.SET_SEARCH,
  payload: search,
});
