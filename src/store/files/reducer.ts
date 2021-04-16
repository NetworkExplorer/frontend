import { FilesStateI, FilesActionTypes, FilesActions } from "./types";

const Acts = FilesActionTypes;

const initState: FilesStateI = {
  folder: undefined,
};

export const filesReducer = (
  state: FilesStateI = initState,
  action: FilesActions
): FilesStateI => {
  switch (action.type) {
    case Acts.LOAD_FOLDER:
      return {
        ...state,
        folder: action.payload
      }
    default:
      return { ...state };
  }
};

export default filesReducer;
