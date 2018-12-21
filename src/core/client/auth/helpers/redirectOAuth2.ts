import { authRedirectBackTo } from "talk-framework/helpers/storageKeys";

export default function redirectOAuth2(redirectURL: string) {
  sessionStorage.setItem(authRedirectBackTo, window.location.pathname);
  window.location.href = redirectURL;
}
