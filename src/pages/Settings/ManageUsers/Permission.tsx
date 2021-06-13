import { PermissionE } from "@models";
import React from "react";
import css from "./ManageUsers.module.scss";

interface Props {
  p: PermissionE;
  perms: PermissionE[];
  change: (p: PermissionE) => void;
}
export const Permission = ({ p, perms, change }: Props): JSX.Element => {
  return (
    <label
      title={`Permission ${p} is ${perms.includes(p as PermissionE)}`}
      className={css.perm}
    >
      <input
        type="checkbox"
        id={p}
        value={p}
        checked={perms.includes(p as PermissionE)}
        onChange={() => change(p as PermissionE)}
      />
      <div className={css.pText}>{p}</div>
    </label>
  );
};
