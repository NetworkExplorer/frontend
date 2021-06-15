import { faKey, faUser } from "@fortawesome/free-solid-svg-icons";

/**
 * the duration of the login animation in milliseconds
 */
export const LOGIN_DURATION = 3500;

export enum ROUTES {
	LOGIN = "/login",
	REGISTER = "/register",
	FILES = "/files",
	SETTINGS = "/settings",
	EDITOR = "/editor"
}

export enum SettingsRoute {
	PASSWORD = "password",
	MANAGE_USERS = "manageUsers"
}

export const settingsRoutes = [
	{
		path: SettingsRoute.PASSWORD,
		icon: faKey,
		name: "Change your password",
		permissionNeeded: false
	},
	{
		path: SettingsRoute.MANAGE_USERS,
		icon: faUser,
		name: "Manage Users",
		permissionNeeded: true
	},
]

export const REDIRECT_PARAM = "redirect"

export function getFilesURL(path?: string): string {
	path = path || window.location.pathname;
	path = path.replace(ROUTES.FILES, "");
	path = path.replace(ROUTES.EDITOR, "");
	return path;
}

export function getCurrentFilesPath(): string {
	return getFilesURL(undefined);
}