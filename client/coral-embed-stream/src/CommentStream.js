import React, {Component, PropTypes} from 'react';
import Pym from 'pym.js';
import {graphql} from 'react-apollo';
import {connect} from 'react-redux';
import gql from 'graphql-tag';

import {

  // itemActions,
  // Notification,
  // notificationActions,
  authActions
} from '../../coral-framework';

// import CommentBox from '../../coral-plugin-commentbox/CommentBox';
// import InfoBox from '../../coral-plugin-infobox/InfoBox';
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

// import SettingsContainer from '../../coral-settings/containers/SettingsContainer';
// import RestrictedContent from '../../coral-framework/components/RestrictedContent';
// import SuspendedAccount from '../../coral-framework/components/SuspendedAccount';

// import ConfigureStreamContainer from '../../coral-configure/containers/ConfigureStreamContainer';

// const {addItem, updateItem, postItem, getStream, postAction, deleteAction, appendItemArray} = itemActions;
// const {addNotification, clearNotification} = notificationActions;
const {logout, showSignInDialog} = authActions;

const assetID = 'bc7b4cef-1e14-46e1-9db4-66465192f168';

class CommentStream extends Component {

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

    // Set up messaging between embedded Iframe an parent component
    this.pym = new Pym.Child({polling: 100});

    let path = this.pym.parentUrl.split('#')[0];

    if (!path) {
      path = window.location.href.split('#')[0];
    }

    // this.props.getStream(path || window.location);
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

    // const rootItemId = this.props.items.assets && Object.keys(this.props.items.assets)[0];
    // const rootItem = this.props.items.assets && this.props.items.assets[rootItemId];
    // const {actions, users, comments} = this.props.items;
    // const {status, moderation, closedMessage, charCount, charCountEnable} = this.props.config;
    const {isAdmin, showSignInDialog} = this.props.auth;
    const {activeTab} = this.state;

    // const banned = (this.props.userData.status === 'banned');

    const {loading, asset, currentUser, refetch} = this.props.data;

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
            {currentUser && <UserBox user={currentUser} logout={this.props.logout} />}
            <TabContent show={activeTab === 0}>
                {

                  // status === 'open'
                  // ? <div id="commentBox">
                  //     <InfoBox
                  //       content={''/*this.props.config.infoBoxContent*/}
                  //       enable={false/*this.props.config.infoBoxEnable*/}
                  //     />
                  //   <RestrictedContent restricted={false/*banned*/} restrictedComp={<SuspendedAccount />}>
                  //     <CommentBox
                  //       addNotification={this.props.addNotification}
                  //       postItem={this.props.postItem}
                  //       appendItemArray={this.props.appendItemArray}
                  //       updateItem={this.props.updateItem}
                  //       id={rootItemId}
                  //       premod={moderation}
                  //       reply={false}
                  //       currentUser={this.props.auth.user}
                  //       banned={false/*banned*/}
                  //       author={user}
                  //       charCount={charCountEnable && charCount}/>
                  //   </RestrictedContent>
                  //   </div>
                  // : <p>{closedMessage}</p>
                }
                {
                  !currentUser && <SignInContainer
                    refetch={refetch}
                    showSignInDialog={showSignInDialog}/>
                }
                {
                  asset.comments.map((comment) => {
                    return <div className="comment" key={comment.id} id={`c_${comment.id}`}>
                      <hr aria-hidden={true}/>
                      <AuthorName
                        author={comment.user}
                        addNotification={this.props.addNotification}
                        id={comment.id}
                        author_id={comment.user.id}
                        postAction={this.props.postAction}
                        showSignInDialog={this.props.showSignInDialog}
                        deleteAction={this.props.deleteAction}
                        addItem={this.props.addItem}
                        updateItem={this.props.updateItem}
                        currentUser={currentUser}/>
                      <PubDate created_at={comment.created_at}/>
                      <Content body={comment.body}/>
                      <div className="commentActionsLeft">
                        <ReplyButton
                          updateItem={this.props.updateItem}
                          id={comment.id}
                          currentUser={currentUser}
                          showReply={comment.showReply}
                          banned={false/* banned*/}/>
                        <LikeButton
                          addNotification={this.props.addNotification}
                          id={comment.id}
                          like={comment.actions/* Need to find a way to identify which is a like.*/}
                          showSignInDialog={this.props.showSignInDialog}
                          postAction={this.props.postAction}
                          deleteAction={this.props.deleteAction}
                          addItem={this.props.addItem}
                          updateItem={this.props.updateItem}
                          currentUser={currentUser}
                          banned={false/* banned*/}/>
                      </div>
                      <div className="commentActionsRight">
                        <FlagComment
                          addNotification={this.props.addNotification}
                          id={comment.id}
                          author_id={comment.user.id}
                          flag={comment.actions/* Need to find a way to identify which is a flag.*/}
                          postAction={this.props.postAction}
                          deleteAction={this.props.deleteAction}
                          addItem={this.props.addItem}
                          showSignInDialog={this.props.showSignInDialog}
                          updateItem={this.props.updateItem}
                          banned={false/* banned*/}
                          currentUser={currentUser}/>
                        <PermalinkButton
                          commentId={comment.id}
                          articleURL={this.path}/>
                      </div>
                      <ReplyBox
                        addNotification={this.props.addNotification}
                        postItem={this.props.postItem}
                        appendItemArray={this.props.appendItemArray}
                        updateItem={this.props.updateItem}
                        id={asset.id}
                        author={null}
                        parent_id={comment.id}
                        premod={'post'}
                        currentUser={null/* user*/}
                        charCount={100/* charCountEnable && charCount*/}
                        showReply={false/* comment.showReply need a way to do these sorts of comment-level settings*/}/>
                      {
                        comment.replies.map((reply) => {
                          return <div className="reply" key={reply.id} id={`c_${reply.id}`}>
                            <hr aria-hidden={true}/>
                            <AuthorName author={reply.author}/>
                            <PubDate created_at={reply.created_at}/>
                            <Content body={reply.body}/>
                            <div className="replyActionsLeft">
                              <ReplyButton
                                updateItem={this.props.updateItem}
                                id={reply.id}
                                banned={false/* banned*/}
                                currentUser={this.props.auth.user}
                                showReply={reply.showReply}/>
                              <LikeButton
                                addNotification={this.props.addNotification}
                                id={reply.id}
                                like={reply.actions}
                                postAction={this.props.postAction}
                                deleteAction={this.props.deleteAction}
                                addItem={this.props.addItem}
                                showSignInDialog={this.props.showSignInDialog}
                                updateItem={this.props.updateItem}
                                currentUser={currentUser}
                                banned={false/* banned*/}/>
                            </div>
                            <div className="replyActionsRight">
                              <FlagComment
                                addNotification={this.props.addNotification}
                                id={reply.id}
                                author_id={comment.user_id}
                                flag={reply.actions}
                                postAction={this.props.postAction}
                                showSignInDialog={this.props.showSignInDialog}
                                deleteAction={this.props.deleteAction}
                                addItem={this.props.addItem}
                                updateItem={this.props.updateItem}
                                banned={false/* banned*/}
                                currentUser={null}/>
                              <PermalinkButton
                                commentId={reply.parent_id}
                                articleURL={this.path}
                              />
                            </div>
                            {
                              <ReplyBox
                                addNotification={this.props.addNotification}
                                postItem={this.props.postItem}
                                appendItemArray={this.props.appendItemArray}
                                updateItem={this.props.updateItem}
                                id={asset.id}
                                author={reply.user}
                                parent_id={comment.id}
                                child_id={reply.id}
                                premod={'post'/* moderation*/}
                                banned={false/* banned*/}
                                currentUser={null}
                                charCount={null/* charCountEnable && charCount*/}
                                showReply={reply.showReply}/>
                            }
                          </div>;
                        })
                    }
                  </div>;
                  })
                }
            {

              // <Notification
              //   notifLength={4500}
              //   clearNotification={this.props.clearNotification}
              //   notification={{text: null}}
              // />
          }
            </TabContent>
            {

            //   <TabContent show={activeTab === 1}>
            //     <SettingsContainer
            //       loggedIn={loggedIn}
            //       userData={this.props.userData}
            //       showSignInDialog={this.props.handleSignInDialog}
            //     />
            //   </TabContent>
            //   <TabContent show={activeTab === 2}>
            //     <RestrictedContent restricted={!loggedIn}>
            //       <ConfigureStreamContainer
            //         status={status}
            //         onClick={this.toggleStatus}
            //       />
            //     </RestrictedContent>
            //   </TabContent>
            // <Notification
            //   notifLength={4500}
            //   clearNotification={this.props.clearNotification}
            //   notification={this.props.notification}
            // />
            }
        </div>
      }
    </div>;
  }
}

// const mapStateToProps = state => ({
//   config: state.config.toJS(),
//   items: state.items.toJS(),
//   notification: state.notification.toJS(),
//   auth: state.auth.toJS(),
//   userData: state.user.toJS()
// });
//
// const mapDispatchToProps = (dispatch) => ({
//   addItem: (item, item_id) => dispatch(addItem(item, item_id)),
//   updateItem: (id, property, value, itemType) => dispatch(updateItem(id, property, value, itemType)),
//   postItem: (data, type, id) => dispatch(postItem(data, type, id)),
//   getStream: (rootId) => dispatch(getStream(rootId)),
//   addNotification: (type, text) => dispatch(addNotification(type, text)),
//   clearNotification: () => dispatch(clearNotification()),
//   postAction: (item, itemType, action) => dispatch(postAction(item, itemType, action)),
//   showSignInDialog: (offset) => dispatch(showSignInDialog(offset)),
//   deleteAction: (item, action, user, itemType) => dispatch(deleteAction(item, action, user, itemType)),
//   appendItemArray: (item, property, value, addToFront, itemType) => dispatch(appendItemArray(item, property, value, addToFront, itemType)),
//   handleSignInDialog: () => dispatch(authActions.showSignInDialog()),
//   logout: () => dispatch(logout())
// });
// Initialize GraphQL queries or mutations with the `gql` tag
const StreamQuery = gql`fragment commentView on Comment {
  id
  body
  user {
    id
    name: displayName
  }
  actions {
    type: action_type
    count
    current: current_user {
      id
      created_at
    }
  }
}

query AssetQuery($asset_id: ID!) {
  asset(id: $asset_id) {
    id
    title
    url
    comments {
      ...commentView
      replies {
        ...commentView
      }
    }
  },
  currentUser: me {
    id,
    displayName
  }
}`;

const CommentStreamWithData = graphql(
  StreamQuery, {
    options: {
      variables: {
        asset_id: assetID
      }
    }
  }
)(CommentStream);

export default connect(
  state => state,
  dispatch => {
    return {
      logout: () => dispatch(logout()),
      showSignInDialog: (offset) => dispatch(showSignInDialog(offset)),
    };
  }
)(CommentStreamWithData);
