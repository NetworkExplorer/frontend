import { FileI } from "@lib";
import { FilesStateI, FilesActionTypes, FilesActions } from "./types";

const Acts = FilesActionTypes;

const initState: FilesStateI = {
  folder: undefined,
  loading: false,
  selection: {
    lastSelection: undefined,
    selected: new Set<FileI>(),
  },
  menu: {
    isOpen: false,
  },
  progressFiles: new Map()
};

export const filesReducer = (
  state: FilesStateI = initState,
  action: FilesActions
): FilesStateI => {
  switch (action.type) {
    case Acts.LOAD_FOLDER:
      return {
        ...state,
        folder: action.payload,
      };
    case Acts.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case Acts.SELECT_FILE: {
      return {
        ...state,
        selection: {
          ...state.selection,
          lastSelection: action.payload,
          selected: new Set([action.payload]),
        },
        menu: {
          ...state.menu,
          file: action.payload,
        },
      };
    }
    case Acts.ADD_SELECTION: {
      return {
        ...state,
        selection: {
          ...state.selection,
          lastSelection: action.payload,
          selected: new Set(state.selection.selected).add(action.payload),
        },
      };
    }
    case Acts.REMOVE_SELECTION: {
      const removed = new Set(state.selection.selected);
      removed.delete(action.payload);
      return {
        ...state,
        selection: {
          ...state.selection,
          lastSelection: undefined,
          selected: removed,
        },
      };
    }
    case Acts.SHIFT_SELECTION: {
      if (!state.folder) return state;

      const files = [...state.folder.files];
      let lastI = -1;
      let nowI = -1;
      for (const idx in files) {
        const i = Number(idx);
        if (files[i].name === state.selection.lastSelection?.name) {
          lastI = i;
        }
        if (files[i].name === action.payload.name) {
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
      files
        .filter((_, i) => lastI <= i && i <= nowI)
        .forEach((f) => selection.add(f));

      return {
        ...state,
        selection: {
          ...state.selection,
          lastSelection: action.payload,
          selected: selection,
        },
      };
    }
    case Acts.CLEAR_SELECTION:
      return {
        ...state,
        selection: {
          lastSelection: undefined,
          selected: new Set<FileI>(),
        },
      };
    case Acts.SET_CONTEXT_MENU:
      return {
        ...state,
        menu: {
          ...state.menu,
          ...action.payload,
        },
      };
    case Acts.ADD_FILES:
      if (!state.folder) return state;
      return {
        ...state,
        folder: {
          ...state.folder,
          files: [...state.folder.files, ...action.payload],
        },
      };
    case Acts.ADD_PROGRESS_FILES: {
      console.log(action.payload)
      const copy = new Map(state.progressFiles);
      for (const file of action.payload) {
        copy.set(file.cwd + file.name, file);
      }
      return {
        ...state,
        progressFiles: copy
      }
    }
    case Acts.UPDATE_PROGRESS_FILE: {
      const copy = new Map(state.progressFiles);
      let f = copy.get(action.payload.cwd + action.payload.name);
      console.log("ff", f)
      if (!f) {
        f = {
          ...action.payload,
          progress: 0,
          name: action.payload.name.split("/").reverse()[0]
        };
      }
      if (!action.payload.total) {
        action.payload.total = f.total;
      }
      f.progress += action.payload.progress;
      copy.set(action.payload.cwd + action.payload.name, action.payload);
      return {
        ...state,
        progressFiles: copy
      }
    }
    case Acts.REMOVE_PROGRESS_FILES: {
      const copy = new Map(state.progressFiles);

      for (const p of action.payload) {
        copy.delete(p.cwd + p.name);
      }

      return {
        ...state,
        progressFiles: copy
      }
    }
    default:
      return { ...state };
  }
};

export default filesReducer;
