module.exports = {
  commands: [{
    url: function() {
      return `${this.api.launchUrl}/admin`;
    },
    ready() {
      return this
        .waitForElementVisible('body');
    },
  }],
  elements: {
    'loginLayout': '.talk-admin-login',
    'signInForm': '.talk-admin-login-sign-in',
    'emailInput': '.talk-admin-login-sign-in #email',
    'passwordInput': '.talk-admin-login-sign-in #password',
    'signInButton': '.talk-admin-login-sign-in-button',
    'storiesNav': '.talk-admin-nav-stories',
    'storiesSection': '.talk-admin-stories',
    'communityNav': '.talk-admin-nav-community',
    'communitySection': '.talk-admin-community',
    'moderationContainer': '.talk-admin-moderation-container'
  }
};
