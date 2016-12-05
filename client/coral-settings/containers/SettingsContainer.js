import React, {Component} from 'react';
import {connect} from 'react-redux';

import {saveBio} from 'coral-framework/actions/user';

import BioContainer from './BioContainer';
import NotLoggedIn from '../components/NotLoggedIn';
import {TabBar, Tab, TabContent} from '../../coral-ui';
import CommentHistory from '../components/CommentHistory';
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
  }

  handleTabChange(tab) {
    this.setState({
      activeTab: tab
    });
  }

  render() {
    const {loggedIn, userData, showSignInDialog} = this.props;
    const {activeTab} = this.state;
    return (
      <RestrictedContent restricted={!loggedIn} restrictedComp={<NotLoggedIn showSignInDialog={showSignInDialog} />}>
        <SettingsHeader {...this.props} />
        <TabBar onChange={this.handleTabChange} activeTab={activeTab} cStyle='material'>
          <Tab>All Comments (120)</Tab>
          <Tab>Profile Settings</Tab>
        </TabBar>
        <TabContent show={activeTab === 0}>
          <CommentHistory {...this.props}/>
        </TabContent>
        <TabContent show={activeTab === 1}>
          <BioContainer bio={userData.settings.bio} handleSave={this.handleSave} {...this.props} />
        </TabContent>
      </RestrictedContent>
    );
  }
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = dispatch => ({
  saveBio: (user_id, formData) => dispatch(saveBio(user_id, formData)),
  getHistory: () => dispatch(),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignInContainer);
