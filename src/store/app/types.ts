import { PromptProps } from "@components";
import { BubbleI, SearchI } from "@models";
import { RootActions } from "@store";
import { ActionCreator } from "redux";
import { ThunkAction } from "redux-thunk";

export type AppThunk<ReturnType = void> = ActionCreator<
  ThunkAction<ReturnType, AppStateI, unknown, RootActions>
>;

export interface AppStateI {
  loading: boolean;
  sidebarOpen: boolean;
  terminalOpen: boolean;
  user?: User;
  bubbles: Map<string, BubbleI>;
  prompt?: PromptProps;
  search: SearchI;
  suggestions: string[];
}

export enum AppActionTypes {
  LOGIN = "app/login",
  SET_SIDEBAR = "app/set-sidebar",
  SET_TERMINAL = "app/set-terminal",
  ADD_BUBBLE = "app/add-bubble",
  REMOVE_BUBBLE = "app/remove-bubble",
  SET_PROMPT = "app/set-prompt",
  SET_SEARCH = "app/set-search",
  FETCH_SUGGESTIONS = "app/fetch-suggestions"
}

const Acts = AppActionTypes;

export type User = {
  username: string;
};

export interface AppLogin {
  type: typeof Acts.LOGIN;
  payload: User;
}

export type SidebarActions = "TOGGLE" | "OPEN" | "CLOSED";

export interface AppSetSidebar {
  type: typeof Acts.SET_SIDEBAR;
  payload: SidebarActions;
}

export type TerminalActions = "TOGGLE" | "OPEN" | "CLOSED";

export interface AppSetTerminal {
  type: typeof Acts.SET_TERMINAL;
  payload: TerminalActions;
}

export interface AppAddBubble {
  type: typeof Acts.ADD_BUBBLE;
  payload: {
    key: string;
    bubble: BubbleI;
  };
}

export interface AppRemoveBubble {
  type: typeof Acts.REMOVE_BUBBLE;
  payload: string;
}

export interface AppSetPrompt {
  type: typeof Acts.SET_PROMPT;
  payload?: PromptProps;
}

export interface AppSetSearch {
  type: typeof Acts.SET_SEARCH;
  payload: SearchI;
}

export interface AppFetchSuggestions {
  type: typeof Acts.FETCH_SUGGESTIONS;
  payload: string[];
}

export type AppActions =
  | AppLogin
  | AppSetSidebar
  | AppSetTerminal
  | AppAddBubble
  | AppRemoveBubble
  | AppSetPrompt
  | AppSetSearch
  | AppFetchSuggestions;
