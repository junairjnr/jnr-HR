import { useRouter } from "next/navigation";
import { LoginResponse } from "../Types";

const keys = {
  USER_CONTEXT: "user_context",
  DATE: "date",
};

export function storeUserContext(userContext: LoginResponse) {
  localStorage.setItem(keys.USER_CONTEXT, JSON.stringify(userContext));
}

export function getUserContext() {
  const userContext = localStorage?.getItem(keys.USER_CONTEXT);
  if (userContext) {
    return JSON.parse(userContext) as LoginResponse;
  }
  return <LoginResponse>{};
}

export const storeLoginDate = (date: string) => {
  localStorage.setItem(keys.DATE, date);
};
export const getLoginDate = () => {
  return get(keys.DATE) || "";
};

const get = (key: string) => {
  if (typeof window === "undefined") {
    return;
  }
  return localStorage.getItem(key);
};
export const removeUserContext = () => {
  localStorage.removeItem(keys.USER_CONTEXT);
  localStorage.removeItem(keys.DATE);
};
