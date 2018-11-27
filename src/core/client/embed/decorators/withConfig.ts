import { ExternalConfig } from "talk-framework/lib/externalConfig";

import { Decorator } from "./types";

const withConfig = (config: ExternalConfig): Decorator => pym => {
  pym.onMessage("getConfig", () => {
    pym.sendMessage("config", JSON.stringify(config));
  });
};

export default withConfig;
