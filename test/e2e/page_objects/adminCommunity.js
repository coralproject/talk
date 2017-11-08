module.exports = {
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
        .navigate(`${this.url()}/people`);
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
  },
  sections: {
    people: {
      selector: '.talk-admin-community-people-container',
      elements: {
        row: '.talk-admin-community-people-row',
        dropdownStatus: '.talk-admin-community-people-dd-status',
        dropdownRole: '.talk-admin-community-people-dd-role',
        dropdownStatusActive: '.talk-admin-community-people-dd-status .dd-list-active',
        optionActive: '.dd-option#ACTIVE',
        optionBanned: '.dd-option#BANNED',
      }
    }
  }
};
