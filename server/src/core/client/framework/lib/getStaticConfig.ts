import { StaticConfig } from "coral-common/config";

export default function getStaticConfig(window: Window) {
  // Parse and load the reporter configuration from the config element on the
  // page.
  const element = window.document.getElementById("coral-static-config")!;
  if (!element) {
    return null;
  }

  // Parse the config from the element text, it should always be a valid JSON
  // string if the element is available. We should allow the error to bubble if
  // we are unable to parse it.
  const config: StaticConfig = JSON.parse(element.innerText);
  return config;
}
