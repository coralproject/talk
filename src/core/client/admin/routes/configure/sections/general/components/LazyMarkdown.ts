import React from "react";

export function loadMarkdownEditor() {
  return import("talk-framework/components/loadables/MarkdownEditor" /* webpackChunkName: "markdownEditor" */);
}

export default React.lazy(loadMarkdownEditor);
