import translations from './translations.yml';
import { t } from 'plugin-api/beta/client/services';
import { createSettingsToggle } from 'talk-plugin-notifications/client/api/factories';

const SettingsToggle = createSettingsToggle('onFeatured', () =>
  t('talk-plugin-notifications-category-featured.toggle_description')
);

export default {
  slots: {
    notificationSettings: [SettingsToggle],
  },
  translations,
};
