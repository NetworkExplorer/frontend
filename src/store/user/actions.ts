import { UserThunk } from "./types";

export const login: UserThunk = (username: string, password: string, autoLogin: boolean) =>
	async (dispatch) => {
		// TODO add login, saving data on autologin
	}

export const register: UserThunk = (username: string, password: string, autoLogin: boolean) =>
	async (dispatch) => {
		// TODO add login, saving data on autologin
	}
