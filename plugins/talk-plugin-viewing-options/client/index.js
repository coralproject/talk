import ViewingOptions from './containers/ViewingOptions';
import reducer from './reducer';

export default {
  reducer,
  slots: {
    streamFilter: [ViewingOptions]
  }
};
