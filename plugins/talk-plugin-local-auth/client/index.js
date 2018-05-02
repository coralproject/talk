import ChangePassword from './containers/ChangePassword';
import AddEmailAddressDialog from './containers/AddEmailAddressDialog';
import Profile from './containers/Profile';
import translations from './translations.yml';
import reducer from './reducer';

export default {
  reducer,
  translations,
  slots: {
    profileHeader: [Profile],
    profileSettings: [ChangePassword],
    stream: [AddEmailAddressDialog],
  },
};
