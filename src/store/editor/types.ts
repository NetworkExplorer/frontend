import { RootActions } from "@store";
import { ActionCreator } from "redux";
import { ThunkAction } from "redux-thunk";

export type EditorThunk<ReturnType = void> = ActionCreator<
  ThunkAction<ReturnType, EditorStateI, unknown, RootActions>
>;

export interface EditorFile {
  name: string;
  content: string;
  path: string;
}

export interface EditorStateI {
  currentFile?: EditorFile;
}

export enum EditorActionTypes {
  SET_CURRENT_FILE = "editor/set-current-file"
}

const Acts = EditorActionTypes;

export interface EditorSetCurrentFile {
  type: typeof Acts.SET_CURRENT_FILE;
  payload?: EditorFile
}

export type EditorActions = EditorSetCurrentFile;
