import React, { Component, PropTypes } from 'react';
import { I18n } from '../coral-framework';
import translations from './translations.json';
import { Button } from 'coral-ui';

const name = 'coral-plugin-commentbox';

class CommentBox extends Component {

  static propTypes = {
    commentPostedHandler: PropTypes.func,
    postItem: PropTypes.func.isRequired,
    cancelButtonClicked: PropTypes.func,
    assetId: PropTypes.string.isRequired,
    parentId: PropTypes.string,
    authorId: PropTypes.string.isRequired,
    isReply: PropTypes.bool.isRequired,
    canPost: PropTypes.bool,
    currentUser: PropTypes.object
  }

  state = {
    body: '',
    username: ''
  }

  postComment = () => {
    const {
      commentPostedHandler,
      postItem,
      assetId,
      updateCountCache,
      isReply,
      countCache,
      parentId,
      addNotification,
      authorId
    } = this.props;

    let comment = {
      body: this.state.body,
      asset_id: assetId,
      author_id: authorId,
      parent_id: parentId
    };

    if (this.props.charCount && this.state.body.length > this.props.charCount) {
      return;
    }
    !isReply && updateCountCache(assetId, countCache + 1);
    postItem(comment, 'comments')
      .then(({ data }) => {
        const postedComment = data.createComment.comment;

        if (postedComment.status === 'REJECTED') {
          addNotification('error', lang.t('comment-post-banned-word'));
          !isReply && updateCountCache(assetId, countCache);
        } else if (postedComment.status === 'PREMOD') {
          addNotification('success', lang.t('comment-post-notif-premod'));
          !isReply && updateCountCache(assetId, countCache);
        }

        if (commentPostedHandler) {
          commentPostedHandler();
        }
      })
    .catch((err) => console.error(err));
    this.setState({ body: '' });
  }

  render () {
    const { styles, isReply, authorId, charCount } = this.props;
    let { cancelButtonClicked } = this.props;
    const length = this.state.body.length;

    if (isReply && typeof cancelButtonClicked !== 'function') {
      console.warn('the CommentBox component should have a cancelButtonClicked callback defined if it lives in a Reply');
      cancelButtonClicked = () => {};
    }

    return <div>
      <div
        className={`${name}-container`}>
          <label
            htmlFor={ isReply ? 'replyText' : 'commentText'}
            className="screen-reader-text"
            aria-hidden={true}>
            {isReply ? lang.t('reply') : lang.t('comment')}
          </label>
          <textarea
            className={`${name}-textarea`}
            style={styles && styles.textarea}
            value={this.state.body}
            placeholder={lang.t('comment')}
            id={isReply ? 'replyText' : 'commentText'}
            onChange={(e) => this.setState({ body: e.target.value })}
            rows={3}/>
        </div>
        <div className={`${name}-char-count ${length > charCount ? `${name}-char-max` : ''}`}>
          {
            charCount &&
            `${charCount - length} ${lang.t('characters-remaining')}`
          }
        </div>
        <div className={`${name}-button-container`}>
          {
            isReply && (
              <Button
                cStyle='darkGrey'
                className={`${name}-cancel-button`}
                onClick={() => {
                  cancelButtonClicked('');
                }}>
                {lang.t('cancel')}
              </Button>
            )
          }
          { authorId && (
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
