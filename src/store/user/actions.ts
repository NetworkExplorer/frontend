import { Endpoints, ROUTES } from "@lib";
import { User, UserPaylaod } from "@models";
import { UserActionTypes, UserThunk, UserSetUser } from "./types";
import jwtDecode from "jwt-decode";
import { addBubble, setAppLoading } from "@store/app";
import { push } from "connected-react-router";

const Acts = UserActionTypes;

export const setUser = (user?: User): UserSetUser => ({
	type: Acts.SET_USER,
	payload: user
})

export const login: UserThunk = (username: string, password: string, autoLogin: boolean) =>
	async (dispatch) => {
		dispatch(setAppLoading(true))
		try {
			const { data: { token } } = await Endpoints.getInstance().login(username, password);
			Endpoints.setToken(token, autoLogin);
			const d = jwtDecode<UserPaylaod>(token);
			const user: User = {
				expires: d.exp,
				name: d.sub || username,
				permissions: d.permissions
			}
			dispatch(setUser(user))
			dispatch(push(ROUTES.FILES))
			return dispatch(setAppLoading(false))
		} catch (e) {
			dispatch(addBubble("login-error", {
				title: "Could not login",
				type: "ERROR"
			}))
			return dispatch(setAppLoading(false))
		}
	}

export const loginWithToken: UserThunk = (token: string) =>
	async (dispatch) => {
		dispatch(setAppLoading(true))
		try {
			await Endpoints.getInstance().validate(token);
			const d = jwtDecode<UserPaylaod>(token);
			const user: User = {
				expires: d.exp,
				name: d.sub || "n/a",
				permissions: d.permissions
			}
			dispatch(setUser(user))
			if (window.location.pathname.startsWith(ROUTES.LOGIN)) dispatch(push(ROUTES.FILES))
			return dispatch(setAppLoading(false))
		} catch (e) {
			dispatch(addBubble("login-error", {
				title: "Could not login",
				type: "ERROR"
			}))
			return dispatch(setAppLoading(false))
		}
	}

export const signOut: UserThunk = () =>
	async (dispatch) => {
		Endpoints.clearToken();
		dispatch(push(ROUTES.LOGIN));
		return {
			type: Acts.SIGNOUT
		}
	}

// export const register: UserThunk = (username: string, password: string, autoLogin: boolean) =>
// 	async (dispatch) => {
// 	}
