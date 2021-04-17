import { FolderRes } from "./responses";

const ENV = process.env.NODE_ENV;
export class Endpoints {
  API_URL = "/api/v1";
  BASE = ENV === "development" ? "http://localhost:16091" : "";

  get dev(): boolean {
    return ENV === "development";
  }

  get baseURL(): string {
    return this.BASE + this.API_URL
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
    if (ENV === "development")
      // so that you can you can recreate the instance when hot reloading fails
      (window as any).reCreateEndpoints = this.reCreateInstance;
  }

  reCreateInstance(): void {
    if (ENV === "development") {
      Endpoints._instance = new Endpoints();
    }
  }

  fetchFromAPI = async (
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body = {}
  ): Promise<any> => {
    let options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (method !== "GET") {
      options = { ...options, body: JSON.stringify(body) };
    }
    try {
      const res = await fetch(url, options);
      if (!resWasOk(res, url, body)) {
        // console.error(res);
        // maybe add some other error handling here
        throw new Error("something went wrong")
      }
      const data = await res.json();
      if (data && !data?.error) {
        return data;
      } else {
        throw new Error("something went wrong")
      }
    } catch (e) {
      this.dev && console.error("exception: " + e);
      throw new Error("could not connect to server")
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
}

/**
 * returns true if the response was ok and false if the response was bad
 * @param {Response} res the response to handle
 * @param {string} url the url that was requested
 * @param {string} body the body that was sent with it
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