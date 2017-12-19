module.exports = {
  commands: [{
    url: function() {
      return `${this.api.launchUrl}/admin`;
    },
    ready() {
      return this
        .waitForElementVisible('body');
    },
    openDrawer() {
      this
        .waitForElementVisible('@drawerButton')
        .click('@drawerButton');
      this.expect.section('@drawer').to.be.visible;
      return this.section.drawer;
    },
    goToModerate() {
      this
        .click('@moderateNav')
        .expect.section('@moderate').to.be.visible;
      return this.section.moderate;
    },
    goToStories() {
      this
        .click('@storiesNav')
        .expect.section('@stories').to.be.visible;
      return this.section.stories;
    },
    goToCommunity() {
      this
        .click('@communityNav')
        .expect.section('@community').to.be.visible;
      return this.section.community;
    },
    logout() {
      this
        .waitForElementVisible('@settingsButton')
        .click('@settingsButton')
        .waitForElementVisible('@signOutButton')
        .click('@signOutButton');
    },
    navigateAndLogin(user) {
      this
        .navigate()
        .expect.section('@login').to.be.visible;
      return this.section.login.login(user);
    },
  }],
  elements: {
    drawerButton: '.mdl-layout__drawer-button',
    drawerOverlay: 'div.mdl-layout__obfuscator.is-visible',
    storiesNav: '.talk-admin-nav-stories',
    communityNav: '.talk-admin-nav-community',
    moderateNav: '.talk-admin-nav-moderate',
    settingsButton: '.talk-admin-header-settings-button',
    signOutButton: '.talk-admin-header-sign-out',
    suspendUserDialog: '.talk-admin-suspend-user-dialog',
    suspendUserConfirmButton: '.talk-admin-suspend-user-dialog-confirm',
    supendUserSendButton: '.talk-admin-suspend-user-dialog-send',
    usernameDialog: '.talk-reject-username-dialog',
    usernameDialogButtons: '.talk-reject-username-dialog-buttons',
    usernameDialogSuspend: '.talk-reject-username-dialog-button-k',
    usernameDialogSuspensionMessage: '.talk-reject-username-dialog-suspension-message',
    toast: '.toastify',
    toastClose: '.toastify__close',
  },
  sections: {
    moderate: {
      selector: '.talk-admin-moderation-container',
      elements: {
        comment: '.talk-admin-moderate-comment',
        commentActionMenu: '.talk-admin-moderate-comment-actions-menu',
        actionItemSuspendUser: '.action-menu-item#suspendUser',
        actionMenuButton: '.talk-admin-moderate-comment-actions-menu #actions-dropdown-0'
      }
    },
    stories: {
      selector: '.talk-admin-stories',
    },
    community: {
      selector: '.talk-admin-community',
      commands: [{
        url: function() {
          return `${this.api.launchUrl}/admin/community`;
        },
        ready() {
          return this
            .waitForElementVisible('body');
        },
        goToPeople() {
          this
            .click('@peopleNav')
            .expect.section('@people').to.be.visible;
          return this.section.people;
        },
      }],
      elements: {
        peopleNav: '.talk-admin-nav-people',
        flaggedAccountsNav: '.talk-admin-nav-flagged-accounts',
        flaggedAccountsContainer: '.talk-adnin-community-flagged-accounts',
        flaggedUser:'.talk-admin-community-flagged-user',
        flaggedUserApproveButton: '.talk-admin-flagged-user-approve-button',
        flaggedUserRejectButton: '.talk-admin-flagged-user-reject-button',
      },
      sections: {
        people: {
          selector: '.talk-admin-community-people-container',
          elements: {
            firstRow: '.talk-admin-community-people-row:first-child',
            dropdownStatus: '.talk-admin-community-people-dd-status',
            dropdownRole: '.talk-admin-community-people-dd-role',
            dropdownStatusActive: '.talk-admin-community-people-dd-status .dd-list-active',
            optionActive: '.dd-option#ACTIVE',
            optionBanned: '.dd-option#BANNED',
          }
        }
      }
    },
    drawer: {
      selector: '.talk-admin-drawer-nav',
      commands: [{
        goToStories() {
          this
            .click('@storiesButton');
          this.parent.expect.section('@stories').to.be.visible;
          this.close();
          return this.parent.section.stories;
        },
        goToCommunity() {
          this
            .click('@communityButton');
          this.parent.expect.section('@community').to.be.visible;
          this.close();
          return this.parent.section.stories;
        },
        close() {
          this.parent
            .click('@drawerOverlay')
            .waitForElementNotPresent('@drawerOverlay');

          // Wait a bit to let animations terminate cleanly.
          this.api.pause(200);

          return this.parent;
        },
      }],
      elements: {
        'storiesButton': '.talk-admin-drawer-nav .talk-admin-nav-stories',
        'communityButton': '.talk-admin-drawer-nav .talk-admin-nav-community',
      },
    },
    login: {
      commands: [{
        login(user) {
          this
            .waitForElementVisible('@signInForm')
            .setValue('@emailInput', user.email)
            .setValue('@passwordInput', user.password)
            .waitForElementVisible('@signInButton')
            .click('@signInButton');
          const adminPage = this.api.page.admin();
          adminPage.expect.section('@moderate').to.be.visible;
          return adminPage.section.moderate;
        },
      }],
      selector: '.talk-admin-login',
      elements: {
        'signInForm': '.talk-admin-login-sign-in',
        'emailInput': '.talk-admin-login-sign-in #email',
        'passwordInput': '.talk-admin-login-sign-in #password',
        'signInButton': '.talk-admin-login-sign-in-button',
      }
    },
  },
};
