import React, {Component} from 'react';
import {connect} from 'react-redux';

import {TabBar, Tab, TabContent} from '../../coral-ui';

import Bio from '../components/Bio';
import CommentHistory from '../components/CommentHistory';
import SettingsHeader from '../components/SettingsHeader';
import NotLoggedIn from '../components/NotLoggedIn';
import RestrictedContent from 'coral-framework/components/RestrictedContent';

class SignInContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
      activeTab: 0
    };

    this.handleTabChange = this.handleTabChange.bind(this);
  }

  componentWillMount () {
    // Get Bio
    // Fetch commentHistory
  }

  handleTabChange(tab) {
    this.setState({
      activeTab: tab
    });
  }

  render() {
    const {loggedIn} = this.props;
    const {activeTab} = this.state;
    return (
      <RestrictedContent restricted={!loggedIn} restrictedComp={NotLoggedIn}>
        <SettingsHeader {...this.props} />
        <TabBar onChange={this.handleTabChange} activeTab={activeTab} cStyle='material'>
          <Tab>All Comments (120)</Tab>
          <Tab>Profile Settings</Tab>
        </TabBar>
        <TabContent show={activeTab === 0}>
          <CommentHistory {...this.props}/>
        </TabContent>
        <TabContent show={activeTab === 1}>
          <Bio {...this.props} />
        </TabContent>
      </RestrictedContent>
    );
  }
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = dispatch => ({
  handleSaveBio: () => dispatch(),
  getHistory: () => dispatch(),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignInContainer);
