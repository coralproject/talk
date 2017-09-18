
import React from 'react';
import {compose} from 'react-apollo';
import {bindActionCreators} from 'redux';
import {closeBanDialog, closeMenu} from '../actions';
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
      commentStatus,
      closeMenu,
      closeBanDialog,
      setCommentStatus,
      setUserStatus
    } = this.props;

    try {
      await setUserStatus({
        userId: authorId,
        status: 'BANNED'
      });

      closeMenu();
      closeBanDialog();

      if (commentStatus !== 'REJECTED') {
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
        showBanDialog={this.props.showBanDialog}
        closeBanDialog={this.props.closeBanDialog}
      />
    );
  }
}

const mapStateToProps = ({talkPluginModerationActions: state}) => ({
  showBanDialog: state.showBanDialog,
  commentId: state.commentId,
  authorId: state.authorId
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    notify,
    closeBanDialog,
    closeMenu
  }, dispatch);

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withSetCommentStatus,
  withSetUserStatus
);

export default enhance(BanUserDialogContainer);
