import { getBrowserInfo } from "coral-framework/lib/browserInfo";

function getAriaPoliteMacOSWorkaround() {
  const browserInfo = getBrowserInfo();
  if (browserInfo.macos) {
    return "assertive";
  }
  return "polite";
}

export default getAriaPoliteMacOSWorkaround;
