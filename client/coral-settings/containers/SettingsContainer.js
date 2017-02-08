import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import React, {Component} from 'react';
import I18n from 'coral-framework/modules/i18n/i18n';

import {myCommentHistory} from 'coral-framework/graphql/queries';

import {link} from 'coral-framework/services/PymConnection';
import NotLoggedIn from '../components/NotLoggedIn';
import {Spinner} from 'coral-ui';
import SettingsHeader from '../components/SettingsHeader';
import CommentHistory from 'coral-plugin-history/CommentHistory';

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
    const {loggedIn, asset, showSignInDialog, data} = this.props;
    const {me} = this.props.data;

    if (!loggedIn || !me) {
      return <NotLoggedIn showSignInDialog={showSignInDialog}/>;
    }

    if (data.loading) {
      return <Spinner/>;
    }

    return (
      <div>
        <SettingsHeader {...this.props} />
        {

          // Hiding bio until moderation can get figured out
          /* <TabBar onChange={this.handleTabChange} activeTab={activeTab} cStyle='material'>
            <Tab>{lang.t('allComments')} ({user.myComments.length})</Tab>
              <Tab>{lang.t('profileSettings')}</Tab>
          </TabBar>
          <TabContent show={activeTab === 0}> */
          me.comments.length ?
            <CommentHistory
              comments={me.comments}
              asset={asset}
              link={link}
            />
          :
            <p>{lang.t('userNoComment')}</p>

          // Hiding user bio pending effective moderation system.
          /* </TabContent>
          <TabContent show={activeTab === 1}>
              <BioContainer bio={userData.settings.bio} handleSave={this.handleSave} {...this.props} />
          </TabContent> */
        }

      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.toJS(),
  asset: state.asset.toJS(),
  auth: state.auth.toJS()
});

const mapDispatchToProps = () => ({

  // saveBio: (user_id, formData) => dispatch(saveBio(user_id, formData))
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  myCommentHistory
)(SettingsContainer);
