import React from 'react';
import {connect} from 'react-redux';
import styles from './style.css';
import {Wizard, WizardNav} from 'coral-ui';
import {Layout} from '../../components/ui/Layout';
import {nextStep, previousStep, goToStep, updateUserFormData, updateSettingsFormData, submit} from '../../actions/install';

import InitialStep from './components/Steps/InitialStep';
import AddOrganizationName from './components/Steps/AddOrganizationName';
import CreateYourAccount from './components/Steps/CreateYourAccount';
import FinalStep from './components/Steps/FinalStep';

const InstallContainer = props => {
  const {goToStep, install} = props;

  return (
    <Layout restricted={true}>
      <div className={styles.Install}>
        <h2>Welcome to the Coral Project</h2>
        { install.step !== 0 ? <WizardNav goToStep={goToStep} items={install.navItems} currentStep={install.step} icon='check'/> : null }
        <Wizard currentStep={install.step} {...props}>
          <InitialStep/>
          <AddOrganizationName/>
          <CreateYourAccount/>
          <FinalStep/>
        </Wizard>
      </div>
    </Layout>
  );
};

const mapStateToProps = state => ({
  install: state.install.toJS()
});

const mapDispatchToProps = dispatch => ({
  nextStep: () => dispatch(nextStep()),
  previousStep: () => dispatch(previousStep()),
  goToStep: step => dispatch(goToStep(step)),
  handleSettingsChange: e => {
    const {name, value} = e.currentTarget;
    dispatch(updateSettingsFormData(name, value));
  },
  handleUserChange: e => {
    const {name, value} = e.currentTarget;
    dispatch(updateUserFormData(name, value));
  },
  handleSubmit: e => {
    e.preventDefault();
    dispatch(submit());
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InstallContainer);
