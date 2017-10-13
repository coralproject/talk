module.exports = {
  commands: [{
    url: function() {
      return `${this.api.launchUrl}/admin/install`;
    },
    ready() {
      return this
        .waitForElementVisible('body', 2000);
    },
  }],
  elements: {
    'getStartedButton': '.talk-install-get-started-button',
    'step2': '.talk-install-step-2',
    'step2organizationNameInput': '.talk-install-step-2 #organizationName',
    'step2saveButton': '.talk-install-step-2-save-button',
    'step3': '.talk-install-step-3',
    'step3EmailInput': '.talk-install-step-3 #email',
    'step3UsernameInput': '.talk-install-step-3 #username',
    'step3PasswordInput': '.talk-install-step-3 #password',
    'step3ConfirmPasswordInput': '.talk-install-step-3 #confirmPassword',
    'step3saveButton': '.talk-install-step-3-save-button',
    'step4': '.talk-install-step-4',
    'step4DomainInput': '.talk-install-step-4-permited-domains-input',
    'step4saveButton': '.talk-install-step-4-save-button',
  }
};
