import { IconButton } from "@components";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { UserI, Permission } from "@models";
import { RootState, useAppDispatch } from "@store";
import { fetchUsers, updateUsers } from "@store/user";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import settings from "../Settings.module.scss";
import css from "./ManageUsers.module.scss";

export function ManageUsers(): JSX.Element {
  const [curUsers, setCurUsers] = useState<UserI[]>([]);
  const dispatch = useAppDispatch();
  const { users } = useSelector(({ userReducer: { users } }: RootState) => ({
    users,
  }));
  useEffect(() => {
    dispatch(fetchUsers() as any);
  }, []);
  useEffect(() => {
    setCurUsers(users);
  }, [users]);
  const updateUser = (index: number, user: UserI) => {
    const bef = [...curUsers];
    bef[index] = user;
    setCurUsers(bef);
  };

  const remove = (index: number) => {
    const bef = [...curUsers];
    setCurUsers(bef.splice(index, 1));
  };
  return (
    <div className={`${settings.settingsMenu} ${css.manageUsers}`}>
      <h1>Manage Users</h1>
      <div className={css.users}>
        <User header={true} user={{ username: "", permissions: [] }}></User>
        {curUsers.map((u, i) => (
          <User
            key={u.username}
            user={u}
            changeUser={(n) => updateUser(i, n)}
            remove={() => remove(i)}
          ></User>
        ))}
      </div>
    </div>
  );
}

interface UserProps {
  user: UserI;
  header?: boolean;
  changeUser?: (user: UserI) => void;
  remove?: () => void;
}
const User = ({ user, header, changeUser, remove }: UserProps): JSX.Element => {
  if (header) {
    return (
      <div className={`${css.user} ${css.header}`}>
        <div className={css.name}>Name</div>
        <div className={css.permissions}>Permissions</div>
        <div className={css.delete}></div>
      </div>
    );
  }
  const change = (perm: Permission): void => {
    let perms = [...user.permissions];
    if (user.permissions.includes(perm)) {
      perms = perms.filter((p) => p !== perm);
    } else {
      perms.push(perm);
    }
    changeUser &&
      changeUser({
        ...user,
        permissions: perms,
      });
  };
  return (
    <div className={css.user}>
      <div className={css.name}>{user.username}</div>
      <div className={css.permissions}>
        {Object.keys(Permission).map((p) => (
          <label htmlFor={p} key={p}>
            <input
              type="checkbox"
              id={p}
              value={p}
              checked={user.permissions.includes(p as Permission)}
              onChange={() => change(p as Permission)}
            />
            <div className={css.pText}>{p}</div>
          </label>
        ))}
      </div>
      <IconButton
        name={`Delete ${user.username}`}
        className={css.delete}
        btnWrapper={css.deleteIcon}
        icon={faTrash}
        onClick={() => remove && remove()}
      ></IconButton>
    </div>
  );
};

export default ManageUsers;
