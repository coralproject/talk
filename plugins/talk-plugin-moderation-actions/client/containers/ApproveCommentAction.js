import React from 'react';
import {compose} from 'react-apollo';
import {bindActionCreators} from 'redux';
import {getErrorMessages} from 'plugin-api/beta/client/utils';
import {notify} from 'plugin-api/beta/client/actions/notification';
import ApproveCommentAction from '../components/ApproveCommentAction';
import {connect, withSetCommentStatus} from 'plugin-api/beta/client/hocs';

class ApproveCommentActionContainer extends React.Component {

  approveComment = () => {
    const {setCommentStatus, comment} = this.props;
    
    try {
      setCommentStatus({
        commentId: comment.id,
        status: 'ACCEPTED'
      });
    } catch (err) {
      notify('error', getErrorMessages(err));
    }
  }

  render() {
    return <ApproveCommentAction comment={this.props.comment} approveComment={this.approveComment}/>;
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    notify,
  }, dispatch);

const enhance = compose(
  connect(null, mapDispatchToProps),
  withSetCommentStatus
);

export default enhance(ApproveCommentActionContainer);
