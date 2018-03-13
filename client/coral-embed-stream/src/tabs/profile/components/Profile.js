import React from 'react';
import PropTypes from 'prop-types';
import Slot from 'coral-framework/components/Slot';
import styles from './Profile.css';
import TabPanel from '../containers/TabPanel';

const Profile = ({ username, emailAddress, data, root, slotPassthrough }) => {
  return (
    <div className="talk-my-profile talk-profile-container">
      <div className={styles.userInfo}>
        <h2 className={styles.username}>{username}</h2>
        {emailAddress ? <p className={styles.email}>{emailAddress}</p> : null}
      </div>
      <Slot fill="profileSections" passthrough={slotPassthrough} />
      <TabPanel data={data} root={root} slotPassthrough={slotPassthrough} />
    </div>
  );
};

Profile.propTypes = {
  username: PropTypes.string,
  emailAddress: PropTypes.string,
  data: PropTypes.object,
  root: PropTypes.object,
  slotPassthrough: PropTypes.object,
};

export default Profile;
