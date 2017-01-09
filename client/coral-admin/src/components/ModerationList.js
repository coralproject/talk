import React, {PropTypes} from 'react';
import styles from './ModerationList.css';
import key from 'keymaster';
import Hammer from 'hammerjs';
import Comment from './Comment';
import UserAction from './UserAction';
import SuspendUserModal from './SuspendUserModal';

// Each action has different meaning and configuration
const menuOptionsMap = {
  'reject': {status: 'rejected', icon: 'close', key: 'r'},
  'approve': {status: 'accepted', icon: 'done', key: 't'},
  'flag': {status: 'flagged', icon: 'flag', filter: 'Untouched'},
  'ban': {status: 'banned', icon: 'not interested'}
};

// Renders a comment list and allow performing actions
export default class ModerationList extends React.Component {
  static propTypes = {
    isActive: PropTypes.bool,
    singleView: PropTypes.bool,
    commentIds: PropTypes.arrayOf(PropTypes.string),
    actionIds: PropTypes.arrayOf(PropTypes.string),
    comments: PropTypes.object,
    users: PropTypes.object.isRequired,
    actions: PropTypes.object,
    userStatusUpdate: PropTypes.func.isRequired,
    suspendUser: PropTypes.func.isRequired,

    // list of actions (flags, etc) associated with the comments
    modActions: PropTypes.arrayOf(PropTypes.string).isRequired,
    loading: PropTypes.bool,

    suspectWords: PropTypes.arrayOf(PropTypes.string).isRequired
  }

  state = {active: null, suspendUserModal: null, email: null};

  // remove key handlers before leaving
  componentWillUnmount () {
    this.unbindKeyHandlers();
  }

  // add key handlers and gestures
  componentDidMount () {
    this.bindKeyHandlers();

    // this.bindGestures() // need to check whether we're on a mobile device or this throws an Error
  }

  // If entering to singleview and no active, active is the first eleement
  componentWillReceiveProps (nextProps) {
    if (nextProps.singleView && !this.state.active) {
      this.setState({active: nextProps.commentIds[0]});
    }
  }

  // Add swipe to approve or reject
  bindGestures () {
    const {modActions} = this.props;
    this._hammer = new Hammer(this.base);
    this._hammer.get('swipe').set({direction: Hammer.DIRECTION_HORIZONTAL});

    if (modActions.indexOf('reject') !== -1) {
      this._hammer.on('swipeleft', () => this.props.singleView && this.actionKeyHandler('Rejected'));
    }
    if (modActions.indexOf('approve') !== -1) {
      this._hammer.on('swiperight', () => this.props.singleView && this.actionKeyHandler('Approved'));
    }
  }

  // Add key handlers. Each action has one and added j/k for moving around
  bindKeyHandlers () {
    const {modActions, isActive} = this.props;
    modActions.filter(action => menuOptionsMap[action].key).forEach(action => {
      key(menuOptionsMap[action].key, 'moderationList', () => isActive && this.actionKeyHandler(menuOptionsMap[action].status));
    });
    key('j', 'moderationList', () => isActive && this.moveKeyHandler('down'));
    key('k', 'moderationList', () => isActive && this.moveKeyHandler('up'));
    key.setScope('moderationList');
  }

  // Perform an action using the keys only if the comment is active
  actionKeyHandler (action) {
    if (this.props.isActive && this.state.active) {
      this.onClickAction(action, this.state.active);
    }
  }

  // move around with j/k
  moveKeyHandler (direction) {
    if (!this.props.isActive) {
      return;
    }

    const {commentIds} = this.props;
    const {active} = this.state;

    // check boundaries
    if (active === null || !commentIds.length) {
      this.setState({active: commentIds[0]});
    } else if (direction === 'up' && active !== commentIds[0]) {
      this.setState({active: commentIds[commentIds.indexOf(active) - 1]});
    } else if (direction === 'down' && active !== commentIds[commentIds.length - 1]) {
      this.setState({active: commentIds[commentIds.indexOf(active) + 1]});
    }

    // scroll to the position
    const index = Math.max(commentIds.indexOf(this.state.active), 0);
    this.base.childNodes[index] && this.base.childNodes[index].focus();
  }

  unbindKeyHandlers () {
    key.deleteScope('moderationList');
  }

  // If we are performing an action over a comment (aka removing from the list) we need to select a new active.
  // TODO: In the future this can be improved and look at the actual state to
  // resolve since the content of the list could change externally. For now it works as expected
  onClickAction = (menuOption, id, action) => {

    // activate the next comment
    if (id === this.state.active) {
      const moderationIds = this.getModerationIds();
      if (moderationIds[moderationIds.length - 1] === this.state.active) {
        this.setState({active: moderationIds[moderationIds.length - 2]});
      } else {
        this.setState({active: moderationIds[Math.min(moderationIds.indexOf(this.state.active) + 1, moderationIds.length - 1)]});
      }
    }

    // Update the status right away if this is a comment
    if (action.item_type === 'comments') {
      this.props.updateCommentStatus(menuOption, id);
    } else if (action.item_type === 'users') {

      // If a user bio or name is rejected, bring up a dialog before suspending them.
      if (menuOption === 'rejected') {
        this.setState({suspendUserModal: action});
      } else if (menuOption === 'accepted') {
        this.props.userStatusUpdate('active', action.item_id);
      }
    }
  }

  onClickShowBanDialog = (userId, userName, commentId) => {
    this.props.onClickShowBanDialog(userId, userName, commentId);
  }

  mapModItems = (itemId, index) => {

    const {comments = {}, users, actions = {}, modActions, suspectWords, hideActive} = this.props;
    const {active} = this.state;

    // Because ids are unique, the id will either appear as an action or as a comment.

    const item = comments[itemId] || actions[itemId];
    let modItem;

    if (item.body) {

      // If the item is a comment...
      const author = users[item.author_id];
      modItem = <Comment
        suspectWords={suspectWords}
        comment={item}
        author={author}
        key={index}
        index={index}
        onClickAction={this.onClickAction}
        onClickShowBanDialog={this.onClickShowBanDialog}
        modActions={modActions}
        menuOptionsMap={menuOptionsMap}
        isActive={itemId === active}
        hideActive={hideActive} />;
    } else {

      // If the item is an action...
      const user = users[item.item_id];
      modItem = <UserAction
        suspectWords={suspectWords}
        action={item}
        user={user}
        key={index}
        index={index}
        onClickAction={this.onClickAction}
        onClickShowBanDialog={this.onClickShowBanDialog}
        modActions={modActions}
        menuOptionsMap={menuOptionsMap}
        isActive={itemId === active}
        hideActive={hideActive} />;
    }
    return modItem;
  }

  getModerationIds = () => {
    const {commentIds = [], actionIds = [], comments, actions} = this.props;
    if (comments && actions) {
      return [ ...commentIds, ...actionIds ].sort((a, b) => {
        const itemA = comments[a] || actions[a];
        const itemB = comments[b] || actions[b];
        return itemB.updated_at - itemA.updated_at;
      });
    } else {
      return commentIds || actionIds;
    }
  }

  render () {
    const {singleView, key, suspendUser} = this.props;

    // Combine moderations and actions into a single stream and sort by most recently updated.
    const moderationIds = this.getModerationIds();

    return (
      <ul
        className={`${styles.list} ${singleView ? styles.singleView : ''}`} {...key}
        id='moderationList'>
        {moderationIds.map(this.mapModItems)}
        <SuspendUserModal
          action = {this.state.suspendUserModal}
          onClose={() => this.setState({suspendUserModal:null})}
          suspendUser={suspendUser} />
      </ul>
    );
  }
}
