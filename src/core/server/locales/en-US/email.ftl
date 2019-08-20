email-notification-footer =
  Sent by <a data-l10n-name="organizationLink">{ $organizationName }</a>

email-notification-template-forgotPassword =
  Hello { $username },<br/><br/>
  We received a request to reset your password on <a data-l10n-name="organizationName">{ $organizationName }</a>.<br/><br/>
  Please follow this link reset your password: <a data-l10n-name="resetYourPassword">Click here to reset your password</a><br/><br/>
  <i>If you did not request this, you can ignore this email.</i><br/>

email-subject-forgotPassword = Password Reset Request

email-notification-template-ban =
  { $customMessage }<br /><br />
  if you think this has been done in error, please contact our community team
  at <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-ban = Your account has been banned

email-notification-template-passwordChange =
  Hello { $username },<br/><br/>
  The password on your account has been changed.<br/><br/>
  If you did not request this change,
  please contact our community team at <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-passwordChange = Your password has been changed

email-subject-updateUsername = Your username has been changed

email-notification-template-updateUsername =
  Hello { $username },<br/><br/>
  Thank you for updating your { $organizationName } commenter account information. The changes you made are effective immediately. <br /><br />
  If you did not make this change please reach out to our community team at <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-notification-template-suspend =
  { $customMessage }<br/><br/>
  If you think this has been done in error,  please contact our community team
  at <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-suspend = Your account has been suspended

email-notification-template-confirmEmail =
  Hello { $username },<br/><br/>
  To confirm your email address for use with your commenting account at { $organizationName },
  please follow this link: <a data-l10n-name="confirmYourEmail">Click here to confirm your email</a><br/><br/>
  If you did not recently create a commenting account with
  { $organizationName }, you can safely ignore this email.

email-subject-confirmEmail = Confirm Email

email-subject-invite = Coral Team invite

email-notification-template-invite =
  You have been invited to join the { $organizationName } team on Coral. Finish
  setting up your account <a data-l10n-name="invite">here</a>.

email-subject-downloadComments = Your comments are ready for download
email-notification-template-downloadComments =
  Your comments from { $organizationName } as of { $date } are now available for download.<br /><br />
  <a data-l10n-name="downloadUrl">Download my comment archive</a>

email-subject-deleteRequestConfirmation =
  Your commenter account is scheduled to be deleted
email-notification-template-deleteRequestConfirmation =
  A request to delete your commenter account was received.
  Your account is scheduled for deletion on { $requestDate }.<br /><br />
  After that time all of your comments will be removed from the site,
  all of your comments will be removed from our database, and your
  username and email address will be removed from our system.<br /><br />
  If you change your mind you can sign into your account and cancel the
  request before your scheduled account deletion time.

email-subject-deleteRequestCancel =
  Your account deletion request has been cancelled
email-notification-template-deleteRequestCancel =
  You have cancelled your account deletion request for { $organizationName }.
  Your account is now reactivated.

email-subject-deleteRequestCompleted =
  Your account has been deleted
email-notification-template-deleteRequestCompleted =
  Your commenter account for { $username } is now deleted. We're sorry to
  see you go!<br /><br />
  If you'd like to re-join the discussion in the future, you can sign up for
  a new account.<br /><br />
  If you'd like to give us feedback on why you left and what we can do to make
  the commenting experience better, please email us at
  { $organizationContactEmail }.

