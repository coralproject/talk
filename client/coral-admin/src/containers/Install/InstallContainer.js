import React from 'react';
import {connect} from 'react-redux';
import styles from './style.css';
import {nextStep, previousStep, goToStep} from '../../actions/install';
import {Button, Wizard} from 'coral-ui';

import InitialStep from './components/Steps/InitialStep'
import AddOrganizationName from './components/Steps/AddOrganizationName'

const InstallContainer = props => {
  const {nextStep, previousStep, goToStep, install} = props;

  return (
    <div className={styles.Install}>
      <h1>{install.step}</h1>
      <nav>
        <ul>
          <li onClick={() => goToStep(0)}>Add Organization Name</li>
          <li onClick={() => goToStep(1)}>Create your account</li>
          <li onClick={() => goToStep(2)}>Invite team members</li>
        </ul>
      </nav>
      <Wizard currentStep={install.step} nextStep={nextStep} previousStep={previousStep} goToStep={goToStep}>
        <InitialStep/>
        <AddOrganizationName/>
      </Wizard>
    </div>
  );
};

const mapStateToProps = state => ({
  install: state.install.toJS()
});

const mapDispatchToProps = dispatch => ({
  nextStep: () => dispatch(nextStep()),
  previousStep: () => dispatch(previousStep()),
  goToStep: step => dispatch(goToStep(step))
});

export default connect(mapStateToProps, mapDispatchToProps)(InstallContainer);
