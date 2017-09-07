// import RejectCommentAction from './containers/RejectCommentAction';
import ModerationActions from './components/ModerationActions';
import translations from './translations.yml';
import update from 'immutability-helper';

export default {
  slots: {
    commentInfoBar: [ModerationActions],
  },
  translations
};
