import React from 'react';
import PropTypes from 'prop-types';
import Slot from 'coral-framework/components/Slot';
import styles from './Profile.css';
import TabPanel from '../containers/TabPanel';

const DefaultProfileHeader = ({ username, emailAddress }) => (
  <div className={styles.userInfo}>
    <h2 className={styles.username}>{username}</h2>
    {emailAddress ? <p className={styles.email}>{emailAddress}</p> : null}
  </div>
);

DefaultProfileHeader.propTypes = {
  username: PropTypes.string,
  emailAddress: PropTypes.string,
};

const Profile = ({ id, username, emailAddress, root, slotPassthrough }) => {
  return (
    <div className="talk-my-profile talk-profile-container">
      <Slot
        fill="profileHeader"
        size={1}
        defaultComponent={DefaultProfileHeader}
        passthrough={{
          ...slotPassthrough,
          id,
          username,
          emailAddress,
        }}
      />
      <Slot fill="profileSections" passthrough={slotPassthrough} />
      <TabPanel root={root} slotPassthrough={slotPassthrough} />
    </div>
  );
};

Profile.propTypes = {
  id: PropTypes.string,
  username: PropTypes.string,
  emailAddress: PropTypes.string,
  root: PropTypes.object,
  slotPassthrough: PropTypes.object,
};

export default Profile;
