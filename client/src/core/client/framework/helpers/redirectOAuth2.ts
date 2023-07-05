import qs from "querystringify";

import { REDIRECT_TO_PARAM } from "coral-common/constants";

export default function redirectOAuth2(window: Window, redirectURL: string) {
  const redirectTo = window.location.pathname;
  window.location.href = `${redirectURL}?${qs.stringify({
    [REDIRECT_TO_PARAM]: redirectTo,
  })}`;
}
