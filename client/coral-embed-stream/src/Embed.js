import React, {Component, PropTypes} from 'react';
import Pym from 'pym.js';
import {graphql, compose} from 'react-apollo';
import {connect} from 'react-redux';
import gql from 'graphql-tag';

import {
  itemActions,
  Notification,
  notificationActions,
  authActions
} from '../../coral-framework';

import Comment from './Comment';

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

// import SettingsContainer from '../../coral-settings/containers/SettingsContainer';
import RestrictedContent from '../../coral-framework/components/RestrictedContent';
import SuspendedAccount from '../../coral-framework/components/SuspendedAccount';

// import ConfigureStreamContainer from '../../coral-configure/containers/ConfigureStreamContainer';

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
    return;

    // Set up messaging between embedded Iframe an parent component
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

    const {isAdmin, showSignInDialog} = this.props.auth;
    const {activeTab} = this.state;

    // const banned = (this.props.userData.status === 'banned');

    const {loading, asset, currentUser, refetch} = this.props.data;

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
            {currentUser && <UserBox user={currentUser} logout={this.props.logout} />}
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
                         author={currentUser}
                         charCount={asset.settings.charCountEnable && asset.settings.charCount}/>
                     </RestrictedContent>
                     </div>
                   : <p>{asset.settings.closedMessage}</p>
                }
                {
                  !currentUser && <SignInContainer
                    refetch={refetch}
                    showSignInDialog={showSignInDialog}/>
                }
                {
                  asset.comments.map(comment => {
                    return <Comment key={comment.id} comment={comment} />;
                  })
                }
            {
             <Notification
               notifLength={4500}
               clearNotification={this.props.clearNotification}
               notification={{text: null}}
             />
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

const mapStateToProps = state => (state);
const mapDispatchToProps = (dispatch, ownProps) => ({});

// const mapDispatchToProps = (dispatch, ownProps) => ({
//   addItem: (item, item_id) => dispatch(addItem(item, item_id)),
//   updateItem: (id, property, value, itemType) => dispatch(updateItem(id, property, value, itemType)),
//   postItem: (data, type, id) => {
//     console.log('postItem', dispatch, ownProps)
//     // dispatch(postItem(data, type, id, ownProps))
//   },
//   getStream: (rootId) => dispatch(getStream(rootId)),
//   addNotification: (type, text) => dispatch(addNotification(type, text)),
//   clearNotification: () => dispatch(clearNotification()),
//   postAction: (item, itemType, action) => dispatch(postAction(item, itemType, action)),
//   showSignInDialog: (offset) => dispatch(showSignInDialog(offset)),
//   deleteAction: (item, action, user, itemType) => dispatch(deleteAction(item, action, user, itemType)),
//   appendItemArray: (item, property, value, addToFront, itemType) => dispatch(appendItemArray(item, property, value, addToFront, itemType)),
//   handleSignInDialog: () => dispatch(authActions.showSignInDialog()),
//   logout: () => dispatch(logout()),
// });

// Initialize GraphQL queries or mutations with the `gql` tag
const StreamQuery = gql`
fragment commentView on Comment {
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

query AssetQuery($asset_url: String!) {
  asset(url: $asset_url) {
    id
    title
    url
    closedAt
    settings {
      moderation
      infoBoxEnable
      infoBoxContent
      closeTimeout
      closedMessage
      charCountEnable
      charCount
      requireEmailConfirmation
    }
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
}
`;

const postComment = gql`
  fragment commentView on Comment {
    id
    body
    user {
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

  mutation CreateComment ($asset_id: ID!, $parent_id: ID, $body: String!) {
    createComment(asset_id:$asset_id, parent_id:$parent_id, body:$body) {
        ...commentView
      }
    }
`;

const pym = new Pym.Child({polling: 100});

let url = pym.parentUrl;

console.log('pym.parentUrl', url);

export default compose(
  graphql(StreamQuery, {
    options: { variables: { asset_url: url } },
    props: props => props,
  }),
  graphql(postComment, {
    props: ({ownProps, mutate}) => ({
      postItem: ({asset_id, author_id, body}) => {
        mutate({
          variables: {
            asset_id,
            body,
            parent_id: null
          }
        }).then(({data}) => {
          console.log('it workt');
          console.log(data);
        });
    }}),
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(Embed);
