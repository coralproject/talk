import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import { bindActionCreators } from 'redux';
import { closeBanDialog, closeMenu } from '../actions';
import {
  connect,
  withSetCommentStatus,
  withBanUser,
} from 'plugin-api/beta/client/hocs';
import BanUserDialog from '../components/BanUserDialog';

class BanUserDialogContainer extends React.Component {
  banUser = async () => {
    const {
      authorId,
      commentId,
      commentStatus,
      closeMenu,
      closeBanDialog,
      setCommentStatus,
      banUser,
    } = this.props;

    await banUser({
      id: authorId,
      message: '',
    });

    closeMenu();
    closeBanDialog();

    if (commentStatus !== 'REJECTED') {
      await setCommentStatus({
        commentId: commentId,
        status: 'REJECTED',
      });
    }
  };

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

BanUserDialogContainer.propTypes = {
  showBanDialog: PropTypes.bool,
  closeBanDialog: PropTypes.func,
};

const mapStateToProps = ({ talkPluginModerationActions: state }) => ({
  showBanDialog: state.showBanDialog,
  commentId: state.commentId,
  authorId: state.authorId,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      closeBanDialog,
      closeMenu,
    },
    dispatch
  );

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withSetCommentStatus,
  withBanUser
);

export default enhance(BanUserDialogContainer);
