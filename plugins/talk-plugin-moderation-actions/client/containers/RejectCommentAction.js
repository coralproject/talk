import React from 'react';
import { compose } from 'react-apollo';
import RejectCommentAction from '../components/RejectCommentAction';
import { withSetCommentStatus } from 'plugin-api/beta/client/hocs';

class RejectCommentActionContainer extends React.Component {
  rejectComment = async () => {
    const { setCommentStatus, comment, hideMenu } = this.props;

    await setCommentStatus({
      commentId: comment.id,
      status: 'REJECTED',
    });

    hideMenu();
  };

  render() {
    return <RejectCommentAction rejectComment={this.rejectComment} />;
  }
}

const enhance = compose(withSetCommentStatus);

export default enhance(RejectCommentActionContainer);
