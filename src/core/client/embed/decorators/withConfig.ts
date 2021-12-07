import { ExternalConfig } from "coral-framework/lib/externalConfig";

import { DecoratorLegacy } from "./types";

const withConfig = (config: ExternalConfig): DecoratorLegacy => (pym) => {
  pym.onMessage("getConfig", () => {
    pym.sendMessage("config", JSON.stringify(config));
  });
};

export default withConfig;
