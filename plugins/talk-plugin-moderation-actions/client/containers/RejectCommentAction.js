import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'plugin-api/beta/client/hocs';
import {getErrorMessages} from 'plugin-api/beta/client/utils'
import {withSetCommentStatus} from 'plugin-api/beta/client/hocs';
import {notify} from 'plugin-api/beta/client/actions/notification';
import RejectCommentAction from '../components/RejectCommentAction';

class RejectCommentActionContainer extends React.Component {

  rejectComment = () => {
    const {setCommentStatus, comment, hideTooltip, notify} = this.props;

    try {
      await setCommentStatus({
        commentId: comment.id,
        status: 'REJECTED'
      });
    }
    catch(err) {
      notify('error', getErrorMessages(err));
    }

    hideTooltip();
  }

  render() {
    return <RejectCommentAction rejectComment={this.rejectComment}/>;
  }
}

const mapDispatchToProps = (dispatch) =>
bindActionCreators({
  notify
}, dispatch);

export default compose(
  withSetCommentStatus,
  connect(null, mapDispatchToProps)
)(RejectCommentActionContainer);
