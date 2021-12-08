function scrollToBeginning(shadowRoot: ShadowRoot, window: Window) {
  const tab = shadowRoot.getElementById("tab-COMMENTS");
  if (tab) {
    window.scrollTo({ top: tab.offsetTop });
  }
}

export default scrollToBeginning;
