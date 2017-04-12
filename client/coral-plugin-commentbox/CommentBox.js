import React, {Component, PropTypes} from 'react';
import {I18n} from '../coral-framework';
import translations from './translations.json';
import {Button} from 'coral-ui';
import {Slot} from 'coral-framework';

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
    username: '',
    hooks: {
      preSubmit: [],
      postSubmit: []
    }
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
      parent_id: parentId
    };

    if (this.props.charCount && this.state.body.length > this.props.charCount) {
      return;
    }
    !isReply && updateCountCache(assetId, countCache + 1);

    // Execute preSubmit Hooks
    this.state.hooks.preSubmit.forEach(hook => hook());

    postItem(comment, 'comments')
      .then(({data}) => {
        const postedComment = data.createComment.comment;

        // Execute postSubmit Hooks
        this.state.hooks.postSubmit.forEach(hook => hook(data));

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
    this.setState({body: ''});
  }

  registerHook = (hookType = '', hook = () => {}) => {
    if (typeof hook === 'function') {
      if (typeof hookType === 'string') {
        this.setState(state => ({
          hooks: {
            ...state.hooks,
            [hookType]: [
              ...state.hooks[hookType],
              hook
            ]
          }
        }));

        return {
          hookType,
          hook
        };

      } else {
        console.warn('hookTypes must be a string. Please check your hooks');
      }
    } else {
      console.warn(`Hooks must be functions. Please check your ${hookType} hooks`);
    }
  }

  unregisterHook = hookData => {
    const {hookType, hook} = hookData;

    this.setState(state => {
      let newHooks = state.hooks[newHooks];
      const idx = state.hooks[hookType].indexOf(hook);

      if (idx !== -1) {
        newHooks = [
          ...state.hooks[hookType].slice(0, idx),
          ...state.hooks[hookType].slice(idx + 1)
        ];
      }

      return {
        hooks: {
          ...state.hooks,
          [hookType]: newHooks
        }
      };

    });
  }

  render () {
    const {styles, isReply, authorId, charCount} = this.props;
    let {cancelButtonClicked} = this.props;
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

          <Slot
            fill="commentBoxDetail"
            registerHook={this.registerHook}
            unregisterHook={this.unregisterHook}
            inline
          />

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
                onClick={this.postComment}
                disabled={!length || (charCount && length > charCount) ? 'disabled' : ''}
              >
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
