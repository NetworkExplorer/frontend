import { FileI, FileTypes } from "./types";

export interface DefRes {
	statusCode: number;
	data: unknown;
	message: string;
}

export interface FolderResInner {
	name: string;
	size: number;
	type: FileTypes;
	files: FileI[];
}

export interface FolderRes extends DefRes {
	data: FolderResInner;
}

export interface SuggestionsRes extends DefRes {
	data: string[];
}

export interface AuthRes extends DefRes {
	data: {
		token: string;
	}
}

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
