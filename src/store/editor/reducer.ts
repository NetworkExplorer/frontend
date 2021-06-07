import { EditorActions, EditorStateI, EditorActionTypes } from "./types";

const Acts = EditorActionTypes;

const initState: EditorStateI = {
  currentFile: undefined,
  editorReady: false
};

export const editorReducer = (
  state: EditorStateI = initState,
  action: EditorActions
): EditorStateI => {
  switch (action.type) {
    case Acts.SET_CURRENT_FILE:
      return {
        ...state,
        currentFile: action.payload
      }
    case Acts.SET_EDITOR_READY:
      return {
        ...state,
        editorReady: action.payload
      }
    default:
      return state;
  }
};

export default editorReducer;
