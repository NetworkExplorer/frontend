import { User } from "@models";
import { RootActions } from "@store";
import { ActionCreator } from "redux";
import { ThunkAction } from "redux-thunk";

export type UserThunk<ReturnType = void> = ActionCreator<
	ThunkAction<ReturnType, UserStateI, unknown, RootActions>
>;

export interface UserStateI {
	user?: User;
}

export enum UserActionTypes {
	SET_USER = "user/set-user",
	REGISTER = "user/register",
	SIGNOUT = "user/signout"
}

const Acts = UserActionTypes;

export interface UserSetUser {
	type: typeof Acts.SET_USER;
	payload?: User;
}

export interface UserRegister {
	type: typeof Acts.REGISTER;
	payload?: User;
}

export interface UserSignout {
	type: typeof Acts.SIGNOUT;
}

export type UserActions = UserSetUser
	| UserRegister
	| UserSignout;
