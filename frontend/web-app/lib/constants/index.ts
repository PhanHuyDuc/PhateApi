export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Daily Coffee";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION || "A modern coffee shop app";

export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5001/api";
export const NEXTAUTH_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";
export const NEXTAUTH_URL_LOGIN =
  process.env.NEXTAUTH_URL_LOGIN ||
  "http://localhost:5001/api/login?useCookies=true";
export const NEXTAUTH_URL_GETCURRENTUSER =
  process.env.NEXTAUTH_URL_GETCURRENTUSER ||
  "http://localhost:5001/api/account/user-info";

export const signInDefaultValues = {
  email: "",
  password: "",
};

export const signUpDefaultValues = {
  email: "",
  password: "",
  displayName: "",
  bio: "",
  confirmPassword: "",
};

