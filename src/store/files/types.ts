import { FolderRes } from "@lib/responses";
import { RootActions } from "@store";
import { ActionCreator } from "redux";
import { ThunkAction } from "redux-thunk";

export type FilesThunk<ReturnType = void> = ActionCreator<
  ThunkAction<ReturnType, FilesStateI, unknown, RootActions>
>;

export interface FilesStateI {
  folder?: FolderRes;
  loading: boolean;
}

export enum FilesActionTypes {
  LOAD_FOLDER = "files/load-folder",
  SET_ERROR = "files/set-error",
  SET_LOADING = "files/set-loading"
}

const Acts = FilesActionTypes;

export interface FilesLoadFolder {
  type: typeof Acts.LOAD_FOLDER;
  payload: FolderRes;
}

export interface FilesSetError {
  type: typeof Acts.SET_ERROR;
  payload: string;
}

export interface FilesSetLoading {
  type: typeof Acts.SET_LOADING;
  payload: boolean;
}

export type FilesActions = FilesLoadFolder | FilesSetError | FilesSetLoading;
