import { FileI } from "@lib";
import { FolderResInner } from "@lib/responses";
import { ProgressFileI } from "@models";
import { RootActions } from "@store";
import { ActionCreator } from "redux";
import { ThunkAction } from "redux-thunk";

export type FilesThunk<ReturnType = void> = ActionCreator<
  ThunkAction<ReturnType, FilesStateI, unknown, RootActions>
>;

export interface ContextMenuProps {
  x?: number;
  y?: number;
  file?: FileI;
  isOpen: boolean;
}

export interface FilesStateI {
  folder?: FolderResInner;
  loading: boolean;
  selection: {
    lastSelection?: FileI;
    selected: Set<FileI>;
  };
  menu: ContextMenuProps;
  progressFiles: Map<string, ProgressFileI>;
}

export enum FilesActionTypes {
  LOAD_FOLDER = "files/load-folder",
  SET_LOADING = "files/set-loading",
  SELECT_FILE = "files/select-file",
  ADD_SELECTION = "files/add-selection",
  REMOVE_SELECTION = "files/remove-selection",
  SHIFT_SELECTION = "files/shift-selection",
  CLEAR_SELECTION = "files/clear-selection",
  SET_CONTEXT_MENU = "files/set-context-menu",
  ADD_FILES = "files/set-file",
  ADD_PROGRESS_FILES = "files/add-progress-files",
  UPDATE_PROGRESS_FILE = "files/update-progress-file",
  REMOVE_PROGRESS_FILES = "files/remove-progress-files"
}

const Acts = FilesActionTypes;

export interface FilesLoadFolder {
  type: typeof Acts.LOAD_FOLDER;
  payload: FolderResInner;
}

export interface FilesSetLoading {
  type: typeof Acts.SET_LOADING;
  payload: boolean;
}

export interface FilesSelectFile {
  type: typeof Acts.SELECT_FILE;
  payload: FileI;
}

export interface FilesAddSelection {
  type: typeof Acts.ADD_SELECTION;
  payload: FileI;
}

export interface FilesRemoveSelection {
  type: typeof Acts.REMOVE_SELECTION;
  payload: FileI;
}

export interface FilesShiftSelection {
  type: typeof Acts.SHIFT_SELECTION;
  payload: FileI;
}

export interface FilesClearSelection {
  type: typeof Acts.CLEAR_SELECTION;
}

export interface FilesSetContextMenu {
  type: typeof Acts.SET_CONTEXT_MENU;
  payload: ContextMenuProps;
}

export interface FilesAddFiles {
  type: typeof Acts.ADD_FILES;
  payload: FileI[];
}

export interface FilesAddProgressFiles {
  type: typeof Acts.ADD_PROGRESS_FILES;
  payload: ProgressFileI[]
}

export interface FilesUpdateProgressFile {
  type: typeof Acts.UPDATE_PROGRESS_FILE;
  payload: ProgressFileI
}

export interface FilesRemoveProgressFiles {
  type: typeof Acts.REMOVE_PROGRESS_FILES;
  payload: ProgressFileI[]
}

export type FilesActions =
  | FilesLoadFolder
  | FilesSetLoading
  | FilesSelectFile
  | FilesAddSelection
  | FilesRemoveSelection
  | FilesShiftSelection
  | FilesClearSelection
  | FilesSetContextMenu
  | FilesAddFiles
  | FilesAddProgressFiles
  | FilesUpdateProgressFile
  | FilesRemoveProgressFiles;
