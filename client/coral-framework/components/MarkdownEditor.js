import { Spinner } from 'coral-ui';
import Loadable from 'react-loadable';

const MarkdownEditor = Loadable({
  loader: () =>
    import(/* webpackChunkName: "markdownEditor" */
    './loadable/MarkdownEditor'),
  loading: Spinner,
});

export default MarkdownEditor;
