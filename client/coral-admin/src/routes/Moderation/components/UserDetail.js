import React, {PropTypes} from 'react';
import {Button, Drawer} from 'coral-ui';
import styles from './UserDetail.css';
import Slot from 'coral-framework/components/Slot';

export default class UserDetail extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    hideUserDetail: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
  }

  copyPermalink = () => {
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

    const {user, totalComments, rejectedComments} = data;
    const localProfile = user.profiles.find((p) => p.provider === 'local');
    let profile;
    if (localProfile) {
      profile = localProfile.id;
    }

    let rejectedPercent = rejectedComments / totalComments;
    if (rejectedPercent === Infinity || isNaN(rejectedPercent)) {

      // if totalComments is 0, you're dividing by zero, which is naughty
      rejectedPercent = 0;
    }

    return (
      <Drawer handleClickOutside={hideUserDetail}>
        <h3>{user.username}</h3>
        <Button className={styles.copyButton} onClick={this.copyPermalink}>Copy</Button>
        {profile && <input className={styles.profileEmail} readOnly type="text" ref={(ref) => this.profile = ref} value={profile} />}
        <Slot fill="userProfile" user={user} />
        <p className={styles.memberSince}><strong>Member since</strong> {new Date(user.created_at).toLocaleString()}</p>
        <hr/>
        <p>
          <strong>Account summary</strong>
          <br/><small className={styles.small}>Data represents the last six months of activity</small>
        </p>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <p>Total Comments</p>
            <p>{totalComments}</p>
          </div>
          <div className={styles.stat}>
            <p>Reject Rate</p>
            <p>{`${(rejectedPercent).toFixed(1)}%`}</p>
          </div>
        </div>
      </Drawer>
    );
  }
}

