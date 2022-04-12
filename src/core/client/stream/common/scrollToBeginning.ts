import getElementWindowTopOffset from "coral-ui/helpers/getElementWindowTopOffset";

function scrollToBeginning(root: ShadowRoot | Document, window: Window) {
  const tab = root.getElementById("tab-COMMENTS");
  if (tab) {
    window.scrollTo({ top: getElementWindowTopOffset(window, tab) });
  }
}

export default scrollToBeginning;
