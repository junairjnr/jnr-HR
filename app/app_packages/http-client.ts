import { getUserContext } from "./tocken";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_ENV_API_BASE_URL || "https://api.hisabuk.com/api";
// process.env.NEXT_PUBLIC_ENV_API_BASE_URL || 'http://192.168.1.107:5002/api';
export const get = async (url: string) => {
  const res = await fetch(API_BASE_URL + url, {
    method: "GET",
    headers: {
      ...getApplicationHeader(url),
    },
  });
  return await res.json();
};

export interface HttpError extends Error {
  cause: string;
}

export async function post<T>(
  url: string,
  body: unknown,
  method: "POST" | "PUT" | "DELETE" = "POST"
) {
  const res = await fetch(API_BASE_URL + url, {
    method,
    headers: {
      ...getApplicationHeader(url),
    },
    body: JSON.stringify(body),
  });
  if (res.status < 200 || res.status >= 400) {
    throw new Error(`[${res.status}] ${res.statusText}`, {
      cause: (await res.json()).detail || res.statusText,
    }) as HttpError;
  }
  return (await res.json()) as Promise<T>;
}
export async function put<T>(url: string, body: unknown) {
  return post(url, body, 'PUT');
}


const accessTokenExcludedUrls = ["/Login"];

const getApplicationHeader = (url?: string) => {
  const headers = {
    "Content-Type": "application/json",
    "x-app": "HISABUK Web app version(1.1)",
  };

  if (url && accessTokenExcludedUrls.find((x) => x.startsWith(url))) {
    return headers;
  }
  const { token, branchId, companyId, financialYear } = getUserContext();
  if (!token || !branchId || !companyId || !financialYear) {
    return {};
  }
  return {
    ...headers,
    Authorization: `Bearer ${token}`,
    branchId,
    companyId,
    financialYearId: financialYear.id,
  };
};
