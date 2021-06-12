import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import css from "./SidebarLink.module.scss";

interface Props {
  icon: IconProp;
  path?: string;
  name: string;
  "aria-label"?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function SidebarLink({
  path,
  icon,
  name,
  onClick,
  ...props
}: Props): JSX.Element {
  if (path) {
    return (
      <Link to={path} className={css.link} {...props} title={name}>
        <div className={css.iconWrapper} aria-hidden="true">
          <FontAwesomeIcon icon={icon}></FontAwesomeIcon>
        </div>
        {name}
      </Link>
    );
  } else if (onClick) {
    return (
      <button
        onClick={onClick}
        className={css.link}
        title={name}
        aria-label={name}
      >
        <div className={css.iconWrapper} aria-hidden="true">
          <FontAwesomeIcon icon={icon}></FontAwesomeIcon>
        </div>
        {name}
      </button>
    );
  } else {
    throw new Error("specify onClick or path for SidebarLink component");
  }
}
