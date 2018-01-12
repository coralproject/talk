import AuthorName from './containers/AuthorName';
import reducer from './reducer';
import translations from './translations.yml';

export default {
  reducer,
  slots: {
    commentAuthorName: [AuthorName],
  },
  translations,
};
