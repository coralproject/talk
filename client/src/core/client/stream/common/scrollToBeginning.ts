import getElementWindowTopOffset from "coral-ui/helpers/getElementWindowTopOffset";

function scrollToBeginning(
  root: ShadowRoot | Document,
  window: Window,
  customScrollContainer?: HTMLElement
) {
  const tab = root.getElementById("tab-COMMENTS");
  if (tab) {
    if (customScrollContainer) {
      tab.scrollIntoView();
    } else {
      window.scrollTo({ top: getElementWindowTopOffset(window, tab) });
    }
    // set keyboard focus to Comments button for accessibility
    tab.getElementsByTagName("button")[0].focus();
  }
}

export default scrollToBeginning;
