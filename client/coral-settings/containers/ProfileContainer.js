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
                $apply: (nodes) => insertCommentsSorted(nodes, comments.nodes, 'REVERSE_CHRONOLOGICAL'),
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
    const {auth, auth: {user}, asset, showSignInDialog, stopIgnoringUser} = this.props;
    const {me} = this.props.root;
    const loading = [1, 2, 4].indexOf(this.props.data.networkStatus) >= 0;

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
          ? <CommentHistory comments={me.comments} asset={asset} link={link} loadMore={this.loadMore}/>
          : <p>{t('user_no_comment')}</p>}
      </div>
    );
  }
}

const CommentFragment = gql`
  fragment TalkSettings_CommentConnectionFragment on CommentConnection {
    nodes {
      id
      body
      asset {
        id
        title
        url
      }
      created_at
    }
    endCursor
    hasNextPage
  }
`;

const LOAD_MORE_QUERY = gql`
  query TalkSettings_LoadMoreComments($limit: Int, $cursor: Date) {
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
  }
  ${CommentFragment}
`);

const mapStateToProps = (state) => ({
  asset: state.asset,
  auth: state.auth
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({showSignInDialog, checkLogin}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStopIgnoringUser,
  withProfileQuery
)(ProfileContainer);
