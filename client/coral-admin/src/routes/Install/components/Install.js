import React from 'react';
import styles from './Install.css';
import { Wizard, WizardNav } from 'coral-ui';
import Layout from 'coral-admin/src/components/Layout';
import PropTypes from 'prop-types';

import InitialStep from './Steps/InitialStep';
import OrganizationDetails from './Steps/OrganizationDetails';
import CreateYourAccount from './Steps/CreateYourAccount';
import PermittedDomainsStep from './Steps/PermittedDomainsStep';
import FinalStep from './Steps/FinalStep';

class Install extends React.Component {
  handleDomainsChange = value => {
    this.props.updatePermittedDomains(value);
  };

  handleSettingsChange = ({ currentTarget: { name, value } }) => {
    this.props.updateSettingsFormData(name, value);
  };

  handleUserChange = ({ currentTarget: { name, value } }) => {
    this.props.updateUserFormData(name, value);
  };

  handleSettingsSubmit = e => {
    e.preventDefault();
    this.props.submitSettings();
  };

  handleUserSubmit = e => {
    e.preventDefault();
    this.props.submitUser();
  };

  render() {
    const { install } = this.props;

    return (
      <Layout restricted={true}>
        <div className={styles.install}>
          {!install.alreadyInstalled ? (
            <div>
              <h2 className={styles.header}>Welcome to the Coral Project</h2>
              {install.step !== 0 ? (
                <WizardNav
                  items={install.navItems}
                  currentStep={install.step}
                  icon="check"
                />
              ) : null}
              <Wizard
                currentStep={install.step}
                nextStep={this.props.nextStep}
                previousStep={this.props.previousStep}
                goToStep={this.props.goToStep}
              >
                <InitialStep />
                <OrganizationDetails
                  install={install}
                  handleSettingsChange={this.handleSettingsChange}
                  handleSettingsSubmit={this.handleSettingsSubmit}
                />
                <CreateYourAccount
                  install={install}
                  handleUserChange={this.handleUserChange}
                  handleUserSubmit={this.handleUserSubmit}
                />
                <PermittedDomainsStep
                  install={install}
                  handleDomainsChange={this.handleDomainsChange}
                  finishInstall={this.props.finishInstall}
                />
                <FinalStep />
              </Wizard>
            </div>
          ) : (
            <div>Talk is already installed</div>
          )}
        </div>
      </Layout>
    );
  }
}

Install.propTypes = {
  updatePermittedDomains: PropTypes.func.isRequired,
  updateSettingsFormData: PropTypes.func.isRequired,
  updateUserFormData: PropTypes.func.isRequired,
  submitSettings: PropTypes.func.isRequired,
  submitUser: PropTypes.func.isRequired,
  install: PropTypes.object.isRequired,
  nextStep: PropTypes.func.isRequired,
  previousStep: PropTypes.func.isRequired,
  goToStep: PropTypes.func.isRequired,
  finishInstall: PropTypes.func.isRequired,
};

export default Install;
