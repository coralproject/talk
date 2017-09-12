import React from 'react';
import {withSetCommentStatus} from 'plugin-api/beta/client/hocs';
import ApproveCommentAction from '../components/ApproveCommentAction';

class ApproveCommentActionContainer extends React.Component {

  approveComment = () => {
    const {setCommentStatus, comment} = this.props;

    setCommentStatus({
      commentId: comment.id,
      status: 'ACCEPTED'
    });
  }

  render() {
    return <ApproveCommentAction comment={this.props.comment} approveComment={this.approveComment}/>;
  }
}

export default withSetCommentStatus(ApproveCommentActionContainer);
