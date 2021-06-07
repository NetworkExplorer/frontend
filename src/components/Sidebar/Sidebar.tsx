import React from "react";
import {
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
import { onCreateFolder, ROUTES } from "@lib";
import { getFolder } from "@store/files";

export const Sidebar = (): JSX.Element => {
  const { sidebarOpen } = useSelector(
    ({ appReducer: { sidebarOpen } }: RootState) => ({
      sidebarOpen,
    })
  );
  const dispatch = useAppDispatch();
  return (
    <div className={`${css.sidebar} ${sidebarOpen ? css.opened : ""}`}>
      <div>
        <SidebarLink
          aria-label="Home"
          name="Home"
          path="/"
          icon={faHome}
        ></SidebarLink>
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
      </div>
      <div>
        <SidebarLink
          name="Sign out"
          icon={faSignOutAlt}
          // path="/"
          onClick={() => {
            //
          }} // TODO
        ></SidebarLink>
      </div>
    </div>
  );
};
