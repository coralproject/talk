import { ensureInView } from "coral-framework/utils";

export const ensureRefInView = (el: HTMLElement | null) => {
  if (el) {
    ensureInView(el);
  }
};
