import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import React, {Component} from 'react';
import I18n from 'coral-framework/modules/i18n/i18n';

import {myCommentHistory} from 'coral-framework/graphql/queries';
import {saveBio} from 'coral-framework/actions/user';

import BioContainer from './BioContainer';
import {TabBar, Tab, TabContent} from 'coral-ui';
import NotLoggedIn from '../components/NotLoggedIn';
import CommentHistory from 'coral-plugin-history/CommentHistory';
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
    const {loggedIn, userData, showSignInDialog, user, data} = this.props;
    const {activeTab} = this.state;

    if (data.loading) {
      return <div>Loading</div>
    }

    return (
      <RestrictedContent restricted={!loggedIn} restrictedComp={<NotLoggedIn showSignInDialog={showSignInDialog} />}>
        <SettingsHeader {...this.props} />
        <TabBar onChange={this.handleTabChange} activeTab={activeTab} cStyle='material'>
          <Tab>{lang.t('allComments')} ({user.myComments.length})</Tab>
          <Tab>{lang.t('profileSettings')}</Tab>
        </TabBar>
        <TabContent show={activeTab === 0}>
          {
            data.me.comments.length ?
              <CommentHistory comments={data.me.comments}/>
            :
              <p>{lang.t('user-no-comment')}</p>
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
  user: state.user.toJS()
});

const mapDispatchToProps = dispatch => ({
  saveBio: (user_id, formData) => dispatch(saveBio(user_id, formData))
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  myCommentHistory
)(SettingsContainer);
