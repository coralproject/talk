import React from 'react';
import {withSetCommentStatus} from 'plugin-api/beta/client/hocs';
import RejectCommentAction from '../components/RejectCommentAction';

class RejectCommentActionContainer extends React.Component {

  rejectComment = () => {
    const {setCommentStatus, comment} = this.props;

    setCommentStatus({
      commentId: comment.id,
      status: 'REJECTED'
    });
  }

  render() {
    return <RejectCommentAction rejectComment={this.rejectComment}/>;
  }
}

export default withSetCommentStatus(RejectCommentActionContainer);
