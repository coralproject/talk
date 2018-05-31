module.exports = {
  commands: [
    {
      ready() {
        return this.waitForElementVisible('body');
      },
      login(user) {
        return this.waitForElementVisible('@emailInput')
          .setValue('@emailInput', user.email)
          .waitForElementVisible('@passwordInput')
          .setValue('@passwordInput', user.password)
          .waitForElementVisible('@signIn')
          .waitForElementVisible('@loginButton')
          .click('@loginButton');
      },
      register(user) {
        return this.waitForElementVisible('@registerButton')
          .click('@registerButton')
          .setValue('@emailInput', user.email)
          .setValue('@usernameInput', user.username)
          .setValue('@passwordInput', user.password)
          .setValue('@confirmPasswordInput', user.password)
          .waitForElementVisible('@signUpButton')
          .click('@signUpButton')
          .waitForElementVisible('@signIn')
          .waitForElementVisible('@loginButton')
          .click('@loginButton');
      },
    },
  ],
  elements: {
    registerButton: '#coralRegister',
    signInButton: '#coralSignInButton',
    emailInput: '#email',
    usernameInput: '#username',
    passwordInput: '#password',
    confirmPasswordInput: '#confirmPassword',
    signUpButton: '#coralSignUpButton',
    signIn: '.coral-sign-in',
    loginButton: '#coralLogInButton',
  },
};
