import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'plugin-api/beta/client/hocs';
import {getErrorMessages} from 'plugin-api/beta/client/utils';
import {withSetCommentStatus} from 'plugin-api/beta/client/hocs';
import {notify} from 'plugin-api/beta/client/actions/notification';
import ApproveCommentAction from '../components/ApproveCommentAction';
import {connect, withSetCommentStatus} from 'plugin-api/beta/client/hocs';

class ApproveCommentActionContainer extends React.Component {

  approveComment = async () => {
    const {setCommentStatus, comment, hideMenu, notify} = this.props;

    try {
      await setCommentStatus({
        commentId: comment.id,
        status: 'ACCEPTED'
      });
    }
    catch(err) {
      notify('error', getErrorMessages(err));
    }

    hideMenu();
  }

  render() {
    return <ApproveCommentAction comment={this.props.comment} approveComment={this.approveComment}/>;
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

export default enhance(ApproveCommentActionContainer);
