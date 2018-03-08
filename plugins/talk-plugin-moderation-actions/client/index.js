import ModerationActions from './containers/ModerationActions';
import BanUserDialog from './containers/BanUserDialog';
import translations from './translations.yml';
import reducer from './reducer';

export default {
  slots: {
    embed: [BanUserDialog],
    commentInfoBar: [ModerationActions],
  },
  reducer,
  translations,
};
