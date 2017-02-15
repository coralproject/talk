import React, {Component} from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import isEqual from 'lodash/isEqual';

import {TabBar, Tab, TabContent, Spinner} from 'coral-ui';

const {logout, showSignInDialog, requestConfirmEmail} = authActions;
const {addNotification, clearNotification} = notificationActions;
const {fetchAssetSuccess} = assetActions;

import {queryStream} from 'coral-framework/graphql/queries';
import {postComment, postFlag, postLike, deleteAction} from 'coral-framework/graphql/mutations';
import {editName} from 'coral-framework/actions/user';
import {Notification, notificationActions, authActions, assetActions, pym} from 'coral-framework';

import Stream from './Stream';
import InfoBox from 'coral-plugin-infobox/InfoBox';
import {ModerationLink} from 'coral-plugin-moderation';
import Count from 'coral-plugin-comment-count/CommentCount';
import CommentBox from 'coral-plugin-commentbox/CommentBox';
import UserBox from 'coral-sign-in/components/UserBox';
import SignInContainer from 'coral-sign-in/containers/SignInContainer';
import SuspendedAccount from 'coral-framework/components/SuspendedAccount';
import ChangeDisplayNameContainer from '../../coral-sign-in/containers/ChangeDisplayNameContainer';
import SettingsContainer from 'coral-settings/containers/SettingsContainer';
import RestrictedContent from 'coral-framework/components/RestrictedContent';
import ConfigureStreamContainer from 'coral-configure/containers/ConfigureStreamContainer';
import LoadMore from './LoadMore';

class Embed extends Component {

  state = {activeTab: 0, showSignInDialog: false};

  changeTab = (tab) => {

    // Everytime the comes from another tab, the Stream needs to be updated.
    if (tab === 0) {
      this.props.data.refetch();
    }

    this.setState({
      activeTab: tab
    });
  }

  static propTypes = {
    data: React.PropTypes.shape({
      loading: React.PropTypes.bool,
      error: React.PropTypes.object
    }).isRequired
  }

  componentDidMount () {
    pym.sendMessage('childReady');

    pym.onMessage('DOMContentLoaded', hash => {
      const commentId = hash.replace('#', 'c_');
      let count = 0;
      const interval = setInterval(() => {
        if (document.getElementById(commentId)) {
          window.clearInterval(interval);
          pym.scrollParentToChildEl(commentId);
        }

        if (++count > 100) { // ~10 seconds
          // give up waiting for the comments to load.
          // it would be weird for the page to jump after that long.
          window.clearInterval(interval);
        }
      }, 100);
    });
  }

  componentWillReceiveProps (nextProps) {
    const {loadAsset} = this.props;
    if(!isEqual(nextProps.data.asset, this.props.data.asset)) {
      loadAsset(nextProps.data.asset);
    }
  }

  render () {
    const {activeTab} = this.state;
    const {closedAt} = this.props.asset;
    const {loading, asset, refetch} = this.props.data;
    const {loggedIn, isAdmin, user, showSignInDialog, signInOffset} = this.props.auth;

    const openStream = closedAt === null;

    const banned = user && user.status === 'BANNED';

    const expandForLogin = showSignInDialog ? {
      minHeight: document.body.scrollHeight + 200
    } : {};

    if (loading || !asset) {
      return <Spinner />;
    }

    return (
      <div style={expandForLogin}>
        <div className="commentStream">
          <TabBar onChange={this.changeTab} activeTab={activeTab}>
            <Tab><Count count={asset.commentCount}/></Tab>
            <Tab>Settings</Tab>
            <Tab restricted={!isAdmin}>Configure Stream</Tab>
          </TabBar>
          {loggedIn && <UserBox user={user} logout={this.props.logout}  changeTab={this.changeTab}/>}
          <TabContent show={activeTab === 0}>
            {
              openStream
               ? <div id="commentBox">
                   <InfoBox
                     content={asset.settings.infoBoxContent}
                     enable={asset.settings.infoBoxEnable}
                   />
                 <RestrictedContent restricted={banned} restrictedComp={
                     <SuspendedAccount
                       canEditName={user && user.canEditName}
                       editName={this.props.editName}
                       />
                   }>
                   {
                     user
                     ? <CommentBox
                        addNotification={this.props.addNotification}
                        postItem={this.props.postItem}
                        appendItemArray={this.props.appendItemArray}
                        updateItem={this.props.updateItem}
                        assetId={asset.id}
                        premod={asset.settings.moderation}
                        isReply={false}
                        currentUser={this.props.auth.user}
                        authorId={user.id}
                        charCount={asset.settings.charCountEnable && asset.settings.charCount} />
                     : null
                   }
                   <ModerationLink assetId={asset.id} isAdmin={isAdmin} />
                 </RestrictedContent>
                 </div>
               : <p>{asset.settings.closedMessage}</p>
            }
            {!loggedIn && <SignInContainer requireEmailConfirmation={asset.settings.requireEmailConfirmation} offset={signInOffset}/>}
            {loggedIn &&  user && <ChangeDisplayNameContainer loggedIn={loggedIn} offset={signInOffset} user={user} />}
            <Stream
              refetch={refetch}
              addNotification={this.props.addNotification}
              postItem={this.props.postItem}
              asset={asset}
              currentUser={user}
              postLike={this.props.postLike}
              postFlag={this.props.postFlag}
              deleteAction={this.props.deleteAction}
              showSignInDialog={this.props.showSignInDialog}
              comments={asset.comments} />
            <Notification
              notifLength={4500}
              clearNotification={this.props.clearNotification}
              notification={{text: null}}
            />
          <LoadMore
            assetId={asset.id}
            comments={asset.comments}
            moreComments={asset.commentCount > asset.comments.length}
            loadMore={this.props.loadMore}/>
        </TabContent>
         <TabContent show={activeTab === 1}>
           <SettingsContainer
             loggedIn={loggedIn}
             userData={this.props.userData}
             showSignInDialog={this.props.showSignInDialog}
           />
         </TabContent>
         <TabContent show={activeTab === 2}>
           <RestrictedContent restricted={!loggedIn}>
             <ConfigureStreamContainer
               status={status}
               onClick={this.toggleStatus}
             />
           </RestrictedContent>
         </TabContent>
          <Notification
            notifLength={4500}
            clearNotification={this.props.clearNotification}
            notification={this.props.notification}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  notification: state.notification.toJS(),
  auth: state.auth.toJS(),
  userData: state.user.toJS(),
  asset: state.asset.toJS()
});

const mapDispatchToProps = dispatch => ({
  requestConfirmEmail: () => dispatch(requestConfirmEmail()),
  loadAsset: (asset) => dispatch(fetchAssetSuccess(asset)),
  addNotification: (type, text) => {
    pym.sendMessage('getPosition');

    pym.onMessage('position', position => {
      dispatch(addNotification(type, text, position));
    });
  },
  clearNotification: () => dispatch(clearNotification()),
  editName: (username) => dispatch(editName(username)),
  showSignInDialog: (offset) => dispatch(showSignInDialog(offset)),
  logout: () => dispatch(logout()),
  dispatch: d => dispatch(d)
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  postComment,
  postFlag,
  postLike,
  deleteAction,
  queryStream
)(Embed);
