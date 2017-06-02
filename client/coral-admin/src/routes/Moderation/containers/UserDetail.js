import React, {PropTypes} from 'react';
import {compose, gql} from 'react-apollo';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import UserDetail from '../components/UserDetail';
import withQuery from 'coral-framework/hocs/withQuery';
import {getSlotsFragments} from 'coral-framework/helpers/plugins';
import {getDefinitionName} from 'coral-framework/utils';
import {changeUserDetailStatuses} from 'coral-admin/src/actions/moderation';
import Comment from './Comment';

const commentConnectionFragment = gql`
  fragment CoralAdmin_Moderation_CommentConnection on CommentConnection {
    nodes {
      ...${getDefinitionName(Comment.fragments.comment)}
    }
    hasNextPage
    startCursor
    endCursor
  }
  ${Comment.fragments.comment}
`;

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

    return <UserDetail changeStatus={this.props.changeUserDetailStatuses} {...this.props}/>;
  }
}

export const withUserDetailQuery = withQuery(gql`
  query CoralAdmin_UserDetail($author_id: ID!, $statuses: [COMMENT_STATUS!]) {
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
      statuses: $statuses
    }) {
      ...CoralAdmin_Moderation_CommentConnection
    }
    ${pluginFragments.spreads('root')}
  }
  ${Comment.fragments.comment}
  ${pluginFragments.definitions('user')}
  ${pluginFragments.definitions('root')}
  ${commentConnectionFragment}
`, {
  options: ({id, moderation: {userDetailStatuses: statuses}}) => {
    return {
      variables: {author_id: id, statuses}
    };
  }
});

const mapStateToProps = (state) => ({
  moderation: state.moderation.toJS()
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({changeUserDetailStatuses}, dispatch)
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withUserDetailQuery,
)(UserDetailContainer);
