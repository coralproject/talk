import ChangePassword from './containers/ChangePassword';
import AddEmailAddressDialog from './containers/AddEmailAddressDialog';
import Profile from './containers/Profile';
import translations from './translations.yml';
import graphql from './graphql';

export default {
  translations,
  slots: {
    profileHeader: [Profile],
    profileSettings: [ChangePassword],
    stream: [AddEmailAddressDialog],
  },
  ...graphql,
};
