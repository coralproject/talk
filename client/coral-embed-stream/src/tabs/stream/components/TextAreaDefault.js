import React from 'react';
import PropTypes from 'prop-types';

const TextAreaComponent = ({
  value,
  placeholder,
  id,
  onChange,
  rows,
  disabled,
}) => (
  <textarea
    className={'talk-plugin-commentbox-textarea'}
    value={value}
    placeholder={placeholder}
    id={id}
    onChange={e => onChange(e.target.value)}
    rows={rows}
    disabled={disabled}
  />
);

TextAreaComponent.defaultProps = {
  rows: 3,
};

TextAreaComponent.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  rows: PropTypes.number,
};

export default TextAreaComponent;
