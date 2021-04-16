import { FolderRes } from "@lib/responses";
import { Action, ActionCreator } from "redux";
import { ThunkAction } from "redux-thunk";

export type FilesThunk<ReturnType = void> = ActionCreator<
  ThunkAction<ReturnType, FilesStateI, unknown, Action<string>>
>;

export interface FilesStateI {
  folder?: FolderRes;
}

export enum FilesActionTypes {
  LOAD_FOLDER = "files/load-folder",
  SET_ERROR = "files/set-error",
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

export type FilesActions = FilesLoadFolder | FilesSetError;
