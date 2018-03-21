import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './DraftAreaContent.css';

class DraftAreaContent extends React.Component {
  render() {
    const {
      input,
      id,
      onInputChange,
      disabled,
      label,
      placeholder,
    } = this.props;
    const inputId = `${id}-textarea`;
    return (
      <div>
        <label
          htmlFor={inputId}
          className="screen-reader-text"
          aria-hidden={true}
        >
          {label}
        </label>
        <textarea
          id={inputId}
          className={cn(styles.content, 'talk-plugin-commentbox-textarea')}
          value={input.body}
          placeholder={placeholder}
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
  label: PropTypes.string,
  onInputChange: PropTypes.func,
  disabled: PropTypes.bool,
  isEdit: PropTypes.bool,
  isReply: PropTypes.bool,
};

export default DraftAreaContent;
