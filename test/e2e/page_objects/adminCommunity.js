module.exports = {
  commands: [{
    url: function() {
      return `${this.api.launchUrl}/admin/community`;
    },
    ready() {
      return this
        .waitForElementVisible('body');
    },
  }],
  elements: {
    container: '.talk-admin-community',
    flaggedAccountsContainer: '.talk-adnin-community-flagged-accounts',
    flaggedUser:'.talk-admin-community-flagged-user',
    flaggedUserApproveButton: '.talk-admin-flagged-user-approve-button',
    flaggedUserRejectButton: '.talk-admin-flagged-user-reject-button',
    usernameDialog: '.talk-reject-username-dialog',
    usernameDialogButtons: '.talk-reject-username-dialog-buttons',
    usernameDialogSuspend: '.talk-reject-username-dialog-button-k',
    usernameDialogSuspensionMessage: '.talk-reject-username-dialog-suspension-message'
  }
};
