import React from 'react';
import PropTypes from 'prop-types';
import Stream from '../tabs/stream/containers/Stream';
import Configure from '../tabs/configure/containers/Configure';
import Slot from 'coral-framework/components/Slot';
import { can } from 'coral-framework/services/perms';
import t from 'coral-framework/services/i18n';
import AutomaticAssetClosure from '../containers/AutomaticAssetClosure';

import ExtendableTabPanel from '../containers/ExtendableTabPanel';
import { Tab, TabPane } from 'coral-ui';
import ProfileContainer from 'coral-settings/containers/ProfileContainer';
import Popup from 'coral-framework/components/Popup';
import IfSlotIsNotEmpty from 'coral-framework/components/IfSlotIsNotEmpty';
import cn from 'classnames';

export default class Embed extends React.Component {
  changeTab = tab => {
    // TODO: move data fetching to appropiate containers.
    switch (tab) {
      case 'profile':
        this.props.data.refetch();
        break;
    }
    this.props.setActiveTab(tab);
  };

  getTabs() {
    const { user } = this.props.auth;
    const tabs = [
      <Tab
        key="stream"
        tabId="stream"
        className="talk-embed-stream-comments-tab"
      >
        {t('embed_comments_tab')}
      </Tab>,
      <Tab
        key="profile"
        tabId="profile"
        className="talk-embed-stream-profile-tab"
      >
        {t('framework.my_profile')}
      </Tab>,
    ];
    if (can(user, 'UPDATE_CONFIG')) {
      tabs.push(
        <Tab
          key="config"
          tabId="config"
          className="talk-embed-stream-config-tab"
        >
          {t('framework.configure_stream')}
        </Tab>
      );
    }
    return tabs;
  }

  render() {
    const {
      activeTab,
      commentId,
      root,
      root: { asset },
      data,
      auth: { showSignInDialog, signInDialogFocus },
      blurSignInDialog,
      focusSignInDialog,
      hideSignInDialog,
      router: { location: { query: { parentUrl } } },
    } = this.props;
    const hasHighlightedComment = !!commentId;

    return (
      <div
        className={cn('talk-embed-stream', {
          'talk-embed-stream-highlight-comment': hasHighlightedComment,
        })}
      >
        <AutomaticAssetClosure asset={asset} />
        <IfSlotIsNotEmpty slot="login">
          <Popup
            href={`embed/stream/login?parentUrl=${encodeURIComponent(
              parentUrl
            )}`}
            title="Login"
            features="menubar=0,resizable=0,width=500,height=550,top=200,left=500"
            open={showSignInDialog}
            focus={signInDialogFocus}
            onFocus={focusSignInDialog}
            onBlur={blurSignInDialog}
            onClose={hideSignInDialog}
          />
        </IfSlotIsNotEmpty>

        <Slot data={data} queryData={{ root }} fill="embed" />

        <ExtendableTabPanel
          className="talk-embed-stream-tab-bar"
          activeTab={activeTab}
          setActiveTab={this.changeTab}
          fallbackTab="stream"
          tabSlot="embedStreamTabs"
          tabSlotPrepend="embedStreamTabsPrepend"
          tabPaneSlot="embedStreamTabPanes"
          slotProps={{ data }}
          queryData={{ root }}
          tabs={this.getTabs()}
          tabPanes={[
            <TabPane
              key="stream"
              tabId="stream"
              className="talk-embed-stream-comments-tab-pane"
            >
              <Stream data={data} root={root} asset={root.asset} />
            </TabPane>,
            <TabPane
              key="profile"
              tabId="profile"
              className="talk-embed-stream-profile-tab-pane"
            >
              <ProfileContainer />
            </TabPane>,
            <TabPane
              key="config"
              tabId="config"
              className="talk-embed-stream-config-tab-pane"
            >
              <Configure data={data} root={root} asset={root.asset} />
            </TabPane>,
          ]}
        />
      </div>
    );
  }
}

Embed.propTypes = {
  setActiveTab: PropTypes.func,
  auth: PropTypes.object,
  blurSignInDialog: PropTypes.func,
  focusSignInDialog: PropTypes.func,
  hideSignInDialog: PropTypes.func,
  router: PropTypes.object,
  commentId: PropTypes.string,
  root: PropTypes.object,
  activeTab: PropTypes.string,
  data: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.object,
    refetch: PropTypes.func,
  }).isRequired,
};
