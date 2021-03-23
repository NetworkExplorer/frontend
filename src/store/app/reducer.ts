import { AppStateI } from "./types";

const initState: AppStateI = {
  loading: false,
};

export const appReducer = (
  state: AppStateI = initState,
  action: any
): AppStateI => {
  return { ...state };
};

export default appReducer;
