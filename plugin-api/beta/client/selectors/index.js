// @Deprecated plugin_config
export const pluginsConfigSelector = state =>
  state.config.plugins_config || state.config.plugin_config;
