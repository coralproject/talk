import {gql} from 'react-apollo';
import Comment from '../components/Comment';
import {withFragments} from 'coral-framework/hocs';
import {getSlotFragmentSpreads} from 'coral-framework/utils';

const slots = [
  'streamQuestionArea',
  'commentInputArea',
  'commentInputDetailArea',
  'commentInfoBar',
  'commentActions',
  'commentContent',
  'commentReactions',
  'commentAvatar'
];

export default withFragments({
  root: gql`
    fragment CoralEmbedStream_Comment_root on RootQuery {
      __typename
      ${getSlotFragmentSpreads(slots, 'root')}
    }
    `,
  comment: gql`
    fragment CoralEmbedStream_Comment_comment on Comment {
      id
      body
      created_at
      status
      tags {
        tag {
          name
        }
      }
      user {
        id
        username
      }
      action_summaries {
        __typename
        count
        current_user {
          id
        }
      }
      editing {
        edited
        editableUntil
      }
      ${getSlotFragmentSpreads(slots, 'comment')}
    }
  `
})(Comment);
