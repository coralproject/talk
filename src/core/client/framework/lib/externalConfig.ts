import { areWeInIframe } from "coral-framework/utils";
import { Child as PymChild } from "pym.js";

export interface ExternalConfig {
  accessToken?: string;
}

export function getExternalConfig(
  pym?: PymChild
): Promise<ExternalConfig> | null {
  if (pym && areWeInIframe()) {
    return new Promise(resolve => {
      pym.sendMessage("getConfig", "");
      pym.onMessage("config", raw => {
        resolve(JSON.parse(raw) as ExternalConfig);
      });
    });
  }
  return null;
}
