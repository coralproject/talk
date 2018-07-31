import { Decorator } from "./";

const withAutoHeight: Decorator = (pym: any) => {
  // Resize parent iframe height when child height changes
  let cachedHeight: number;
  pym.onMessage("height", (height: number) => {
    if (height !== cachedHeight) {
      pym.el.firstChild.style.height = `${height}px`;
      cachedHeight = height;
    }
  });
};

export default withAutoHeight;
