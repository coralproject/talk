import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose } from 'react-apollo';
import Install from '../components/Install';

import {
  goToStep,
  nextStep,
  submitUser,
  checkInstall,
  previousStep,
  finishInstall,
  submitSettings,
  updateUserFormData,
  updateSettingsFormData,
  updatePermittedDomains,
} from '../../../actions/install';

class InstallContainer extends Component {
  componentDidMount() {
    const { checkInstall } = this.props;
    checkInstall(() => {
      this.context.router.push('/admin');
    });
  }

  render() {
    return <Install {...this.props} />;
  }
}

InstallContainer.contextTypes = {
  router: PropTypes.object,
};

const mapStateToProps = state => ({
  install: state.install,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      goToStep,
      nextStep,
      submitUser,
      checkInstall,
      previousStep,
      finishInstall,
      submitSettings,
      updateUserFormData,
      updateSettingsFormData,
      updatePermittedDomains,
    },
    dispatch
  );

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  InstallContainer
);
