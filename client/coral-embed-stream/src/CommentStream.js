import React, {Component, PropTypes} from 'react';
import Pym from 'pym.js';
import {connect} from 'react-redux';

import {
  itemActions,
  Notification,
  notificationActions,
  authActions
} from '../../coral-framework';

import CommentBox from '../../coral-plugin-commentbox/CommentBox';
import InfoBox from '../../coral-plugin-infobox/InfoBox';
import Content from '../../coral-plugin-commentcontent/CommentContent';
import PubDate from '../../coral-plugin-pubdate/PubDate';
import Count from '../../coral-plugin-comment-count/CommentCount';
import AuthorName from '../../coral-plugin-author-name/AuthorName';
import {ReplyBox, ReplyButton} from '../../coral-plugin-replies';
import FlagComment from '../../coral-plugin-flags/FlagComment';
import LikeButton from '../../coral-plugin-likes/LikeButton';
import PermalinkButton from '../../coral-plugin-permalinks/PermalinkButton';
import SignInContainer from '../../coral-sign-in/containers/SignInContainer';
import UserBox from '../../coral-sign-in/components/UserBox';

import {TabBar, Tab, TabContent, Spinner} from '../../coral-ui';
import SettingsContainer from '../../coral-settings/containers/SettingsContainer';
import RestrictedContent from '../../coral-framework/components/RestrictedContent';
import SuspendedAccount from '../../coral-framework/components/SuspendedAccount';

import ConfigureStreamContainer from '../../coral-configure/containers/ConfigureStreamContainer';

const {addItem, updateItem, postItem, getStream, postAction, deleteAction, appendItemArray} = itemActions;
const {addNotification, clearNotification} = notificationActions;
const {logout, showSignInDialog} = authActions;

class CommentStream extends Component {

  constructor (props) {
    super(props);

    this.state = {
      activeTab: 0
    };

    this.changeTab = this.changeTab.bind(this);
  }

  changeTab (tab) {
    this.setState({
      activeTab: tab
    });
  }

  static propTypes = {
    items: PropTypes.object.isRequired,
    addItem: PropTypes.func.isRequired,
    updateItem: PropTypes.func.isRequired
  }

  componentDidMount () {
    // Set up messaging between embedded Iframe an parent component
    this.pym = new Pym.Child({polling: 100});

    const path = this.pym.parentUrl.split('#')[0];

    this.props.getStream(path || window.location);
    this.path = path;

    this.pym.sendMessage('childReady');

    this.pym.onMessage('DOMContentLoaded', hash => {
      const commentId = hash.replace('#', 'c_');
      let count = 0;
      const interval = setInterval(() => {
        if (document.getElementById(commentId)) {
          window.clearInterval(interval);
          this.pym.scrollParentToChildEl(commentId);
        }

        if (++count > 100) { // ~10 seconds
          // give up waiting for the comments to load.
          // it would be weird for the page to jump after that long.
          window.clearInterval(interval);
        }
      }, 100);
    });
  }

  render () {
    const rootItemId = this.props.items.assets && Object.keys(this.props.items.assets)[0];
    const rootItem = this.props.items.assets && this.props.items.assets[rootItemId];
    const {actions, users, comments} = this.props.items;
    const {status, moderation, closedMessage} = this.props.config;
    const {loggedIn, user, showSignInDialog, signInOffset} = this.props.auth;
    const {activeTab} = this.state;
    const banned = (this.props.userData.status === 'banned');

    const expandForLogin = showSignInDialog ? {
      minHeight: document.body.scrollHeight + 150
    } : {};
    return <div style={expandForLogin}>
      {
        rootItem
          ? <div className="commentStream">
          <TabBar onChange={this.changeTab} activeTab={activeTab}>
            <Tab><Count id={rootItemId} items={this.props.items}/></Tab>
            <Tab>Settings</Tab>
            <Tab>Configure Stream</Tab>
          </TabBar>
            {loggedIn && <UserBox user={user} logout={this.props.logout} />}
            <TabContent show={activeTab === 0}>
                {
                  status === 'open'
                  ? <div id="commentBox">
                      <InfoBox
                        content={this.props.config.infoBoxContent}
                        enable={this.props.config.infoBoxEnable}
                      />
                    <RestrictedContent restricted={banned} restrictedComp={<SuspendedAccount />}>
                      <CommentBox
                        addNotification={this.props.addNotification}
                        postItem={this.props.postItem}
                        appendItemArray={this.props.appendItemArray}
                        updateItem={this.props.updateItem}
                        id={rootItemId}
                        premod={moderation}
                        reply={false}
                        currentUser={this.props.auth.user}
                        banned={banned}
                        author={user}
                      />
                    </RestrictedContent>
                    </div>
                  : <p>{closedMessage}</p>
                }
                {!loggedIn && <SignInContainer offset={signInOffset} />}
                {
                  rootItem.comments && rootItem.comments.map((commentId) => {
                    const comment = comments[commentId];
                    return <div className="comment" key={commentId} id={`c_${commentId}`}>
                      <hr aria-hidden={true}/>
                      <AuthorName
                        author={users[comment.author_id]}
                        addNotification={this.props.addNotification}
                        id={commentId}
                        author_id={comment.author_id}
                        postAction={this.props.postAction}
                        showSignInDialog={this.props.showSignInDialog}
                        deleteAction={this.props.deleteAction}
                        addItem={this.props.addItem}
                        updateItem={this.props.updateItem}
                        currentUser={this.props.auth.user}/>
                      <PubDate created_at={comment.created_at}/>
                      <Content body={comment.body}/>
                      <div className="commentActionsLeft">
                        <ReplyButton
                          updateItem={this.props.updateItem}
                          id={commentId}
                          currentUser={this.props.auth.user}
                          showReply={comment.showReply}
                          banned={banned}/>
                        <LikeButton
                          addNotification={this.props.addNotification}
                          id={commentId}
                          like={actions[comment.like]}
                          showSignInDialog={this.props.showSignInDialog}
                          postAction={this.props.postAction}
                          deleteAction={this.props.deleteAction}
                          addItem={this.props.addItem}
                          updateItem={this.props.updateItem}
                          currentUser={this.props.auth.user}
                          banned={banned}/>
                      </div>
                      <div className="commentActionsRight">
                        <FlagComment
                          addNotification={this.props.addNotification}
                          id={commentId}
                          author_id={comment.author_id}
                          flag={actions[comment.flag]}
                          postAction={this.props.postAction}
                          deleteAction={this.props.deleteAction}
                          addItem={this.props.addItem}
                          showSignInDialog={this.props.showSignInDialog}
                          updateItem={this.props.updateItem}
                          banned={banned}
                          currentUser={this.props.auth.user}/>
                        <PermalinkButton
                          commentId={commentId}
                          articleURL={this.path}/>
                      </div>
                      <ReplyBox
                        addNotification={this.props.addNotification}
                        postItem={this.props.postItem}
                        appendItemArray={this.props.appendItemArray}
                        updateItem={this.props.updateItem}
                        id={rootItemId}
                        author={user}
                        parent_id={commentId}
                        premod={moderation}
                        currentUser={user}
                        showReply={comment.showReply}/>
                      {
                        comment.children &&
                        comment.children.map((replyId) => {
                          let reply = this.props.items.comments[replyId];
                          return <div className="reply" key={replyId} id={`c_${replyId}`}>
                            <hr aria-hidden={true}/>
                            <AuthorName author={users[reply.author_id]}/>
                            <PubDate created_at={reply.created_at}/>
                            <Content body={reply.body}/>
                            <div className="replyActionsLeft">
                              <ReplyButton
                                updateItem={this.props.updateItem}
                                id={replyId}
                                banned={banned}
                                currentUser={this.props.auth.user}
                                showReply={reply.showReply}/>
                              <LikeButton
                                addNotification={this.props.addNotification}
                                id={replyId}
                                like={this.props.items.actions[reply.like]}
                                postAction={this.props.postAction}
                                deleteAction={this.props.deleteAction}
                                addItem={this.props.addItem}
                                showSignInDialog={this.props.showSignInDialog}
                                updateItem={this.props.updateItem}
                                currentUser={this.props.auth.user}
                                banned={banned}/>
                            </div>
                            <div className="replyActionsRight">
                              <FlagComment
                                addNotification={this.props.addNotification}
                                id={replyId}
                                author_id={comment.author_id}
                                flag={actions[reply.flag]}
                                postAction={this.props.postAction}
                                showSignInDialog={this.props.showSignInDialog}
                                deleteAction={this.props.deleteAction}
                                addItem={this.props.addItem}
                                updateItem={this.props.updateItem}
                                banned={banned}
                                currentUser={this.props.auth.user}/>
                              <PermalinkButton
                                commentId={reply.parent_id}
                                articleURL={this.path}
                              />
                            </div>
                            <ReplyBox
                              addNotification={this.props.addNotification}
                              postItem={this.props.postItem}
                              appendItemArray={this.props.appendItemArray}
                              updateItem={this.props.updateItem}
                              id={rootItemId}
                              author={user}
                              parent_id={commentId}
                              child_id={replyId}
                              premod={moderation}
                              banned={banned}
                              currentUser={user}
                              showReply={reply.showReply}/>
                          </div>;
                        })
                    }
                  </div>;
                  })
                }
              <Notification
                notifLength={4500}
                clearNotification={this.props.clearNotification}
                notification={this.props.notification}
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
          :
        <Spinner/>
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

const mapDispatchToProps = (dispatch) => ({
  addItem: (item, item_id) => dispatch(addItem(item, item_id)),
  updateItem: (id, property, value, itemType) => dispatch(updateItem(id, property, value, itemType)),
  postItem: (data, type, id) => dispatch(postItem(data, type, id)),
  getStream: (rootId) => dispatch(getStream(rootId)),
  addNotification: (type, text) => dispatch(addNotification(type, text)),
  clearNotification: () => dispatch(clearNotification()),
  postAction: (item, itemType, action) => dispatch(postAction(item, itemType, action)),
  showSignInDialog: (offset) => dispatch(showSignInDialog(offset)),
  deleteAction: (item, action, user, itemType) => dispatch(deleteAction(item, action, user, itemType)),
  appendItemArray: (item, property, value, addToFront, itemType) => dispatch(appendItemArray(item, property, value, addToFront, itemType)),
  handleSignInDialog: () => dispatch(authActions.showSignInDialog()),
  logout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentStream);
