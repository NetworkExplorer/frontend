import { convertFiles, Endpoints } from "@lib";
import { addBubble } from "@store/app";
import { FilesActionTypes, FilesSetLoading, FilesThunk } from "./types";

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
