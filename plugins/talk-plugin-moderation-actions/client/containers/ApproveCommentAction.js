import React from 'react';
import {getErrorMessages} from 'plugin-api/beta/client/utils';
import {withSetCommentStatus} from 'plugin-api/beta/client/hocs';
import {notify} from 'plugin-api/beta/client/actions/notification';
import ApproveCommentAction from '../components/ApproveCommentAction';

class ApproveCommentActionContainer extends React.Component {

  approveComment = async () => {
    const {setCommentStatus, comment} = this.props;

    try {
      const result = await setCommentStatus({
        commentId: comment.id,
        status: 'APPROVED'
      });

      if (result.data.setCommentStatus.errors) {
        throw result.data.setCommentStatus.errors;
      }
      
    } catch (err) {
      notify('error', getErrorMessages(err));
    }
  }

  render() {
    return <ApproveCommentAction comment={this.props.comment} approveComment={this.approveComment}/>
  }
}

export default withSetCommentStatus(ApproveCommentActionContainer);
