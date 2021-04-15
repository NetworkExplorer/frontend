import { createBrowserHistory, History } from "history";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { connectRouter, routerMiddleware, RouterAction } from "connected-react-router";
import { AppDispatchTypes, appReducer } from "./app";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { useDispatch as _useDispatch } from 'react-redux'

const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    appReducer,
  });

export const history = createBrowserHistory();
export const store = createStore(
  createRootReducer(history),
  composeWithDevTools(applyMiddleware(routerMiddleware(history), thunk))
);

export type RootState = ReturnType<typeof store.getState>;
export type RootDispatch = AppDispatchTypes | RouterAction;

export function useDispatch(): (event: RootDispatch) => void {
  const dispatch = _useDispatch()
  return (event: RootDispatch) => {
    dispatch(event)
  }
}

export default store;
