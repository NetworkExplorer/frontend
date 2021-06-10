import React from "react";
import css from "./App.module.scss";
import { ConnectedRouter } from "connected-react-router";
import { history } from "@store";
import { Redirect, Route, Switch } from "react-router";
import { EditorPage, Login, MainPage, Register } from "@pages";
import { ROUTES } from "@lib";

export function App(): JSX.Element {
  // const state = useSelector((state: RootState) => ({
  //   loading: state.appReducer.loading,
  // }));
  // const dispatch = useDispatch<RootDispatch>();
  // const handleChange = () =>
  //   dispatch({
  //     type: AppActionTypes.SET_LOADING,
  //     payload: !state.loading,
  //   });

  return (
    <div className={css.App}>
      <div id={css.appWrapper}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path={ROUTES.LOGIN} component={Login}></Route>
            <Route path={ROUTES.REGISTER} component={Register}></Route>
            <Route path={ROUTES.FILES} component={MainPage}></Route>
            <Route path={ROUTES.EDITOR} component={EditorPage}></Route>
            {/* TODO add pages for settings */}
            <Route path={ROUTES.SETTINGS}></Route>
            <Route exact path="/">
              <Redirect to={ROUTES.FILES}></Redirect>
            </Route>
          </Switch>
        </ConnectedRouter>
      </div>
    </div>
  );
}

export default App;
