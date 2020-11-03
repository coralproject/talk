import { AUTH_REDIRECT_PATH_KEY } from "coral-framework/helpers/storageKeys";

export default function redirectOAuth2(redirectURL: string) {
  localStorage.setItem(AUTH_REDIRECT_PATH_KEY, window.location.pathname);
  window.location.href = redirectURL;
}
