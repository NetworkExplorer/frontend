import { JwtPayload } from "jwt-decode";
export enum Permission {
	MANAGE_USER = 1,
	READ = 2,
	WRITE = 4,
	TERMINAL = 8
}

export interface UserPaylaod extends JwtPayload {
	permissions: Permission[];
}

export interface User {
	name: string;
	permissions: Permission[];
	expires?: number;
}