import React from 'react';
import {connect} from 'react-redux';
import styles from './style.css';
import {nextStep, previousStep, goToStep} from '../../actions/install';
import {Wizard, WizardNav} from 'coral-ui';

import InitialStep from './components/Steps/InitialStep';
import AddOrganizationName from './components/Steps/AddOrganizationName';

const InstallContainer = props => {
  const {nextStep, previousStep, goToStep, install} = props;

  return (
    <div className={styles.Install}>
      <h2>Welcome to the Coral Project</h2>
      { install.step !== 0 ? <WizardNav goToStep={goToStep} items={wizardNavitems} currentStep={install.step}/> : null }
      <Wizard currentStep={install.step} nextStep={nextStep} previousStep={previousStep} goToStep={goToStep}>
        <InitialStep/>
        <AddOrganizationName/>
      </Wizard>
    </div>
  );
};

const wizardNavitems = [{
  text: '1. Add Organization Name',
  step: 1
},
{
  text: '2. Create your account',
  step: 2
},
{
  text: '3. Invite team members',
  step: 3
}];

const mapStateToProps = state => ({
  install: state.install.toJS()
});

const mapDispatchToProps = dispatch => ({
  nextStep: () => dispatch(nextStep()),
  previousStep: () => dispatch(previousStep()),
  goToStep: step => dispatch(goToStep(step))
});

export default connect(mapStateToProps, mapDispatchToProps)(InstallContainer);
