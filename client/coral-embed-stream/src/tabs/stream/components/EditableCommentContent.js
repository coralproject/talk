import React from 'react';
import PropTypes from 'prop-types';
import { notifyForNewCommentStatus } from 'talk-plugin-commentbox/CommentBox';
import { CommentForm } from 'talk-plugin-commentbox/CommentForm';
import styles from './Comment.css';
import { CountdownSeconds } from './CountdownSeconds';
import { getEditableUntilDate } from './util';
import { can } from 'coral-framework/services/perms';
import { forEachError } from 'coral-framework/utils';

import { Icon } from 'coral-ui';
import t from 'coral-framework/services/i18n';

/**
 * Renders a Comment's body in such a way that the end-user can edit it and save changes
 */
export class EditableCommentContent extends React.Component {
  static propTypes = {
    // show notification to the user (e.g. for errors)
    notify: PropTypes.func.isRequired,

    // comment that is being edited
    comment: PropTypes.shape({
      body: PropTypes.string,
      editing: PropTypes.shape({
        edited: PropTypes.bool,

        // ISO8601
        editableUntil: PropTypes.string,
      }),
    }).isRequired,

    // logged in user
    currentUser: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
    charCountEnable: PropTypes.bool,
    maxCharCount: PropTypes.number,

    // edit a comment, passed {{ body }}
    editComment: PropTypes.func,

    // called when editing should be stopped
    stopEditing: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.editWindowExpiryTimeout = null;
    this.state = {
      body: props.comment.body,
      loadingState: '',
    };
  }
  componentDidMount() {
    const editableUntil = getEditableUntilDate(this.props.comment);
    const now = new Date();
    const editWindowRemainingMs = editableUntil && editableUntil - now;
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

  handleBodyChange = body => {
    this.setState({ body });
  };

  handleSubmit = async () => {
    if (!can(this.props.currentUser, 'INTERACT_WITH_COMMUNITY')) {
      this.props.notify('error', t('error.NOT_AUTHORIZED'));
      return;
    }

    this.setState({ loadingState: 'loading' });

    const { editComment, notify, stopEditing } = this.props;
    if (typeof editComment !== 'function') {
      return;
    }
    let response;
    try {
      response = await editComment({ body: this.state.body });
      this.setState({ loadingState: 'success' });
      const status = response.data.editComment.comment.status;
      notifyForNewCommentStatus(this.props.notify, status);
      if (typeof stopEditing === 'function') {
        stopEditing();
      }
    } catch (error) {
      this.setState({ loadingState: 'error' });
      forEachError(error, ({ msg }) => notify('error', msg));
    }
  };

  getEditableUntil = (props = this.props) => {
    return getEditableUntilDate(props.comment);
  };

  isEditWindowExpired = (props = this.props) => {
    return this.getEditableUntil(props) - new Date() < 0;
  };

  isSubmitEnabled = comment => {
    // should be disabled if user hasn't actually changed their
    // original comment
    return (
      comment.body !== this.props.comment.body && !this.isEditWindowExpired()
    );
  };

  render() {
    return (
      <div className={styles.editCommentForm}>
        <CommentForm
          defaultValue={this.props.comment.body}
          charCountEnable={this.props.charCountEnable}
          maxCharCount={this.props.maxCharCount}
          submitEnabled={this.isSubmitEnabled}
          body={this.state.body}
          onBodyChange={this.handleBodyChange}
          onSubmit={this.handleSubmit}
          bodyLabel={t('edit_comment.body_input_label')}
          bodyPlaceholder=""
          submitText={<span>{t('edit_comment.save_button')}</span>}
          submitButtonCStyle="green"
          onCancel={this.props.stopEditing}
          submitButtonClassName={styles.button}
          cancelButtonClassName={styles.button}
          loadingState={this.state.loadingState}
          buttonContainerStart={
            <div className={styles.buttonContainerLeft}>
              <span className={styles.editWindowRemaining}>
                {this.isEditWindowExpired() ? (
                  <span>
                    {t('edit_comment.edit_window_expired')}
                    {typeof this.props.stopEditing === 'function' ? (
                      <span>
                        &nbsp;<a
                          className={styles.link}
                          onClick={this.props.stopEditing}
                        >
                          {t('edit_comment.edit_window_expired_close')}
                        </a>
                      </span>
                    ) : null}
                  </span>
                ) : (
                  <span>
                    <Icon name="timer" className={styles.timerIcon} />{' '}
                    {t('edit_comment.edit_window_timer_prefix')}
                    <CountdownSeconds
                      until={this.getEditableUntil()}
                      classNameForMsRemaining={remainingMs =>
                        remainingMs <= 10 * 1000
                          ? styles.editWindowAlmostOver
                          : ''
                      }
                    />
                  </span>
                )}
              </span>
            </div>
          }
        />
      </div>
    );
  }
}
