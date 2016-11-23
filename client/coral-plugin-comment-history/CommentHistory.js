import React from 'react';
import {connect} from 'react-redux';

const mapStateToProps = state => {
  return {
    config: state.config.toJS(),
    items: state.items.toJS(),
    auth: state.auth.toJS()
  };
};

class CommentHistory extends React.Component {
  render () {
    return (
      <div>Comment History</div>
    );
  }
}

export default connect(mapStateToProps)(CommentHistory);
