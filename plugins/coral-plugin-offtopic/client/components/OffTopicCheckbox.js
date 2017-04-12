import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {addTag, removeTag} from 'coral-plugin-commentbox/actions';
import styles from './styles.css';

class OffTopicCheckbox extends React.Component {

  label = 'OFF_TOPIC';

  handleChange = (e) => {
    if (e.target.checked) {
      this.props.addTag(this.label)
    } else {
      const idx = this.props.commentBox.tags.indexOf(this.label);
      this.props.removeTag(idx);
    }
  }

  render() {
    return (
      <div className={styles.offTopic}>
        <label className={styles.offTopicLabel}>
          <input type="checkbox" onChange={this.handleChange}/>
          Off-Topic
        </label>
      </div>
    )
  }
}


const mapStateToProps = ({commentBox}) => ({commentBox});

const mapDispatchToProps = dispatch =>
  bindActionCreators({addTag, removeTag}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(OffTopicCheckbox);
