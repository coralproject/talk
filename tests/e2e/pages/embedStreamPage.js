const embedStreamCommands = {
  url: function () {
    return this
      .api.launchUrl;
  },
  ready() {
    return this
      .waitForElementVisible('body', 2000)
      .waitForElementVisible('iframe#coralStreamIframe')
      .api.frame('coralStreamIframe');
  },
  login(user) {
    return this
      .waitForElementVisible('@signInButton', 2000)
      .click('@signInButton')
      .waitForElementVisible('@signInDialog')
      .waitForElementVisible('@signInDialogEmail')
      .waitForElementVisible('@signInDialogPassword')
      .setValue('@signInDialogEmail', user.email)
      .setValue('@signInDialogPassword', user.pass)
      .waitForElementVisible('@logInButton')
      .click('@logInButton')
      .waitForElementVisible('@logoutButton', 5000);
  },
  logout() {
    return this
      .waitForElementVisible('@logoutButton')
      .click('@logoutButton')
      .waitForElementVisible('@signInButton', 2000);
  },
  postComment(comment = 'Test Comment') {
    return this
      .waitForElementVisible('@commentBox', 2000)
      .setValue('@commentBox', comment)
      .click('@postButton');
  },
  likeComment() {
    return this
      .waitForElementVisible('@likeButton')
      .waitForElementVisible('@likesCount')
      .click('@likeButton')
      .expect.element('@likeText').text.to.equal('Liked');
  },
  visitorLikeComment() {
    return this
      .waitForElementVisible('@likeButton')
      .waitForElementVisible('@likesCount')
      .click('@likeButton')
      .waitForElementVisible('@signInDialog', 2000);
  }
};

export default {
  commands: [embedStreamCommands],
  elements: {
    signInButton: {
      selector: '#coralSignInButton'
    },
    signInDialog:{
      selector: '#signInDialog'
    },
    signInDialogEmail: {
      selector: '#signInDialog #email'
    },
    signInDialogPassword: {
      selector: '#signInDialog #password'
    },
    logInButton: {
      selector: '#coralLogInButton'
    },
    logoutButton: {
      selector: '.commentStream #logout'
    },
    commentBox: {
      selector: '.coral-plugin-commentbox-textarea'
    },
    postButton: {
      selector: '#commentBox .coral-plugin-commentbox-button'
    },
    likeButton: {
      selector: '.comment .coral-plugin-likes-container .coral-plugin-likes-button'
    },
    likeText: {
      selector: '.comment .coral-plugin-likes-container .coral-plugin-likes-button .coral-plugin-likes-button-text'
    },
    likesCount: {
      selector: '.comment .coral-plugin-likes-container .coral-plugin-likes-like-count'
    }
  }
};
