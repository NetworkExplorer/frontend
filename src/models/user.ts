import { JwtPayload } from "jwt-decode";
export enum PermissionE {
	MANAGE_USER = "MANAGE_USER",
	READ = "READ",
	WRITE = "WRITE",
	TERMINAL = "TERMINAL"
}

export interface UserPayload extends JwtPayload {
	permissions: PermissionE[];
}

export interface UserI {
	username: string;
	permissions: PermissionE[];
	expires?: number;
	jwts?: string[];
	password?: string;
	delete?: boolean;
}