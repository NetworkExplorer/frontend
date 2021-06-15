import { Endpoints, LOGIN_DURATION, ROUTES, sleep } from "@lib";
import { UserI, UserPaylaod } from "@models";
import { UserActionTypes, UserThunk, UserSetUser, UserSetUsersLoading, UserUpdateUsers, UserSetUserPrompt } from "./types";
import jwtDecode from "jwt-decode";
import { addBubble, setAppLoading, setTransition } from "@store/app";
import { push } from "connected-react-router";

const Acts = UserActionTypes;

export const setUser = (user?: UserI): UserSetUser => ({
	type: Acts.SET_USER,
	payload: user
})

export const login: UserThunk = (username: string, password: string, autoLogin: boolean, redirect?: string) =>
	async (dispatch) => {
		dispatch(setTransition("hidden"));
		dispatch(setTransition("running"));
		dispatch(setAppLoading(true))
		await sleep(LOGIN_DURATION * 0.4);
		dispatch(setTransition("paused"));
		try {
			const { data: { token } } = await Endpoints.getInstance().login(username, password);
			Endpoints.setToken(token, autoLogin);
			const d = jwtDecode<UserPaylaod>(token);
			const user: UserI = {
				expires: d.exp,
				username: d.sub || username,
				permissions: d.permissions
			}
			dispatch(setUser(user));

			if (!redirect) {
				dispatch(push(ROUTES.FILES) as any);
			} else {
				dispatch(push(redirect) as any);
			}
			dispatch(setTransition("running"))
			dispatch(setAppLoading(false))
			await sleep(LOGIN_DURATION * 0.6);
			return dispatch(setTransition("hidden"))
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
			const user: UserI = {
				expires: d.exp,
				username: d.sub || "n/a",
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

export const setUsersLoading = (loading: boolean): UserSetUsersLoading => ({
	type: Acts.SET_USERS_LOADING,
	payload: loading
})

export const updateUsers = (users: UserI[]): UserUpdateUsers => ({
	type: Acts.UPDATE_USERS,
	payload: users
})

export const fetchUsers: UserThunk = () =>
	async (dispatch) => {
		dispatch(setUsersLoading(true));

		try {
			const { data } = await Endpoints.getInstance().getUsers();
			dispatch(updateUsers(data))
			return dispatch(setUsersLoading(false))
		} catch (e) {
			dispatch(addBubble("users-error", {
				title: "Could not fetch users",
				type: "ERROR"
			}))
			return dispatch(setUsersLoading(false))
		}
	}

export const saveUsers: UserThunk = (users: UserI[]) =>
	async (dispatch) => {
		dispatch(setUsersLoading(true));

		try {
			for (const u of users) {
				if (u.username === "admin") continue;
				else if (u.delete) {
					await Endpoints.getInstance().deleteUser(u);
				} else {
					u.password = "";
					await Endpoints.getInstance().changeUser(u);
				}
			}
			return dispatch(fetchUsers())
		} catch (e) {
			dispatch(addBubble("users-error", {
				title: "Could not fetch users",
				type: "ERROR"
			}))
			return dispatch(setUsersLoading(false))
		}
	}

export const setUserPrompt = (prompt: boolean): UserSetUserPrompt => ({
	type: Acts.SET_USER_PROMPT,
	payload: prompt
})

export const createUser: UserThunk = (user: UserI) =>
	async (dispatch) => {
		dispatch(setUsersLoading(true));
		dispatch(setUserPrompt(false));

		try {
			await Endpoints.getInstance().createUser(user);
			return dispatch(fetchUsers())
		} catch (e) {
			dispatch(addBubble("users-error", {
				title: "Could not fetch users",
				type: "ERROR"
			}))
			return dispatch(setUsersLoading(false))
		}
	}

export const changeUser: UserThunk = (user: UserI) =>
	async (dispatch) => {
		dispatch(setUsersLoading(true));

		try {
			await Endpoints.getInstance().changeUser(user);
			dispatch(addBubble("change-success", {
				title: "Successfully changed user",
				type: "SUCCESS"
			}))
			return dispatch(setUsersLoading(false))
		} catch (e) {
			dispatch(addBubble("users-error", {
				title: "Could not change user",
				type: "ERROR"
			}))
			return dispatch(setUsersLoading(false))
		}
	}

// export const register: UserThunk = (username: string, password: string, autoLogin: boolean) =>
// 	async (dispatch) => {
// 	}
