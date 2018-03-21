import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import t from 'coral-framework/services/i18n';
import Slot from 'coral-framework/components/Slot';
import DraftAreaContent from './DraftAreaContent';
import styles from './DraftArea.css';

// TODO: (kiwi) Need to adapt CSS classes post refactor to match the rest.

/**
 * An enhanced textarea to make comment drafts.
 */
export default class DraftArea extends React.Component {
  renderCharCount() {
    const { input, maxCharCount } = this.props;

    const className = cn(
      styles.charCount,
      'talk-plugin-commentbox-char-count',
      {
        [`${styles.charMax} talk-plugin-commentbox-char-max`]:
          input.body.length > maxCharCount,
      }
    );
    const remaining = maxCharCount - input.body.length;

    return (
      <div className={className}>
        {remaining} {t('comment_box.characters_remaining')}
      </div>
    );
  }

  getLabel() {
    if (this.props.isEdit) {
      return t('edit_comment.body_input_label');
    }
    return this.props.isReply ? t('comment_box.reply') : t('comment.comment');
  }

  getPlaceholder() {
    if (this.props.isEdit) {
      return '';
    }
    return this.getLabel();
  }

  render() {
    const {
      input,
      id,
      disabled,
      charCountEnable,
      maxCharCount,
      onInputChange,
      isReply,
      isEdit,
      registerHook,
      unregisterHook,
      root,
      comment,
    } = this.props;

    return (
      <div id={id}>
        <div
          className={cn(styles.container, 'talk-plugin-commentbox-container')}
        >
          <Slot
            fill="draftArea"
            defaultComponent={DraftAreaContent}
            className={styles.content}
            passthrough={{
              id,
              root,
              comment,
              registerHook,
              unregisterHook,
              input,
              onInputChange,
              disabled,
              isReply,
              isEdit,
              placeholder: this.getPlaceholder(),
              label: this.getLabel(),
            }}
          />
          {/* Is this slot here legitimate? (kiwi) */}
          <Slot fill="commentInputArea" />
        </div>
        {charCountEnable && maxCharCount > 0 && this.renderCharCount()}
      </div>
    );
  }
}

DraftArea.propTypes = {
  charCountEnable: PropTypes.bool,
  maxCharCount: PropTypes.number,
  id: PropTypes.string,
  input: PropTypes.object,
  onInputChange: PropTypes.func,
  disabled: PropTypes.bool,
  root: PropTypes.object.isRequired,
  comment: PropTypes.object,
  registerHook: PropTypes.func,
  unregisterHook: PropTypes.func,
  isReply: PropTypes.bool,
  isEdit: PropTypes.bool,
};
