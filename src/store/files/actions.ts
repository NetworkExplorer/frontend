import { convertFiles, Endpoints, FileI } from "@lib";
import { addBubble } from "@store/app";
import { ContextMenuProps, FilesActionTypes, FilesAddSelection, FilesClearSelection, FilesRemoveSelection, FilesSelectFile, FilesSetContextMenu, FilesSetLoading, FilesShiftSelection, FilesThunk } from "./types";

export const setLoading = (loading: boolean): FilesSetLoading => ({
  type: FilesActionTypes.SET_LOADING,
  payload: loading
})

export const getFolder: FilesThunk = (path: string) => async (
  dispatch
) => {
  dispatch(setLoading(true));
  try {
    const res = await Endpoints.getInstance().getFolder(path);
    res.files = convertFiles(res.files);
    dispatch({
      type: FilesActionTypes.LOAD_FOLDER,
      payload: res
    })
    dispatch({
      type: FilesActionTypes.CLEAR_SELECTION,
    })

    return dispatch(setLoading(false));
  } catch (e) {
    dispatch({
      type: FilesActionTypes.LOAD_FOLDER,
      payload: {
        name: "n/a",
        files: [],
        size: 0,
        type: "FOLDER"
      }
    })
    dispatch(setLoading(false));
    return dispatch(addBubble("getFolder-error", {
      title: `could not navigate to folder ${path}`,
      type: "ERROR",
      message: e.message
    }))
  }
};

export const addSelection = (file: FileI): FilesAddSelection => ({
  type: FilesActionTypes.ADD_SELECTION,
  payload: file
})

export const selectFile = (file: FileI): FilesSelectFile => ({
  type: FilesActionTypes.SELECT_FILE,
  payload: file
})

export const shiftSelection = (file: FileI): FilesShiftSelection => ({
  type: FilesActionTypes.SHIFT_SELECTION,
  payload: file
})

export const clearSelection = (): FilesClearSelection => ({
  type: FilesActionTypes.CLEAR_SELECTION,
})

export const removeSelection = (file: FileI): FilesRemoveSelection => ({
  type: FilesActionTypes.REMOVE_SELECTION,
  payload: file
})

export const setContextMenu = (menu: ContextMenuProps): FilesSetContextMenu => ({
  type: FilesActionTypes.SET_CONTEXT_MENU,
  payload: menu
})
