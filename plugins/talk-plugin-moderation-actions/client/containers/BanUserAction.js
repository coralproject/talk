import React from 'react';
import {compose} from 'react-apollo';
import {openBanDialog} from '../actions';
import {bindActionCreators} from 'redux';
import BanUserAction from '../components/BanUserAction';
import {connect, excludeIf} from 'plugin-api/beta/client/hocs';

class BanUserActionContainer extends React.Component {
  onBanUser = () => {
    this.props.openBanDialog({
      commentId: this.props.comment.id,
      authorId: this.props.comment.user.id
    });
  }

  render() {
    return <BanUserAction 
      onBanUser={this.onBanUser}
      comment={this.props.comment}
    />;
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    openBanDialog
  }, dispatch);

const enhance = compose(
  connect(null, mapDispatchToProps),
  excludeIf(({root: {me}, comment}) => !me || me.id === comment.user.id),
);

export default enhance(BanUserActionContainer);
