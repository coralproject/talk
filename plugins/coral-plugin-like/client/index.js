import LikeButton from './containers/LikeButton';

import translations from './translations.json';
import {loadTranslations} from '/coral-framework/services/i18n';

Promise.all([loadTranslations(translations)]);

export default {
  slots: {
    commentReactions: [LikeButton]
  }
};
