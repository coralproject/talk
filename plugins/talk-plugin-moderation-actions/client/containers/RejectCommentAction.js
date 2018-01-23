import React from 'react';
import { compose } from 'react-apollo';
import { bindActionCreators } from 'redux';
import { notify } from 'plugin-api/beta/client/actions/notification';
import RejectCommentAction from '../components/RejectCommentAction';
import { connect, withSetCommentStatus } from 'plugin-api/beta/client/hocs';

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

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      notify,
    },
    dispatch
  );

const enhance = compose(
  connect(null, mapDispatchToProps),
  withSetCommentStatus
);

export default enhance(RejectCommentActionContainer);
