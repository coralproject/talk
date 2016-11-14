import React, {Component, PropTypes} from 'react';
import {
  itemActions,
  Notification,
  notificationActions,
  authActions
} from '../../coral-framework';
import {connect} from 'react-redux';
import CommentBox from '../../coral-plugin-commentbox/CommentBox';
import Content from '../../coral-plugin-commentcontent/CommentContent';
import PubDate from '../../coral-plugin-pubdate/PubDate';
import Count from '../../coral-plugin-comment-count/CommentCount';
import AuthorName from '../../coral-plugin-author-name/AuthorName';
import {ReplyBox, ReplyButton} from '../../coral-plugin-replies';
import Pym from 'pym.js';
import FlagButton from '../../coral-plugin-flags/FlagButton';
import PermalinkButton from '../../coral-plugin-permalinks/PermalinkButton';
import SignInContainer from '../../coral-sign-in/containers/SignInContainer';
import UserBox from '../../coral-sign-in/components/UserBox';

const {addItem, updateItem, postItem, getStream, postAction, appendItemArray} = itemActions;
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
  setLoggedInUser: (user_id) => dispatch(setLoggedInUser(user_id)),
  postAction: (item, action, user, itemType) => dispatch(postAction(item, action, user, itemType)),
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
    new Pym.Child({polling: 500});
    this.props.getStream('assetTest');
  }

  render () {
    if (Object.keys(this.props.items).length === 0) {
        // Loading mock asset
      this.props.postItem({
        comments: [],
        url: 'http://coralproject.net'
      }, 'asset', 'assetTest');

        // Loading mock user
      this.props.postItem({name: 'Ban Ki-Moon'}, 'user', 'user_8989')
        .then((id) => {
          this.props.setLoggedInUser(id);
        });
    }

    // TODO: Replace teststream id with id from params

    const rootItemId = 'assetTest';
    const rootItem = this.props.items.assets && this.props.items.assets[rootItemId];
    const {loggedIn, user} = this.props.auth;
    return <div>
      {
        rootItem
        ? <div>
          <div id="commentBox">
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
              canPost={loggedIn}
            />
            {!loggedIn && <SignInContainer />}
          </div>
          {
            rootItem.comments.map((commentId) => {
              const comment = this.props.items.comments[commentId];
              return <div className="comment" key={commentId}>
                <hr aria-hidden={true}/>
                <AuthorName name={comment.username}/>
                <PubDate created_at={comment.created_at}/>
                <Content body={comment.body}/>
                <div className="commentActions">
                  <FlagButton
                    addNotification={this.props.addNotification}
                    id={commentId}
                    flag={this.props.items.actions[comment.flag]}
                    postAction={this.props.postAction}
                    addItem={this.props.addItem}
                    updateItem={this.props.updateItem}
                    currentUser={this.props.auth.user}/>
                  <ReplyButton
                    updateItem={this.props.updateItem}
                    id={commentId}/>
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
                    parent_id={commentId}
                    premod={this.props.config.moderation}
                    showReply={comment.showReply}/>
                  {
                    comment.children &&
                    comment.children.map((replyId) => {
                      let reply = this.props.items.comments[replyId];
                      return <div className="reply" key={replyId}>
                        <hr aria-hidden={true}/>
                        <AuthorName name={reply.username}/>
                        <PubDate created_at={reply.created_at}/>
                        <Content body={reply.body}/>
                        <div className="replyActions">
                          <FlagButton
                            addNotification={this.props.addNotification}
                            id={replyId}
                            flag={this.props.items.actions[reply.flag]}
                            postAction={this.props.postAction}
                            addItem={this.props.addItem}
                            updateItem={this.props.updateItem}
                            currentUser={this.props.auth.user}/>
                          <ReplyButton
                            updateItem={this.props.updateItem}
                            parent_id={reply.parent_id}/>
                          <PermalinkButton
                            comment_id={reply.comment_id}
                            asset_id={reply.comment_id}
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
