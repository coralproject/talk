import React from 'react';
import {connect} from 'react-redux';
import key from 'keymaster';

import ModerationKeysModal from 'components/ModerationKeysModal';
import CommentList from 'components/CommentList';
import BanUserDialog from 'components/BanUserDialog';

import {updateStatus, showBanUserDialog, hideBanUserDialog} from 'actions/comments';
import {banUser} from 'actions/users';
import styles from './ModerationQueue.css';

import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../../translations.json';

/*
 * Renders the moderation queue as a tabbed layout with 3 moderation
 * queues :
 * * pending: filtered by status Untouched
 * * rejected: filtered by status Rejected
 * * flagged: with a flagged action on them
 */

class ModerationQueue extends React.Component {

  constructor (props) {
    super(props);

    this.state = {activeTab: 'pending', singleView: false, modalOpen: false};
  }

  // Fetch comments and bind singleView key before render
  componentWillMount () {
    this.props.dispatch({type: 'COMMENTS_MODERATION_QUEUE_FETCH'});
    key('s', () => this.setState({singleView: !this.state.singleView}));
    key('shift+/', () => this.setState({modalOpen: true}));
    key('esc', () => this.setState({modalOpen: false}));
  }

  // Unbind singleView key before unmount
  componentWillUnmount () {
    key.unbind('s');
    key.unbind('shift+/');
    key.unbind('esc');
  }

  // Hack for dynamic mdl tabs
  componentDidMount () {
    if (typeof componentHandler !== 'undefined') {
      // FIXME: fix this hack
      componentHandler.upgradeAllRegistered(); // eslint-disable-line no-undef
    }
  }

  // Dispatch the update status action
  onCommentAction (action, id) {
    // If not banning then change the status to approved or flagged as action = status
    this.props.dispatch(updateStatus(action, id));
  }

  showBanUserDialog (userId, userName, commentId) {
    this.props.dispatch(showBanUserDialog(userId, userName, commentId));
  }

  hideBanUserDialog () {
    this.props.dispatch(hideBanUserDialog(false));
  }

  banUser (userId, commentId) {
    this.props.dispatch(banUser('banned', userId, commentId));
  }

  onTabClick (activeTab) {
    this.setState({activeTab});
  }

  // Render the tabbed lists moderation queues
  render () {
    const {comments, users} = this.props;
    const {activeTab, singleView, modalOpen} = this.state;

    const premodIds = comments.ids.filter(id => comments.byId[id].status === 'premod');
    const rejectedIds = comments.ids.filter(id => comments.byId[id].status === 'rejected');
    const flaggedIds = comments.ids.filter(id => comments.byId[id].flagged === true);

    return (
      <div>
        <div className='mdl-tabs mdl-js-tabs mdl-js-ripple-effect'>
          <div className={`mdl-tabs__tab-bar ${styles.tabBar}`}>
            <a href='#pending' onClick={() => this.onTabClick('pending')}
              className={`mdl-tabs__tab ${styles.tab}`}>{lang.t('modqueue.pending')}</a>
            <a href='#rejected' onClick={() => this.onTabClick('rejected')}
              className={`mdl-tabs__tab ${styles.tab}`}>{lang.t('modqueue.rejected')}</a>
            <a href='#flagged' onClick={() => this.onTabClick('flagged')}
              className={`mdl-tabs__tab ${styles.tab}`}>{lang.t('modqueue.flagged')}</a>
          </div>
          <div className={`mdl-tabs__panel is-active ${styles.listContainer}`} id='pending'>
            <CommentList
              isActive={activeTab === 'pending'}
              singleView={singleView}
              commentIds={premodIds}
              comments={comments.byId}
              users={users.byId}
              onClickAction={(action, commentId) => this.onCommentAction(action, commentId)}
              onClickShowBanDialog={(userId, userName, commentId) => this.showBanUserDialog(userId, userName, commentId)}
              actions={['reject', 'approve', 'ban']}
              loading={comments.loading} />
            <BanUserDialog
              open={comments.showBanUserDialog}
              handleClose={() => this.hideBanUserDialog()}
              onClickBanUser={(userId, commentId) => this.banUser(userId, commentId)}
              user={comments.banUser}/>
        </div>
          <div className={`mdl-tabs__panel ${styles.listContainer}`} id='rejected'>
            <CommentList
              isActive={activeTab === 'rejected'}
              singleView={singleView}
              commentIds={rejectedIds}
              comments={comments.byId}
              users={users.byId}
              onClickAction={(action, id) => this.onCommentAction(action, id)}
              actions={['approve']}
              loading={comments.loading} />
          </div>
          <div className={`mdl-tabs__panel ${styles.listContainer}`} id='flagged'>
            <CommentList
              isActive={activeTab === 'rejected'}
              singleView={singleView}
              commentIds={flaggedIds}
              comments={comments.byId}
              users={users.byId}
              onClickAction={(action, id) => this.onCommentAction(action, id)}
              actions={['reject', 'approve']}
              loading={comments.loading} />
          </div>
          <ModerationKeysModal open={modalOpen}
            onClose={() => this.setState({modalOpen: false})} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  comments: state.comments.toJS(),
  users: state.users.toJS()
});

export default connect(mapStateToProps)(ModerationQueue);

const lang = new I18n(translations);
