import React from 'react';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-framework/translations';
const lang = new I18n(translations);

import {TabBar, Tab, TabContent, Button} from 'coral-ui';

import Stream from './Stream';
import Count from 'coral-plugin-comment-count/CommentCount';
import UserBox from 'coral-sign-in/components/UserBox';
import ProfileContainer from 'coral-settings/containers/ProfileContainer';
import RestrictedContent from 'coral-framework/components/RestrictedContent';
import ConfigureStreamContainer from 'coral-configure/containers/ConfigureStreamContainer';

export default class Embed extends React.Component {
  state = {
    activeTab: 0,
  };

  changeTab = (tab) => {
    if (tab === 0) {
      if (this.props.data.comment) {
        this.props.viewAllComments();
      }
      else {

        // TODO: don't rely on refetching.
        this.props.data.refetch();
      }
    }

    this.setState({
      activeTab: tab
    });
  }

  render () {
    const {activeTab} = this.state;
    const {asset, comment} = this.props.data;
    const {loggedIn, isAdmin, user, showSignInDialog} = this.props.auth;

    const expandForLogin = showSignInDialog ? {
      minHeight: document.body.scrollHeight + 200
    } : {};

    const userBox = <UserBox user={user} logout={this.props.logout} changeTab={this.changeTab}/>;

    return (
      <div style={expandForLogin}>
        <div className="commentStream">
          <TabBar onChange={this.changeTab} activeTab={activeTab}>
            <Tab><Count count={asset.totalCommentCount}/></Tab>
            <Tab>{lang.t('myProfile')}</Tab>
            <Tab restricted={!isAdmin}>Configure Stream</Tab>
          </TabBar>
          {
            comment &&
              <Button
                cStyle='darkGrey'
                style={{float: 'right'}}
                onClick={this.props.viewAllComments}
              >
                {lang.t('showAllComments')}
              </Button>
          }
          <TabContent show={activeTab === 0}>
            { loggedIn ? userBox : null }
            <Stream
              addNotification={this.props.addNotification}
              postItem={this.props.postItem}
              setActiveReplyBox={this.props.setActiveReplyBox}
              activeReplyBox={this.props.activeReplyBox}
              asset={asset}
              currentUser={user}
              postLike={this.props.postLike}
              postFlag={this.props.postFlag}
              postDontAgree={this.props.postDontAgree}
              addCommentTag={this.props.addCommentTag}
              removeCommentTag={this.props.removeCommentTag}
              ignoreUser={this.props.ignoreUser}
              loadMore={this.props.loadMore}
              deleteAction={this.props.deleteAction}
              showSignInDialog={this.props.showSignInDialog}
              comments={asset.comments}
              ignoredUsers={this.props.data.myIgnoredUsers.map(u => u.id)}
              auth={this.props.auth}
              comment={this.props.data.comment}
              commentCountCache={this.props.commentCountCache}
              refetch={this.props.data.refetch}
              editName={this.props.editName}
              setCommentCountCache={this.props.setCommentCountCache}
            />
          </TabContent>
          <TabContent show={activeTab === 1}>
            <ProfileContainer />
          </TabContent>
          <TabContent show={activeTab === 2}>
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

  // dispatch action to add a tag to a comment
  addCommentTag: React.PropTypes.func,

  // dispatch action to remove a tag from a comment
  removeCommentTag: React.PropTypes.func,

  // dispatch action to ignore another user
  ignoreUser: React.PropTypes.func,
};
