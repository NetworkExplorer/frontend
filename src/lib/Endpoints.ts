import { AuthRes, DefRes, FolderRes, SuggestionsRes, TokenRes, UsersRes } from "./responses";
import { normalizeURL } from "./util";

const ENV = process.env.NODE_ENV;
export class Endpoints {
	API_URL = "/api/v1";
	BASE = ENV === "development" ? "http://localhost:16091" : "";
	private ws?: WebSocket;
	private static headers: { Authorization?: string } = {}

	get dev(): boolean {
		return ENV === "development";
	}

	get baseURL(): string {
		return this.BASE + this.API_URL;
	}

	private static _instance: Endpoints;

	/**
	 * gets the singleton instance for the Endpoints class
	 */
	static getInstance(): Endpoints {
		if (!this._instance) this._instance = new Endpoints();

		return this._instance;
	}

	static getBase(): string {
		return this.getInstance().baseURL;
	}

	private constructor() {
		console.log("Created Endpoints object");
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

	public static clearToken(): void {
		Endpoints.headers = {};
		localStorage.removeItem("token");
		localStorage.removeItem("isAuthenticated");
		sessionStorage.removeItem("token");
		sessionStorage.removeItem("isAuthenticated");
	}

	reCreateInstance(): void {
		if (ENV === "development") {
			// this.ws.close();
			Endpoints._instance = new Endpoints();
		}
	}

	startExec(cwd: string, cmdStr: string, callback: (ev: MessageEvent) => void, error: (e: Event) => void): any {
		if (!Endpoints.headers.Authorization) {
			error(new Event("error"));
			return;
		}
		try {
			if (!this.ws) this.ws = new WebSocket(`ws://${this.BASE.replace(/https?:\/\//, "")}/exec`);
			this.ws.onmessage = callback;
			this.ws.onclose = error
			this.ws.onerror = error
			this.ws.onopen = () => {
				this.ws?.send(`{bearer: "${Endpoints.headers.Authorization?.replaceAll("Bearer ", "")}"}`)
				const cmd = `{cwd: "${normalizeURL(cwd, false, false)}", cmd: "${cmdStr}"}`;
				this.ws?.send(cmd)
			}
		} catch (e) {
			error(e)
		}
	}


	cancelExec(): void {
		this.ws?.send(`{exit: true}`);
	}

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

	async login(username: string, password: string): Promise<AuthRes> {
		return this.fetchFromAPI(`${this.baseURL}/user/authenticate`, "POST", {
			username,
			password
		})
	}

	async validate(token: string): Promise<DefRes> {
		return this.fetchFromAPI(`${this.baseURL}/user/validate`, "POST", {
			token
		})
	}

	async logout(token: string): Promise<DefRes> {
		return this.fetchFromAPI(`${this.baseURL}/user/logout`, "POST", {
			token
		})
	}

	async getUsers(): Promise<UsersRes> {
		return this.fetchFromAPI(`${this.baseURL}/user`);
	}

	async getFileToken(): Promise<TokenRes> {
		return this.fetchFromAPI(`${this.baseURL}/token`);
	}

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

	getFileBlob(file: string): Promise<Response> {
		if (file.startsWith("/")) file = file.substring(1);

		const url = `${this.baseURL}/download/file?file=${file}`;
		return fetch(url);
	}

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

	async mkdir(path: string): Promise<DefRes> {
		return this.fetchFromAPI(
			`${this.baseURL}/mkdir?path=${normalizeURL(path, false)}`,
			"POST"
		);
	}

	async delete(paths: string[]): Promise<DefRes> {
		return this.fetchFromAPI(`${this.baseURL}/delete`, "DELETE", paths);
	}

	async move(from: string, to: string): Promise<DefRes> {
		return this.fetchFromAPI(
			`${this.baseURL}/rename?path=${normalizeURL(
				from,
				false
			)}&newPath=${normalizeURL(to, false)}`,
			"PUT"
		);
	}

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
