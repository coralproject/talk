import React from 'react';
import PropTypes from 'prop-types';
import CommentHistory from '../containers/CommentHistory';
import ExtendableTabPanel from '../../../containers/ExtendableTabPanel';
import { Tab, TabPane } from 'coral-ui';
import t from 'coral-framework/services/i18n';
import Settings from '../containers/Settings';

const TabPanel = ({
  root,
  activeTab,
  setActiveTab,
  showSettingsTab,
  slotPassthrough,
}) => {
  const tabs = [
    <Tab key="comments" tabId="comments">
      {t('framework.my_comments')}
    </Tab>,
  ];

  if (showSettingsTab) {
    tabs.push(
      <Tab key="settings" tabId="settings">
        {t('profile_settings')}
      </Tab>
    );
  }

  return (
    <ExtendableTabPanel
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      fallbackTab="comments"
      tabSlot="profileTabs"
      tabSlotPrepend="profileTabsPrepend"
      tabPaneSlot="profileTabPanes"
      slotPassthrough={slotPassthrough}
      tabs={tabs}
      tabPanes={[
        <TabPane key="comments" tabId="comments">
          <CommentHistory root={root} />
        </TabPane>,
        <TabPane key="settings" tabId="settings">
          <Settings root={root} />
        </TabPane>,
      ]}
      sub
    />
  );
};

TabPanel.propTypes = {
  root: PropTypes.object,
  slotPassthrough: PropTypes.object,
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  showSettingsTab: PropTypes.bool.isRequired,
};

export default TabPanel;
