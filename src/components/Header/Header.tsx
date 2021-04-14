import React from "react";
import css from "./Header.module.scss";
import {
  faBars,
  faCog,
  faDownload,
  faFilter,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import SearchBox from "./SearchBox/SearchBox";
import IconButton from "@components/IconButton/IconButton";

export const Header = (): JSX.Element => {
  return (
    <header className={css.header}>
      <IconButton className={css.iconBtn} icon={faBars}></IconButton>
      <SearchBox></SearchBox>
      <IconButton className={css.iconBtn} icon={faFilter}></IconButton>
      <IconButton className={css.iconBtn} icon={faDownload}></IconButton>
      <IconButton className={css.iconBtn} icon={faUpload}></IconButton>
      <IconButton className={css.iconBtn} icon={faCog}></IconButton>
    </header>
  );
};
