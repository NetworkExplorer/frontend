import { FolderRes } from "./responses";

const ENV = process.env.NODE_ENV;
export class Endpoints {
  baseURL = ENV === "development" ? "http://localhost:16091/api/v1" : "";
  private static _instance: Endpoints;

  /**
   * gets the singleton instance for the Endpoints class
   */
  static getInstance(): Endpoints {
    console.log(ENV)
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
    console.log(ENV)
    console.log(this.baseURL)
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
        // console.error(`response was bad for ${url}`);
        // maybe add some other error handling here
        throw new Error("something went wrong")
      }
      const data = await res.json();
      if (data && !data?.error) {
        // console.log(data);
        return data;
      } else {
        throw new Error("something went wrong")
      }
    } catch (e) {
      console.error("fetch error for: " + url);
      console.error("exception: " + e);
      throw new Error("could not connect to server")
      // reject({
      //   ...e,
      //   title: "Connection fail",
      //   message: "could not connect to server",
      // });
    }
  };

  async getFolder(path: string): Promise<FolderRes> {
    if (!path.startsWith("/")) {
      path = "/" + path;
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
    console.error(
      `response was bad for ${url.replace(Endpoints.getBase(), "")}`
    );
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