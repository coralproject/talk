import React from 'react';
import PropTypes from 'prop-types';
import pell from 'pell';

class TextArea extends React.Component {
  componentWillMount() {}
  render() {
    const { value, placeholder, id, onChange, rows, disabled } = this.props;

    return (
      <textarea
        className={'talk-plugin-commentbox-textarea'}
        value={value}
        placeholder={'RTE Text Area'}
        id={id}
        onChange={onChange}
        rows={rows}
        disabled={disabled}
      />
    );
  }
}

TextArea.defaultProps = {
  rows: 3,
};

TextArea.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  rows: PropTypes.number,
};

export default TextAreaComponent;
