import React from 'react';
import {connect} from 'react-redux';
import key from 'keymaster';

import {
  updateStatus,
  showBanUserDialog,
  hideBanUserDialog,
  fetchModerationQueueComments
} from 'actions/comments';
import {userStatusUpdate, sendNotificationEmail} from 'actions/users';
import {fetchSettings} from 'actions/settings';

import ModerationQueue from './ModerationQueue';

class ModerationContainer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      activeTab: 'pending',
      singleView: false,
      modalOpen: false
    };

    this.onClose = this.onClose.bind(this);
    this.onTabClick = this.onTabClick.bind(this);
  }

  componentWillMount() {
    this.props.fetchModerationQueueComments();
    this.props.fetchSettings();
    key('s', () => this.setState({singleView: !this.state.singleView}));
    key('shift+/', () => this.setState({modalOpen: true}));
    key('esc', () => this.setState({modalOpen: false}));
  }

  componentWillUnmount() {
    key.unbind('s');
    key.unbind('shift+/');
    key.unbind('esc');
  }

  componentDidMount() {

    // Hack for dynamic mdl tabs
    if (typeof componentHandler !== 'undefined') {

      // FIXME: fix this hack
      componentHandler.upgradeAllRegistered(); // eslint-disable-line no-undef
    }
  }

  onTabClick(activeTab) {
    this.setState({activeTab});
  }

  onClose() {
    this.setState({modalOpen: false});
  }

  render () {
    const {comments, actions} = this.props;

    const premodIds = comments.ids.filter(id => comments.byId[id].status === 'premod');
    const rejectedIds = comments.ids.filter(id => comments.byId[id].status === 'rejected');
    const flaggedIds = comments.ids.filter(id => comments.byId[id].flagged === true);
    const userActionIds = actions.ids.filter(id => actions.byId[id].item_type === 'user');

    return (
      <ModerationQueue
        onTabClick={this.onTabClick}
        onClose={this.onClose}
        premodIds={premodIds}
        userActionIds={userActionIds}
        rejectedIds={rejectedIds}
        flaggedIds={flaggedIds}
        {...this.props}
        {...this.state}
      />
    );
  }
}

const mapStateToProps = state => ({
  comments: state.comments.toJS(),
  settings: state.settings.toJS(),
  users: state.users.toJS(),
  actions: state.actions.toJS(),
});

const mapDispatchToProps = dispatch => {
  return {
    fetchSettings: () => dispatch(fetchSettings()),
    fetchModerationQueueComments: () => dispatch(fetchModerationQueueComments()),
    showBanUserDialog: (userId, userName, commentId) => dispatch(showBanUserDialog(userId, userName, commentId)),
    hideBanUserDialog: () => dispatch(hideBanUserDialog(false)),
    banUser: (userId, commentId) => dispatch(userStatusUpdate('banned', userId, commentId)).then(() => {
      dispatch(fetchModerationQueueComments());
    }),
    userStatusUpdate: (status, userId, commentId) => dispatch(userStatusUpdate(status, userId, commentId)),
    suspendUser: (userId, subject, text) => dispatch(userStatusUpdate('suspended', userId))
    .then(() => dispatch(sendNotificationEmail(userId, subject, text)))
    .then(() => dispatch(fetchModerationQueueComments()))
    ,
    updateStatus: (action, comment) => dispatch(updateStatus(action, comment))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModerationContainer);
