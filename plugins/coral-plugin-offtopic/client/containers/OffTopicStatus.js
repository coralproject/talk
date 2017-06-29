import {PLUGIN_NAME, DEFAULT_CONFIG} from '../constants';

export default function isEnabled(props = {}) {
  let pluginConfig = {...DEFAULT_CONFIG, ...(props.config && props.config[`${PLUGIN_NAME}`])};
  return pluginConfig.enabled;
}
