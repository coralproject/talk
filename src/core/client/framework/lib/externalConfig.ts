import { Child as PymChild } from "pym.js";

import { onPymMessageOnce } from "coral-framework/helpers";
import { areWeInIframe } from "coral-framework/utils";

export interface ExternalConfig {
  accessToken?: string;
  bodyClassName?: string;
  version?: string;
  amp?: boolean;
}

export function getExternalConfig(
  window: Window,
  pym?: PymChild
): Promise<ExternalConfig> | null {
  if (pym && areWeInIframe(window)) {
    return new Promise((resolve) => {
      pym.sendMessage("getConfig", "");
      onPymMessageOnce(pym, "config", (raw) => {
        resolve(JSON.parse(raw) as ExternalConfig);
      });
    });
  }
  return null;
}
