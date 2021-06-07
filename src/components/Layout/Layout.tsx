import React from "react";
import css from "./Layout.module.scss";
import { Header, Sidebar, Bubbles } from "@components";

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
  return (
    <div id={id || ""} className={`${css.layout} ${layoutClass || ""}`}>
      <Header></Header>
      <div className={css.mainContent}>
        <Sidebar></Sidebar>
        <div className={`${css.right} ${mainClass ? mainClass : ""}`}>
          {children}
        </div>
      </div>
      <Bubbles></Bubbles>
    </div>
  );
};

export default Layout;
