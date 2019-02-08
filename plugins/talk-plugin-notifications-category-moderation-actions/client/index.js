import translations from './translations.yml';
import { t } from 'plugin-api/beta/client/services';
import { createSettingsToggle } from 'talk-plugin-notifications/client/api/factories';

const SettingsToggle = createSettingsToggle('onModeration', () =>
  t('talk-plugin-notifications-category-moderation-actions.toggle_description')
);

export default {
  slots: {
    notificationSettings: [SettingsToggle],
  },
  translations,
};
