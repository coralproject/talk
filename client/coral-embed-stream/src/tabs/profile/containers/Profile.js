import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, gql } from 'react-apollo';
import { bindActionCreators } from 'redux';
import { withQuery } from 'coral-framework/hocs';
import NotLoggedIn from '../components/NotLoggedIn';
import { Spinner } from 'coral-ui';
import Profile from '../components/Profile';
import CommentHistory from './CommentHistory';
import { getDefinitionName } from 'coral-framework/utils';

import { showSignInDialog } from 'coral-embed-stream/src/actions/login';
import { getSlotFragmentSpreads } from 'coral-framework/utils';

class ProfileContainer extends Component {
  componentWillReceiveProps(nextProps) {
    if (!this.props.currentUser && nextProps.currentUser) {
      // Refetch after login.
      this.props.data.refetch();
    }
  }

  render() {
    const { currentUser, showSignInDialog, root, data } = this.props;
    const { me } = this.props.root;
    const loading = this.props.data.loading;

    if (this.props.data.error) {
      return <div>{this.props.data.error.message}</div>;
    }

    if (!currentUser) {
      return <NotLoggedIn showSignInDialog={showSignInDialog} />;
    }

    if (loading || !me) {
      return <Spinner />;
    }

    const localProfile = currentUser.profiles.find(p => p.provider === 'local');
    const emailAddress = localProfile && localProfile.id;

    return (
      <Profile
        username={me.username}
        emailAddress={emailAddress}
        data={data}
        root={root}
      />
    );
  }
}

ProfileContainer.propTypes = {
  data: PropTypes.object,
  root: PropTypes.object,
  currentUser: PropTypes.object,
  showSignInDialog: PropTypes.func,
};

const slots = ['profileSections'];

const withProfileQuery = withQuery(
  gql`
  query CoralEmbedStream_Profile {
    me {
      id
      username
    }
    ...${getDefinitionName(CommentHistory.fragments.root)}
    ${getSlotFragmentSpreads(slots, 'root')}
  }
  ${CommentHistory.fragments.root}
`,
  {
    options: {
      fetchPolicy: 'network-only',
    },
  }
);

const mapStateToProps = state => ({
  currentUser: state.auth.user,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ showSignInDialog }, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withProfileQuery
)(ProfileContainer);
