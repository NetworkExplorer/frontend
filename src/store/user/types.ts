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
	userPromptOpen: boolean;
}


export enum UserActionTypes {
	SET_USER = "user/set-user",
	REGISTER = "user/register",
	SIGNOUT = "user/signout",
	UPDATE_USERS = "user/update-users",
	SET_USERS_LOADING = "user/set-users-loading",
	CREATE_USER = "user/create-user",
	SET_USER_PROMPT = "user/set-user-prompt",
	CHANGE_USER = "user/change-user",
	SAVE_USERS = "user/save-users"
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

export interface UserCreateUser {
	type: typeof Acts.CREATE_USER;
	payload: UserI;
}

export interface UserSetUserPrompt {
	type: typeof Acts.SET_USER_PROMPT;
	payload: boolean;
}

export interface UserChangeUser {
	type: typeof Acts.CHANGE_USER;
	payload: UserI;
}

export interface UserSaveUsers {
	type: typeof Acts.SAVE_USERS;
	payload: UserI[];
}

export type UserActions = UserSetUser
	| UserRegister
	| UserSignout
	| UserUpdateUsers
	| UserSetUsersLoading
	| UserCreateUser
	| UserSetUserPrompt
	| UserChangeUser
	| UserSaveUsers;
