import { Child as PymChild } from "pym.js";

import { onPymMessageOnce } from "coral-framework/helpers";

export default function getPymRefreshAccessToken(
  pym: PymChild
): Promise<string> {
  pym.sendMessage("getRefreshAccessToken", "");
  return new Promise<string>((resolve, reject) => {
    onPymMessageOnce(pym, "refreshAccessToken", (token) => {
      resolve(token);
    });
  });
}
