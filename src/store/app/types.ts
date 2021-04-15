export interface AppStateI {
  loading: boolean;
  sidebarOpen: boolean;
  user?: User;
}

export enum AppActionTypes {
  SET_LOADING = "app/loading",
  LOGIN = "app/login",
  SET_SIDEBAR = "app/set-sidebar"
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

export type AppDispatchTypes = AppLoading | AppLogin | AppSetSidebar;
