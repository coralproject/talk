import React from 'react';
import IgnoreUserConfirmation from '../components/IgnoreUserConfirmation';
import {compose, gql} from 'react-apollo';
import {connect, withFragments, withIgnoreUser} from 'plugin-api/beta/client/hocs';
import {bindActionCreators} from 'redux';
import {setContentSlot} from 'plugins/talk-plugin-author-menu/client/actions';

class IgnoreUserConfirmationContainer extends React.Component {

  ignoreUser = () => {
    this.props.ignoreUser(this.props.comment.user.id);
    this.props.setContentSlot(null);
  };

  render() {
    return <IgnoreUserConfirmation
      username={this.props.comment.username}
      ignoreUser={this.ignoreUser}
    />;
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    setContentSlot,
  }, dispatch);

const withIgnoreUserConfirmationFragments = withFragments({
  comment: gql`
    fragment TalkIgnoreUser_IgnoreUserConfirmation_comment on Comment {
      user {
        id
        username
      }
    }`,
});

const enhance = compose(
  connect(null, mapDispatchToProps),
  withIgnoreUserConfirmationFragments,
  withIgnoreUser,
);

export default enhance(IgnoreUserConfirmationContainer);
