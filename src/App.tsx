import React from "react";
import css from "./App.module.scss";
import { ConnectedRouter } from "connected-react-router";
import { history } from "@store";
import { Route, Switch } from "react-router";
import { MainPage } from "@pages";

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
            <Route exact path="/" component={MainPage}></Route>
            {/* TODO add pages for login/register */}
            <Route path="/login"></Route>
            <Route path="/register"></Route>
          </Switch>
        </ConnectedRouter>
      </div>
    </div>
  );
}

export default App;
