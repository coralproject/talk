import {gql} from 'react-apollo';
import Comment from '../components/Comment';
import withFragments from 'coral-framework/hocs/withFragments';
import {getSlotsFragments} from 'coral-framework/helpers/plugins';

const pluginFragments = getSlotsFragments(['commentInfoBar', 'commentDetail']);

export default withFragments({
  root: gql`
    fragment Comment_root on RootQuery {
      __typename
      ${pluginFragments.root && pluginFragments.root.names}
    }
    ${pluginFragments.root && pluginFragments.root.definitions}
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
      ${pluginFragments.comment && pluginFragments.comment.names}
    }
    ${pluginFragments.comment && pluginFragments.comment.definitions}
  `,
})(Comment);
