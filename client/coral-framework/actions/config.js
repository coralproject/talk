import {
  MERGE_CONFIG,
  ENABLE_PLUGINS_DEBUG,
  DISABLE_PLUGINS_DEBUG,
} from '../constants/config';

export const mergeConfig = config => ({
  type: MERGE_CONFIG,
  config,
});

export const enablePluginsDebug = () => ({
  type: ENABLE_PLUGINS_DEBUG,
});

export const disablePluginsDebug = () => ({
  type: DISABLE_PLUGINS_DEBUG,
});
