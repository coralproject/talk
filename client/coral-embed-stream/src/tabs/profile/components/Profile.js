import React from 'react';
import PropTypes from 'prop-types';
import Slot from 'coral-framework/components/Slot';
import CommentHistory from '../containers/CommentHistory';
import ExtendableTabPanel from '../../../containers/ExtendableTabPanel';
import { Tab, TabPane } from 'coral-ui';
import styles from './Profile.css';
import t from 'coral-framework/services/i18n';

const Profile = ({
  username,
  emailAddress,
  data,
  root,
  activeTab,
  setActiveTab,
}) => (
  <div className="talk-my-profile talk-profile-container">
    <div className={styles.userInfo}>
      <h2 className={styles.username}>{username}</h2>
      {emailAddress ? <p className={styles.email}>{emailAddress}</p> : null}
    </div>
    <Slot fill="profileSections" data={data} queryData={{ root }} />
    <ExtendableTabPanel
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      fallbackTab="comments"
      tabSlot="profileTabs"
      tabSlotPrepend="profileTabsPrepend"
      tabPaneSlot="profileTabPanes"
      slotProps={{ data }}
      queryData={{ root }}
      tabs={[
        <Tab key="comments" tabId="comments">
          {t('framework.my_comments')}
        </Tab>,
      ]}
      tabPanes={[
        <TabPane key="comments" tabId="comments">
          <CommentHistory data={data} root={root} />
        </TabPane>,
      ]}
      sub
    />
  </div>
);

Profile.propTypes = {
  username: PropTypes.string,
  emailAddress: PropTypes.string,
  data: PropTypes.object,
  root: PropTypes.object,
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default Profile;
