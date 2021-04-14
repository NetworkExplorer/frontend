import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface Props {
  className?: string;
  btnWrapper?: string;
  icon: IconProp;
}

export default function IconButton({
  className,
  btnWrapper,
  icon,
}: Props): JSX.Element {
  return (
    <button className={className}>
      <div className={btnWrapper}>
        <FontAwesomeIcon icon={icon}></FontAwesomeIcon>
      </div>
    </button>
  );
}
