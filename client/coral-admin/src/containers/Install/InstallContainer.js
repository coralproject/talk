import React, {Component} from 'react';
import {connect} from 'react-redux';
import styles from './style.css';
import {Wizard, WizardNav} from 'coral-ui';
import {Layout} from '../../components/ui/Layout';

import {
  nextStep,
  previousStep,
  goToStep,
  updateUserFormData,
  updateSettingsFormData,
  submitSettings,
  submitUser,
  checkInstall
} from '../../actions/install';

import InitialStep from './components/Steps/InitialStep';
import AddOrganizationName from './components/Steps/AddOrganizationName';
import CreateYourAccount from './components/Steps/CreateYourAccount';
import FinalStep from './components/Steps/FinalStep';

class InstallContainer extends Component {
  componentDidMount() {
    const {checkInstall} = this.props;
    checkInstall(() => {
      this.context.router.push('/admin');
    });
  }

  render() {
    const {install} = this.props;

    return (
      <Layout restricted={true}>
        <div className={styles.Install}>
          {
            !install.alreadyInstalled ? (
              <div>
                <h2>Welcome to the Coral Project</h2>
                { install.step !== 0 ? <WizardNav items={install.navItems} currentStep={install.step} icon='check'/> : null }
                <Wizard currentStep={install.step} {...this.props}>
                  <InitialStep/>
                  <AddOrganizationName/>
                  <CreateYourAccount/>
                  <FinalStep/>
                </Wizard>
              </div>
            ) : (
              <div>Talk is already installed</div>
            )
          }
        </div>
      </Layout>
    );
  }
}

InstallContainer.contextTypes = {
  router: React.PropTypes.object
};

const mapStateToProps = state => ({
  install: state.install.toJS()
});

const mapDispatchToProps = dispatch => ({
  checkInstall: next => dispatch(checkInstall(next)),
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
  handleSettingsSubmit: e => {
    e.preventDefault();
    dispatch(submitSettings());
  },
  handleUserSubmit: e => {
    e.preventDefault();
    dispatch(submitUser());
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InstallContainer);
