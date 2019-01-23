import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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

class InstallContainer extends React.Component {
  componentDidMount() {
    const { checkInstall } = this.props;
    checkInstall(() => {
      this.context.router.push('/admin');
    });
  }

  render() {
    return (
      <Install
        install={this.props.install}
        goToStep={this.props.goToStep}
        nextStep={this.props.nextStep}
        submitUser={this.props.submitUser}
        checkInstall={this.props.checkInstall}
        previousStep={this.props.previousStep}
        finishInstall={this.props.finishInstall}
        submitSettings={this.props.submitSettings}
        updateUserFormData={this.props.updateUserFormData}
        updateSettingsFormData={this.props.updateSettingsFormData}
        updatePermittedDomains={this.props.updatePermittedDomains}
      />
    );
  }
}

InstallContainer.contextTypes = {
  router: PropTypes.object,
};

InstallContainer.propTypes = {
  install: PropTypes.object.isRequired,
  goToStep: PropTypes.func.isRequired,
  nextStep: PropTypes.func.isRequired,
  submitUser: PropTypes.func.isRequired,
  checkInstall: PropTypes.func.isRequired,
  previousStep: PropTypes.func.isRequired,
  finishInstall: PropTypes.func.isRequired,
  submitSettings: PropTypes.func.isRequired,
  updateUserFormData: PropTypes.func.isRequired,
  updateSettingsFormData: PropTypes.func.isRequired,
  updatePermittedDomains: PropTypes.func.isRequired,
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InstallContainer);
