import translations from './translations.yml';
import { t } from 'plugin-api/beta/client/services';
import { createSettingsToggle } from 'talk-plugin-notifications/client/api/factories';

const SettingsToggle = createSettingsToggle('onReply', () =>
  t('talk-plugin-notifications-category-reply.toggle_description')
);

export default {
  slots: {
    notificationSettings: [SettingsToggle],
  },
  translations,
};
