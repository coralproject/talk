import React from 'react';
import styles from './styles.css';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {toggleCheckbox} from '../actions';
import {addClassName, removeClassName} from 'coral-embed-stream/src/actions/comment';
import {closeViewingOptions} from 'coral-embed-stream/src/actions/stream';

class OffTopicFilter extends React.Component {

  tag = 'OFF_TOPIC';
  className = 'offTopicComment';
  cn = {[this.className] : {tags: [this.tag]}};

  handleChange = (e) => {
    if (e.target.checked) {
      this.props.addClassName(this.cn);
      this.props.toggleCheckbox();
    } else {
      const idx = this.props.classNames.findIndex((i) => i[this.className]);
      this.props.removeClassName(idx);
      this.props.toggleCheckbox();
    }
    this.props.closeViewingOptions();
  }

  render() {
    return (
      <div className={styles.viewingOption}>
        <label>
          <input type="checkbox" onChange={this.handleChange} checked={this.props.checked} />
          Hide Off-Topic Comments
        </label>
      </div>
    );
  }
}

const mapStateToProps = ({comment, offTopic}) => ({
  classNames: comment.classNames,
  checked: offTopic.checked
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({addClassName, removeClassName, toggleCheckbox, closeViewingOptions}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(OffTopicFilter);
