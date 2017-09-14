
import React from 'react';
import {compose} from 'react-apollo';
import {bindActionCreators} from 'redux';
import {closeDialog} from '../actions';
import {notify} from 'plugin-api/beta/client/actions/notification';
import {connect, withSetCommentStatus, withSetUserStatus} from 'plugin-api/beta/client/hocs';
import {getErrorMessages} from 'plugin-api/beta/client/utils';
import BanUserDialog from '../components/BanUserDialog';

class BanUserDialogContainer extends React.Component {  

  banUser = async () => {
    const {
      notify,
      comment,
      hideMenu,
      setCommentStatus,
      setUserStatus
    } = this.props;

    try {
      await setUserStatus({
        userId: comment.user.id,
        status: 'BANNED'
      });

      hideMenu();

      if (comment.status !== 'REJECTED') {
        await setCommentStatus({
          commentId: comment.id,
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
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    notify,
    closeDialog
  }, dispatch);

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withSetCommentStatus,
  withSetUserStatus
);

export default enhance(BanUserDialogContainer);