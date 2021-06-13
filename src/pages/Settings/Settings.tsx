import css from "./Settings.module.scss";
import React from "react";
import { Layout, Loading, ProtectedRoute } from "@components";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import { PermissionE } from "@models";
import { Redirect, Switch, useRouteMatch } from "react-router";
import ManageUsers from "./ManageUsers/ManageUsers";
import ChangePassword from "./ChangePassword/ChangePassword";
import { SettingsRoute } from "@lib";

export function SettingsPage(): JSX.Element {
  const { user, usersLoading } = useSelector(
    ({ userReducer: { user, usersLoading } }: RootState) => ({
      user,
      usersLoading,
    })
  );
  const { path } = useRouteMatch();
  const manageUser = user?.permissions.includes(PermissionE.MANAGE_USER);
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
      <Loading loading={usersLoading}></Loading>
    </Layout>
  );
}

export default SettingsPage;
