import getElementWindowTopOffset from "coral-ui/helpers/getElementWindowTopOffset";

function scrollToBeginning(
  root: ShadowRoot | Document,
  window: Window,
  customScrollContainer?: HTMLElement
) {
  const tab = root.getElementById("tab-COMMENTS");
  const scrollContainer = customScrollContainer ?? window;
  if (tab) {
    scrollContainer.scrollTo({
      top: getElementWindowTopOffset(scrollContainer, tab),
    });
  }
}

export default scrollToBeginning;
