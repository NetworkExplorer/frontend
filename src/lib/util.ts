import { FileI } from "./file";

/**
 * convert the size of a file into a human-readable form
 * @param size the size of a file in bytes
 * @param decimals how many decimals should be displayed
 * @returns the file size in bytes, kilobytes etc.
 */
export function convertFileSize(size: number, decimals = 1): string {
	if (size === 0) return "";

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

	const i = Math.floor(Math.log(size) / Math.log(k));

	return `${parseFloat((size / Math.pow(k, i)).toFixed(dm))}${sizes[i]}`;
}

/**
 * normalises the files from the backend for correct usage
 * @param files the files that should be converted
 * @returns a normalised file array
 */
export function convertFiles(files: FileI[]): FileI[] {
	return files
		.map((f) => ({
			...f,
			created: f.created ? new Date(f.created) : undefined,
			modified: f.modified ? new Date(f.modified) : undefined,
		}))
		.sort((a, b) => {
			if (a.type === b.type) {
				return a.name.localeCompare(b.name);
			}
			if (a.type === "FOLDER") {
				return -1;
			}
			return 1;
		});
}

/**
 * find the nearest parent of an element with the classname
 * @param className the classname to search for
 * @param el the element from which to search from
 * @returns the nearest parent with the supplied classname, or undefiend if not found
 */
export function findElInTree(
	className: string,
	el?: HTMLElement | null
): HTMLElement | undefined {
	if (!el || el === document.documentElement) {
		return undefined;
	}
	if (el.classList.contains(className)) {
		return el;
	}
	return findElInTree(className, el.parentElement);
}

/**
 * normalises an URL for later API usage
 * @param url the url to be normalised
 * @param endingSlash if the URL should have an ending slash
 * @param leadingSlash if the URL should have a leading slash
 * @returns the normalised URL
 */
export function normalizeURL(url: string, endingSlash = true, leadingSlash = false): string {
	url = url.trim();
	if (url === "/") {
		if (!leadingSlash && !endingSlash) return "";
	}
	if (!endingSlash && url.endsWith("/")) url = url.substring(0, url.length - 1);
	if (endingSlash && !url.endsWith("/")) url = url + "/";
	if (leadingSlash && !url.startsWith("/")) url = "/" + url;
	if (!leadingSlash && url.startsWith("/")) url = url.substring(1);
	return url;
}

export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(() => resolve(), ms);
	});
}
