import { createBrowserHistory, History } from "history";
import { applyMiddleware, combineReducers, createStore, Store } from "redux";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { appReducer } from "./app";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    appReducer,
  });
export type RootState = ReturnType<ReturnType<typeof createRootReducer>>;

export const history = createBrowserHistory();
// export default function configureStore(
// initialState: RootState
// ): Store<RootState> {
export const store = createStore(
  createRootReducer(history),
  composeWithDevTools(applyMiddleware(routerMiddleware(history), thunk))
);
export default store;
// }
