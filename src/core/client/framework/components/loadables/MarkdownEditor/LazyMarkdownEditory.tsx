import React from "react";

export function loadMarkdownEditor() {
  return import("./MarkdownEditor" /* webpackChunkName: "markdownEditor" */);
}

export default React.lazy(loadMarkdownEditor);
