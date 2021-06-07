import { push } from "connected-react-router";
import {
  EditorActionTypes,
  EditorFile,
  EditorSetEditorReady,
  EditorThunk,
} from "./types";

export const pushCurrentFile: EditorThunk = (file: EditorFile) => async (dispatch) => {
  dispatch({
    type: EditorActionTypes.SET_CURRENT_FILE,
    payload: file
  })
  return dispatch(push("/editor"))
}

export const setEditorReady = (ready: boolean): EditorSetEditorReady => ({
  payload: ready, type: EditorActionTypes.SET_EDITOR_READY
})
