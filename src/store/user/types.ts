import { RootActions } from "@store";
import { ActionCreator } from "redux";
import { ThunkAction } from "redux-thunk";

export type UserThunk<ReturnType = void> = ActionCreator<
	ThunkAction<ReturnType, UserStateI, unknown, RootActions>
>;

export type User = unknown;

export interface UserStateI {
	user?: User;
}

export enum UserActionTypes {
	LOGIN = "user/login",
	REGISTER = "user/register",
	SIGNOUT = "user/signout"
}

const Acts = UserActionTypes;

export interface UserLogin {
	type: typeof Acts.LOGIN;
	payload?: User;
}

export interface UserRegister {
	type: typeof Acts.REGISTER;
	payload?: User;
}

export interface UserSignout {
	type: typeof Acts.SIGNOUT;
}

export type UserActions = UserLogin
	| UserRegister
	| UserSignout;
