import React from 'react';
import PropTypes from 'prop-types';

import CommentForm from '../containers/CommentForm';
import styles from './Comment.css';
import { CountdownSeconds } from './CountdownSeconds';

import { Icon } from 'coral-ui';
import t from 'coral-framework/services/i18n';

/**
 * Renders a Comment's body in such a way that the end-user can edit it and save changes
 */
class EditableCommentContent extends React.Component {
  renderButtonContainerStart() {
    return (
      <div className={styles.buttonContainerLeft}>
        <span className={styles.editWindowRemaining}>
          {this.props.editWindowExpired ? (
            <span>
              {t('edit_comment.edit_window_expired')}
              <span>
                &nbsp;<a className={styles.link} onClick={this.props.onCancel}>
                  {t('edit_comment.edit_window_expired_close')}
                </a>
              </span>
            </span>
          ) : (
            <span>
              <Icon name="timer" className={styles.timerIcon} />{' '}
              {t('edit_comment.edit_window_timer_prefix')}
              <CountdownSeconds
                until={this.props.editableUntil}
                classNameForMsRemaining={remainingMs =>
                  remainingMs <= 10 * 1000 ? styles.editWindowAlmostOver : ''
                }
              />
            </span>
          )}
        </span>
      </div>
    );
  }

  render() {
    const id = `edit-draft_${this.props.comment.id}`;
    return (
      <div className={styles.editCommentForm}>
        <CommentForm
          isEdit
          root={this.props.root}
          comment={this.props.comment}
          charCountEnable={this.props.charCountEnable}
          maxCharCount={this.props.maxCharCount}
          submitEnabled={this.props.submitEnabled}
          input={this.props.input}
          onInputChange={this.props.onInputChange}
          onSubmit={this.props.onSubmit}
          onCancel={this.props.onCancel}
          loadingState={this.props.loadingState}
          registerHook={this.props.registerHook}
          unregisterHook={this.props.unregisterHook}
          buttonContainerStart={this.renderButtonContainerStart()}
          submitButtonClassName={styles.button}
          cancelButtonClassName={styles.button}
          bodyLabel={t('edit_comment.body_input_label')}
          bodyPlaceholder=""
          submitText={<span>{t('edit_comment.save_button')}</span>}
          submitButtonCStyle="green"
          id={id}
        />
      </div>
    );
  }
}

EditableCommentContent.propTypes = {
  charCountEnable: PropTypes.bool,
  submitEnabled: PropTypes.func,
  maxCharCount: PropTypes.number,
  root: PropTypes.object.isRequired,
  comment: PropTypes.object.isRequired,
  input: PropTypes.object.isRequired,
  registerHook: PropTypes.func.isRequired,
  unregisterHook: PropTypes.func.isRequired,
  onInputChange: PropTypes.func,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  loadingState: PropTypes.string,
  editWindowExpired: PropTypes.bool,
  editableUntil: PropTypes.object,
};

export default EditableCommentContent;
