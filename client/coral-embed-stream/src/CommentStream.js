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
import LikeButton from '../../coral-plugin-likes/LikeButton';
import PermalinkButton from '../../coral-plugin-permalinks/PermalinkButton';

const {addItem, updateItem, postItem, getStream, postAction, deleteAction, appendItemArray} = itemActions;
const {addNotification, clearNotification} = notificationActions;
const {setLoggedInUser} = authActions;

const mapStateToProps = (state) => {
  return {
    config: state.config.toJS(),
    items: state.items.toJS(),
    notification: state.notification.toJS(),
    auth: state.auth.toJS()
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addItem: (item, itemType) => {
      return dispatch(addItem(item, itemType));
    },
    updateItem: (id, property, value, itemType) => {
      return dispatch(updateItem(id, property, value, itemType));
    },
    postItem: (data, type, id) => {
      return dispatch(postItem(data, type, id));
    },
    getStream: (rootId) => {
      return dispatch(getStream(rootId));
    },
    addNotification: (type, text) => {
      return dispatch(addNotification(type, text));
    },
    clearNotification: () => {
      return dispatch(clearNotification());
    },
    setLoggedInUser: (user_id) => {
      return dispatch(setLoggedInUser(user_id));
    },
    postAction: (item, action, user, itemType) => {
      return dispatch(postAction(item, action, user, itemType));
    },
    deleteAction: (item, action, user, itemType) => {
      return dispatch(deleteAction(item, action, user, itemType));
    },
    appendItemArray: (item, property, value, addToFront, itemType) => {
      return dispatch(appendItemArray(item, property, value, addToFront, itemType));
    }
  };
};

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
    console.log(pym);
    this.props.getStream('http://www.test.com');
  }

  render () {

    // TODO: Replace teststream id with id from params

    const rootItemId = this.props.items.assets && Object.keys(this.props.items.assets)[0];
    const rootItem = this.props.items.assets && this.props.items.assets[rootItemId];
    return <div>
      {
        rootItem
        ? <div>
          <div id="commentBox">
            <Count
              id={rootItemId}
              items={this.props.items}/>
            <CommentBox
              addNotification={this.props.addNotification}
              postItem={this.props.postItem}
              appendItemArray={this.props.appendItemArray}
              updateItem={this.props.updateItem}
              id={rootItemId}
              premod={this.props.config.moderation}
              reply={false}/>
          </div>
          {
            rootItem.comments && rootItem.comments.map((commentId) => {
              const comment = this.props.items.comments[commentId];
              return <div className="comment" key={commentId}>
                <hr aria-hidden={true}/>
                <AuthorName name={comment.username}/>
                <PubDate created_at={comment.created_at}/>
                <Content body={comment.body}/>
                <div className="commentActionsLeft">
                  <ReplyButton
                    updateItem={this.props.updateItem}
                    id={commentId}/>
                  <LikeButton
                    addNotification={this.props.addNotification}
                    id={commentId}
                    like={this.props.items.actions[comment.like]}
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
                    flag={this.props.items.actions[comment.flag]}
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
                        <div className="replyActionsLeft">
                            <ReplyButton
                              updateItem={this.props.updateItem}
                              id={replyId}/>
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
