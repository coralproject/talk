import React, {Component, PropTypes} from 'react';
import {I18n} from '../coral-framework';
import translations from './translations.json';
import {Button} from 'coral-ui';

const name = 'coral-plugin-commentbox';

class CommentBox extends Component {

  static propTypes = {

    // updateItem: PropTypes.func,
    // comments: PropTypes.array,
    commentPostedHandler: PropTypes.func,
    postItem: PropTypes.func.isRequired,
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

      // child_id,
      // updateItem,
      // appendItemArray,
      commentPostedHandler,
      postItem,
      assetId,
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

    // let related;
    // let parent_type;
    // if (parent_id) {
    //   comment.parent_id = parent_id;
    //   related = 'children';
    //   parent_type = 'comments';
    // } else {
    //   related = 'comments';
    //   parent_type = 'assets';
    // }
    // if (child_id || parent_id) {
    //   updateItem(child_id || parent_id, 'showReply', false, 'comments');
    // }

    if (this.props.charCount && this.state.body.length > this.props.charCount) {
      return;
    }
    postItem(comment, 'comments')
      .then(({data}) => {
        const postedComment = data.createComment;

        // const commentId = postedComment.id;
        if (postedComment.status === 'REJECTED') {
          addNotification('error', lang.t('comment-post-banned-word'));
        } else if (postedComment.status === 'PREMOD') {
          addNotification('success', lang.t('comment-post-notif-premod'));
        } else {

          // appendItemArray(parent_id || id, related, commentId, !parent_id, parent_type);
          addNotification('success', 'Your comment has been posted.');
        }

        if (commentPostedHandler) {
          commentPostedHandler();
        }
      })
    .catch((err) => console.error(err));
    this.setState({body: ''});
  }

  render () {
    const {styles, isReply, authorId, charCount} = this.props;
    const length = this.state.body.length;
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
          { authorId && (
              <Button
                cStyle={!length || (charCount && length > charCount) ? 'lightGrey' : 'darkGrey'}
                className={`${name}-button`}
                onClick={this.postComment}>
                {lang.t('POST')}
              </Button>
            )
          }
      </div>
    </div>;
  }
}

export default CommentBox;

const lang = new I18n(translations);
