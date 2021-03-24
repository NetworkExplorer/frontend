export interface AppStateI {
  loading: boolean;
  user?: User;
}

export enum AppActionTypes {
  SET_LOADING = "app/loading",
  LOGIN = "app/login",
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

export type AppDispatchTypes = AppLoading | AppLogin;
