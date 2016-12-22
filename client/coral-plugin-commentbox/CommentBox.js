import React, {Component, PropTypes} from 'react';
import {I18n} from '../coral-framework';
import translations from './translations.json';
import {Button} from 'coral-ui';

const name = 'coral-plugin-commentbox';

class CommentBox extends Component {

  static propTypes = {
    postItem: PropTypes.func,
    updateItem: PropTypes.func,
    id: PropTypes.string,
    comments: PropTypes.array,
    reply: PropTypes.bool,
    canPost: PropTypes.bool,
    currentUser: PropTypes.object,
    csrfToken: PropTypes.string
  }

  state = {
    body: '',
    username: ''
  }

  postComment = () => {
    const {
      postItem,
      updateItem,
      id,
      parent_id,
      child_id,
      addNotification,
      appendItemArray,
      premod,
      author,
      csrfToken
    } = this.props;

    let comment = {
      body: this.state.body,
      asset_id: id,
      author_id: author.id
    };
    let related;
    let parent_type;
    if (parent_id) {
      comment.parent_id = parent_id;
      related = 'children';
      parent_type = 'comments';
    } else {
      related = 'comments';
      parent_type = 'assets';
    }
    if (child_id || parent_id) {
      updateItem(child_id || parent_id, 'showReply', false, 'comments');
    }

    if (this.props.charCount && this.state.body.length > this.props.charCount) {
      return;
    }
    postItem(comment, 'comments', csrfToken)
      .then((postedComment) => {
        const commentId = postedComment.id;
        if (postedComment.status === 'rejected') {
          addNotification('error', lang.t('comment-post-banned-word'));
        } else if (premod === 'pre') {
          addNotification('success', lang.t('comment-post-notif-premod'));
        } else {
          appendItemArray(parent_id || id, related, commentId, !parent_id, parent_type);
          addNotification('success', 'Your comment has been posted.');
        }
      })
    .catch((err) => console.error(err));
    this.setState({body: ''});
  }

  render () {
    const {styles, reply, author, charCount} = this.props;
    const length = this.state.body.length;
    return <div>
      <div
        className={`${name}-container`}>
          <label
            htmlFor={ reply ? 'replyText' : 'commentText'}
            className="screen-reader-text"
            aria-hidden={true}>
            {reply ? lang.t('reply') : lang.t('comment')}
          </label>
          <textarea
            className={`${name}-textarea`}
            style={styles && styles.textarea}
            value={this.state.body}
            placeholder={lang.t('comment')}
            id={reply ? 'replyText' : 'commentText'}
            onChange={(e) => this.setState({body: e.target.value})}
            rows={3}/>
        </div>
        <div className={`${name}-char-count ${length > charCount ? `${name}-char-max` : ''}`}>
          {
            charCount &&
            `${charCount - length} ${lang.t('characters-remaining')}`
          }
        </div>
        <div className={`${name}-button-container`}>
          { author && (
              <Button
                cStyle={!length || (charCount && length > charCount) ? 'lightGrey' : 'darkGrey'}
                className={`${name}-button`}
                onClick={this.postComment}>
                {lang.t('post')}
              </Button>
            )
          }
      </div>
    </div>;
  }
}

export default CommentBox;

const lang = new I18n(translations);
