import {gql} from 'react-apollo';
import Comment from '../components/Comment';
import {withFragments} from 'coral-framework/hocs';
import {getSlotsFragments} from 'coral-framework/helpers/plugins';

const pluginFragments = getSlotsFragments([
  'streamQuestionArea',
  'commentInputArea',
  'commentInputDetailArea',
  'commentInfoBar',
  'commentActions',
  'commentContent',
  'commentReactions',
  'commentAvatar'
]);

export default withFragments({
  root: gql`
    fragment CoralEmbedStream_Comment_root on RootQuery {
      __typename
      ${pluginFragments.spreads('root')}
    }
    ${pluginFragments.definitions('root')}
    `,
  asset: gql`
    fragment CoralEmbedStream_Comment_asset on Asset {
      __typename
      ${pluginFragments.spreads('asset')}
    }
    ${pluginFragments.definitions('asset')}
    `,
  comment: gql`
    fragment CoralEmbedStream_Comment_comment on Comment {
      id
      body
      created_at
      status
      replyCount
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
      ${pluginFragments.spreads('comment')}
    }
    ${pluginFragments.definitions('comment')}
  `
})(Comment);
