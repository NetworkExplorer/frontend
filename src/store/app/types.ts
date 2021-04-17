import { BubbleI } from "@models";

export interface AppStateI {
  loading: boolean;
  sidebarOpen: boolean;
  terminalOpen: boolean;
  user?: User;
  bubbles: Map<string, BubbleI>
}

export enum AppActionTypes {
  LOGIN = "app/login",
  SET_SIDEBAR = "app/set-sidebar",
  SET_TERMINAL = "app/set-terminal",
  ADD_BUBBLE = "app/add-bubble",
  REMOVE_BUBBLE = "app/remove-bubble",
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
  }
}

export interface AppRemoveBubble {
  type: typeof Acts.REMOVE_BUBBLE;
  payload: string
}

export type AppActions = AppLogin | AppSetSidebar | AppSetTerminal | AppAddBubble | AppRemoveBubble;
