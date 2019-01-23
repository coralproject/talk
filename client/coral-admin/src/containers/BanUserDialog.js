import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import BanUserDialog from '../components/BanUserDialog';
import { hideBanUserDialog } from '../actions/banUserDialog';
import {
  withBanUser,
  withSetCommentStatus,
} from 'coral-framework/graphql/mutations';
import { compose } from 'react-apollo';
import t from 'coral-framework/services/i18n';

class BanUserDialogContainer extends Component {
  banUser = async ({ message }) => {
    const {
      userId,
      commentId,
      commentStatus,
      banUser,
      setCommentStatus,
      hideBanUserDialog,
    } = this.props;
    await banUser({ id: userId, message });
    hideBanUserDialog();
    if (commentId && commentStatus && commentStatus !== 'REJECTED') {
      await setCommentStatus({ commentId, status: 'REJECTED' });
    }
  };

  getInfo() {
    let note = t('bandialog.note_ban_user');
    if (this.props.commentStatus && this.props.commentStatus !== 'REJECTED') {
      note = t('bandialog.note_reject_comment');
    }
    return t('bandialog.note', note);
  }

  render() {
    return (
      <BanUserDialog
        open={this.props.open}
        onPerform={this.banUser}
        onCancel={this.props.hideBanUserDialog}
        username={this.props.username}
        info={this.getInfo()}
      />
    );
  }
}

BanUserDialogContainer.propTypes = {
  banUser: PropTypes.func.isRequired,
  hideBanUserDialog: PropTypes.func,
  open: PropTypes.bool,
  username: PropTypes.string,
  commentStatus: PropTypes.string,
};

const mapStateToProps = ({
  banUserDialog: { open, userId, username, commentId, commentStatus },
}) => ({
  open,
  userId,
  username,
  commentId,
  commentStatus,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      hideBanUserDialog,
    },
    dispatch
  ),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withBanUser,
  withSetCommentStatus
)(BanUserDialogContainer);
