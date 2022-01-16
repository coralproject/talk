function scrollToBeginning(root: ShadowRoot | Document, window: Window) {
  const tab = root.getElementById("tab-COMMENTS");
  if (tab) {
    window.scrollTo({ top: tab.offsetTop });
  }
}

export default scrollToBeginning;
