import React from 'react';
import {compose} from 'react-apollo';
import {openDialog} from '../actions';
import {bindActionCreators} from 'redux';
import BanUserAction from '../components/BanUserAction';
import {connect, excludeIf} from 'plugin-api/beta/client/hocs';

class BanUserActionContainer extends React.Component {
  onBanUser = () => {
    this.props.openDialog(this.props.comment);
  }

  render() {
    return <BanUserAction 
      onBanUser={this.onBanUser}
      comment={this.props.comment}
      openDialog={this.props.openDialog}
    />;
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    openDialog
  }, dispatch);

const enhance = compose(
  connect(null, mapDispatchToProps),
  excludeIf(({root: {me}, comment}) => !me || me.id === comment.user.id),
);

export default enhance(BanUserActionContainer);
