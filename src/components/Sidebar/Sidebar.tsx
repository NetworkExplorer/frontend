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
import { setTerminal } from "@store/app";

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
        <SidebarLink
          name="New Folder"
          icon={faFolderPlus}
          path="/"
          // TODO onClick={}
        ></SidebarLink>
        <SidebarLink
          name="Terminal"
          icon={faTerminal}
          onClick={() => dispatch(setTerminal("TOGGLE"))}
        ></SidebarLink>
      </div>
      <div>
        <SidebarLink
          name="Sign out"
          icon={faSignOutAlt}
          path="/"
          // TODO onClick={}
        ></SidebarLink>
      </div>
    </div>
  );
};
