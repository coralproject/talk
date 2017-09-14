import React from 'react';
import {compose} from 'react-apollo';
import {openDialog} from '../actions';
import {bindActionCreators} from 'redux';
import BanUserAction from '../components/BanUserAction';
import {notify} from 'plugin-api/beta/client/actions/notification';
import {connect, excludeIf} from 'plugin-api/beta/client/hocs';

class BanUserActionContainer extends React.Component {
  render() {
    return <BanUserAction 
      openDialog={this.props.openDialog}
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
