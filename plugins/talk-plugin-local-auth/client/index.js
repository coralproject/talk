import ChangePassword from './containers/ChangePassword';
import Profile from './containers/Profile';

export default {
  slots: {
    profileHeader: [Profile],
    profileSettings: [ChangePassword],
  },
};
