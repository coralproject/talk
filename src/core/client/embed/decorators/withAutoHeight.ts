import { Decorator } from "./types";

const withAutoHeight = (amp: boolean): Decorator => (pym) => {
  // Resize parent iframe height when child height changes
  let cachedHeightString: string;

  pym.onMessage("height", (heightString: string) => {
    if (heightString === cachedHeightString) {
      return;
    }
    cachedHeightString = heightString;

    const height = parseInt(heightString, 10);

    pym.iframe.style.height = `${height}px`;
    if (!amp) {
      return;
    }

    window.parent.postMessage(
      {
        sentinel: "amp",
        type: "embed-size",
        height: height > 100 ? height : 100,
      },
      "*"
    );
  });
};

export default withAutoHeight;
