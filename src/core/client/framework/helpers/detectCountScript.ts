function detectCountScript(window: Window) {
  // If CoralCount JSONP callback has been defined, then the
  // count script has already run.
  return (window as any).CoralCount !== undefined;
}

export default detectCountScript;
