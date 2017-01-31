import React from 'react';
import {connect} from 'react-redux';
import styles from './style.css';
import {nextStep, previousStep} from '../../actions/install'

const InstallContainer = props => {
  const {nextStep, previousStep, install} = props;

  return (
    <div className={styles.Install}>
      Install:
      <h1>
        {install.step}
      </h1>
      <button onClick={previousStep}>Previous Step</button>
      <button onClick={nextStep}>Next Step</button>
    </div>
  );
};

const mapStateToProps = state => ({
  install: state.install.toJS()
});

const mapDispatchToProps = dispatch => ({
  nextStep: () => dispatch(nextStep()),
  previousStep: () => dispatch(previousStep())
});

export default connect(mapStateToProps, mapDispatchToProps)(InstallContainer);
