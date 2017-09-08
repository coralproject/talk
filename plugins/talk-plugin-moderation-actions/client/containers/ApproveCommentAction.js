import React from 'react';
import {getErrorMessages} from 'plugin-api/beta/client/utils';
import {withSetCommentStatus} from 'plugin-api/beta/client/hocs';
import {notify} from 'plugin-api/beta/client/actions/notification';
import ApproveCommentAction from '../components/ApproveCommentAction';
import isNil from 'lodash/isNil';

class ApproveCommentActionContainer extends React.Component {

  approveComment = async () => {
    const {setCommentStatus, comment} = this.props;

    try {
      const result = await setCommentStatus({
        commentId: comment.id,
        status: 'ACCEPTED'
      });

      if (!isNil(result.data.setCommentStatus)) {
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
