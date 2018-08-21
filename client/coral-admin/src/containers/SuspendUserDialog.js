import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SuspendUserDialog from '../components/SuspendUserDialog';
import { hideSuspendUserDialog } from '../actions/suspendUserDialog';
import {
  withSetCommentStatus,
  withSuspendUser,
} from 'coral-framework/graphql/mutations';
import { compose, gql } from 'react-apollo';
import t, { timeago } from 'coral-framework/services/i18n';
import withQuery from 'coral-framework/hocs/withQuery';
import get from 'lodash/get';
import { notify } from 'coral-framework/actions/notification';

class SuspendUserDialogContainer extends Component {
  suspendUser = async ({ message, until }) => {
    const {
      userId,
      username,
      commentStatus,
      commentId,
      hideSuspendUserDialog,
      setCommentStatus,
      suspendUser,
      notify,
    } = this.props;
    hideSuspendUserDialog();
    await suspendUser({ id: userId, message, until });
    notify(
      'success',
      t('suspenduser.notify_suspend_until', username, timeago(until))
    );
    if (commentId && commentStatus && commentStatus !== 'REJECTED') {
      await setCommentStatus({ commentId, status: 'REJECTED' });
    }
  };

  render() {
    return (
      <SuspendUserDialog
        open={this.props.open}
        onPerform={this.suspendUser}
        onCancel={this.props.hideSuspendUserDialog}
        organizationName={get(this.props, 'root.settings.organizationName')}
        username={this.props.username}
      />
    );
  }
}

SuspendUserDialogContainer.propTypes = {
  open: PropTypes.bool,
  hideSuspendUserDialog: PropTypes.func,
  username: PropTypes.string,
};

const withOrganizationName = withQuery(gql`
  query CoralAdmin_SuspendUserDialog {
    __typename
    settings {
      organizationName
    }
  }
`);

const mapStateToProps = ({
  suspendUserDialog: { open, userId, username, commentId, commentStatus },
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
      hideSuspendUserDialog,
      notify,
    },
    dispatch
  ),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withSuspendUser,
  withSetCommentStatus,
  withOrganizationName
)(SuspendUserDialogContainer);
