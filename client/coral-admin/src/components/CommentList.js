
import React from 'react';
import styles from './CommentList.css';
import key from 'keymaster';
import Hammer from 'hammerjs';
import Comment from 'components/Comment';

// Each action has different meaning and configuration
const actions = {
  'reject': {status: 'rejected', icon: 'close', key: 'r'},
  'approve': {status: 'accepted', icon: 'done', key: 't'},
  'flag': {status: 'flagged', icon: 'flag', filter: 'Untouched'},
  'ban': {status: 'ban'}
};

// Renders a comment list and allow performing actions
export default class CommentList extends React.Component {
  constructor (props) {
    super(props);

    this.state = {active: null};
    this.onClickAction = this.onClickAction.bind(this);
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
      this.setState({active: nextProps.commentIds.get(0)});
    }
  }

  // Add swipe to approve or reject
  bindGestures () {
    const {actions} = this.props;
    this._hammer = new Hammer(this.base);
    this._hammer.get('swipe').set({direction: Hammer.DIRECTION_HORIZONTAL});

    if (actions.indexOf('reject') !== -1) {
      this._hammer.on('swipeleft', () => this.props.singleView && this.actionKeyHandler('Rejected'));
    }
    if (actions.indexOf('approve') !== -1) {
      this._hammer.on('swiperight', () => this.props.singleView && this.actionKeyHandler('Approved'));
    }
  }

  // Add key handlers. Each action has one and added j/k for moving around
  bindKeyHandlers () {
    this.props.actions.filter(action => actions[action].key).forEach(action => {
      key(actions[action].key, 'commentList', () => this.props.isActive && this.actionKeyHandler(actions[action].status));
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
    if (active === null || !commentIds.size) {
      this.setState({active: commentIds.get(0)});
    } else if (direction === 'up' && active !== commentIds.first()) {
      this.setState({active: commentIds.get(commentIds.indexOf(active) - 1)});
    } else if (direction === 'down' && active !== commentIds.last()) {
      this.setState({active: commentIds.get(commentIds.indexOf(active) + 1)});
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
  onClickAction (action, id) {
    if (id === this.state.active) {
      const {commentIds} = this.props;
      if (commentIds.last() === this.state.active) {
        this.setState({active: commentIds.get(commentIds.size - 2)});
      } else {
        this.setState({active: commentIds.get(Math.min(commentIds.indexOf(this.state.active) + 1, commentIds.size - 1))});
      }
    }
    this.props.onClickAction(action, id);
  }

  render () {
    const {singleView, commentIds, comments, users, hideActive, key} = this.props;
    const {active} = this.state;

    return (
      <ul className={`${styles.list} ${singleView ? styles.singleView : ''}`} {...key}>
        {commentIds.map((commentId, index) => {
          const comment = comments.get(commentId);
          return <Comment comment={comment}
            author={users.get(comment.get('author_id'))}
            ref={el => { if (el && commentId === active) { this._active = el; } }}
            key={index}
            index={index}
            onClickAction={this.onClickAction}
            actions={this.props.actions}
            actionsMap={actions}
            isActive={commentId === active}
            hideActive={hideActive} />;
        }).toArray()}
      </ul>
    );
  }
}
