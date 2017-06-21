import {gql} from 'react-apollo';
import Comment from '../components/Comment';
import {getSlotsFragments} from 'coral-framework/helpers/plugins';
import withFragments from 'coral-framework/hocs/withFragments';

const pluginFragments = getSlotsFragments([
  'adminCommentInfoBar',
  'adminCommentContent',
  'adminSideActions',
  'adminCommentDetailArea',
]);

export default withFragments({
  root: gql`
    fragment CoralAdmin_ModerationComment_root on RootQuery {
      __typename
      ${pluginFragments.spreads('root')}
    }
    ${pluginFragments.definitions('root')}
    `,
  comment: gql`
    fragment CoralAdmin_ModerationComment_comment on Comment {
      id
      body
      created_at
      status
      user {
        id
        username
        status
      }
      asset {
        id
        title
        url
      }
      action_summaries {
        count
        ... on FlagActionSummary {
          reason
        }
      }
      actions {
        ... on FlagAction {
          reason
          message
          user {
            username
          }
        }
      }
      editing {
        edited
      }
      ${pluginFragments.spreads('comment')}
    }
    ${pluginFragments.definitions('comment')}
  `
})(Comment);
