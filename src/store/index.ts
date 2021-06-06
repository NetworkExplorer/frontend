import { createBrowserHistory, History } from "history";
import {
  AnyAction,
  applyMiddleware,
  combineReducers,
  createStore,
} from "redux";
import {
  connectRouter,
  routerMiddleware,
  RouterAction,
} from "connected-react-router";
import { AppActions, appReducer } from "./app";
import { FilesActions, filesReducer } from "./files";
import { editorReducer, EditorActions } from "./editor";
import thunk, { ThunkDispatch } from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { useDispatch as _useDispatch } from "react-redux";

const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    appReducer,
    filesReducer,
    editorReducer
  });

export const history = createBrowserHistory();
export const store = createStore(
  createRootReducer(history),
  composeWithDevTools(applyMiddleware(routerMiddleware(history), thunk))
);

export type RootState = ReturnType<typeof store.getState>;
export type RootActions = AppActions | RouterAction | FilesActions | EditorActions;
export type RootDispatch = ThunkDispatch<any, any, RootActions | AnyAction>;
// export type RootDispatch = AppDispatchTypes | RouterAction | FilesDispatchTypes;

export function useAppDispatch(): (event: RootActions) => void {
  const dispatch = _useDispatch();
  return (event: RootActions) => {
    dispatch(event);
  };
}

export default store;
