import { UserI } from "@models";
import { RootActions } from "@store";
import { ActionCreator } from "redux";
import { ThunkAction } from "redux-thunk";

export type UserThunk<ReturnType = void> = ActionCreator<
	ThunkAction<ReturnType, UserStateI, unknown, RootActions>
>;

export interface UserStateI {
	user?: UserI;
	users: UserI[];
	usersLoading: boolean;
}

export enum UserActionTypes {
	SET_USER = "user/set-user",
	REGISTER = "user/register",
	SIGNOUT = "user/signout",
	UPDATE_USERS = "user/update-users",
	SET_USERS_LOADING = "user/set-users-loading"
}

const Acts = UserActionTypes;

export interface UserSetUser {
	type: typeof Acts.SET_USER;
	payload?: UserI;
}

export interface UserRegister {
	type: typeof Acts.REGISTER;
	payload?: UserI;
}

export interface UserSignout {
	type: typeof Acts.SIGNOUT;
}

export interface UserUpdateUsers {
	type: typeof Acts.UPDATE_USERS;
	payload: UserI[];
}

export interface UserSetUsersLoading {
	type: typeof Acts.SET_USERS_LOADING;
	payload: boolean;
}

export type UserActions = UserSetUser
	| UserRegister
	| UserSignout
	| UserUpdateUsers
	| UserSetUsersLoading;
