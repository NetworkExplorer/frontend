import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface Props {
  className?: string;
  btnWrapper?: string;
  icon: IconProp;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function IconButton({
  className,
  btnWrapper,
  icon,
  onClick,
}: Props): JSX.Element {
  return (
    <button className={className} onClick={onClick}>
      <div className={btnWrapper}>
        <FontAwesomeIcon icon={icon}></FontAwesomeIcon>
      </div>
    </button>
  );
}
