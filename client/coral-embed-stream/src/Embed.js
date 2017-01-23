import React, {Component, PropTypes} from 'react';
// import Pym from 'pym.js';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';

import {postComment, postAction, deleteAction} from './graphql/mutations';
import {queryStream} from './graphql/queries';

import {

  // itemActions,
  Notification,
  notificationActions,
  authActions
} from 'coral-framework';

import Stream from './Stream';

import CommentBox from 'coral-plugin-commentbox/CommentBox';
import InfoBox from 'coral-plugin-infobox/InfoBox';

// import Content from '../../coral-plugin-commentcontent/CommentContent';
// import PubDate from '../../coral-plugin-pubdate/PubDate';
import Count from 'coral-plugin-comment-count/CommentCount';

import SignInContainer from '../../coral-sign-in/containers/SignInContainer';
import UserBox from '../../coral-sign-in/components/UserBox';

import {TabBar, Tab, TabContent, Spinner} from '../../coral-ui';

import SettingsContainer from '../../coral-settings/containers/SettingsContainer';
import RestrictedContent from '../../coral-framework/components/RestrictedContent';
import SuspendedAccount from '../../coral-framework/components/SuspendedAccount';

import ConfigureStreamContainer from '../../coral-configure/containers/ConfigureStreamContainer';

// const {addItem, updateItem, postItem, getStream, postAction, deleteAction, appendItemArray} = itemActions;
const {addNotification, clearNotification} = notificationActions;
const {logout, showSignInDialog} = authActions;

class Embed extends Component {

  constructor (props) {
    super(props);

    this.state = {
      activeTab: 0,
      showSignInDialog: false
    };

    this.changeTab = this.changeTab.bind(this);
  }

  changeTab (tab) {
    this.setState({
      activeTab: tab
    });
  }

  static propTypes = {
    data: PropTypes.object.isRequired,
  }

  componentDidMount () {

    // stream id, logged in user, settings

    // Set up messaging between embedded Iframe an parent component

    // this.props.getStream(path || window.location);
    // this.path = window.location.href.split('#')[0];
    //
    // this.pym.sendMessage('childReady');
    //
    // this.pym.onMessage('DOMContentLoaded', hash => {
    //   const commentId = hash.replace('#', 'c_');
    //   let count = 0;
    //   const interval = setInterval(() => {
    //     if (document.getElementById(commentId)) {
    //       window.clearInterval(interval);
    //       this.pym.scrollParentToChildEl(commentId);
    //     }
    //
    //     if (++count > 100) { // ~10 seconds
    //       // give up waiting for the comments to load.
    //       // it would be weird for the page to jump after that long.
    //       window.clearInterval(interval);
    //     }
    //   }, 100);
    // });

  }

  render () {

    // const rootItemId = this.props.items.assets && Object.keys(this.props.items.assets)[0];
    // const rootItem = this.props.items.assets && this.props.items.assets[rootItemId];
    // const {actions, users, comments} = this.props.items;

    const {loggedIn, isAdmin, user, showSignInDialog, signInOffset} = this.props.auth;
    const {activeTab} = this.state;

    // const banned = (this.props.userData.status === 'banned');

    const {loading, asset} = this.props.data;

    // const {status, moderation, closedMessage, charCount, charCountEnable} = asset.settings;

    const expandForLogin = showSignInDialog ? {
      minHeight: document.body.scrollHeight + 150
    } : {};

    return <div style={expandForLogin}>
      {
        loading ? <Spinner/>
      : <div className="commentStream">
          <TabBar onChange={this.changeTab} activeTab={activeTab}>
            <Tab><Count count={asset.comments.length}/></Tab>
            <Tab>Settings</Tab>
            <Tab restricted={!isAdmin}>Configure Stream</Tab>
          </TabBar>
            {loggedIn && <UserBox user={user} logout={this.props.logout} />}
            <TabContent show={activeTab === 0}>
                {
                  asset.closedAt === null
                   ? <div id="commentBox">
                       <InfoBox
                         content={asset.settings.infoBoxContent}
                         enable={asset.settings.infoBoxEnable}
                       />
                     <RestrictedContent restricted={false} restrictedComp={<SuspendedAccount />}>
                       <CommentBox
                         addNotification={this.props.addNotification}
                         postItem={this.props.postItem}
                         appendItemArray={this.props.appendItemArray}
                         updateItem={this.props.updateItem}
                         id={asset.id}
                         premod={asset.settings.moderation}
                         reply={false}
                         currentUser={this.props.auth.user}
                         banned={false}
                         author={user}
                         charCount={asset.settings.charCountEnable && asset.settings.charCount}/>
                     </RestrictedContent>
                     </div>
                   : <p>{asset.settings.closedMessage}</p>
                }
                {!loggedIn && <SignInContainer offset={signInOffset}/>}
                <Stream
                  asset={asset}
                  currentUser={user}
                  postAction={this.props.postAction}
                  deleteAction={this.props.deleteAction}
                  showSignInDialog={this.props.showSignInDialog}
                  comments={asset.comments} />
                <Notification
                  notifLength={4500}
                  clearNotification={this.props.clearNotification}
                  notification={{text: null}}
                />
            </TabContent>
             <TabContent show={activeTab === 1}>
               <SettingsContainer
                 loggedIn={loggedIn}
                 userData={this.props.userData}
                 showSignInDialog={this.props.handleSignInDialog}
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
      }
    </div>;
  }
}

const mapStateToProps = state => ({
  config: state.config.toJS(),
  items: state.items.toJS(),
  notification: state.notification.toJS(),
  auth: state.auth.toJS(),
  userData: state.user.toJS()
});

const mapDispatchToProps = dispatch => ({

  // addItem: (item, item_id) => dispatch(addItem(item, item_id)),
  // updateItem: (id, property, value, itemType) => dispatch(updateItem(id, property, value, itemType)),
  // getStream: (rootId) => dispatch(getStream(rootId)),
  addNotification: (type, text) => dispatch(addNotification(type, text)),
  clearNotification: () => dispatch(clearNotification()),

  // postAction: (item, itemType, action) => dispatch(postAction(item, itemType, action)),
  showSignInDialog: (offset) => dispatch(showSignInDialog(offset)),

  // deleteAction: (item, action, user, itemType) => dispatch(deleteAction(item, action, user, itemType)),
  // appendItemArray: (item, property, value, addToFront, itemType) => dispatch(appendItemArray(item, property, value, addToFront, itemType)),
  // handleSignInDialog: () => dispatch(authActions.showSignInDialog()),
  logout: () => dispatch(logout()),
  dispatch: d => dispatch(d)
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  postComment,
  postAction,
  deleteAction,
  queryStream
)(Embed);
