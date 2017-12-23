import React from 'react';
import PropTypes from 'prop-types';
import Stream from '../tabs/stream/containers/Stream';
import Configure from '../tabs/configure/containers/Configure';
import Slot from 'coral-framework/components/Slot';
import {can} from 'coral-framework/services/perms';
import t from 'coral-framework/services/i18n';
import AutomaticAssetClosure from '../containers/AutomaticAssetClosure';

import ExtendableTabPanel from '../containers/ExtendableTabPanel';
import {Tab, TabPane} from 'coral-ui';
import ProfileContainer from 'coral-settings/containers/ProfileContainer';
import Popup from 'coral-framework/components/Popup';
import IfSlotIsNotEmpty from 'coral-framework/components/IfSlotIsNotEmpty';
import cn from 'classnames';

export default class Embed extends React.Component {
  changeTab = (tab) => {

    // TODO: move data fetching to appropiate containers.
    switch (tab) {
    case 'profile':
      this.props.data.refetch();
      break;
    }
    this.props.setActiveTab(tab);
  };

  getTabs() {
    const {user} = this.props.auth;
    const tabs = [
      <Tab key='stream' tabId='stream' className='talk-embed-stream-comments-tab'>
        {t('embed_comments_tab')}
      </Tab>,
      <Tab key='profile' tabId='profile' className='talk-embed-stream-profile-tab'>
        {t('framework.my_profile')}
      </Tab>,
    ];
    if (can(user, 'UPDATE_CONFIG')) {
      tabs.push(
        <Tab key='config' tabId='config'>
          {t('framework.configure_stream')}
        </Tab>
      );
    }
    return tabs;
  }

  render() {
    const {activeTab, commentId, root, root: {asset}, data, auth: {showSignInDialog, signInDialogFocus}, blurSignInDialog, focusSignInDialog, hideSignInDialog, router: {location: {query: {parentUrl}}}} = this.props;
    const hasHighlightedComment = !!commentId;

    return (
      <div className={cn('talk-embed-stream', {'talk-embed-stream-highlight-comment': hasHighlightedComment})}>
        <AutomaticAssetClosure asset={asset} />
        <IfSlotIsNotEmpty slot="login">
          <Popup
            href={`embed/stream/login?parentUrl=${encodeURIComponent(parentUrl)}`}
            title='Login'
            features='menubar=0,resizable=0,width=500,height=550,top=200,left=500'
            open={showSignInDialog}
            focus={signInDialogFocus}
            onFocus={focusSignInDialog}
            onBlur={blurSignInDialog}
            onClose={hideSignInDialog}
          />
        </IfSlotIsNotEmpty>
        <Slot
          data={data}
          queryData={{root}}
          fill="embed"
        />

        <Stream data={data} root={root} />
      </div>
    );
  }
}

Embed.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.object
  }).isRequired
};
