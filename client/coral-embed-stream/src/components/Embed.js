import React from 'react';
const lang = new I18n(translations);
import Stream from '../containers/Stream';
import Slot from 'coral-framework/components/Slot';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-framework/translations';
import {TabBar, Tab, TabContent, Button} from 'coral-ui';
import Count from 'coral-plugin-comment-count/CommentCount';
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

  handleShowProfile = () => this.props.setActiveTab('profile');

  render () {
    const {activeTab, viewAllComments, commentId} = this.props;
    const {asset: {totalCommentCount}} = this.props.root;
    const {loggedIn, isAdmin} = this.props.auth;

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
          <Slot fill="embed"/>
          <TabContent show={activeTab === 'stream'}>
            <Stream data={this.props.data} root={this.props.root} />
          </TabContent>
          <TabContent show={activeTab === 'profile'}>
            <ProfileContainer />
          </TabContent>
          <TabContent show={activeTab === 'config'}>
            <RestrictedContent restricted={!loggedIn}>
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
