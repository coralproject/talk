import React, {Component} from 'react';
import {connect} from 'react-redux';

import {saveBio, fetchCommentsByUserId} from 'coral-framework/actions/user';

import {link} from 'coral-framework/PymConnection';
import BioContainer from './BioContainer';
import NotLoggedIn from '../components/NotLoggedIn';
import {TabBar, Tab, TabContent} from 'coral-ui';
import CommentHistory from 'coral-plugin-history/CommentHistory';
import SettingsHeader from '../components/SettingsHeader';
import RestrictedContent from 'coral-framework/components/RestrictedContent';

import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations';
const lang = new I18n(translations);

class SettingsContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
      activeTab: 0,
    };

    this.handleTabChange = this.handleTabChange.bind(this);
  }

  componentWillMount () {
    // this.props.fetchCommentsByUserId(this.props.userData.id);
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
          <Tab>All Comments ({user.myComments.length})</Tab>
          <Tab>Profile Settings</Tab>
        </TabBar>
        <TabContent show={activeTab === 0}>
          My comment History
        </TabContent>
        <TabContent show={activeTab === 1}>
          <BioContainer bio={userData.settings.bio} handleSave={this.handleSave} {...this.props} />
        </TabContent>
      </RestrictedContent>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.toJS()
});

const mapDispatchToProps = dispatch => ({
  saveBio: (user_id, formData) => dispatch(saveBio(user_id, formData))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsContainer);
