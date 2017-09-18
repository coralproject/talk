
import React from 'react';
import {compose} from 'react-apollo';
import {bindActionCreators} from 'redux';
import {closeDialog, closeMenu} from '../actions';
import {notify} from 'plugin-api/beta/client/actions/notification';
import {connect, withSetCommentStatus, withSetUserStatus} from 'plugin-api/beta/client/hocs';
import {getErrorMessages} from 'plugin-api/beta/client/utils';
import BanUserDialog from '../components/BanUserDialog';

class BanUserDialogContainer extends React.Component {  

  banUser = async () => {
    const {
      notify,
      authorId,
      commentId,
      closeMenu,
      closeDialog,
      setCommentStatus,
      setUserStatus
    } = this.props;

    try {
      await setUserStatus({
        userId: authorId,
        status: 'BANNED'
      });

      closeMenu();
      closeDialog();

      if (comment.status !== 'REJECTED') {
        await setCommentStatus({
          commentId: commentId,
          status: 'REJECTED'
        });
      }
    }
    catch(err) {
      notify('error', getErrorMessages(err));
    }
  }

  render() {
    return (
      <BanUserDialog 
        banUser={this.banUser} 
        showDialog={this.props.showDialog}
        closeDialog={this.props.closeDialog}
      />
    );
  }
}

const mapStateToProps = ({talkPluginModerationActions: state}) => ({
  showDialog: state.showDialog,
  commentId: state.commentId,
  authorId: state.authorId
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    notify,
    closeDialog,
    closeMenu
  }, dispatch);

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withSetCommentStatus,
  withSetUserStatus
);

export default enhance(BanUserDialogContainer);
