import React, { Component } from 'react';
import styles from './Install.css';
import { Wizard, WizardNav } from 'coral-ui';
import Layout from 'coral-admin/src/components/Layout';

import InitialStep from './Steps/InitialStep';
import AddOrganizationName from './Steps/AddOrganizationName';
import CreateYourAccount from './Steps/CreateYourAccount';
import PermittedDomainsStep from './Steps/PermittedDomainsStep';
import FinalStep from './Steps/FinalStep';

export default class Install extends Component {
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
                <AddOrganizationName
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
