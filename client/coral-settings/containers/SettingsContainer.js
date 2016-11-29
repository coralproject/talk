import React, {Component} from 'react';
import {connect} from 'react-redux';

import {TabBar, Tab} from '../../coral-ui';

import Bio from '../components/Bio';
import CommentHistory from '../components/CommentHistory';
import SettingsHeader from '../components/SettingsHeader';

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
    //const {embedStream} = this.props;
    const {activeTab} = this.state;
    return (
      <div>
        <SettingsHeader />
        <TabBar onChange={this.handleTabChange} activeTab={activeTab} cStyle='material'>
          <Tab>All Comments (120)</Tab>
          <Tab>Profile Settings</Tab>
        </TabBar>
        { activeTab === 0 && <CommentHistory {...this.props}/> }
        { activeTab === 1 && <Bio {...this.props}/> }
      </div>
    );
  }
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = dispatch => ({
  getBio: () => dispatch(),
  getHistory: () => dispatch(),
  handleSaveChanges: () => dispatch(),
  handleCancel: () => dispatch()
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignInContainer);
