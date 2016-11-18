import React from 'react';
import {connect} from 'react-redux';
import ModerationKeysModal from 'components/ModerationKeysModal';
import CommentList from 'components/CommentList';
import {updateStatus} from 'actions/comments';
import styles from './ModerationQueue.css';
import key from 'keymaster';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations.json';

/*
 * Renders the moderation queue as a tabbed layout with 3 moderation
 * queues filtered by status (Untouched, Rejected and Approved)
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
  onCommentAction (status, id) {
    this.props.dispatch(updateStatus(status, id));
  }

  onTabClick (activeTab) {
    this.setState({activeTab});
  }

  // Render the tabbed lists moderation queues
  render () {
    const {comments} = this.props;
    const {activeTab, singleView, modalOpen} = this.state;

    return (
      <div>
        <div className='mdl-tabs mdl-js-tabs mdl-js-ripple-effect'>
          <div className='mdl-tabs__tab-bar'>
            <a href='#pending' onClick={() => this.onTabClick('pending')}
              className={`mdl-tabs__tab is-active ${styles.tab}`}>{lang.t('modqueue.pending')}</a>
            <a href='#rejected' onClick={() => this.onTabClick('rejected')}
              className={`mdl-tabs__tab ${styles.tab}`}>{lang.t('modqueue.rejected')}</a>
            <a href='#flagged' onClick={() => this.onTabClick('flagged')}
              className={`mdl-tabs__tab ${styles.tab}`}>{lang.t('modqueue.flagged')}</a>
          </div>
          <div className={`mdl-tabs__panel is-active ${styles.listContainer}`} id='pending'>
            <CommentList
              isActive={activeTab === 'pending'}
              singleView={singleView}
              commentIds={
                comments.get('ids')
                  .filter(id => !comments.get('byId')
                  .get(id)
                  .get('status'))
              }
              comments={comments.get('byId')}
              onClickAction={(action, id) => this.onCommentAction(action, id)}
              actions={['reject', 'approve']}
              loading={comments.loading} />
          </div>
          <div className={`mdl-tabs__panel ${styles.listContainer}`} id='rejected'>
            <CommentList
              isActive={activeTab === 'rejected'}
              singleView={singleView}
              commentIds={
                comments
                  .get('ids')
                  .filter(id =>
                    comments
                      .get('byId')
                      .get(id)
                      .get('status') === 'rejected')
              }
              comments={comments.get('byId')}
              onClickAction={(action, id) => this.onCommentAction(action, id)}
              actions={['approve']}
              loading={comments.loading} />
          </div>
          <div className={`mdl-tabs__panel ${styles.listContainer}`} id='flagged'>
            <CommentList
              isActive={activeTab === 'rejected'}
              singleView={singleView}
              commentIds={comments.get('ids').filter(id => {
                const data = comments.get('byId').get(id);
                return !data.get('status') && data.get('flagged') === true;
              })}
              comments={comments.get('byId')}
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

export default connect(({comments}) => ({comments}))(ModerationQueue);

const lang = new I18n(translations);
