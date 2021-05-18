import SockJS from "sockjs-client";
import { DefRes, FolderRes } from "./responses";
import { Stomp } from "@stomp/stompjs";
import { normalizeURL } from "./util";

const ENV = process.env.NODE_ENV;
export class Endpoints {
  API_URL = "/api/v1";
  BASE = ENV === "development" ? "http://localhost:16091" : "";

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
    if (ENV === "development") {
      // so that you can you can recreate the instance when hot reloading fails
      (window as any).reCreateEndpoints = this.reCreateInstance;
      (window as any).endpoints = this;
    }
  }

  reCreateInstance(): void {
    if (ENV === "development") {
      Endpoints._instance = new Endpoints();
    }
  }

  static testWS(): void {
    const sock = new SockJS("http://localhost:16091/websocket");
    const stompClient = Stomp.over(sock);
    stompClient.connect({}, function (frame: any) {
      // setConnected(true);
      console.log("Connected: " + frame);
      stompClient.subscribe("/user/queue/output", function (greeting) {
        console.log(greeting.body);
      });
      stompClient.send("/app/exec", {}, "dir");
    });
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

  getFile(file: string, downloadName: string): void {
    if (file.startsWith("/")) {
      file = file.substring(1);
    }
    const url = `${this.baseURL}/download/file?file=${file}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadName;
    a.className = "hidden";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  getFiles(paths: string[], downloadName = "download.zip"): void {
    const pathsStr = paths
      .map((f) => {
        if (f.startsWith("/")) return f.substring(1);
        return f;
      })
      .join(",");

    const url = `${this.baseURL}/download/files?files=${pathsStr}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadName;
    a.className = "hidden";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  uploadFile(file: File, path: string): XMLHttpRequest {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", path);

    const request = new XMLHttpRequest();
    request.open("POST", `${this.baseURL}/upload`);

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

// export function isJsonOk(json: DefaultResponse): boolean {
//   return !(
//     Math.floor(json.status / 100) === 4 || Math.floor(json.status / 100) === 5
//   );
// }

export default Endpoints;
