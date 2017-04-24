import React from 'react';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-framework/translations';
const lang = new I18n(translations);

import {TabBar, Tab, TabContent, Button} from 'coral-ui';

import Stream from '../containers/Stream';
import Count from 'coral-plugin-comment-count/CommentCount';
import UserBox from 'coral-sign-in/components/UserBox';
import ProfileContainer from 'coral-settings/containers/ProfileContainer';
import RestrictedContent from 'coral-framework/components/RestrictedContent';
import ConfigureStreamContainer from 'coral-configure/containers/ConfigureStreamContainer';

export default class Embed extends React.Component {
  changeTab = (tab) => {
    switch(tab) {
    case 0:
      this.props.setActiveTab('stream');
      break;
    case 1:
      this.props.setActiveTab('profile');

      // TODO: move data fetching to profile container.
      this.props.data.refetch();
      break;
    case 2:
      this.props.setActiveTab('config');

      // TODO: move data fetching to config container.
      this.props.data.refetch();
      break;
    }
  }

  render () {
    const {activeTab, logout, viewAllComments, commentId} = this.props;
    const {asset: {totalCommentCount}} = this.props.data;
    const {loggedIn, isAdmin, user} = this.props.auth;

    const userBox = <UserBox user={user} logout={logout} changeTab={this.changeTab}/>;

    return (
      <div>
        <div className="commentStream">
          <TabBar onChange={this.changeTab} activeTab={activeTab}>
            <Tab><Count count={totalCommentCount}/></Tab>
            <Tab>{lang.t('myProfile')}</Tab>
            <Tab restricted={!isAdmin}>Configure Stream</Tab>
          </TabBar>
          {
            commentId &&
              <Button
                cStyle='darkGrey'
                style={{float: 'right'}}
                onClick={viewAllComments}
              >
                {lang.t('showAllComments')}
              </Button>
          }
          <TabContent show={activeTab === 'stream'}>
            { loggedIn ? userBox : null }
            <Stream data={this.props.data} />
          </TabContent>
          <TabContent show={activeTab === 'profile'}>
            <ProfileContainer />
          </TabContent>
          <TabContent show={activeTab === 'config'}>
            <RestrictedContent restricted={!loggedIn}>
              { loggedIn ? userBox : null }
              <ConfigureStreamContainer />
            </RestrictedContent>
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
  }).isRequired,
};
