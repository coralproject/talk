import { Decorator } from "./";

const withAutoHeight: Decorator = pym => {
  // Resize parent iframe height when child height changes
  let cachedHeight: string;
  pym.onMessage("height", (height: string) => {
    if (height !== cachedHeight) {
      (pym.el.firstChild! as HTMLElement).style.height = `${height}px`;
      cachedHeight = height;
    }
  });
};

export default withAutoHeight;
