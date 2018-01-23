import React from 'react';
import { compose } from 'react-apollo';
import ApproveCommentAction from '../components/ApproveCommentAction';
import { withSetCommentStatus } from 'plugin-api/beta/client/hocs';

class ApproveCommentActionContainer extends React.Component {
  approveComment = async () => {
    const { setCommentStatus, comment, hideMenu } = this.props;

    await setCommentStatus({
      commentId: comment.id,
      status: 'ACCEPTED',
    });

    hideMenu();
  };

  render() {
    return (
      <ApproveCommentAction
        comment={this.props.comment}
        approveComment={this.approveComment}
      />
    );
  }
}

const enhance = compose(withSetCommentStatus);

export default enhance(ApproveCommentActionContainer);
