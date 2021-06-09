import React from "react";
import css from "./Layout.module.scss";
import { Header, Sidebar, Bubbles } from "@components";
import { useSelector } from "react-redux";
import { RootState } from "@store";

interface Props {
  children?: React.ReactNode;
  layoutClass?: string;
  mainClass?: string;
  id?: string;
}

export const Layout = ({
  children,
  layoutClass,
  mainClass,
  id,
}: Props): JSX.Element => {
  const { sidebarOpen } = useSelector(
    ({ appReducer: { sidebarOpen } }: RootState) => ({ sidebarOpen })
  );
  return (
    <div id={id || ""} className={`${css.layout} ${layoutClass || ""}`}>
      <Header></Header>
      <div className={css.mainContent}>
        <Sidebar></Sidebar>
        <div
          className={`${css.right} ${mainClass ? mainClass : ""} ${
            sidebarOpen ? css.sidebarOpen : ""
          }`}
        >
          {children}
        </div>
      </div>
      <Bubbles></Bubbles>
    </div>
  );
};

export default Layout;
