import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface Props {
  className?: string;
  btnWrapper?: string;
  icon: IconProp;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
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
}: Props): JSX.Element {
  return (
    <button
      className={className}
      onClick={onClick}
      title={name}
      role="button"
      disabled={disabled}
    >
      <div className={btnWrapper}>
        <FontAwesomeIcon icon={icon}></FontAwesomeIcon>
      </div>
      <span hidden>{name}</span>
    </button>
  );
}

export default IconButton;
