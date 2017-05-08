import React, {PropTypes} from 'react';
import {notifyForNewCommentStatus} from 'coral-plugin-commentbox/CommentBox';
import {CommentForm} from 'coral-plugin-commentbox/CommentForm';
import styles from './Comment.css';
import {CountdownSeconds} from './CountdownSeconds';
import {getEditableUntilDate} from './util';

import {Icon} from 'coral-ui';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-framework/translations';
const lang = new I18n(translations);

/**
 * Renders a Comment's body in such a way that the end-user can edit it and save changes
 */
export class EditableCommentContent extends React.Component {
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
        addNotification('error', lang.t('editComment.unexpectedError'));
        throw error;
      }
    }
    if (successfullyEdited) {
      const status = response.data.editComment.comment.status;
      notifyForNewCommentStatus(this.props.addNotification, status);
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
      <div className={styles.editCommentForm}>
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
          bodyLabel={lang.t('editComment.bodyInputLabel')}
          bodyPlaceholder=""
          submitText={<span>{lang.t('editComment.saveButton')}</span>}
          saveButtonCStyle="green"
          cancelButtonClicked={this.props.stopEditing}
          buttonClass={styles.button}
          buttonContainerStart={
            <div className={styles.buttonContainerLeft}>
              <span className={styles.editWindowRemaining}>
                {
                  editWindowExpired
                  ? <span>
                      {lang.t('editComment.editWindowExpired')}
                      {
                        typeof this.props.stopEditing === 'function'
                        ? <span>&nbsp;<a className={styles.link} onClick={this.props.stopEditing}>{lang.t('editComment.editWindowExpiredClose')}</a></span>
                        : null
                      }
                    </span>
                  : <span>
                      <Icon name="timer"/> {lang.t('editComment.editWindowTimerPrefix')}
                      <CountdownSeconds
                        until={editableUntil}
                        classNameForMsRemaining={(remainingMs) => (remainingMs <= 10 * 1000) ? styles.editWindowAlmostOver : '' }
                      />
                    </span>
                }
              </span>
            </div>
          }
        />
      </div>
    );
  }
}
