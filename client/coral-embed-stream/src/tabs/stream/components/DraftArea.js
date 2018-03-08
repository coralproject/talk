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
    const { value, maxCharCount } = this.props;

    const className = cn(
      styles.charCount,
      'talk-plugin-commentbox-char-count',
      {
        [`${styles.charMax} talk-plugin-commentbox-char-max`]:
          value.length > maxCharCount,
      }
    );
    const remaining = maxCharCount - value.length;

    return (
      <div className={className}>
        {remaining} {t('comment_box.characters_remaining')}
      </div>
    );
  }

  render() {
    const {
      value,
      placeholder,
      id,
      disabled,
      rows,
      label,
      charCountEnable,
      maxCharCount,
      onChange,
      queryData,
      isReply,
    } = this.props;

    const tASettings = {
      value,
      placeholder,
      id,
      onChange,
      rows,
      disabled,
      isReply,
    };

    return (
      <div>
        <div
          className={cn(styles.container, 'talk-plugin-commentbox-container')}
        >
          <label htmlFor={id} className="screen-reader-text" aria-hidden={true}>
            {label}
          </label>
          <Slot
            fill="draftArea"
            defaultComponent={DraftAreaContent}
            className={styles.content}
            queryData={queryData}
            registerHook={this.props.registerHook}
            unregisterHook={this.props.unregisterHook}
            {...tASettings}
          />
          <Slot fill="commentInputArea" />
        </div>
        {charCountEnable && maxCharCount > 0 && this.renderCharCount()}
      </div>
    );
  }
}

DraftArea.defaultProps = {
  rows: 3,
};

DraftArea.propTypes = {
  charCountEnable: PropTypes.bool,
  maxCharCount: PropTypes.number,
  id: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  rows: PropTypes.number,
  queryData: PropTypes.object.isRequired,
  registerHook: PropTypes.func,
  unregisterHook: PropTypes.func,
  isReply: PropTypes.bool,
};
