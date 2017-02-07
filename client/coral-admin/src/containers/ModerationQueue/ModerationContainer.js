import React from 'react';
import {connect} from 'react-redux';
import key from 'keymaster';

import {
  updateStatus,
  showBanUserDialog,
  hideBanUserDialog,
  fetchPremodQueue,
  fetchRejectedQueue,
  fetchFlaggedQueue,
  fetchModerationQueueComments,
} from 'actions/comments';

import {fetchSettings} from 'actions/settings';
import {userStatusUpdate, sendNotificationEmail} from 'actions/users';
import {setActiveTab, toggleModal, singleView} from 'actions/moderation';

import ModerationQueue from './ModerationQueue';

class ModerationContainer extends React.Component {
  componentWillMount() {
    const {toggleModal, singleView} = this.props;

    this.props.fetchModerationQueueComments();
    this.props.fetchSettings();

    key('s', () => singleView());
    key('shift+/', () => toggleModal(true));
    key('esc', () => toggleModal(false));
  }

  componentWillUnmount() {
    key.unbind('s');
    key.unbind('shift+/');
    key.unbind('esc');
  }

  onTabClick = (activeTab) => {
    const {setActiveTab} = this.props;
    setActiveTab(activeTab);

    if (activeTab === 'premod') {
      this.props.fetchPremodQueue();
    } else if (activeTab === 'rejected') {
      this.props.fetchRejectedQueue();
    } else if (activeTab === 'flagged') {
      this.props.fetchFlaggedQueue();
    } else {
      this.props.fetchModerationQueueComments();
    }
  }

  onClose = () => {
    const {toggleModal} = this.props;
    toggleModal(false);
  }

  render () {
    const {comments, actions, settings, moderation} = this.props;

    // Remove all this filters
    const premodIds = comments.ids.filter(id => comments.byId[id].status === 'PREMOD');
    const rejectedIds = comments.ids.filter(id => comments.byId[id].status === 'REJECTED');
    const flaggedIds = comments.ids.filter(id =>
        comments.byId[id].flagged === true &&
        comments.byId[id].status !== 'REJECTED' &&
        comments.byId[id].status !== 'ACCEPTED'
      );
    const userActionIds = actions.ids.filter(id => actions.byId[id].item_type === 'USERS');

    // show the Pre-Mod tab if premod is enabled globally OR there are pre-mod comments in the db.
    let enablePremodTab = (settings.settings && settings.settings.moderation === 'PRE') || premodIds.length;

    return (
      <ModerationQueue
        enablePremodTab={enablePremodTab}
        onTabClick={this.onTabClick}
        onClose={this.onClose}
        premodIds={premodIds}
        userActionIds={userActionIds}
        rejectedIds={rejectedIds}
        flaggedIds={flaggedIds}
        {...this.props}
        {...moderation}
      />
    );
  }
}

const mapStateToProps = state => ({
  moderation: state.moderation.toJS(),
  comments: state.comments.toJS(),
  settings: state.settings.toJS(),
  users: state.users.toJS(),
  actions: state.actions.toJS()
});

const mapDispatchToProps = dispatch => ({
  setActiveTab: tab => dispatch(setActiveTab(tab)),
  toggleModal: open => dispatch(toggleModal(open)),
  singleView: () => dispatch(singleView()),


  fetchSettings: () => dispatch(fetchSettings()),
  fetchModerationQueueComments: () => dispatch(fetchModerationQueueComments()),
  fetchPremodQueue: () => dispatch(fetchPremodQueue()),
  fetchRejectedQueue: () => dispatch(fetchRejectedQueue()),
  fetchFlaggedQueue: () => dispatch(fetchFlaggedQueue()),
  showBanUserDialog: (userId, userName, commentId) => dispatch(showBanUserDialog(userId, userName, commentId)),
  hideBanUserDialog: () => dispatch(hideBanUserDialog(false)),
  userStatusUpdate: (status, userId, commentId) => dispatch(userStatusUpdate(status, userId, commentId)).then(() => {
    dispatch(fetchModerationQueueComments());
  }),
  suspendUser: (userId, subject, text) => dispatch(userStatusUpdate('suspended', userId))
  .then(() => dispatch(sendNotificationEmail(userId, subject, text)))
  .then(() => dispatch(fetchModerationQueueComments()))
  ,
  updateStatus: (action, comment) => dispatch(updateStatus(action, comment))
});

export default connect(mapStateToProps, mapDispatchToProps)(ModerationContainer);
