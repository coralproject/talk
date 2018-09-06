import { Decorator } from "./types";

const withIOSSafariWidthWorkaround: Decorator = pym => {
  // Workaround: IOS Safari ignores `width` but respects `min-width` value.
  (pym.el.firstChild! as HTMLElement).style.width = "1px";
  (pym.el.firstChild! as HTMLElement).style.minWidth = "100%";
};

export default withIOSSafariWidthWorkaround;
