import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, gql } from 'react-apollo';
import { withQuery } from 'coral-framework/hocs';
import { Spinner } from 'coral-ui';
import Profile from '../components/Profile';
import TabPanel from './TabPanel';
import { getDefinitionName } from 'coral-framework/utils';

import { getSlotFragmentSpreads } from 'coral-framework/utils';

class ProfileContainer extends Component {
  render() {
    const { currentUser, root } = this.props;
    const { me } = this.props.root;
    const loading = this.props.data.loading;

    if (this.props.data.error) {
      return <div>{this.props.data.error.message}</div>;
    }

    if (loading || !me) {
      return <Spinner />;
    }

    const localProfile = currentUser.profiles.find(p => p.provider === 'local');
    const emailAddress = localProfile && localProfile.id;
    const slotPassthrough = { root };

    return (
      <Profile
        id={me.id}
        username={me.username}
        emailAddress={emailAddress}
        root={root}
        slotPassthrough={slotPassthrough}
      />
    );
  }
}

ProfileContainer.propTypes = {
  data: PropTypes.object,
  root: PropTypes.object,
  currentUser: PropTypes.object,
};

const slots = ['profileSections', 'profileSettings', 'profileHeader'];

const withProfileQuery = withQuery(
  gql`
  query CoralEmbedStream_Profile {
    me {
      id
      username
      state {
        status {
          username {
            history {
              created_at
            }
          }
        }
      }
    }
    ...${getDefinitionName(TabPanel.fragments.root)}
    ${getSlotFragmentSpreads(slots, 'root')}
  }
  ${TabPanel.fragments.root}
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

export default compose(
  connect(mapStateToProps),
  withProfileQuery
)(ProfileContainer);
