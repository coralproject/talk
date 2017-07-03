import translations from './translations.json';
import FeaturedTag from './components/FeaturedTag';
import FeaturedButton from './components/FeaturedButton';

export default {
  translations,
  slots: {
    commentInfoBar: [FeaturedTag],
    commentReactions: [FeaturedButton]
  }
};
