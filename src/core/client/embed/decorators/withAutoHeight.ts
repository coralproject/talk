import { Decorator } from "./types";

const withAutoHeight: Decorator = pym => {
  // Resize parent iframe height when child height changes
  let cachedHeight: string;
  pym.onMessage("height", (height: string) => {
    if (height !== cachedHeight) {
      pym.iframe.style.height = `${height}px`;
      cachedHeight = height;
    }
  });
};

export default withAutoHeight;
