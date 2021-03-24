import { AppDispatchTypes, AppStateI, AppActionTypes } from "./types";

const Acts = AppActionTypes;

const initState: AppStateI = {
  loading: false,
};

export const appReducer = (
  state: AppStateI = initState,
  action: AppDispatchTypes
): AppStateI => {
  switch (action.type) {
    case Acts.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case Acts.LOGIN:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return { ...state };
  }
};

export default appReducer;
