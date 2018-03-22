import { Spinner } from 'coral-ui';
import Loadable from 'react-loadable';

const QuestionBoxBuilder = Loadable({
  loader: () =>
    import(/* webpackChunkName: "questionBoxBuilder" */
    './loadable/QuestionBoxBuilder'),
  loading: Spinner,
});

export default QuestionBoxBuilder;
