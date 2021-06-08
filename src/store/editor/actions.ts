import { push } from "connected-react-router";
import { editor } from "monaco-editor";
import {
  EditorActionTypes,
  EditorFile,
  EditorSetEditor,
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

export const setEditor = (editor?: editor.IStandaloneCodeEditor): EditorSetEditor => ({
  payload: editor,
  type: EditorActionTypes.SET_EDITOR
})
