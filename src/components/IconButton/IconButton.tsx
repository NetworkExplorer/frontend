import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";

interface Props {
  className?: string;
  btnWrapper?: string;
  icon: IconProp;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  path?: string;
  name: string;
  disabled?: boolean;
}

export function IconButton({
  className,
  btnWrapper,
  icon,
  onClick,
  name,
  disabled,
  path,
}: Props): JSX.Element {
  if (path) {
    return (
      <Link to={path} className={className} title={name}>
        <div className={btnWrapper} aria-hidden="true">
          <FontAwesomeIcon icon={icon}></FontAwesomeIcon>
        </div>
        <span hidden>{name}</span>
      </Link>
    );
  } else if (onClick) {
    return (
      <button
        className={className}
        onClick={onClick}
        title={name}
        role="button"
        disabled={disabled}
      >
        <div className={btnWrapper} aria-hidden="true">
          <FontAwesomeIcon icon={icon}></FontAwesomeIcon>
        </div>
        <span hidden>{name}</span>
      </button>
    );
  } else {
    throw new Error("specify onClick or path for IconButton component");
  }
}

export default IconButton;
