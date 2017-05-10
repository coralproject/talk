import React, {PropTypes} from 'react';
import {Button, Drawer} from 'coral-ui';
import styles from './UserDetail.css';
import {compose} from 'react-apollo';
import {getUserDetail} from 'coral-admin/src/graphql/queries';
import Slot from 'coral-framework/components/Slot';

class UserDetail extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    hideUserDetail: PropTypes.func.isRequired
  }

  copyPermalink () {
    this.profile.select();
    try {
      document.execCommand('copy');
    } catch (e) {

      /* nothing */
    }
  }

  render () {
    const {data, hideUserDetail} = this.props;

    if (!('user' in data)) {
      return null;
    }

    const {user} = data;
    const localProfile = user.profiles.find(p => p.provider === 'local');
    let profile;
    if (localProfile) {
      profile = localProfile.id;
    }

    return (
      <Drawer handleClickOutside={hideUserDetail}>
        <h3>{user.username}</h3>
        <Button className={styles.copyButton}>Copy</Button>
        {profile && <p ref={ref => this.profile = ref} contentEditable="true">{profile}</p>}
        <Slot fill="userProfile" user={user} />
        <p className={styles.memberSince}><strong>Member since</strong> {new Date(user.created_at).toLocaleString()}</p>
        <hr/>
        <p>
          <strong>Account summary</strong>
          <br/><small className={styles.small}>Data represents the last six months of activity</small>
        </p>
        <div className={styles.stats}>
        </div>
      </Drawer>
    );
  }
}

export default compose(
  getUserDetail
)(UserDetail);
