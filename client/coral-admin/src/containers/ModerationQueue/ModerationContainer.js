import React, {Component} from 'react';
import key from 'keymaster';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import {Spinner} from 'coral-ui';
import {withRouter} from 'react-router';

import {modQueueQuery} from '../../graphql/queries';

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
import ModerationQueueHeader from './components/ModerationQueueHeader';

class ModerationContainer extends Component {

  componentWillMount() {
    const {toggleModal, singleView} = this.props;

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
  }

  onClose = () => {
    const {toggleModal} = this.props;
    toggleModal(false);
  }

  render () {
    const {data, moderation, settings} = this.props;

    if (data.loading) {
      return <div><Spinner/></div>;
    }

    return (
      <div>
        <ModerationQueueHeader onTabClick={this.onTabClick} {...moderation} />
        <ModerationQueue
          activeTab={moderation.activeTab}
          data={data}
          suspectWords={settings.wordlist.suspect}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  moderation: state.moderation.toJS(),
  settings: state.settings.toJS()
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

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
  modQueueQuery
)(ModerationContainer);
