import React from 'react';
import IgnoreUserAction from '../components/IgnoreUserAction';
import {compose} from 'react-apollo';
import {connect, withFragments} from 'plugin-api/beta/client/hocs';
import {bindActionCreators} from 'redux';
import {setContentSlot} from 'plugins/talk-plugin-author-menu/client/actions';
import IgnoreUserConfirmation from './IgnoreUserConfirmation';

class IgnoreUserActionContainer extends React.Component {

  ignoreUser = () => {
    this.props.setContentSlot('ignoreUserConfirmation');
  };

  render() {
    return <IgnoreUserAction
      ignoreUser={this.ignoreUser}
    />;
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    setContentSlot,
  }, dispatch);

const withIgnoreUserActionFragments = withFragments(IgnoreUserConfirmation.fragments);

const enhance = compose(
  connect(null, mapDispatchToProps),
  withIgnoreUserActionFragments,
);

export default enhance(IgnoreUserActionContainer);
