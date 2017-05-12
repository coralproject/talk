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
  'commentReactions'
]);

export default withFragments({
  root: gql`
    fragment Comment_root on RootQuery {
      __typename
      ${pluginFragments.spreads('root')}
    }
    ${pluginFragments.definitions('root')}
    `,
  comment: gql`
    fragment Comment_comment on Comment {
      id
      body
      created_at
      status
      tags {
        name
      }
      user {
        id
        name: username
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
