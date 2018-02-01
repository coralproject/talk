import React from 'react';
import PropTypes from 'prop-types';
import DraftArea from '../components/DraftArea';

const STORAGE_PATH = 'DraftArea';

/**
 * An enhanced textarea to make comment drafts.
 */
export default class DraftAreaContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.initValue();
  }

  async initValue() {
    const value = await this.context.pymSessionStorage.getItem(this.getPath());
    if (value && this.props.onChange) {
      this.props.onChange(value);
    }
  }

  getPath = () => {
    return `${STORAGE_PATH}_${this.props.id}`;
  };

  onChange = e => {
    this.props.onChange && this.props.onChange(e.target.value);
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      if (nextProps.value) {
        this.context.pymSessionStorage.setItem(this.getPath(), nextProps.value);
      } else {
        this.context.pymSessionStorage.removeItem(this.getPath());
      }
    }
  }

  render() {
    return (
      <DraftArea
        value={this.props.value}
        placeholder={this.props.placeholder}
        id={this.props.id}
        onChange={this.onChange}
        rows={this.props.rows}
        disabled={this.props.disabled}
        charCountEnable={this.props.charCountEnable}
        maxCharCount={this.props.maxCharCount}
        label={this.props.label}
      />
    );
  }
}

DraftAreaContainer.contextTypes = {
  // We use pymSessionStorage instead to persist the data directly on the parent page,
  // in order to mitigate strict cross domain security settings.
  pymSessionStorage: PropTypes.object,
};

DraftAreaContainer.propTypes = {
  charCountEnable: PropTypes.bool,
  maxCharCount: PropTypes.number,
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  rows: PropTypes.number,
  label: PropTypes.string.isRequired,
};
