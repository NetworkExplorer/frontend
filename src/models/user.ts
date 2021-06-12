import { JwtPayload } from "jwt-decode";
export enum Permission {
	MANAGE_USER = "MANAGE_USER",
	READ = "READ",
	WRITE = "WRITE",
	TERMINAL = "TERMINAL"
}

export interface UserPaylaod extends JwtPayload {
	permissions: Permission[];
}

export interface UserI {
	username: string;
	permissions: Permission[];
	expires?: number;
	jwts?: string[]
}