import { SERVER_URL } from "./constants";

const baseUrl = SERVER_URL;

async function get(url: string) {
  const requestOptions = {
    method: "GET",
    headers: await getHeaders(),
  };
  const response = await fetch(baseUrl + url, requestOptions);
  return handleResponse(response);
}

async function post(url: string, body: unknown) {
  const requestOptions = {
    method: "POST",
    headers: await getHeaders(),
    body: JSON.stringify(body),
  };
  const response = await fetch(baseUrl + url, requestOptions);
  return handleResponse(response);
}

async function handleResponse(response: Response) {
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (response.ok) {
    return data || response.statusText;
  } else {
    const error = {
      status: response.status,
      message: typeof data === "string" ? data : response.statusText,
    };
    return { error };
  }
}

async function getHeaders(): Promise<Headers> {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  return headers;
}

export const fetchWrapper = {
  get,
  post,
};
