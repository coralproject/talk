import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'plugin-api/beta/client/hocs';
import {getErrorMessages} from 'plugin-api/beta/client/utils';
import {withSetCommentStatus} from 'plugin-api/beta/client/hocs';
import {notify} from 'plugin-api/beta/client/actions/notification';
import ApproveCommentAction from '../components/ApproveCommentAction';

class ApproveCommentActionContainer extends React.Component {

  approveComment = async () => {
    const {setCommentStatus, comment, hideTooltip, notify} = this.props;

    try {
      await setCommentStatus({
        commentId: comment.id,
        status: 'ACCEPTED'
      });
    }
    catch(err) {
      notify('error', getErrorMessages(err));
    }

    hideTooltip();
  }

  render() {
    return <ApproveCommentAction comment={this.props.comment} approveComment={this.approveComment}/>;
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    notify
  }, dispatch);

export default compose(
  withSetCommentStatus,
  connect(null, mapDispatchToProps)
)(ApproveCommentActionContainer);
