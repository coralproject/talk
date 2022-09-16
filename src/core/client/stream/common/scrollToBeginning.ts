import getElementWindowTopOffset from "coral-ui/helpers/getElementWindowTopOffset";

function scrollToBeginning(
  root: ShadowRoot | Document,
  window: Window,
  customScrollContainer?: React.RefObject<any>
) {
  const tab = root.getElementById("tab-COMMENTS");
  const scrollContainer = customScrollContainer?.current ?? window;
  if (tab) {
    scrollContainer.scrollTo({
      top: getElementWindowTopOffset(scrollContainer, tab),
    });
  }
}

export default scrollToBeginning;
