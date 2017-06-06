import React from 'react';
import styles from './styles.css';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {addClassName, removeClassName} from 'coral-embed-stream/src/actions/comment';
import {closeViewingOptions} from 'coral-embed-stream/src/actions/stream';

class OffTopicFilter extends React.Component {

  tag = 'OFF_TOPIC';
  className = 'offTopicComment';
  cn = {[this.className] : {tags: [this.tag]}};

  handleChange = (e) => {
    if (e.target.checked) {
      this.props.addClassName(this.cn);
    } else {
      const idx = this.props.comment.classNames.indexOf(this.cn);
      this.props.removeClassName(idx);
    }
    this.props.closeViewingOptions();
  }

  render() {
    return (
      <div className={styles.viewingOption}>
        <label>
          <input type="checkbox" onChange={this.handleChange} checked={true}/>
          Hide Off-Topic Comments
        </label>
      </div>
    );
  }
}

const mapStateToProps = ({comment, offTopicFilter}) => ({comment, offTopicFilter});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({addClassName, removeClassName, closeViewingOptions}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(OffTopicFilter);
