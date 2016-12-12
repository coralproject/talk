import React from 'react';
import {connect} from 'react-redux';

import styles from './CommentHistory.css';

class CommentHistory extends React.Component {
  render () {
    return (
      <div className={styles.header}>
        <h1>Comment History</h1>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    config: state.config.toJS(),
    items: state.items.toJS(),
    auth: state.auth.toJS()
  };
};

export default connect(mapStateToProps)(CommentHistory);
