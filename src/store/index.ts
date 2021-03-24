import { createBrowserHistory, History } from "history";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { appReducer } from "./app";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

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
export type RootDispatch = typeof store.dispatch;
export default store;
