import React from 'react';
import styles from './styles.css';

class OffTopicCheckbox extends React.Component {

  handleChange = (e) => {

    if (e.target.checked) {
      this.props.addCommentHooks({
        postSubmit: {
          addTag: (data) => {
            console.log('This is a hook after posting')
          }
        }
      })
    } else {
      this.props.addCommentHooks({
        postSubmit: {
          addTag: () => {}
        }
      })
    }
  }

  render() {



    return (
      <div className={styles.offTopic}>
        <label>
          {/*{console.log(this.props)}*/}
          <input type="checkbox" onChange={this.handleChange}/>
          Off-Topic
        </label>
      </div>
    )
  }
}

export default OffTopicCheckbox;
