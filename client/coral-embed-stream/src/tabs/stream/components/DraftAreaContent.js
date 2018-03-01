import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './DraftAreaContent.css';

const DraftAreaContent = ({
  value,
  placeholder,
  id,
  onChange,
  rows,
  disabled,
}) => (
  <textarea
    className={cn(styles.content, 'talk-plugin-commentbox-textarea')}
    value={value}
    placeholder={placeholder}
    id={id}
    onChange={e => onChange(e.target.value)}
    rows={rows}
    disabled={disabled}
  />
);

DraftAreaContent.defaultProps = {
  rows: 3,
};

DraftAreaContent.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  rows: PropTypes.number,
};

export default DraftAreaContent;
