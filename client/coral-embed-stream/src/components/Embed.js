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
import Profile from '../tabs/profile/containers/Profile';
import Popup from 'coral-framework/components/Popup';
import IfSlotIsNotEmpty from 'coral-framework/components/IfSlotIsNotEmpty';
import cn from 'classnames';

export default class Embed extends React.Component {
  getTabs() {
    const tabs = [
      <Tab
        key="stream"
        tabId="stream"
        className="talk-embed-stream-comments-tab"
      >
        {t('embed_comments_tab')}
      </Tab>,
    ];

    if (this.props.currentUser) {
      tabs.push(
        <Tab
          key="profile"
          tabId="profile"
          className="talk-embed-stream-profile-tab"
        >
          {t('framework.my_profile')}
        </Tab>
      );
    }

    if (can(this.props.currentUser, 'UPDATE_ASSET_CONFIG')) {
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
      setActiveTab,
      commentId,
      root,
      root: { asset },
      data,
      showSignInDialog,
      signInDialogFocus,
      blurSignInDialog,
      focusSignInDialog,
      hideSignInDialog,
      parentUrl,
    } = this.props;
    const hasHighlightedComment = !!commentId;
    const popupUrl = `login?parentUrl=${encodeURIComponent(parentUrl)}`;
    const slotPassthrough = { root };

    return (
      <div
        className={cn('talk-embed-stream', {
          'talk-embed-stream-highlight-comment': hasHighlightedComment,
        })}
      >
        <AutomaticAssetClosure asset={asset} />
        <IfSlotIsNotEmpty slot="login">
          <Popup
            href={popupUrl}
            title="Login"
            features="menubar=0,resizable=0,width=500,height=550,top=200,left=500"
            open={showSignInDialog}
            focus={signInDialogFocus}
            onFocus={focusSignInDialog}
            onBlur={blurSignInDialog}
            onClose={hideSignInDialog}
          />
        </IfSlotIsNotEmpty>

        <Slot passthrough={slotPassthrough} fill="embed" />

        <ExtendableTabPanel
          className="talk-embed-stream-tab-bar"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          fallbackTab="stream"
          tabSlot="embedStreamTabs"
          tabSlotPrepend="embedStreamTabsPrepend"
          tabPaneSlot="embedStreamTabPanes"
          slotPassthrough={slotPassthrough}
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
              <Profile />
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
  currentUser: PropTypes.object,
  showSignInDialog: PropTypes.bool,
  signInDialogFocus: PropTypes.bool,
  blurSignInDialog: PropTypes.func,
  focusSignInDialog: PropTypes.func,
  hideSignInDialog: PropTypes.func,
  parentUrl: PropTypes.string,
  commentId: PropTypes.string,
  root: PropTypes.object,
  activeTab: PropTypes.string,
  data: PropTypes.object.isRequired,
};
