import React from 'react';
import IgnoreUserConfirmation from '../components/IgnoreUserConfirmation';
import { compose, gql } from 'react-apollo';
import {
  connect,
  withFragments,
  withIgnoreUser,
} from 'plugin-api/beta/client/hocs';
import { bindActionCreators } from 'redux';
import { closeMenu } from 'plugins/talk-plugin-author-menu/client/actions';
import { notify } from 'plugin-api/beta/client/actions/notification';
import { t } from 'plugin-api/beta/client/services';

class IgnoreUserConfirmationContainer extends React.Component {
  ignoreUser = () => {
    const { ignoreUser, notify, comment, closeMenu } = this.props;
    ignoreUser(comment.user.id).then(() => {
      notify(
        'success',
        t('talk-plugin-ignore-user.notify_success', comment.user.username)
      );
    });
    closeMenu();
  };

  cancel = () => {
    this.props.closeMenu();
  };

  render() {
    return (
      <IgnoreUserConfirmation
        username={this.props.comment.user.username}
        ignoreUser={this.ignoreUser}
        cancel={this.cancel}
      />
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      closeMenu,
      notify,
    },
    dispatch
  );

const withIgnoreUserConfirmationFragments = withFragments({
  comment: gql`
    fragment TalkIgnoreUser_IgnoreUserConfirmation_comment on Comment {
      user {
        id
        username
      }
    }
  `,
});

const enhance = compose(
  connect(null, mapDispatchToProps),
  withIgnoreUserConfirmationFragments,
  withIgnoreUser
);

export default enhance(IgnoreUserConfirmationContainer);
