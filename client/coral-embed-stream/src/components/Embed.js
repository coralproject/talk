import React from 'react';
import Stream from '../containers/Stream';
import Slot from 'coral-framework/components/Slot';
import {can} from 'coral-framework/services/perms';
import t from 'coral-framework/services/i18n';

import {TabBar, Tab, TabContent, TabPane} from 'coral-ui';
import ProfileContainer from 'coral-settings/containers/ProfileContainer';
import ConfigureStreamContainer
  from 'coral-configure/containers/ConfigureStreamContainer';

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
    const {activeTab} = this.props;
    const {user} = this.props.auth;

    return (
      <div>
        <div className="commentStream">
          <TabBar
            onTabClick={this.changeTab}
            activeTab={activeTab}
            className='talk-stream-tabbar'
            aria-controls='talk-embed-stream-tab-content'
          >
            <Tab tabId={'stream'} className={'talk-stream-comment-count-tab'}>
              {t('embed_comments_tab')}
            </Tab>
            <Tab tabId={'profile'} className={'talk-stream-profile-tab'}>
              {t('framework.my_profile')}
            </Tab>
            {can(user, 'UPDATE_CONFIG') &&
              <Tab tabId={'config'} className={'talk-stream-configuration-tab'}>
                {t('framework.configure_stream')}
              </Tab>
            }
          </TabBar>
          <Slot fill="embed" />

          <TabContent
            activeTab={activeTab}
            id='talk-embed-stream-tab-content'
          >
            <TabPane tabId={'stream'}>
              <Stream data={this.props.data} root={this.props.root} />
            </TabPane>
            <TabPane tabId={'profile'}>
              <ProfileContainer />
            </TabPane>
            <TabPane tabId={'config'}>
              <ConfigureStreamContainer />
            </TabPane>
          </TabContent>
        </div>
      </div>
    );
  }
}

Embed.propTypes = {
  data: React.PropTypes.shape({
    loading: React.PropTypes.bool,
    error: React.PropTypes.object
  }).isRequired
};
