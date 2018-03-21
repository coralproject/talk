import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './DraftAreaContent.css';
import t from 'coral-framework/services/i18n';

class DraftAreaContent extends React.Component {
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
    const { input, id, onInputChange, disabled } = this.props;
    const inputId = `${id}-textarea`;
    return (
      <div>
        <label
          htmlFor={inputId}
          className="screen-reader-text"
          aria-hidden={true}
        >
          {this.getLabel()}
        </label>
        <textarea
          id={inputId}
          className={cn(styles.content, 'talk-plugin-commentbox-textarea')}
          value={input.body}
          placeholder={this.getPlaceholder()}
          onChange={e => onInputChange({ body: e.target.value })}
          rows={3}
          disabled={disabled}
        />
      </div>
    );
  }
}

DraftAreaContent.propTypes = {
  id: PropTypes.string,
  input: PropTypes.object,
  placeholder: PropTypes.string,
  onInputChange: PropTypes.func,
  disabled: PropTypes.bool,
  isEdit: PropTypes.bool,
  isReply: PropTypes.bool,
};

export default DraftAreaContent;
