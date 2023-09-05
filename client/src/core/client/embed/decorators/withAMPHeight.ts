import { EventEmitter2 } from "eventemitter2";

const withAMPHeight = (streamEventEmitter: EventEmitter2, polling = 100) => {
  let cachedHeight: number;

  const updateHeight = () => {
    const height = window.document.body.clientHeight;
    if (height === cachedHeight) {
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
    cachedHeight = height;
  };

  streamEventEmitter.on("heightChange", () => {
    updateHeight();
  });

  window.setInterval(updateHeight, polling);
};

export default withAMPHeight;
