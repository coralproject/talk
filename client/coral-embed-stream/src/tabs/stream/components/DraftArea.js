import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import t from 'coral-framework/services/i18n';
import Slot from 'coral-framework/components/Slot';

// TODO: (kiwi) Need to adapt CSS classes post refactor to match the rest.

/**
 * An enhanced textarea to make comment drafts.
 */
export default class DraftArea extends React.Component {
  renderCharCount() {
    const { value, maxCharCount } = this.props;
    const className = cn('talk-plugin-commentbox-char-count', {
      ['talk-plugin-commentbox-char-max']: value.length > maxCharCount,
    });
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
    } = this.props;

    return (
      <div>
        <div className={'talk-plugin-commentbox-container'}>
          <label htmlFor={id} className="screen-reader-text" aria-hidden={true}>
            {label}
          </label>
          <textarea
            className={'talk-plugin-commentbox-textarea'}
            value={value}
            placeholder={placeholder}
            id={id}
            onChange={onChange}
            rows={rows}
            disabled={disabled}
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
};
