import { push } from "connected-react-router";
import {
  EditorActionTypes,
  EditorFile,
  EditorThunk,
} from "./types";

export const pushCurrentFile: EditorThunk = (file: EditorFile) => async (dispatch) => {
  dispatch({
    type: EditorActionTypes.SET_CURRENT_FILE,
    payload: file
  })
  return dispatch(push("/editor"))
}
