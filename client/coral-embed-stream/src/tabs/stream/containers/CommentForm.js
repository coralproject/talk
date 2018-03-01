import { gql } from 'react-apollo';
import CommentForm from '../components/CommentForm';
import withFragments from 'coral-framework/hocs/withFragments';
import { getDefinitionName } from 'coral-framework/utils';
import DraftArea from './DraftArea';

export default withFragments({
  comment: gql`
  fragment TalkEmbedStream_CommentForm_comment on Comment {
    __typename
    ...${getDefinitionName(DraftArea.fragments.comment)}
  }

  ${DraftArea.fragments.comment}
`,
})(CommentForm);
