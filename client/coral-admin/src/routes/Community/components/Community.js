import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Community.css';
import People from '../containers/People';
import CommunityMenu from '../containers/CommunityMenu';
import RejectUsernameDialog from '../containers/RejectUsernameDialog';
import FlaggedAccounts from '../containers/FlaggedAccounts';

class Community extends Component {
  renderTab() {
    const { route } = this.props;
    const activeTab = route.path === ':id' ? 'flagged' : route.path;

    if (activeTab === 'people') {
      return <People />;
    }

    return (
      <div>
        <FlaggedAccounts />
        <RejectUsernameDialog />
      </div>
    );
  }

  render() {
    return (
      <div className="talk-admin-community">
        <CommunityMenu />
        <div className={styles.container}>{this.renderTab()}</div>
      </div>
    );
  }
}

Community.propTypes = {
  route: PropTypes.object,
};

export default Community;
