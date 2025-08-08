export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Daily Coffee";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION || "A modern coffee shop app";

export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5001/api";
export const NEXTAUTH_URL =
  process.env.NEXTAUTH_URL ||
  "http://localhost:5001/api/login?useCookies=true";
export const NEXTAUTH_URL_INTERNAL =
  process.env.NEXTAUTH_URL_INTERNAL ||
  "http://localhost:5001/api/login?useCookies=true";

export const COOKIE_NAME = process.env.COOKIE_NAME;

export const signInDefaultValues = {
  email: "",
  password: "",
};
