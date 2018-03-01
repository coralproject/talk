import { gql } from 'react-apollo';
import EditableCommentContent from '../components/EditableCommentContent';
import withFragments from 'coral-framework/hocs/withFragments';
import { getDefinitionName } from 'coral-framework/utils';
import CommentForm from './CommentForm';

export default withFragments({
  comment: gql`
  fragment TalkEmbedStream_EditableCommentContent_comment on Comment {
    __typename
    ...${getDefinitionName(CommentForm.fragments.comment)}
  }

  ${CommentForm.fragments.comment}
`,
})(EditableCommentContent);
