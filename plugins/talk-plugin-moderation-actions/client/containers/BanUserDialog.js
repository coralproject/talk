import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import { bindActionCreators } from 'redux';
import { closeBanDialog, closeMenu } from '../actions';
import { notify } from 'plugin-api/beta/client/actions/notification';
import {
  connect,
  withSetCommentStatus,
  withBanUser,
} from 'plugin-api/beta/client/hocs';
import { getErrorMessages } from 'plugin-api/beta/client/utils';
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
      banUser,
    } = this.props;

    try {
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
    } catch (err) {
      notify('error', getErrorMessages(err));
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
      notify,
      closeBanDialog,
      closeMenu,
    },
    dispatch
  );

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withSetCommentStatus,
  withBanUser
);

export default enhance(BanUserDialogContainer);
