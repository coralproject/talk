import React from 'react';
import Toggle from '../components/Toggle';
import withSettingsToggle from '../hocs/withSettingsToggle';

/**
 * createSettingsToggle will add a boolean setting with the
 * name `settingsName` to notification settings and return
 * a full Toggle Component.
 *
 * You must provide a `label` either as a string or as a callback.
 * E.g. to provide translations you could do:
 *
 * `const SettingsToggle = createSettingsToggle('onReply', () => t('translate'));`
 */
const createSettingsToggle = (settingsName, label) => {
  const SettingsToggle = props => (
    <Toggle {...props}>{typeof label === 'function' ? label() : label}</Toggle>
  );
  return withSettingsToggle(settingsName)(SettingsToggle);
};

export default createSettingsToggle;
