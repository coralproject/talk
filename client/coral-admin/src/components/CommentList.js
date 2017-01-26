import React, {PropTypes} from 'react';
import styles from './CommentList.css';
import key from 'keymaster';
import Hammer from 'hammerjs';
import Comment from 'components/Comment';

// Each action has different meaning and configuration
const modActions = {
  'reject': {status: 'REJECTED', icon: 'close', key: 'r'},
  'approve': {status: 'ACCEPTED', icon: 'done', key: 't'},
  'flag': {status: 'FLAGGED', icon: 'flag', filter: 'Untouched'},
  'ban': {status: 'BANNED', icon: 'not interested'}
};

// Renders a comment list and allow performing actions
export default class CommentList extends React.Component {
  static propTypes = {
    isActive: PropTypes.bool,
    singleView: PropTypes.bool,
    commentIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    comments: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
    onClickAction: PropTypes.func,

    // list of actions (flags, etc) associated with the comments
    modActions: PropTypes.arrayOf(PropTypes.string).isRequired,
    loading: PropTypes.bool,

    suspectWords: PropTypes.arrayOf(PropTypes.string).isRequired
  }

  constructor (props) {
    super(props);

    this.state = {active: null};
    this.onClickAction = this.onClickAction.bind(this);
    this.onClickShowBanDialog = this.onClickShowBanDialog.bind(this);
  }

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
    this.props.modActions.filter(action => modActions[action].key).forEach(action => {
      key(modActions[action].key, 'commentList', () => this.props.isActive && this.actionKeyHandler(modActions[action].status));
    });
    key('j', 'commentList', () => this.props.isActive && this.moveKeyHandler('down'));
    key('k', 'commentList', () => this.props.isActive && this.moveKeyHandler('up'));
    key.setScope('commentList');
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
    key.deleteScope('commentList');
  }

  // If we are performing an action over a comment (aka removing from the list) we need to select a new active.
  // TODO: In the future this can be improved and look at the actual state to
  // resolve since the content of the list could change externally. For now it works as expected
  onClickAction (action, id, author_id) {

    // activate the next comment
    if (id === this.state.active) {
      const {commentIds} = this.props;
      if (commentIds[commentIds.length - 1] === this.state.active) {
        this.setState({active: commentIds[commentIds.length - 2]});
      } else {
        this.setState({active: commentIds[Math.min(commentIds.indexOf(this.state.active) + 1, commentIds.length - 1)]});
      }
    }
    this.props.onClickAction(action, id, author_id);
  }

  onClickShowBanDialog(userId, userName, commentId) {
    this.props.onClickShowBanDialog(userId, userName, commentId);
  }

  render () {
    const {singleView, commentIds, comments, users, hideActive, key, suspectWords} = this.props;
    const {active} = this.state;

    return (
      <ul
        className={`${styles.list} ${singleView ? styles.singleView : ''}`} {...key}
        id='commentList'
      >
        {commentIds.map((commentId, index) => {
          const comment = comments[commentId];
          const author = users[comment.author_id];
          return <Comment
            suspectWords={suspectWords}
            comment={comment}
            author={author}
            key={index}
            index={index}
            onClickAction={this.onClickAction}
            onClickShowBanDialog={this.onClickShowBanDialog}
            modActions={this.props.modActions}
            actionsMap={modActions}
            isActive={commentId === active}
            hideActive={hideActive} />;
        })}
      </ul>
    );
  }
}
