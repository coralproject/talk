import React, {PropTypes} from 'react';
import {Button, Drawer} from 'coral-ui';
import styles from './UserDetail.js';
import {compose} from 'react-apollo';
import {getUserDetail} from 'coral-admin/src/graphql/queries';

class UserDetail extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired
  }

  render () {
    const {data} = this.props;

    if (!('user' in data)) {
      return null;
    }

    const {user} = data;
    const localProfile = user.profiles.find(p => p.provider === 'local');
    const facebookProfile = user.profiles.find(p => p.provider === 'facebook');
    let profile;
    if (localProfile) {
      profile = localProfile.id;
    } else if (facebookProfile) {
      profile = <a href={`https://facebook.com/${facebookProfile.id}`}>{facebookProfile.id}</a>;
    }

    return (
      <Drawer>
        <h3>{user.username}</h3>
        <p>{profile}</p> <Button>Copy</Button>
        <strong>Member since</strong> {user.created_at}
        <hr/>
        <strong>Account summary</strong>
        <br/><span className={styles.small}>Data represents the last six months of activity</span>
        <div className={styles.stats}>
        </div>
      </Drawer>
    );
  }
}

export default compose(
  getUserDetail
)(UserDetail);
