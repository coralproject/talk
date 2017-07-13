import translations from './translations.json';
import FeaturedTag from './components/FeaturedTag';
import FeaturedButton from './components/FeaturedButton';
import Tab from './containers/Tab';
import TabPane from './containers/TabPane';

export default {
  translations,
  slots: {
    commentInfoBar: [FeaturedTag],
    commentReactions: [FeaturedButton],
    streamTabs: [Tab],
    streamTabPanes: [TabPane]
  }
};
