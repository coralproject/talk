import {connect} from 'react-redux';
import {compose, gql} from 'react-apollo';
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {withQuery} from 'coral-framework/hocs';

import {withStopIgnoringUser} from 'coral-framework/graphql/mutations';

import {link} from 'coral-framework/services/pym';
import NotLoggedIn from '../components/NotLoggedIn';
import IgnoredUsers from '../components/IgnoredUsers';
import {Spinner} from 'coral-ui';
import CommentHistory from 'talk-plugin-history/CommentHistory';

// TODO: Auth logic needs refactoring.
import {showSignInDialog, checkLogin} from 'coral-embed-stream/src/actions/auth';

import {insertCommentsSorted} from 'plugin-api/beta/client/utils';
import update from 'immutability-helper';
import {getSlotFragmentSpreads} from 'coral-framework/utils';

import t from 'coral-framework/services/i18n';

class ProfileContainer extends Component {
  componentWillReceiveProps(nextProps) {
    if (!this.props.auth.loggedIn && nextProps.auth.loggedIn) {

      // Refetch after login.
      this.props.data.refetch();
    }
  }

  loadMore = () => {
    return this.props.data.fetchMore({
      query: LOAD_MORE_QUERY,
      variables: {
        limit: 5,
        cursor: this.props.root.me.comments.endCursor,
      },
      updateQuery: (previous, {fetchMoreResult:{comments}}) => {
        const updated = update(previous, {
          me: {
            comments: {
              nodes: {
                $apply: (nodes) => insertCommentsSorted(nodes, comments.nodes, 'DESC'),
              },
              hasNextPage: {$set: comments.hasNextPage},
              endCursor: {$set: comments.endCursor},
            },
          }
        });
        return updated;
      },
    });
  };

  render() {
    const {auth, auth: {user}, showSignInDialog, stopIgnoringUser, root, data} = this.props;
    const {me} = this.props.root;
    const loading = this.props.data.loading;

    if (!auth.loggedIn) {
      return <NotLoggedIn showSignInDialog={showSignInDialog} />;
    }

    if (loading) {
      return <Spinner />;
    }

    const localProfile = user.profiles.find(
      (p) => p.provider === 'local'
    );
    const emailAddress = localProfile && localProfile.id;

    return (
      <div>
        <h2>{user.username}</h2>
        {emailAddress ? <p>{emailAddress}</p> : null}

        {me.ignoredUsers && me.ignoredUsers.length
          ? <div>
              <h3>{t('framework.ignored_users')}</h3>
              <IgnoredUsers
                users={me.ignoredUsers}
                stopIgnoring={stopIgnoringUser}
              />
            </div>
          : null}

        <hr />

        <h3>{t('framework.my_comments')}</h3>
        {me.comments.nodes.length
          ? <CommentHistory data={data} root={root} comments={me.comments} link={link} loadMore={this.loadMore}/>
          : <p>{t('user_no_comment')}</p>}
      </div>
    );
  }
}

// TODO: This Slot should be included in `talk-plugin-history` instead.
const slots = [
  'commentContent',
];

const CommentFragment = gql`
  fragment TalkSettings_CommentConnectionFragment on CommentConnection {
    nodes {
      id
      body
      asset {
        id
        title
        url
        ${getSlotFragmentSpreads(slots, 'asset')}
      }
      created_at
      ${getSlotFragmentSpreads(slots, 'comment')}
    }
    endCursor
    hasNextPage
  }
`;

const LOAD_MORE_QUERY = gql`
  query TalkSettings_LoadMoreComments($limit: Int, $cursor: Cursor) {
    comments(query: {limit: $limit, cursor: $cursor}) {
      ...TalkSettings_CommentConnectionFragment
    }
  }
  ${CommentFragment}
`;

const withProfileQuery = withQuery(
  gql`
  query CoralEmbedStream_Profile {
    me {
      id
      ignoredUsers {
        id,
        username,
      }
      comments(query: {limit: 10}) {
        ...TalkSettings_CommentConnectionFragment
      }
    }
    ${getSlotFragmentSpreads(slots, 'root')}
  }
  ${CommentFragment}
`);

const mapStateToProps = (state) => ({
  auth: state.auth
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({showSignInDialog, checkLogin}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStopIgnoringUser,
  withProfileQuery
)(ProfileContainer);
