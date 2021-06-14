import { UserI } from "@models";
import { FileI, FileTypes } from "./file";

/**
 * the default response
 */
export interface DefRes {
	statusCode: number;
	/**
	 * the data object, where the type can be overridden by specific response types
	 */
	data: unknown;
	message: string;
}

/**
 * the data object when fetching the contents of a folder
 */
export interface FolderResInner {
	name: string;
	size: number;
	type: FileTypes;
	files: FileI[];
}

/**
 * the response when fetching the contents of a folder
 */
export interface FolderRes extends DefRes {
	data: FolderResInner;
}

/**
 * the response when fetching suggestions
 */
export interface SuggestionsRes extends DefRes {
	data: string[];
}

/**
 * the response when fetching the token for a login
 */
export interface AuthRes extends DefRes {
	data: {
		token: string;
	}
}

/**
 * the response when fetching a token for file downloads
 */
export interface TokenRes extends DefRes {
	data: {
		token: string;
	}
}

/**
 * the response when fetching the user list for management purposes
 */
export interface UsersRes extends DefRes {
	data: UserI[];
}

/**
 * the response types for WebSocket messages
 */
export type WSData = {
	cmd: string;
	end: false;
	error: false;
	result: string;
} | {
	cmd: string;
	end: true;
	error: false
} | {
	cmd: string;
	error: true
}
