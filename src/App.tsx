import React, { useEffect } from "react";
import css from "./App.module.scss";
import { ConnectedRouter } from "connected-react-router";
import { history, useAppDispatch, RootState } from "@store";
import { Redirect, Route, Switch } from "react-router";
import { EditorPage, Login, MainPage, SettingsPage } from "@pages";
import { Endpoints, ROUTES } from "@lib";
import ProtectedRoute from "@components/ProtectedRoute";
import { loginWithToken } from "@store/user";
import { useSelector } from "react-redux";
import { Bubbles, Loading, Transition } from "@components";

export function App(): JSX.Element {
  const dispatch = useAppDispatch();
  const { appLoading, transition } = useSelector(
    ({ appReducer: { appLoading, transition } }: RootState) => ({
      appLoading,
      transition,
    })
  );
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) dispatch(loginWithToken(token) as any);
    else Endpoints.clearToken();
    window.addEventListener("unload", () => {
      if (localStorage.getItem("isAuthenticated")) {
        localStorage.removeItem("isAuthenticated");
      } else if (sessionStorage.getItem("isAuthenticated")) {
        sessionStorage.removeItem("isAuthenticated");
      }
    });
  }, []);
  return (
    <div className={css.App}>
      <div id={css.appWrapper}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path={ROUTES.LOGIN} component={Login}></Route>
            {/* TODO check if register is enabled */}
            {/* <Route path={ROUTES.REGISTER} component={Register}></Route> */}
            <ProtectedRoute
              path={ROUTES.FILES}
              component={MainPage}
            ></ProtectedRoute>
            <ProtectedRoute
              path={ROUTES.EDITOR}
              component={EditorPage}
            ></ProtectedRoute>
            {/* TODO add page for settings */}
            <ProtectedRoute
              path={ROUTES.SETTINGS}
              component={SettingsPage}
            ></ProtectedRoute>
            <Route exact path="/">
              <Redirect to={ROUTES.FILES}></Redirect>
            </Route>
          </Switch>
        </ConnectedRouter>
        <Loading loading={appLoading}></Loading>
      </div>
      <Bubbles></Bubbles>
      {transition && <Transition></Transition>}
    </div>
  );
}

export default App;
