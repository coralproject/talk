import React, {Component} from 'react';
import {connect} from 'react-redux';

import {saveBio, fetchCommentsByUserId} from 'coral-framework/actions/user';
import {fetchMulitpleAssets} from 'coral-framework/actions/assets';

import BioContainer from './BioContainer';
import NotLoggedIn from '../components/NotLoggedIn';
import {TabBar, Tab, TabContent} from '../../coral-ui';
import CommentHistory from 'coral-plugin-history/CommentHistory';
import SettingsHeader from '../components/SettingsHeader';
import RestrictedContent from 'coral-framework/components/RestrictedContent';

class SignInContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
      activeTab: 0,
    };

    this.handleTabChange = this.handleTabChange.bind(this);
  }

  componentWillMount () {
    // Fetch commentHistory
    this.props.fetchCommentsByUserId(this.props.userData.id);
  }

  handleTabChange(tab) {
    this.setState({
      activeTab: tab
    });
  }

  render() {
    const {loggedIn, userData, showSignInDialog, items, user} = this.props;
    const {activeTab} = this.state;
    return (
      <RestrictedContent restricted={!loggedIn} restrictedComp={<NotLoggedIn showSignInDialog={showSignInDialog} />}>
        <SettingsHeader {...this.props} />
        <TabBar onChange={this.handleTabChange} activeTab={activeTab} cStyle='material'>
          <Tab>All Comments (120)</Tab>
          <Tab>Profile Settings</Tab>
        </TabBar>
        <TabContent show={activeTab === 0}>
          {
            user.myComments.length && user.myAssets.length
            ? <CommentHistory
              comments={user.myComments.map(id => items.comments[id])}
              assets={user.myAssets.map(id => items.assets[id])} />
            : <p>Loading comment history...</p>
          }
        </TabContent>
        <TabContent show={activeTab === 1}>
          <BioContainer bio={userData.settings.bio} handleSave={this.handleSave} {...this.props} />
        </TabContent>
      </RestrictedContent>
    );
  }
}

const mapStateToProps = state => ({
  items: state.items.toJS(),
  user: state.user.toJS()
});

const mapDispatchToProps = dispatch => ({
  saveBio: (user_id, formData) => dispatch(saveBio(user_id, formData)),
  fetchCommentsByUserId: userId => dispatch(fetchCommentsByUserId(userId)),
  fetchMulitpleAssets: assetIds => dispatch(fetchMulitpleAssets(assetIds))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignInContainer);
