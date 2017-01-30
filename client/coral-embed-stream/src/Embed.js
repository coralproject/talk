import React, {Component} from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {isEqual} from 'lodash';

import {TabBar, Tab, TabContent, Spinner} from '../../coral-ui';

const {logout, showSignInDialog} = authActions;
const {addNotification, clearNotification} = notificationActions;
const {fetchAssetSuccess} = assetActions;

import {queryStream} from './graphql/queries';
import {postComment, postAction, deleteAction} from './graphql/mutations';
import {Notification, notificationActions, authActions, assetActions, pym} from 'coral-framework';

import Stream from './Stream';
import InfoBox from 'coral-plugin-infobox/InfoBox';
import Count from 'coral-plugin-comment-count/CommentCount';
import CommentBox from 'coral-plugin-commentbox/CommentBox';
import UserBox from '../../coral-sign-in/components/UserBox';
import SignInContainer from '../../coral-sign-in/containers/SignInContainer';
import ChangeDisplayNameContainer from '../../coral-framework/containers/ChangeDisplayNameContainer';
import SuspendedAccount from '../../coral-framework/components/SuspendedAccount';
import SettingsContainer from '../../coral-settings/containers/SettingsContainer';
import RestrictedContent from '../../coral-framework/components/RestrictedContent';
import ConfigureStreamContainer from '../../coral-configure/containers/ConfigureStreamContainer';

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
    const {loading, asset, refetch} = this.props.data;
    const {loggedIn, isAdmin, user, showSignInDialog, signInOffset} = this.props.auth;

    const expandForLogin = showSignInDialog ? {
      minHeight: document.body.scrollHeight + 200
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
                       {
                         user
                         ? <CommentBox
                            commentPostedHandler={refetch}
                            addNotification={this.props.addNotification}
                            postItem={this.props.postItem}
                            appendItemArray={this.props.appendItemArray}
                            updateItem={this.props.updateItem}
                            assetId={asset.id}
                            premod={asset.settings.moderation}
                            isReply={false}
                            currentUser={this.props.auth.user}
                            banned={false}
                            authorId={user.id}
                            charCount={asset.settings.charCountEnable && asset.settings.charCount} />
                         : null
                       }
                     </RestrictedContent>
                     </div>
                   : <p>{asset.settings.closedMessage}</p>
                }
                {!loggedIn && <SignInContainer offset={signInOffset}/>}
                {loggedIn && <ChangeDisplayNameContainer loggedIn={loggedIn} offset={signInOffset} user={user}/>}
                <Stream
                  refetch={refetch}
                  addNotification={this.props.addNotification}
                  postItem={this.props.postItem}
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
      }
    </div>;
  }
}

const mapStateToProps = state => ({
  items: state.items.toJS(),
  notification: state.notification.toJS(),
  auth: state.auth.toJS(),
  userData: state.user.toJS()
});

const mapDispatchToProps = dispatch => ({
  loadAsset: (asset) => dispatch(fetchAssetSuccess(asset)),
  addNotification: (type, text) => dispatch(addNotification(type, text)),
  clearNotification: () => dispatch(clearNotification()),
  showSignInDialog: (offset) => dispatch(showSignInDialog(offset)),
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
