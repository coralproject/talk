import { ensureInView } from "coral-framework/utils";

const ensureRefInView = (el: HTMLElement | null) => {
  if (el) {
    ensureInView(el);
  }
};

export default ensureRefInView;
