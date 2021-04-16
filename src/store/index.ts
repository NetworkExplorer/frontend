import { createBrowserHistory, History } from "history";
import { AnyAction, applyMiddleware, combineReducers, createStore } from "redux";
import { connectRouter, routerMiddleware, RouterAction } from "connected-react-router";
import { AppActions, appReducer } from "./app";
import { FilesActions, filesReducer } from "./files";
import thunk, { ThunkDispatch } from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { useDispatch as _useDispatch } from 'react-redux'

const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    appReducer,
    filesReducer,
  });

export const history = createBrowserHistory();
export const store = createStore(
  createRootReducer(history),
  composeWithDevTools(applyMiddleware(routerMiddleware(history), thunk))
);

export type RootState = ReturnType<typeof store.getState>;
type Actions = AppActions | RouterAction | FilesActions;
export type RootDispatch = ThunkDispatch<any, any, Actions | AnyAction>;
// export type RootDispatch = AppDispatchTypes | RouterAction | FilesDispatchTypes;

export function useDispatch(): (event: Actions) => void {
  const dispatch = _useDispatch()
  return (event: Actions) => {
    dispatch(event)
  }
}

export default store;
