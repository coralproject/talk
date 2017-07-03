import reducer from './reducer';
import isEnabled from './containers/ViewingOptionsStatus';
import ViewingOptions from './containers/ViewingOptions';

export default {
  reducer,
  slots: {
    streamBox: [ViewingOptions]
  },
  isEnabled
};
