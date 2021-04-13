import React from "react";
import css from "./App.module.scss";
import { Header } from "@components";

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
      <Header></Header>
    </div>
  );
}

export default App;
