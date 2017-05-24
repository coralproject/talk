import React, {PropTypes} from 'react';
import {compose} from 'react-apollo';
import {getUserDetail} from 'coral-admin/src/graphql/queries';
import UserDetail from '../components/UserDetail';

class UserDetailContainer extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    hideUserDetail: PropTypes.func.isRequired
  }

  render () {
    return <UserDetail {...this.props}/>;
  }
}

export default compose(
  getUserDetail
)(UserDetailContainer);
