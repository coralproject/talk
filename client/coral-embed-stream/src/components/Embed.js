import React from 'react';
import PropTypes from 'prop-types';
import Stream from '../containers/Stream';
import Slot from 'coral-framework/components/Slot';
import {can} from 'coral-framework/services/perms';
import t from 'coral-framework/services/i18n';

import {TabBar, Tab, TabContent, TabPane} from 'coral-ui';
import ProfileContainer from 'coral-settings/containers/ProfileContainer';
import Popup from 'coral-framework/components/Popup';
import IfSlotIsNotEmpty from 'coral-framework/components/IfSlotIsNotEmpty';
import ConfigureStreamContainer
  from 'coral-configure/containers/ConfigureStreamContainer';
import cn from 'classnames';

export default class Embed extends React.Component {
  changeTab = (tab) => {

    // TODO: move data fetching to appropiate containers.
    switch (tab) {
    case 'profile':
      this.props.data.refetch();
      break;
    case 'config':
      this.props.data.refetch();
      break;
    }
    this.props.setActiveTab(tab);
  };

  render() {
    const {activeTab, commentId, root, data, auth: {showSignInDialog, signInDialogFocus}, blurSignInDialog, focusSignInDialog, hideSignInDialog, router: {location: {query: {parentUrl}}}} = this.props;
    const {user} = this.props.auth;
    const hasHighlightedComment = !!commentId;

    return (
      <div className={cn('talk-embed-stream', {'talk-embed-stream-highlight-comment': hasHighlightedComment})}>
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
        <TabBar
          onTabClick={this.changeTab}
          activeTab={activeTab}
          className='talk-embed-stream-tab-bar'
          aria-controls='talk-embed-stream-tab-content'
        >
          <Tab tabId={'stream'} className={'talk-embed-stream-comments-tab'}>
            {t('embed_comments_tab')}
          </Tab>
          <Tab tabId={'profile'} className={'talk-embed-stream-profile-tab'}>
            {t('framework.my_profile')}
          </Tab>
          {can(user, 'UPDATE_CONFIG') &&
            <Tab tabId={'config'} className={'talk-embed-stream-configuration-tab'}>
              {t('framework.configure_stream')}
            </Tab>
          }
        </TabBar>
        <Slot
          data={data}
          queryData={{root}}
          fill="embed"
        />

        <TabContent
          activeTab={activeTab}
          id='talk-embed-stream-tab-content'
        >
          <TabPane tabId={'stream'}>
            <Stream data={data} root={root} />
          </TabPane>
          <TabPane tabId={'profile'}>
            <ProfileContainer />
          </TabPane>
          <TabPane tabId={'config'}>
            <ConfigureStreamContainer />
          </TabPane>
        </TabContent>
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
