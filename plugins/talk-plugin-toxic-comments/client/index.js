import translations from './translations.yml';
import ToxicCommentAlert from './components/ToxicCommentAlert';

/**
 * coral-plugin-offtopic depends on coral-plugin-viewing-options
 * in other to display filter and use the streamViewingOptions slot
 */

export default {
  translations,
  slots: {
    commentInputDetailArea: [ToxicCommentAlert],
  }
};
