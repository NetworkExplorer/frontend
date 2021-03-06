/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react";
import { Redirect, Route } from "react-router-dom";
import { REDIRECT_PARAM, ROUTES } from "@lib";

export function ProtectedRoute({
  component: Component,
  ...restOfProps
}: any): JSX.Element {
  const isAuthenticated =
    localStorage.getItem("isAuthenticated") ||
    sessionStorage.getItem("isAuthenticated");

  return (
    <Route
      {...restOfProps}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={`${ROUTES.LOGIN}?${REDIRECT_PARAM}=${window.location.pathname}`}
          />
        )
      }
    />
  );
}

export default ProtectedRoute;
