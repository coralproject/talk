import Settings from './containers/Settings';
import translations from './translations.yml';
import graphql from './graphql';

export default {
  slots: {
    profileSettings: [Settings],
  },
  translations,
  ...graphql,
};
