import React, {PropTypes} from 'react';
import {CommentForm} from 'coral-plugin-commentbox/CommentBox';

import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-framework/translations';
const lang = new I18n(translations);

const getEditableUntilDate = (comment) => {
  const editing = comment && comment.editing;
  const editableUntil = editing && editing.editableUntil && new Date(Date.parse(editing.editableUntil));
  return editableUntil;  
};

/**
 * Renders a Comment's body in such a way that the end-user can edit it and save changes
 */
export class EditableCommentContent extends React.Component {

  // @TODO (bengo) make sure these are accurate wrt isRequired
  static propTypes = {

    // show notification to the user (e.g. for errors)
    addNotification: PropTypes.func.isRequired,
    asset: PropTypes.shape({
      settings: PropTypes.shape({
        charCountEnable: PropTypes.bool,
      }),
    }).isRequired,

    // comment that is being edited
    comment: PropTypes.shape({
      body: PropTypes.string,
      editing: PropTypes.shape({
        edited: PropTypes.bool,

        // ISO8601
        editableUntil: PropTypes.string,
      })
    }).isRequired,

    // logged in user
    currentUser: PropTypes.shape({
      id: PropTypes.string.isRequired
    }),
    maxCharCount: PropTypes.number,

    // edit a comment, passed {{ body }}
    editComment: React.PropTypes.func,

    // called when editing should be stopped
    stopEditing: React.PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.editComment = this.editComment.bind(this);
    this.editWindowExpiryTimeout = null;
  }
  componentDidMount() {
    const editableUntil = getEditableUntilDate(this.props.comment);
    const now = new Date();
    const editWindowRemainingMs = editableUntil && (editableUntil - now);
    if (editWindowRemainingMs > 0) {
      this.editWindowExpiryTimeout = setTimeout(() => {
        this.forceUpdate();
      }, editWindowRemainingMs);
    }
  }
  componentWillUnmount() {
    if (this.editWindowExpiryTimeout) {
      this.editWindowExpiryTimeout = clearTimeout(this.editWindowExpiryTimeout);
    }    
  }
  async editComment(edit) {
    const {editComment, addNotification, stopEditing} = this.props;
    if (typeof editComment !== 'function') {return;}
    let response;
    let successfullyEdited = false;
    try {
      response = await editComment(edit);
      const errors = (response && response.data && response.data.editComment)
        ? response.data.editComment.errors
        : null;
      if (errors && (errors.length === 1)) {
        throw errors[0];
      }
      successfullyEdited = true;
    } catch (error) {
      if (error.translation_key) {
        addNotification('error', lang.t(error.translation_key) || error.translation_key);
      } else if (error.networkError) {
        addNotification('error', lang.t('error.networkError'));
      } else {
        throw error;
      }
    }
    if (successfullyEdited && typeof stopEditing === 'function') {
      stopEditing();
    }
  }
  render() {
    const originalBody = this.props.comment.body;
    const editableUntil = getEditableUntilDate(this.props.comment);
    const editWindowExpired = (editableUntil - new Date()) < 0;
    return (
      <div style={{marginBottom: '10px'}}>
        <CommentForm
          defaultValue={this.props.comment.body}
          charCountEnable={this.props.asset.settings.charCountEnable}
          maxCharCount={this.props.maxCharCount}
          saveCommentEnabled={(comment) => {

            // should be disabled if user hasn't actually changed their
            // original comment
            return (comment.body !== originalBody) && ! editWindowExpired;
          }}
          saveComment={this.editComment}
          bodyLabel={'Edit this comment' /* @TODO (bengo) i18n */}
          bodyPlaceholder=""
          submitText={'Save changes' /* @TODO (bengo) i18n */}
          saveButtonCStyle="green"
          cancelButtonClicked={this.props.stopEditing}
        />
        {
          editWindowExpired
          ? <p>You can no longer edit this comment. The time window to do so has expired. Why not post another one?</p>
          : <p>You have <CountdownSeconds until={editableUntil} /> to save this Edit. You may save this edit now to reset the clock.</p>
        }
      </div>
    );
  }
}

/**
 * Countdown the number of seconds until a given Date
 */
class CountdownSeconds extends React.Component {
  static propTypes = {
    until: PropTypes.instanceOf(Date).isRequired
  }
  constructor(props) {
    super(props);
    this.countdownInterval = null;
  }
  componentDidMount() {
    const {until} = this.props;
    const now = new Date();
    if (until - now > 0) {
      this.countdownInterval = setInterval(() => {

        // re-render
        this.forceUpdate();
      }, 1000);
    }
  }
  componentWillUnmount() {
    if (this.countdownInterval) {
      this.countdownInterval = clearInterval(this.countdownInterval);
    }    
  }
  render() {
    const now = new Date();
    const {until} = this.props;
    const msRemaining = until - now;
    const secRemaining = msRemaining / 1000;
    const wholeSecRemaining = Math.floor(secRemaining);
    const plural = secRemaining !== 1;
    return <span>{`${wholeSecRemaining} second${plural ? 's' : ''}`}</span>;
  }
}
