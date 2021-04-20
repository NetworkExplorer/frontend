import { FilesStateI, FilesActionTypes, FilesActions } from "./types";

const Acts = FilesActionTypes;

const initState: FilesStateI = {
  folder: undefined,
  loading: false,
  selection: {
    lastSelection: undefined,
    selected: new Set<string>()
  },
  menu: {
    isOpen: false,
  }
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
    case Acts.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      }
    case Acts.SELECT_FILE: {
      return {
        ...state,
        selection: {
          ...state.selection,
          lastSelection: action.payload,
          selected: new Set([action.payload])
        }
      }
    }
    case Acts.ADD_SELECTION: {
      return {
        ...state,
        selection: {
          ...state.selection,
          lastSelection: action.payload,
          selected: new Set(state.selection.selected).add(action.payload)
        }
      }
    }
    case Acts.REMOVE_SELECTION: {
      const removed = new Set(state.selection.selected);
      removed.delete(action.payload);
      return {
        ...state,
        selection: {
          ...state.selection,
          lastSelection: undefined,
          selected: removed
        }
      }
    }
    case Acts.SHIFT_SELECTION: {
      if (!state.folder) return state;

      const files = [...state.folder.files];
      let lastI = -1;
      let nowI = -1;
      for (const idx in files) {
        const i = Number(idx);
        if (files[i].name === state.selection.lastSelection) {
          lastI = i;
        }
        if (files[i].name === action.payload) {
          nowI = i;
        }
      }
      if (lastI === -1 || nowI === -1) return state;

      const selection = new Set(state.selection.selected);
      if (lastI > nowI) {
        const temp = nowI;
        nowI = lastI;
        lastI = temp;
      }
      files.filter((_, i) => lastI <= i && i <= nowI).forEach((f) => selection.add(f.name));

      return {
        ...state,
        selection: {
          ...state.selection,
          lastSelection: action.payload,
          selected: selection
        }
      }
    }
    case Acts.CLEAR_SELECTION:
      return {
        ...state,
        selection: {
          lastSelection: undefined,
          selected: new Set<string>()
        }
      }
    case Acts.SET_CONTEXT_MENU:
      return {
        ...state,
        menu: {
          ...state.menu,
          ...action.payload
        }
      }
    default:
      return { ...state };
  }
};

export default filesReducer;
