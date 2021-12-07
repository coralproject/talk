function scrollToBeginning(window: Window) {
  const tab = window.document.getElementById("tab-COMMENTS");
  if (tab) {
    window.scrollTo({ top: tab.offsetTop });
  }
}

export default scrollToBeginning;
