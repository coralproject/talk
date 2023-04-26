function detectCommentEmbedScript(window: Window) {
  // If CoralCommentEmbed JSONP callback has been defined, then the
  // count script has already run.
  return (window as any).CoralCommentEmbed !== undefined;
}

export default detectCommentEmbedScript;
