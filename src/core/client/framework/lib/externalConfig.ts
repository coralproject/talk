import { Child as PymChild } from "pym.js";

import { onPymMessageOnce } from "coral-framework/helpers";
import { areWeInIframe } from "coral-framework/utils";

export interface ExternalConfig {
  accessToken?: string;
  bodyClassName?: string;
  version?: string;
}

export function getExternalConfig(
  pym?: PymChild
): Promise<ExternalConfig> | null {
  if (pym && areWeInIframe()) {
    return new Promise((resolve) => {
      pym.sendMessage("getConfig", "");
      onPymMessageOnce(pym, "config", (raw) => {
        resolve(JSON.parse(raw) as ExternalConfig);
      });
    });
  }
  return null;
}
