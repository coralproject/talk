import React, {Component} from 'react';
import {connect} from 'react-redux';

import {} from '../../coral-framework/actions/embedStream';
import {TabBar, Tab} from '../../coral-ui';

import Bio from '../components/Bio';
import SettingsHeader from '../components/SettingsHeader';

class SignInContainer extends Component {
  componentWillMount () {
    // Get Bio
    // Fetch commentHistory
  }

  render() {
    //const {embedStream} = this.props;
    return (
      <div>
        <SettingsHeader />
        <TabBar cStyle='material'>
          <Tab>All Comments (120)</Tab>
          <Tab>Profile Settings</Tab>
        </TabBar>
        <Bio {...this.props}/>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  embedStream: state.embedStream.toJS()
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
