import React, {PropTypes} from 'react';
import {compose, gql} from 'react-apollo';
import UserDetail from '../components/UserDetail';
import withQuery from 'coral-framework/hocs/withQuery';
import {getSlotsFragments} from 'coral-framework/helpers/plugins';
import {getDefinitionName} from 'coral-framework/utils';
import Comment from './Comment';

const pluginFragments = getSlotsFragments([
  'userProfile',
]);

class UserDetailContainer extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    hideUserDetail: PropTypes.func.isRequired
  }

  render () {
    if (!('user' in this.props.root)) {
      return null;
    }

    return <UserDetail {...this.props}/>;
  }
}

export const withUserDetailQuery = withQuery(gql`
  query CoralAdmin_UserDetail($author_id: ID!) {
    user(id: $author_id) {
      id
      username
      created_at
      profiles {
        id
        provider
      }
      ${pluginFragments.spreads('user')}
    }
    totalComments: commentCount(query: {author_id: $author_id})
    rejectedComments: commentCount(query: {author_id: $author_id, statuses: [REJECTED]})
    comments: comments(query: {
      author_id: $author_id,
      statuses: [NONE, PREMOD, ACCEPTED, REJECTED]
    }) {
      ...${getDefinitionName(Comment.fragments.comment)}
    }
    ${pluginFragments.spreads('root')}
  }
  ${pluginFragments.definitions('user')}
  ${pluginFragments.definitions('root')}
`, {
  options: ({id}) => {
    return {
      variables: {author_id: id}
    };
  }
});

export default compose(
  withUserDetailQuery,
)(UserDetailContainer);
