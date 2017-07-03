import translations from './translations.json';
import FeaturedTag from './components/FeaturedTag';
import FeaturedButton from './components/FeaturedButton';
import FeaturedComments from './components/FeaturedComments';

export default {
  translations,
  slots: {
    commentInfoBar: [FeaturedTag],
    commentReactions: [FeaturedButton],
    stream: [FeaturedComments]
  }
};
