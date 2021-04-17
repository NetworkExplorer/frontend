import { convertFiles, Endpoints } from "@lib";
import { FilesActionTypes, FilesSetLoading, FilesThunk } from "./types";

export const setLoading = (loading: boolean): FilesSetLoading => ({
  type: FilesActionTypes.SET_LOADING,
  payload: loading
})

export const getFolder: FilesThunk = (path: string) => async (
  dispatch
) => {
  try {
    const res = await Endpoints.getInstance().getFolder(path);
    res.files = convertFiles(res.files);

    return dispatch({
      type: FilesActionTypes.LOAD_FOLDER,
      payload: res
    })
  } catch (e) {
    console.error(e);
    return dispatch({
      type: FilesActionTypes.SET_ERROR,
      payload: "could not fetch files"
    })
  }
};
