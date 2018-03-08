import Toggle from './containers/Toggle';
import translations from './translations.yml';
import graphql from './graphql';

export default {
  slots: {
    notificationSettings: [Toggle],
  },
  translations,
  ...graphql,
};
