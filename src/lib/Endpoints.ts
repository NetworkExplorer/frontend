import { UserI } from "@models";
import { AuthRes, DefRes, FolderRes, SuggestionsRes, TokenRes, UsersRes } from "./responses";
import { normalizeURL } from "./util";

const ENV = process.env.NODE_ENV;
/**
 * the class for fetching data from the backend
 */
export class Endpoints {
	/**
	 * the basic url to the API
	 */
	API_URL = "/api/v1";
	/**
	 * the base of the urls to the api, only needs to be set in development
	 */
	BASE = this.dev ? "http://localhost:16091" : "";
	/**
	 * the WebSocket connection for executing terminal commands
	 */
	private ws?: WebSocket;
	/**
	 * the headers object for sending the jwt bearer token
	 */
	private static headers: { Authorization?: string } = {}

	/**
	 * returns true if environment is development
	 */
	get dev(): boolean {
		return ENV === "development";
	}

	/**
	 * get the base + api url at once
	 */
	get baseURL(): string {
		return this.BASE + this.API_URL;
	}

	/**
	 * singleton instance variable
	 */
	private static _instance: Endpoints;

	/**
	 * gets the singleton instance for the Endpoints class
	 */
	static getInstance(): Endpoints {
		if (!this._instance) this._instance = new Endpoints();

		return this._instance;
	}

	/**
	 * function for getting the baseURl anywhere in the application
	 * @returns the base url
	 */
	static getBase(): string {
		return this.getInstance().baseURL;
	}

	/**
	 * private constructor for singleton
	 */
	private constructor() {
		console.log("Created Endpoints object");
		// check if any token is saved in local storage (autoLogin) or session storage (no autoLogin, but still in same tab)
		let token = localStorage.getItem("token");
		if (token) Endpoints.setToken(token, true);
		else {
			token = sessionStorage.getItem("token");
			if (token) Endpoints.setToken(token, false);
		}
		if (ENV === "development") {
			// so that you can you can recreate the instance when hot reloading fails
			(window as any).reCreateEndpoints = this.reCreateInstance;
			(window as any).endpoints = this;
		}
	}

	/**
	 * clears and saves the JWT token
	 * @param token the token to saved into storage
	 * @param autoLogin if autoLogin is enabled, if true, the token will get saved to localStorage, otherwise to sessionStorage
	 */
	public static setToken(token: string, autoLogin = false): void {
		Endpoints.clearToken();
		Endpoints.headers = { Authorization: tokenHeader(token) };
		if (autoLogin) {
			localStorage.setItem("token", token);
			localStorage.setItem("isAuthenticated", "true");
		} else {
			sessionStorage.setItem("token", token);
			sessionStorage.setItem("isAuthenticated", "true");
		}
	}

	/**
	 * removes all JWT tokens from storage
	 */
	public static clearToken(): void {
		Endpoints.headers = {};
		localStorage.removeItem("token");
		localStorage.removeItem("isAuthenticated");
		sessionStorage.removeItem("token");
		sessionStorage.removeItem("isAuthenticated");
	}

	/**
	 * recreate the Endpoints instance for development
	 */
	reCreateInstance(): void {
		if (ENV === "development") {
			// this.ws.close();
			Endpoints._instance = new Endpoints();
		}
	}

	/**
	 * starts the execution of a terminal command and creates a WebSocket session if not created
	 * @param cwd the current working directory
	 * @param cmdStr the command to be executed
	 * @param callback the callback to be fire when a message is received
	 * @param error the function to be called when there is an error
	 */
	startExec(cwd: string, cmdStr: string, callback: (ev: MessageEvent) => void, error: (e: Event) => void): void {
		if (!Endpoints.headers.Authorization) {
			error(new Event("error"));
			return;
		}
		try {
			if (!this.ws) {
				// create the instance and authenticate oneself
				this.ws = new WebSocket(`ws://${this.BASE.replace(/https?:\/\//, "")}/exec`);
				this.ws.onopen = () => {
					this.ws?.send(`{bearer: "${Endpoints.headers.Authorization?.replaceAll("Bearer ", "")}"}`)
					const cmd = `{cwd: "${normalizeURL(cwd, false, false)}", cmd: "${cmdStr}"}`;
					this.ws?.send(cmd)
				}
			} else {
				const cmd = `{cwd: "${normalizeURL(cwd, false, false)}", cmd: "${cmdStr}"}`;
				this.ws?.send(cmd)
			}
			this.ws.onmessage = callback;
			this.ws.onclose = error
			this.ws.onerror = error
		} catch (e) {
			error(e)
		}
	}

	/**
	 * tries to cancel the current execution
	 */
	cancelExec(): void {
		this.ws?.send(`{exit: true}`);
	}

	/**
	 * wrapper for clean API calls with checking for HTTP codes and messages if necessary
	 * @param url the url that should be used
	 * @param method the method for the request
	 * @param body an optional body (will only be set on non-GET requests)
	 * @param options any options that can be used in fetch
	 * @returns a Promise of the contents of the response or an error with the correct message (if available)
	 */
	fetchFromAPI = async (
		url: string,
		method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
		body: any = undefined,
		options: RequestInit = {}
	): Promise<any> => {
		options = {
			method,
			headers: {
				"Content-Type": "application/json",
				...Endpoints.headers
			},
			...options,
		};
		if (method !== "GET") {
			options = { ...options, body: body ? JSON.stringify(body) : undefined };
		}
		try {
			const res = await fetch(url, options);
			if (!resWasOk(res, url, body)) {
				// console.error(res);
				// maybe add some other error handling here
				throw new Error("something went wrong");
			}
			const data = await res.json();
			if (data && !data?.error) {
				return data;
			} else {
				throw new Error("something went wrong");
			}
		} catch (e) {
			this.dev && console.error("exception: " + e);
			throw new Error("could not connect to server");
		}
	};

	/**
	 * fetch the contents of a folder
	 * @param path the path of the folder
	 * @returns the response with the folder contents
	 */
	async getFolder(path: string): Promise<FolderRes> {
		if (!path.startsWith("/")) {
			path = "/" + path;
		}
		const url = new URL(`${this.baseURL}/folder${path}`);
		if (!url.pathname.startsWith(`${this.API_URL}/folder`)) {
			throw new Error("invalid path");
		}
		return await this.fetchFromAPI(`${this.baseURL}/folder${path}`);
	}

	/**
	 * login with username and password and receive a JWT token for future requests
	 * @param username the username that should be used
	 * @param password the password that should be used
	 * @returns the response with an authentication token
	 */
	async login(username: string, password: string): Promise<AuthRes> {
		return this.fetchFromAPI(`${this.baseURL}/user/authenticate`, "POST", {
			username,
			password
		})
	}

	/**
	 * validate if a previously fetched/saved JWT token is valid and usable
	 * @param token the token to be validated
	 * @returns a default response and an error if the token is not valid
	 */
	async validate(token: string): Promise<DefRes> {
		return this.fetchFromAPI(`${this.baseURL}/user/validate`, "POST", {
			token
		})
	}

	/**
	 * invalidate a JWT token
	 * @param token the token that should be sent
	 * @returns a default response
	 */
	async logout(token: string): Promise<DefRes> {
		return this.fetchFromAPI(`${this.baseURL}/user/logout`, "POST", {
			token
		});
	}

	/**
	 * creates an user
	 * @param user the user that should be created
	 * @returns a default response
	 */
	async createUser(user: UserI): Promise<DefRes> {
		return this.fetchFromAPI(`${this.baseURL}/user`, "POST", user);
	}

	/**
	 * changes a user
	 * @param user the user that should be changed (only the parameters that should be changed, should be included)
	 * @returns a default response and an error if the changes are too broad or not allowed
	 */
	async changeUser(user: UserI): Promise<DefRes> {
		return this.fetchFromAPI(`${this.baseURL}/user`, "PUT", user)
	}

	/**
	 * deletes a user
	 * @param user the that should be deleted
	 * @returns a default resposne and an error if not possible
	 */
	async deleteUser(user: UserI): Promise<DefRes> {
		return this.fetchFromAPI(`${this.baseURL}/user`, "DELETE", user);
	}

	/**
	 * fetch the list of current users
	 * @returns a list of users (for management purposes)
	 */
	async getUsers(): Promise<UsersRes> {
		return this.fetchFromAPI(`${this.baseURL}/user`);
	}

	/**
	 * fetch a file token that can be used for file downloading
	 * @returns a token for a file download
	 */
	async getFileToken(): Promise<TokenRes> {
		return this.fetchFromAPI(`${this.baseURL}/token`);
	}

	/**
	 * fetch a file with the browser (open download window with a tag)
	 * @param file the file to be downloaded (including folder path)
	 * @param downloadName the name it should be downloaded by (if the backend does not set anything)
	 */
	async getFile(file: string, downloadName: string): Promise<void> {
		if (file.startsWith("/")) {
			file = file.substring(1);
		}
		const url = `${this.baseURL}/download/file?file=${file}&token=${(await this.getFileToken()).data.token}`;
		const a = document.createElement("a");
		a.href = url;
		a.download = downloadName;
		a.className = "hidden";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}

	/**
	 * fetch a file for internal use (with blob etc.)
	 * @param file the file to be downloaded (including folder path)
	 * @returns the response for a file download (with which you can get the blob)
	 */
	getFileBlob(file: string): Promise<Response> {
		if (file.startsWith("/")) file = file.substring(1);

		const url = `${this.baseURL}/download/file?file=${file}`;
		return fetch(url);
	}

	/**
	 * fetch multiple files as a ZIP file
	 * @param paths the complete paths to the files that should be downloaded
	 * @param downloadName a downloadname if the backend does not specify anything
	 */
	async getFiles(paths: string[], downloadName = "download.zip"): Promise<void> {
		const pathsStr = paths
			.map((f) => {
				if (f.startsWith("/")) return f.substring(1);
				return f;
			})
			.join(",");

		const url = `${this.baseURL}/download/files?files=${pathsStr}&token=${(await this.getFileToken()).data.token}`;
		const a = document.createElement("a");
		a.href = url;
		a.download = downloadName;
		a.className = "hidden";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}

	/**
	 * upload a file and track progress etc.
	 * @param file the file object that should be uploaded
	 * @param path the folder path where it should be uploaded to
	 * @param progress the callback function for tracking upload progress
	 * @param load the callback function when the upload is finished
	 * @param error the callback function when the upload errors
	 * @returns the xml http request for future use
	 */
	uploadFile(file: File, path: string,
		progress: (e: ProgressEvent<XMLHttpRequestEventTarget>) => void,
		load: () => void,
		error: () => void): XMLHttpRequest {
		if (!Endpoints.headers.Authorization) throw new Error("not logged in");
		const formData = new FormData();
		formData.append("file", file);
		formData.append("path", path);

		const request = new XMLHttpRequest()
		request.open("POST", `${this.baseURL}/upload`);
		request.setRequestHeader("Authorization", Endpoints.headers.Authorization)
		request.upload.addEventListener("progress", progress, false);
		request.addEventListener("load", load);
		request.addEventListener("error", error)

		request.send(formData);
		return request;
		// return this.fetchFromAPI(`${this.baseURL}/upload`, "POST", formData);
	}

	/**
	 * creates a directory
	 * @param path the folder that should be created
	 * @returns a default response if successful
	 */
	async mkdir(path: string): Promise<DefRes> {
		return this.fetchFromAPI(
			`${this.baseURL}/mkdir?path=${normalizeURL(path, false)}`,
			"POST"
		);
	}

	/**
	 * deletes multiple files/folders
	 * @param paths the complete paths to folders/files that should be deleted
	 * @returns the default response
	 */
	async delete(paths: string[]): Promise<DefRes> {
		return this.fetchFromAPI(`${this.baseURL}/delete`, "DELETE", paths);
	}

	/**
	 * moves/renames a file/folder
	 * @param from the complete path of a folder/file
	 * @param to the complete path to where a folder/file should be moved to
	 * @returns the default response
	 */
	async move(from: string, to: string): Promise<DefRes> {
		return this.fetchFromAPI(
			`${this.baseURL}/rename?path=${normalizeURL(
				from,
				false
			)}&newPath=${normalizeURL(to, false)}`,
			"PUT"
		);
	}

	/**
	 * fetches the search suggestions for a path
	 * @param path the path that should be used for suggestions
	 * @param max the maximum amount of results that should be fetched
	 * @returns a response with a list of Suggestions
	 */
	async fetchSuggestions(path: string, max: number): Promise<SuggestionsRes> {
		return this.fetchFromAPI(
			`${this.baseURL}/suggest?path=${path}&max=${max}`
		);
	}
}

/**
 * returns true if the response was ok and false if the response was bad
 * @param res the response to handle
 * @param url the url that was requested
 * @param body the body that was sent with it
 */
export function resWasOk(res: Response, url: string, body = {}): boolean {
	if (!res.ok) {
		console.error("request body", JSON.stringify(body));
	}
	return res.ok;
}

/**
 * makes a token ready for request (add Bearer at the beginning)
 * @param token the token that should be used
 * @returns a token with Bearer at the front for usage in the Authorization header
 */
const tokenHeader = (token: string): string => {
	if (token.startsWith("Bearer ")) return token;
	if (token.startsWith("Bearer")) return token.replace("Bearer", "Bearer ");
	return `Bearer ${token}`;
}

// export function isJsonOk(json: DefaultResponse): boolean {
//   return !(
//     Math.floor(json.status / 100) === 4 || Math.floor(json.status / 100) === 5
//   );
// }

export default Endpoints;
