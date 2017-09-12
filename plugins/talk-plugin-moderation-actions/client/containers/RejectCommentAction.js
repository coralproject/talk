import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'plugin-api/beta/client/hocs';
import {getErrorMessages} from 'plugin-api/beta/client/utils'
import {withSetCommentStatus} from 'plugin-api/beta/client/hocs';
import {notify} from 'plugin-api/beta/client/actions/notification';
import RejectCommentAction from '../components/RejectCommentAction';
import {connect, withSetCommentStatus} from 'plugin-api/beta/client/hocs';

class RejectCommentActionContainer extends React.Component {

  rejectComment = () => {
    const {setCommentStatus, comment, hideMenu, notify} = this.props;

    try {
      await setCommentStatus({
        commentId: comment.id,
        status: 'REJECTED'
      });
    }
    catch(err) {
      notify('error', getErrorMessages(err));
    }

    hideMenu();
  }

  render() {
    return <RejectCommentAction rejectComment={this.rejectComment}/>;
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    notify
  }, dispatch);

const enhance = compose(
  connect(null, mapDispatchToProps),
  withSetCommentStatus
);

export default enhance(RejectCommentActionContainer);
