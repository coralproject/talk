import {connect} from 'react-redux';
import React, {Component} from 'react';
import I18n from 'coral-framework/modules/i18n/i18n';

import {saveBio} from 'coral-framework/actions/user';

import BioContainer from './BioContainer';
import {TabBar, Tab, TabContent} from 'coral-ui';
import NotLoggedIn from '../components/NotLoggedIn';
import SettingsHeader from '../components/SettingsHeader';
import RestrictedContent from 'coral-framework/components/RestrictedContent';

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

  handleTabChange(tab) {
    this.setState({
      activeTab: tab
    });
  }

  render() {
    const {loggedIn, userData, showSignInDialog, user} = this.props;
    const {activeTab} = this.state;

    return (
      <RestrictedContent restricted={!loggedIn} restrictedComp={<NotLoggedIn showSignInDialog={showSignInDialog} />}>
        <SettingsHeader {...this.props} />
        <TabBar onChange={this.handleTabChange} activeTab={activeTab} cStyle='material'>
          <Tab>{lang.t('allComments')} ({user.myComments.length})</Tab>
          <Tab>{lang.t('profileSettings')}</Tab>
        </TabBar>
        <TabContent show={activeTab === 0}>
          {lang.t('myCommentHistory')}
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
