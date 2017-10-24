import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styles from './Community.css';
import People from '../containers/People';
import CommunityMenu from './CommunityMenu';
import RejectUsernameDialog from './RejectUsernameDialog';
import FlaggedAccounts from '../containers/FlaggedAccounts';

class Community extends Component {
  renderTab() {
    const {route, community, ...props} = this.props; 
    const activeTab = route.path === ':id' ? 'flagged' : route.path;

    if (activeTab === 'people') {
      return <People community={community} />;
    }

    return (
      <div>
        <FlaggedAccounts
          data={this.props.data}
          root={this.props.root}
        />
        <RejectUsernameDialog
          user={community.user}
          open={community.rejectUsernameDialog}
          rejectUsername={props.rejectUsername}
          handleClose={props.hideRejectUsernameDialog}
        />
      </div>
    );
  }

  render() {
    const {root: {flaggedUsernamesCount}} = this.props;

    return (
      <div className="talk-admin-community">
        <CommunityMenu flaggedUsernamesCount={flaggedUsernamesCount} />
        <div className={styles.container}>
          {this.renderTab()}
        </div>
      </div>
    );
  }
}

Community.propTypes = {
  route: PropTypes.object,
  community: PropTypes.object,
  rejectUsername: PropTypes.func.isRequired,
  hideRejectUsernameDialog: PropTypes.func.isRequired,
  data: PropTypes.object,
  root: PropTypes.object,
};

export default Community;
