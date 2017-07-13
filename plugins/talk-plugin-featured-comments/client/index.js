import Tab from './containers/Tab';
import TabPane from './containers/TabPane';
import FeaturedTag from './components/FeaturedTag';
import FeaturedButton from './components/FeaturedButton';
import translations from './translations.json';

export default {
  translations,
  slots: {
    streamTabs: [Tab],
    streamTabPanes: [TabPane],
    commentInfoBar: [FeaturedTag],
    commentReactions: [FeaturedButton]
  }
};
