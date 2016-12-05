import React, {Component, PropTypes} from 'react';
import {
  itemActions,
  Notification,
  notificationActions,
  authActions,
  configActions
} from '../../coral-framework';
import {connect} from 'react-redux';
import CommentBox from '../../coral-plugin-commentbox/CommentBox';
import InfoBox from '../../coral-plugin-infobox/InfoBox';
import Content from '../../coral-plugin-commentcontent/CommentContent';
import PubDate from '../../coral-plugin-pubdate/PubDate';
import Count from '../../coral-plugin-comment-count/CommentCount';
import AuthorName from '../../coral-plugin-author-name/AuthorName';
import {ReplyBox, ReplyButton} from '../../coral-plugin-replies';
import Pym from 'pym.js';
import FlagButton from '../../coral-plugin-flags/FlagButton';
import LikeButton from '../../coral-plugin-likes/LikeButton';
import PermalinkButton from '../../coral-plugin-permalinks/PermalinkButton';
import SignInContainer from '../../coral-sign-in/containers/SignInContainer';
import UserBox from '../../coral-sign-in/components/UserBox';
import {TabBar, Tab, TabContent, Button} from '../../coral-ui';
import SettingsContainer from '../../coral-settings/containers/SettingsContainer';
import {Icon} from 'react-mdl';

const {addItem, updateItem, postItem, getStream, postAction, deleteAction, appendItemArray} = itemActions;
const {addNotification, clearNotification} = notificationActions;
const {logout} = authActions;
const {updateOpenStatus} = configActions;

const mapStateToProps = (state) => {
  return {
    config: state.config.toJS(),
    items: state.items.toJS(),
    notification: state.notification.toJS(),
    auth: state.auth.toJS()
  };
};

const mapDispatchToProps = (dispatch) => ({
  addItem: (item, itemType) => dispatch(addItem(item, itemType)),
  updateItem: (id, property, value, itemType) => dispatch(updateItem(id, property, value, itemType)),
  postItem: (data, type, id) => dispatch(postItem(data, type, id)),
  getStream: (rootId) => dispatch(getStream(rootId)),
  addNotification: (type, text) => dispatch(addNotification(type, text)),
  clearNotification: () => dispatch(clearNotification()),
  postAction: (item, action, user, itemType) => dispatch(postAction(item, action, user, itemType)),
  deleteAction: (item, action, user, itemType) => {
    return dispatch(deleteAction(item, action, user, itemType));
  },
  appendItemArray: (item, property, value, addToFront, itemType) =>
    dispatch(appendItemArray(item, property, value, addToFront, itemType)),
  logout: () => dispatch(logout()),
  updateStatus: status => dispatch(updateOpenStatus(status))
});

class CommentStream extends Component {

  constructor (props) {
    super(props);

    this.state = {
      activeTab: 0
    };

    this.changeTab = this.changeTab.bind(this);
    this.toggleStatus = this.toggleStatus.bind(this);
  }

  changeTab (tab) {
    this.setState({
      activeTab: tab
    });
  }

  toggleStatus () {
    this.props.updateStatus(this.props.config.status === 'open' ? 'closed' : 'open')
  }

  static propTypes = {
    items: PropTypes.object.isRequired,
    addItem: PropTypes.func.isRequired,
    updateItem: PropTypes.func.isRequired
  }

  componentDidMount () {
    // Set up messaging between embedded Iframe an parent component
    // Using recommended Pym init code which violates .eslint standards
    this.pym = new Pym.Child({polling: 100});

    const path = this.pym.parentUrl.split('#')[0];

    this.props.getStream(path || window.location);
    this.path = path;

    this.pym.sendMessage('childReady');

    this.pym.onMessage('DOMContentLoaded', hash => {
      // the comment ids can start with numbers, which is invalid for DOM id attributes
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
    if (Object.keys(this.props.items).length === 0) {
        // Loading mock asset
      this.props.postItem({
        comments: [],
        url: 'http://coralproject.net'
      }, 'asset', 'assetTest');

      // Loading mock user
      //this.props.postItem({name: 'Ban Ki-Moon'}, 'user', 'user_8989')
      //  .then((id) => {
      //    this.props.setLoggedInUser(id);
      //  });
    }

    // TODO: Replace teststream id with id from params

    const rootItemId = this.props.items.assets && Object.keys(this.props.items.assets)[0];
    const rootItem = this.props.items.assets && this.props.items.assets[rootItemId];
    const {actions, users, comments} = this.props.items;
    const {loggedIn, user, showSignInDialog} = this.props.auth;
    const {status} = this.props.config;
    const {activeTab} = this.state;

    return <div className={showSignInDialog ? 'expandForSignin' : ''}>
      {
        rootItem
        ? <div className="commentStream">
          <TabBar onChange={this.changeTab} activeTab={activeTab}>
            <Tab><Count id={rootItemId} items={this.props.items}/></Tab>
            <Tab>Settings</Tab>
            <Tab>Configure Stream</Tab>
          </TabBar>

          <TabContent show={activeTab === 0}>
            <div id="commentBox">
              <InfoBox
                content={this.props.config.infoBoxContent}
                enable={this.props.config.infoBoxEnable}
              />
              {loggedIn && <UserBox user={user} logout={this.props.logout} />}
              <CommentBox
                addNotification={this.props.addNotification}
                postItem={this.props.postItem}
                appendItemArray={this.props.appendItemArray}
                updateItem={this.props.updateItem}
                id={rootItemId}
                premod={this.props.config.moderation}
                reply={false}
                author={user}
              />
              {!loggedIn && <SignInContainer />}
            </div>
            {
              rootItem.comments && rootItem.comments.map((commentId) => {
                const comment = comments[commentId];
                return <div className="comment" key={commentId} id={`c_${commentId}`}>
                  <hr aria-hidden={true}/>
                  <AuthorName author={users[comment.author_id]}/>
                  <PubDate created_at={comment.created_at}/>
                  <Content body={comment.body}/>
                  <div className="commentActionsLeft">
                    <ReplyButton
                      updateItem={this.props.updateItem}
                      id={commentId}
                      showReply={comment.showReply}/>
                    <LikeButton
                      addNotification={this.props.addNotification}
                      id={commentId}
                      like={actions[comment.like]}
                      postAction={this.props.postAction}
                      deleteAction={this.props.deleteAction}
                      addItem={this.props.addItem}
                      updateItem={this.props.updateItem}
                      currentUser={this.props.auth.user}/>
                  </div>
                  <div className="commentActionsRight">
                    <FlagButton
                      addNotification={this.props.addNotification}
                      id={commentId}
                      flag={actions[comment.flag]}
                      postAction={this.props.postAction}
                      deleteAction={this.props.deleteAction}
                      addItem={this.props.addItem}
                      updateItem={this.props.updateItem}
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
                      premod={this.props.config.moderation}
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
                                showReply={reply.showReply}/>
                              <LikeButton
                                addNotification={this.props.addNotification}
                                id={replyId}
                                like={this.props.items.actions[reply.like]}
                                postAction={this.props.postAction}
                                deleteAction={this.props.deleteAction}
                                addItem={this.props.addItem}
                                updateItem={this.props.updateItem}
                                currentUser={this.props.auth.user}/>
                            </div>
                            <div className="replyActionsRight">
                              <FlagButton
                                addNotification={this.props.addNotification}
                                id={replyId}
                                flag={this.props.items.actions[reply.flag]}
                                postAction={this.props.postAction}
                                deleteAction={this.props.deleteAction}
                                addItem={this.props.addItem}
                                updateItem={this.props.updateItem}
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
                              premod={this.props.config.moderation}
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
            <SettingsContainer/>
          </TabContent>
          <TabContent show={activeTab === 2}>
            <h3>{status === 'open' ? 'Close' : 'Open'} Comment Stream</h3>
            <CloseCommentsInfo onClick={this.toggleStatus}
              status={status} />
          </TabContent>
        </div>
        : 'Loading'
      }
    </div>;
  }
}

const CloseCommentsInfo = ({ status, onClick }) => status === 'open' ? (
  <div className="close-comments-intro-wrapper">
    <p>
      This comment stream is currently open. By closing this comment stream,
      no new comments may be submitted and all previous comments will still
      be displayed.
    </p>
    <Button onClick={onClick}>Close Stream</Button>
  </div>
) : (
  <div className="close-comments-intro-wrapper">
    <p>
      This comment stream is currently closed. By opening this comment stream,
      new comments may be submitted and displayed
    </p>
    <Button onClick={onClick}>Open Stream</Button>
  </div>
)

export default connect(mapStateToProps, mapDispatchToProps)(CommentStream);
