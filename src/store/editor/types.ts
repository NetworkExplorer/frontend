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
  editorReady: boolean;
}

export enum EditorActionTypes {
  SET_CURRENT_FILE = "editor/set-current-file",
  SET_EDITOR_READY = "editor/set-editor-ready",
}

const Acts = EditorActionTypes;

export interface EditorSetCurrentFile {
  type: typeof Acts.SET_CURRENT_FILE;
  payload?: EditorFile
}

export interface EditorSetEditorReady {
  type: typeof Acts.SET_EDITOR_READY;
  payload: boolean
}

export type EditorActions = EditorSetCurrentFile
  | EditorSetEditorReady;
