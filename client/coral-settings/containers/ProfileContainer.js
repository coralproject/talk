import {connect} from 'react-redux';
import {compose, graphql, gql} from 'react-apollo';
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';

import {withStopIgnoringUser} from 'coral-framework/graphql/mutations';

import {link} from 'coral-framework/services/PymConnection';
import NotLoggedIn from '../components/NotLoggedIn';
import IgnoredUsers from '../components/IgnoredUsers';
import {Spinner} from 'coral-ui';
import CommentHistory from 'coral-plugin-history/CommentHistory';
import {showSignInDialog, checkLogin} from 'coral-framework/actions/auth';

import t from 'coral-framework/services/i18n';

class ProfileContainer extends Component {
  constructor() {
    super();

    this.state = {
      activeTab: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.auth.loggedIn && nextProps.auth.loggedIn) {

      // Refetch after login.
      this.props.data.refetch();
    }
  }

  handleTabChange = (tab) => {
    this.setState({
      activeTab: tab
    });
  };

  render() {
    const {auth, asset, data, showSignInDialog, stopIgnoringUser} = this.props;
    const {me} = this.props.data;

    if (!auth.loggedIn) {
      return <NotLoggedIn showSignInDialog={showSignInDialog} />;
    }

    if (!me || data.loading) {
      return <Spinner />;
    }

    const localProfile = this.props.user.profiles.find(
      (p) => p.provider === 'local'
    );
    const emailAddress = localProfile && localProfile.id;

    return (
      <div>
        <h2>{this.props.user.username}</h2>
        {emailAddress ? <p>{emailAddress}</p> : null}

        {me.ignoredUsers && me.ignoredUsers.length
          ? <div>
              <h3>Ignored users</h3>
              <IgnoredUsers
                users={me.ignoredUsers}
                stopIgnoring={stopIgnoringUser}
              />
            </div>
          : null}

        <hr />

        <h3>My comments</h3>
        {me.comments.length
          ? <CommentHistory comments={me.comments} asset={asset} link={link} />
          : <p>{t('user_no_comment')}</p>}
      </div>
    );
  }
}

const withQuery = graphql(
  gql`
  query EmbedStreamProfileQuery {
    me {
      id
      ignoredUsers {
        id,
        username,
      }
      comments {
        id
        body
        asset {
          id
          title
          url
        }
        created_at
      }
    }
  }`
);

const mapStateToProps = (state) => ({
  user: state.user.toJS(),
  asset: state.asset.toJS(),
  auth: state.auth.toJS()
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({showSignInDialog, checkLogin}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStopIgnoringUser,
  withQuery
)(ProfileContainer);
