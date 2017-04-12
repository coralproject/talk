import React, {Component, PropTypes} from 'react';
import {I18n} from '../coral-framework';
import translations from './translations.json';
import {Button} from 'coral-ui';
import {Slot} from 'coral-framework';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

const name = 'coral-plugin-commentbox';

class CommentBox extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      body: '',
      hooks: {
        preSubmit: [],
        postSubmit: []
      }
    };
  }

  updateComment = cb => this.setState(cb);

  postComment = () => {
    const {
      isReply,
      assetId,
      parentId,
      postItem,
      countCache,
      addNotification,
      updateCountCache,
      commentPostedHandler
    } = this.props;

    let comment = {
      asset_id: assetId,
      parent_id: parentId,
      body: this.state.body,
      ...this.props.commentBox
    };

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
    if (typeof hook !== 'function') {
      return console.warn(`Hooks must be functions. Please check your ${hookType} hooks`);
    } else if (typeof hookType === 'string') {
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
      return console.warn('hookTypes must be a string. Please check your hooks');
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

  handleChange = e => this.setState({body: e.target.value});

  render () {
    const {styles, isReply, authorId, charCount} = this.props;
    let {cancelButtonClicked} = this.props;

    const length = this.state.body.length;
    const enablePostComment = !length || (charCount && length > charCount);

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
            onChange={this.handleChange}
            rows={3}/>
        </div>
        <div className={`${name}-char-count ${length > charCount ? `${name}-char-max` : ''}`}>
          {charCount && `${charCount - length} ${lang.t('characters-remaining')}`}
        </div>
        <div className={`${name}-button-container`}>
          <Slot
            fill="commentBoxDetail"
            updateComment={this.updateComment}
            registerHook={this.registerHook}
            unregisterHook={this.unregisterHook}
            inline
          />
          {
            isReply && (
              <Button
                cStyle='darkGrey'
                className={`${name}-cancel-button`}
                onClick={() => cancelButtonClicked('')}>
                {lang.t('cancel')}
              </Button>
            )
          }
          { authorId && (
              <Button
                cStyle={enablePostComment ? 'lightGrey' : 'darkGrey'}
                className={`${name}-button`}
                onClick={this.postComment}
                disabled={enablePostComment ? 'disabled' : ''}>
                {lang.t('post')}
              </Button>
            )
          }
      </div>
    </div>;
  }
}

CommentBox.propTypes = {
  commentPostedHandler: PropTypes.func,
  postItem: PropTypes.func.isRequired,
  cancelButtonClicked: PropTypes.func,
  assetId: PropTypes.string.isRequired,
  parentId: PropTypes.string,
  authorId: PropTypes.string.isRequired,
  isReply: PropTypes.bool.isRequired,
  canPost: PropTypes.bool,
  currentUser: PropTypes.object
};

const mapStateToProps = ({commentBox}) => ({commentBox});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CommentBox);

const lang = new I18n(translations);
