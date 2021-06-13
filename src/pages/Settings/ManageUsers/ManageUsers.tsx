import { IconButton } from "@components";
import { faSave, faTrash, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { UserI, PermissionE } from "@models";
import { RootState, useAppDispatch } from "@store";
import { fetchUsers, saveUsers, setUserPrompt, updateUsers } from "@store/user";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import settings from "../Settings.module.scss";
import CreateUserPrompt from "./CreateUserPrompt";
import css from "./ManageUsers.module.scss";
import { Permission } from "./Permission";

export function ManageUsers(): JSX.Element {
  const dispatch = useAppDispatch();
  const { users } = useSelector(({ userReducer: { users } }: RootState) => ({
    users,
  }));
  useEffect(() => {
    dispatch(fetchUsers() as any);
  }, []);
  const updateUser = (index: number, user: UserI) => {
    if (user.username === "admin") return;
    const bef = [...users];
    bef[index] = user;
    dispatch(updateUsers(bef));
  };

  const remove = (index: number) => {
    const bef = [...users];
    if (bef[index].username === "admin") return;
    bef[index] = {
      ...bef[index],
      delete: true,
    };
    dispatch(updateUsers(bef));
  };

  return (
    <div className={`${settings.settingsMenu} ${css.manageUsers}`}>
      <header className={css.header}>
        <h1>Manage Users</h1>
        <IconButton
          name="Add a user"
          btnWrapper={css.headerBtnWrapper}
          icon={faUserPlus}
          onClick={() => dispatch(setUserPrompt(true))}
        ></IconButton>
        <IconButton
          name="Save changes"
          className={css.saveBtn}
          btnWrapper={css.headerBtnWrapper}
          icon={faSave}
          onClick={() => dispatch(saveUsers(users) as any)}
        ></IconButton>
      </header>
      <div className={css.users}>
        <User header={true} user={{ username: "", permissions: [] }}></User>
        {users.map((u, i) => (
          <User
            key={u.username}
            user={u}
            changeUser={(n) => updateUser(i, n)}
            remove={() => remove(i)}
          ></User>
        ))}
      </div>
      <CreateUserPrompt></CreateUserPrompt>
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
      <div className={`${css.user} ${css.userHeader}`}>
        <div className={css.name}>Name</div>
        <div className={css.permissions}>Permissions</div>
        <div className={css.delete}></div>
      </div>
    );
  }
  const change = (perm: PermissionE): void => {
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
      <div className={css.name}>
        {user.username} {user.delete ? "(will be deleted)" : ""}
      </div>
      <div className={css.permissions}>
        {Object.keys(PermissionE).map((p) => (
          <Permission
            key={p}
            p={p as PermissionE}
            perms={user.permissions}
            change={change}
          ></Permission>
        ))}
      </div>
      {user.username !== "admin" ? (
        <IconButton
          name={`Delete ${user.username}`}
          className={css.delete}
          btnWrapper={css.deleteIcon}
          icon={faTrash}
          onClick={() => remove && remove()}
        ></IconButton>
      ) : (
        <div className={css.delete}></div>
      )}
    </div>
  );
};

export default ManageUsers;
