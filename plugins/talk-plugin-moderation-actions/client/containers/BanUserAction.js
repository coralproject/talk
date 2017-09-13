import React from 'react';
import {compose} from 'react-apollo';
import {bindActionCreators} from 'redux';
import {getErrorMessages} from 'plugin-api/beta/client/utils';
import {notify} from 'plugin-api/beta/client/actions/notification';
import BanUserAction from '../components/BanUserAction';
import {connect, withSetCommentStatus, withSetUserStatus} from 'plugin-api/beta/client/hocs';

class BanUserActionContainer extends React.Component {

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
    return <BanUserAction 
      comment={this.props.comment}
      banUser={this.banUser}
    />;
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    notify
  }, dispatch);

const enhance = compose(
  connect(null, mapDispatchToProps),
  withSetCommentStatus,
  withSetUserStatus
);

export default enhance(BanUserActionContainer);
