export interface AppStateI {
  loading: boolean;
  sidebarOpen: boolean;
  terminalOpen: boolean;
  user?: User;
}

export enum AppActionTypes {
  SET_LOADING = "app/loading",
  LOGIN = "app/login",
  SET_SIDEBAR = "app/set-sidebar",
  SET_TERMINAL = "app/set-terminal"
}

const Acts = AppActionTypes;

export interface AppLoading {
  type: typeof Acts.SET_LOADING;
  payload: boolean;
}

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

export type AppDispatchTypes = AppLoading | AppLogin | AppSetSidebar | AppSetTerminal;
