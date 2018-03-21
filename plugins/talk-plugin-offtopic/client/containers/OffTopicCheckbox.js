import React from 'react';
import PropTypes from 'prop-types';
import OffTopicCheckbox from '../components/OffTopicCheckbox';
import { excludeIf } from 'plugin-api/beta/client/hocs';

const OFF_TOPIC_TAG = 'OFF_TOPIC';
class OffTopicCheckboxContainer extends React.Component {
  handleChange = e => {
    const { input, onInputChange } = this.props;
    if (e.target.checked && !input.tags.includes(OFF_TOPIC_TAG)) {
      onInputChange({ tags: [...input.tags, OFF_TOPIC_TAG] });
    } else {
      const idx = input.tags.indexOf(OFF_TOPIC_TAG);
      if (idx !== -1) {
        onInputChange({
          tags: [...input.tags.slice(0, idx), ...input.tags.slice(0, idx)],
        });
      }
    }
  };

  render() {
    const checked = this.props.input.tags.includes(OFF_TOPIC_TAG);
    return <OffTopicCheckbox checked={checked} onChange={this.handleChange} />;
  }
}

OffTopicCheckboxContainer.propTypes = {
  input: PropTypes.object.isRequired,
  onInputChange: PropTypes.func.isRequired,
  isReply: PropTypes.bool,
};

export default excludeIf(props => props.isReply)(OffTopicCheckboxContainer);
