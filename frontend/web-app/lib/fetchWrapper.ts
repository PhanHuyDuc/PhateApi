import { SERVER_URL } from "./constants";
import { getCurrentUser } from "./actions/authActions";
import toast from "react-hot-toast";

const baseUrl = SERVER_URL;

async function get(url: string) {
  const requestOptions = {
    method: "GET",
    headers: await getHeaders(),
  };
  const response = await fetch(baseUrl + url, requestOptions);
  return handleResponse(response);
}
async function getPaginated(url: string) {
  const requestOptions = {
    method: "GET",
    headers: await getHeaders(),
  };
  const response = await fetch(baseUrl + url, requestOptions);
  return handlePaginatedResponse(response);
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

async function put(url: string, body: unknown) {
  const requestOptions = {
    method: "PUT",
    headers: await getHeaders(),
    body: JSON.stringify(body),
  };
  const response = await fetch(baseUrl + url, requestOptions);
  return handleResponse(response);
}

async function postFormData(url: string, formData: FormData) {
  const headers = await getHeaders();

  headers.delete("Content-Type");

  const requestOptions = {
    method: "POST",
    headers,
    body: formData,
  };

  const response = await fetch(baseUrl + url, requestOptions);

  return handleResponse(response);
}

async function putFormData(url: string, formData: FormData) {
  const headers = await getHeaders();

  headers.delete("Content-Type");

  const requestOptions = {
    method: "PUT",
    headers,
    body: formData,
  };

  const response = await fetch(baseUrl + url, requestOptions);

  return handleResponse(response);
}

async function del(url: string) {
  const requestOptions = {
    method: "DELETE",
    headers: await getHeaders(),
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
    console.error("API ERROR:", data);
    const error = {
      status: response.status,
      message: typeof data === "string" ? data : response.statusText,
      details: data,
    };
    return { error };
  }
}

async function handlePaginatedResponse(response: Response) {
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (response.ok) {
    // Get pagination header
    const paginationHeader = response.headers.get("Pagination");
    let pagination = null;

    if (paginationHeader) {
      try {
        pagination = JSON.parse(paginationHeader);
      } catch (error: any) {
        toast.error("Error parsing pagination header:", error.message);
        pagination = null;
      }
    }

    // If we have pagination data, structure the response accordingly
    if (pagination) {
      return {
        results: Array.isArray(data) ? data : [],
        totalCount: pagination.totalCount || 0,
        pageCount: pagination.totalPages || 0,
        currentPage: pagination.currentPage || 1,
        pageSize: pagination.pageSize || 10,
      };
    }

    // Fallback: if no pagination header, return the data as is
    return data || response.statusText;
  } else {
    const error = {
      status: response.status,
      message: typeof data === "string" ? data : response.statusText,
    };
    return { error };
  }
}

interface Session {
  cookies?: string;
}

async function getHeaders(): Promise<Headers> {
  const session = (await getCurrentUser()) as Session;
  const headers = new Headers();
  headers.set("Content-Type", "application/json");

  if (session && session.cookies) {
    headers.set("Cookie", session.cookies);
  }

  return headers;
}

export const fetchWrapper = {
  get,
  post,
  put,
  del,
  getPaginated,
  postFormData,
  putFormData,
};
