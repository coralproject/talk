import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import SuspendUserDialog from '../components/SuspendUserDialog';
import {hideSuspendUserDialog} from '../actions/suspendUserDialog';
import {withSetCommentStatus, withSuspendUser} from 'coral-framework/graphql/mutations';
import {compose, gql} from 'react-apollo';
import t, {timeago} from 'coral-framework/services/i18n';
import withQuery from 'coral-framework/hocs/withQuery';
import {getErrorMessages} from 'coral-framework/utils';
import get from 'lodash/get';
import {notify} from 'coral-framework/actions/notification';

class SuspendUserDialogContainer extends Component {

  suspendUser = async ({message, until}) => {
    const {userId, username, commentStatus, commentId, hideSuspendUserDialog, setCommentStatus, suspendUser, notify} = this.props;
    hideSuspendUserDialog();
    try {
      const result = await suspendUser({id: userId, message, until});
      if (result.data.suspendUser.errors) {
        throw result.data.suspendUser.errors;
      }
      notify(
        'success',
        t('suspenduser.notify_suspend_until', username, timeago(until)),
      );
      if (commentId && commentStatus && commentStatus !== 'REJECTED') {
        return setCommentStatus({commentId, status: 'REJECTED'})
          .then((result) => {
            if (result.data.setCommentStatus.errors) {
              throw result.data.setCommentStatus.errors;
            }
          });
      }
    }
    catch(err) {
      notify('error', getErrorMessages(err));
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

const withOrganizationName = withQuery(gql`
  query CoralAdmin_SuspendUserDialog {
     settings {
      organizationName
    }
  }
`);

const mapStateToProps = ({suspendUserDialog: {open, userId, username, commentId, commentStatus}}) => ({
  open,
  userId,
  username,
  commentId,
  commentStatus,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    hideSuspendUserDialog,
    notify,
  }, dispatch),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withSuspendUser,
  withSetCommentStatus,
  withOrganizationName,
)(SuspendUserDialogContainer);
