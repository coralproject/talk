import React from 'react';
import styles from './styles.css';

class OffTopicCheckbox extends React.Component {

  handleChange = () => {
    console.log('handle Change');
  }

  render() {
    return (
      <div className={styles.offTopic}>
        <label>
          <input type="checkbox" onChange={this.handleChange}/>
          Off-Topic
        </label>
      </div>
    )
  }
}

export default OffTopicCheckbox;
