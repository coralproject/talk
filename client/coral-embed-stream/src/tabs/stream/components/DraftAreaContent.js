import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './DraftAreaContent.css';

const DraftAreaContent = ({
  input,
  placeholder,
  id,
  onInputChange,
  rows,
  disabled,
}) => (
  <textarea
    className={cn(styles.content, 'talk-plugin-commentbox-textarea')}
    value={input.body}
    placeholder={placeholder}
    id={id}
    onChange={e => onInputChange({ body: e.target.value })}
    rows={rows}
    disabled={disabled}
  />
);

DraftAreaContent.defaultProps = {
  rows: 3,
};

DraftAreaContent.propTypes = {
  id: PropTypes.string,
  input: PropTypes.object,
  placeholder: PropTypes.string,
  onInputChange: PropTypes.func,
  disabled: PropTypes.bool,
  rows: PropTypes.number,
};

export default DraftAreaContent;
