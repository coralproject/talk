import React, {Component, PropTypes} from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';

import {TabBar, Tab, TabContent, Spinner} from '../../coral-ui';

const {logout, showSignInDialog} = authActions;
const {addNotification, clearNotification} = notificationActions;

import {queryStream} from './graphql/queries';
import {postComment, postAction, deleteAction} from './graphql/mutations';
import {Notification, notificationActions, authActions} from 'coral-framework';

import Stream from './Stream';
import InfoBox from 'coral-plugin-infobox/InfoBox';
import Count from 'coral-plugin-comment-count/CommentCount';
import CommentBox from 'coral-plugin-commentbox/CommentBox';
import UserBox from '../../coral-sign-in/components/UserBox';
import SignInContainer from '../../coral-sign-in/containers/SignInContainer';
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

  componentWillReceiveProps (nextProps) {
    if (nextProps.data != null) {
      console.log(nextProps.data)
    }
  }

  render () {
    const {activeTab} = this.state;
    const {dispatch} = this.props;
    const {loading, asset, refetch} = this.props.data;
    const {loggedIn, isAdmin, user, showSignInDialog, signInOffset} = this.props.auth;

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


