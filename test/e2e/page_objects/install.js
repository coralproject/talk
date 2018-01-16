module.exports = {
  commands: [
    {
      url: function() {
        return `${this.api.launchUrl}/admin/install`;
      },
      ready() {
        return this.waitForElementVisible('body');
      },
    },
  ],
  sections: {
    step1: {
      selector: '.talk-install-step-1',
      elements: {
        getStartedButton: '.talk-install-get-started-button',
      },
    },
    step2: {
      selector: '.talk-install-step-2',
      elements: {
        organizationNameInput: '.talk-install-step-2 #organizationName',
        saveButton: '.talk-install-step-2-save-button',
      },
    },
    step3: {
      selector: '.talk-install-step-3',
      elements: {
        emailInput: '.talk-install-step-3 #email',
        usernameInput: '.talk-install-step-3 #username',
        passwordInput: '.talk-install-step-3 #password',
        confirmPasswordInput: '.talk-install-step-3 #confirmPassword',
        saveButton: '.talk-install-step-3-save-button',
      },
    },
    step4: {
      selector: '.talk-install-step-4',
      elements: {
        domainInput: '.talk-install-step-4-permited-domains-input input',
        saveButton: '.talk-install-step-4-save-button',
      },
    },
    step5: {
      selector: '.talk-install-step-5',
    },
  },
};
