import getElementWindowTopOffset from "coral-ui/helpers/getElementWindowTopOffset";

function scrollToBeginning(
  root: ShadowRoot | Document,
  window: Window,
  customScrollParent?: React.RefObject<any>
) {
  const tab = root.getElementById("tab-COMMENTS");
  const scrollContainer = customScrollParent?.current ?? window;
  if (tab) {
    scrollContainer.scrollTo({
      top: getElementWindowTopOffset(scrollContainer, tab),
    });
  }
}

export default scrollToBeginning;
