# Account Notifications

email-footer-accountNotification =
  Sent by <a data-l10n-name="organizationLink">{ $organizationName }</a>

email-subject-accountNotificationForgotPassword = Password Reset Request
email-template-accountNotificationForgotPassword =
  Hello { $username },<br/><br/>
  We received a request to reset your password on <a data-l10n-name="organizationName">{ $organizationName }</a>.<br/><br/>
  Please follow this link to reset your password: <a data-l10n-name="resetYourPassword">Click here to reset your password</a><br/><br/>
  <i>If you did not request this, you can ignore this email.</i><br/>

email-subject-accountNotificationBan = Your account has been banned
email-template-accountNotificationBan =
  { $customMessage }<br /><br />
  If you think this has been done in error, please contact our community team
  at <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationPasswordChange = Your password has been changed
email-template-accountNotificationPasswordChange =
  Hello { $username },<br/><br/>
  The password on your account has been changed.<br/><br/>
  If you did not request this change,
  please contact our community team at <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationUpdateUsername = Your username has been changed
email-template-accountNotificationUpdateUsername =
  Hello { $username },<br/><br/>
  Thank you for updating your { $organizationName } commenter account information. The changes you made are effective immediately. <br /><br />
  If you did not make this change please reach out to our community team at <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationSuspend = Your account has been suspended
email-template-accountNotificationSuspend =
  { $customMessage }<br/><br/>
  If you think this has been done in error,  please contact our community team
  at <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationConfirmEmail = Confirm Email
email-template-accountNotificationConfirmEmail =
  Hello { $username },<br/><br/>
  To confirm your email address for use with your commenting account at { $organizationName },
  please follow this link: <a data-l10n-name="confirmYourEmail">Click here to confirm your email</a><br/><br/>
  If you did not recently create a commenting account with
  { $organizationName }, you can safely ignore this email.

email-subject-accountNotificationInvite = Coral Team invite
email-template-accountNotificationInvite =
  You have been invited to join the { $organizationName } team on Coral. Finish
  setting up your account <a data-l10n-name="invite">here</a>.

email-subject-accountNotificationDownloadComments = Your comments are ready for download
email-template-accountNotificationDownloadComments =
  Your comments from { $organizationName } as of { $date } are now available for download.<br /><br />
  <a data-l10n-name="downloadUrl">Download my comment archive</a>

email-subject-accountNotificationDeleteRequestConfirmation =
  Your commenter account is scheduled to be deleted
email-template-accountNotificationDeleteRequestConfirmation =
  A request to delete your commenter account was received.
  Your account is scheduled for deletion on { $requestDate }.<br /><br />
  After that time all of your comments will be removed from the site,
  all of your comments will be removed from our database, and your
  username and email address will be removed from our system.<br /><br />
  If you change your mind you can sign into your account and cancel the
  request before your scheduled account deletion time.

email-subject-accountNotificationDeleteRequestCancel =
  Your account deletion request has been cancelled
email-template-accountNotificationDeleteRequestCancel =
  You have cancelled your account deletion request for { $organizationName }.
  Your account is now reactivated.

email-subject-accountNotificationDeleteRequestCompleted =
  Your account has been deleted
email-template-accountNotificationDeleteRequestCompleted =
  Your commenter account for { $organizationName } is now deleted. We're sorry to
  see you go!<br /><br />
  If you'd like to re-join the discussion in the future, you can sign up for
  a new account.<br /><br />
  If you'd like to give us feedback on why you left and what we can do to make
  the commenting experience better, please email us at
  { $organizationContactEmail }.

# Notification

email-footer-notification =
  Sent by <a data-l10n-name="organizationLink">{ $organizationName }</a> - <a data-l10n-name="unsubscribeLink">Unsubscribe from these notifications</a>

## On Reply

email-subject-notificationOnReply = Someone has replied to your comment on { $organizationName }
email-template-notificationOnReply =
  { $authorUsername } has replied to <a data-l10n-name="commentPermalink">the comment</a> you posted on <a data-l10n-name="storyLink">{ $storyTitle }</a>

## On Featured

email-subject-notificationOnFeatured = One of your comments was featured on { $organizationName }
email-template-notificationOnFeatured =
  A member of our team has featured <a data-l10n-name="commentPermalink">the comment</a> you posted on <a data-l10n-name="storyLink">{ $storyTitle }</a>

## On Staff Reply

email-subject-notificationOnStaffReply = Someone at { $organizationName } has replied to your comment
email-template-notificationOnStaffReply =
  { $authorUsername } of { $organizationName } has replied to <a data-l10n-name="commentPermalink">the comment</a> you posted on <a data-l10n-name="storyLink">{ $storyTitle }</a>

## On Comment Approved

email-subject-notificationOnCommentApproved = Your comment on { $organizationName } has been published
email-template-notificationOnCommentApproved =
  { $organizationName }<br /><br/>
  Thank you for submitting your comment. Your comment has now been published: <a data-l10n-name="commentPermalink">View comment</a>

## On Comment Rejected

email-subject-notificationOnCommentRejected = Your comment on { $organizationName } was not published
email-template-notificationOnCommentRejected =
  { $organizationName }<br /><br/>
  The language used in one of your comments did not comply with our community guidelines, and so the comment has been removed.

# Notification Digest

email-subject-notificationDigest = Your latest comment activity at { $organizationName }

email-subject-testSmtpTest = Test email from Coral
email-template-testSmtpTest = This is a test email sent to { $email }
