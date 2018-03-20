import {
  MERGE_CONFIG,
  ENABLE_PLUGINS_DEBUG,
  DISABLE_PLUGINS_DEBUG,
} from '../constants/config';

export const mergeConfig = config => ({
  type: MERGE_CONFIG,
  config,
});

export const enablePlugins = () => ({
  type: ENABLE_PLUGINS_DEBUG,
});

export const disablePlugins = () => ({
  type: DISABLE_PLUGINS_DEBUG,
});
