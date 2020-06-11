import { Decorator } from "./types";

const withAutoHeight: (amp: boolean) => Decorator = (amp) => (pym) => {
  // Resize parent iframe height when child height changes
  let cachedHeight: string;
  pym.onMessage("height", (height: string) => {
    if (height !== cachedHeight) {
      pym.iframe.style.height = `${height}px`;
      cachedHeight = height;
      if (amp) {
        window.parent.postMessage(
          {
            sentinel: "amp",
            type: "embed-size",
            height: Number.parseInt(height, 10) > 100 ? height : 100,
          },
          "*"
        );
      }
    }
  });
};

export default withAutoHeight;
