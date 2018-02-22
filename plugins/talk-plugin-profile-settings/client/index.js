import Tab from './components/Tab';
import TabPane from './containers/TabPane';
import translations from './translations.yml';

export default {
  slots: {
    profileTabs: [Tab],
    profileTabPanes: [TabPane],
  },
  translations,
};
