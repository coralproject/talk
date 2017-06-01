import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {compose} from 'react-apollo';
import {
  fetchSettings,
  updateSettings,
  saveSettingsToServer,
  updateWordlist,
  updateDomainlist
} from '../../../actions/settings';

import Configure from '../components/Configure';

class ConfigureContainer extends Component {
  componentWillMount = () => {
    this.props.fetchSettings();
  }

  render () {
    return <Configure {...this.props} />;
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth.toJS(),
  settings: state.settings.toJS()
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    fetchSettings,
    updateSettings,
    saveSettingsToServer,
    updateWordlist,
    updateDomainlist
  }, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(ConfigureContainer);

