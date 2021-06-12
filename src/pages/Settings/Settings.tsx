import css from "./Settings.module.scss";
import React from "react";
import { Layout } from "@components";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import { Permission } from "@models";
import { Redirect, Switch, useRouteMatch } from "react-router";
import ProtectedRoute from "@components/ProtectedRoute";
import ManageUsers from "./ManageUsers/ManageUsers";
import ChangePassword from "./ChangePassword/ChangePassword";
import { SettingsRoute } from "@lib";

export function SettingsPage(): JSX.Element {
  const { user } = useSelector(({ userReducer: { user } }: RootState) => ({
    user,
  }));
  const { path } = useRouteMatch();
  const manageUser = user?.permissions.includes(Permission.MANAGE_USER);
  // is allowed to manage users
  return (
    <Layout id={css.settings}>
      <Switch>
        <ProtectedRoute exact path={path}>
          <Redirect to={`${path}/password`} push={false}></Redirect>
        </ProtectedRoute>
        <ProtectedRoute
          path={`${path}/${SettingsRoute.PASSWORD}`}
          component={ChangePassword}
        ></ProtectedRoute>
        {manageUser ? (
          <>
            <ProtectedRoute
              path={`${path}/${SettingsRoute.MANAGE_USERS}`}
              component={ManageUsers}
            ></ProtectedRoute>
          </>
        ) : (
          <></>
        )}
      </Switch>
    </Layout>
  );
}

export default SettingsPage;
