import React from "react";
import {
  faArrowLeft,
  faFolderPlus,
  faHome,
  faSignOutAlt,
  faTerminal,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import css from "./Sidebar.module.scss";
import SidebarLink from "./SidebarLink/SidebarLink";
import { RootState, useAppDispatch } from "@store";
import { addBubble, setPrompt, setTerminal } from "@store/app";
import { onCreateFolder, ROUTES, settingsRoutes } from "@lib";
import { getFolder } from "@store/files";
import { goBack } from "connected-react-router";
import { signOut } from "@store/user";
import { Permission } from "@models";

export const Sidebar = (): JSX.Element => {
  const { sidebarOpen, user } = useSelector(
    ({ appReducer: { sidebarOpen }, userReducer: { user } }: RootState) => ({
      sidebarOpen,
      user,
    })
  );
  const dispatch = useAppDispatch();
  const settingsOrEditor =
    window.location.pathname.startsWith(ROUTES.SETTINGS) ||
    window.location.pathname.startsWith(ROUTES.EDITOR);
  const manageUser = user?.permissions.includes(Permission.MANAGE_USER);
  return (
    <div className={`${css.sidebar} ${sidebarOpen ? css.opened : ""}`}>
      <div>
        <SidebarLink
          aria-label="Home"
          name="Home"
          path="/"
          icon={faHome}
        ></SidebarLink>
        {settingsOrEditor && (
          <SidebarLink
            aria-label="go back"
            name="go back"
            onClick={() => dispatch(goBack())}
            icon={faArrowLeft}
          ></SidebarLink>
        )}
        <hr />
        {window.location.pathname.startsWith(ROUTES.FILES) && (
          <>
            <SidebarLink
              name="New Folder"
              icon={faFolderPlus}
              onClick={async () => {
                await onCreateFolder(
                  (prompt) => dispatch(setPrompt(prompt)),
                  (key, bubble) => dispatch(addBubble(key, bubble))
                );
                dispatch(getFolder(undefined, false) as any);
              }}
            ></SidebarLink>
            <SidebarLink
              name="Terminal"
              icon={faTerminal}
              onClick={() => dispatch(setTerminal("TOGGLE"))}
            ></SidebarLink>
          </>
        )}
        {window.location.pathname.startsWith(ROUTES.SETTINGS) && (
          <>
            {settingsRoutes.map((r) => {
              if (!r.permissionNeeded || (r.permissionNeeded && manageUser))
                return (
                  <SidebarLink
                    key={r.name}
                    aria-label={r.name}
                    name={r.name}
                    path={`${ROUTES.SETTINGS}/${r.path}`}
                    icon={r.icon}
                  ></SidebarLink>
                );
              else return <React.Fragment key={r.name}></React.Fragment>;
            })}
          </>
        )}
      </div>
      <div>
        <SidebarLink
          name="Sign out"
          icon={faSignOutAlt}
          // path="/"
          onClick={() => dispatch(signOut() as any)} // TODO
        ></SidebarLink>
      </div>
    </div>
  );
};
