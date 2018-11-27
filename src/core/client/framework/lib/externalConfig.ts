import { Child as PymChild } from "pym.js";
import { areWeInIframe } from "talk-framework/utils";

export interface ExternalConfig {
  authToken?: string;
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
