import React from 'react';
import {compose} from 'react-apollo';
import {closeMenu} from '../actions';
import {bindActionCreators} from 'redux';
import {getErrorMessages} from 'plugin-api/beta/client/utils';
import {notify} from 'plugin-api/beta/client/actions/notification';
import RejectCommentAction from '../components/RejectCommentAction';
import {connect, withSetCommentStatus} from 'plugin-api/beta/client/hocs';

class RejectCommentActionContainer extends React.Component {

  rejectComment = () => {
    const {setCommentStatus, closeMenu, comment} = this.props;
    
    try {
      setCommentStatus({
        commentId: comment.id,
        status: 'REJECTED'
      });
      
      closeMenu();
    } catch (err) {
      notify('error', getErrorMessages(err));
    }
  }

  render() {
    return <RejectCommentAction rejectComment={this.rejectComment}/>;
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    notify,
    closeMenu
  }, dispatch);

const enhance = compose(
  connect(null, mapDispatchToProps),
  withSetCommentStatus
);

export default enhance(RejectCommentActionContainer);
