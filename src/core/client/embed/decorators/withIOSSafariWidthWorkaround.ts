import { Decorator } from "./";

const withIOSSafariWidthWorkaround: Decorator = (pym: any) => {
  // Workaround: IOS Safari ignores `width` but respects `min-width` value.
  pym.el.firstChild.style.width = "1px";
  pym.el.firstChild.style.minWidth = "100%";
};

export default withIOSSafariWidthWorkaround;
