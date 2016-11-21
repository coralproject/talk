import React, {Component, PropTypes} from 'react';
import {
  itemActions,
  Notification,
  notificationActions,
  authActions
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

const {addItem, updateItem, postItem, getStream, postAction, deleteAction, appendItemArray} = itemActions;
const {addNotification, clearNotification} = notificationActions;
const {logout} = authActions;

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
  logout: () => dispatch(logout())
});

class CommentStream extends Component {

  static propTypes = {
    items: PropTypes.object.isRequired,
    addItem: PropTypes.func.isRequired,
    updateItem: PropTypes.func.isRequired
  }

  componentDidMount () {
    // Set up messaging between embedded Iframe an parent component
    // Using recommended Pym init code which violates .eslint standards
    const pym = new Pym.Child({polling: 100});
    const path = /https?\:\/\/([^?]+)/.exec(pym.parentUrl);
    this.props.getStream(path && path[1] || window.location);
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
    return <div className={showSignInDialog ? 'expandForSignin' : ''}>
      {
        rootItem
        ? <div>
          <div id="commentBox">
            <InfoBox
              content={this.props.config.infoBoxContent}
              enable={this.props.config.infoBoxEnable}/>
            <Count
              id={rootItemId}
              items={this.props.items}/>
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
              const comment = this.props.items.comments[commentId];
              return <div className="comment" key={commentId}>
                <hr aria-hidden={true}/>
                <AuthorName author={users[comment.author_id]}/>
                <PubDate created_at={comment.created_at}/>
                <Content body={comment.body}/>
                <div className="commentActionsLeft">
                  <ReplyButton
                    updateItem={this.props.updateItem}
                    id={commentId}/>
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
                      comment_id={commentId}
                      asset_id={comment.asset_id}/>
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
                      return <div className="reply" key={replyId}>
                        <hr aria-hidden={true}/>
                        <AuthorName author={users[comment.author_id]}/>
                        <PubDate created_at={reply.created_at}/>
                        <Content body={reply.body}/>
                        <div className="replyActionsLeft">
                            <ReplyButton
                              updateItem={this.props.updateItem}
                              parent_id={reply.parent_id}/>
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
                                comment_id={reply.parent_id}
                                asset_id={rootItemId}
                                />
                          </div>
                      </div>;
                    })
                }
              </div>;
            })
          }
          <Notification
            notifLength={4500}
            clearNotification={this.props.clearNotification}
            notification={this.props.notification}/>
        </div>
        : 'Loading'
      }
    </div>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentStream);
