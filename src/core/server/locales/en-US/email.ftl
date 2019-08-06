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