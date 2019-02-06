### Localization for Admin

## General

general-brandName = { -product-name }

## Navigation
navigation-moderate = Moderate
navigation-community = Community
navigation-stories = Stories
navigation-configure = Configure
navigation-signOutButton = Sign Out

## Restricted
restricted-currentlySignedInTo = Currently signed in to
restricted-noPermissionInfo = You do not have permission to access this page.
restricted-signedInAs = You are signed in as: <username></username>
restricted-signInWithADifferentAccount = Sign in with a different account
restricted-contactAdmin = If you think this is an error, please contact your administrator for assistance.

## Login

# Sign In
login-signInTo = Sign in to
login-signIn-enterAccountDetailsBelow = Enter your account details below

login-emailAddressLabel = Email Address
login-emailAddressTextField =
  .placeholder = Email Address

login-signIn-passwordLabel = Password
login-signIn-passwordTextField =
  .placeholder = Password

login-signIn-signInWithEmail = Sign in with Email
login-signIn-orSeparator = Or

login-signInWithFacebook = Sign in with Facebook
login-signInWithGoogle = Sign in with Google
login-signInWithOIDC = Sign in with { $name }

## Configure

configure-unsavedInputWarning =
  You have unsaved input.
  Are you sure you want to leave this page?

configure-sideBarNavigation-general = General
configure-sideBarNavigation-authentication = Authentication
configure-sideBarNavigation-moderation = Moderation
configure-sideBarNavigation-organization = Organization
configure-sideBarNavigation-advanced = Advanced
configure-sideBarNavigation-bannedAndSuspectWords = Banned and Suspect Words

configure-sideBar-saveChanges = Save Changes
configure-configurationSubHeader = Configuration
configure-onOffField-on = On
configure-onOffField-off = Off
configure-permissionField-allow = Allow
configure-permissionField-dontAllow = Don't allow

### General
configure-general-guidlines-title = Community Guidelines Summary
configure-general-guidlines-explanation =
  Write a summary of your community guidelines that will appear
  at the top of each comment stream sitewide. Your summary can be
  formatted using Markdown Syntax. More information on how to use
  Markdown can be found <externalLink>here</externalLink>.

#### Comment Length
configure-general-commentLength-maxCommentLength = Maximum Comment Length
configure-general-commentLength-setLimit = Set a limit on the length of comments sitewide
configure-general-commentLength-limitCommentLength = Limit Comment Length
configure-general-commentLength-minCommentLength = Minimum Comment Length
configure-general-commentLength-characters = Characters

#### Comment Editing
configure-general-commentEditing-title = Comment Editing
configure-general-commentEditing-explanation =
  Set a limit on how long commenters have to edit their comments sitewide.
  Edited comments are marked as (Edited) on the comment stream and the
  moderation panel.
configure-general-commentEditing-commentEditTimeFrame = Comment Edit Timeframe
configure-general-commentEditing-seconds = Seconds

#### Closed Stream Message
configure-general-closedStreamMessage-title = Closed Stream Message
configure-general-closedStreamMessage-explanation = Write a message to appear after a story is closed for commenting.

### Organization
configure-organization-name = Organization Name
configure-organization-nameExplanation =
  Your organization name will appear on emails sent by Talk to your community and organization members.
configure-organization-email = Organization Email
configure-organization-emailExplanation =
  This email address will be used as in emails and across
  the platform for community members to get in touch with
  the organization should they have any questions about the
  status of their accounts or moderation questions.

### Authentication

configure-auth-authIntegrations = Authentication Integrations
configure-auth-clientID = Client ID
configure-auth-clientSecret = Client Secret
configure-auth-configBoxEnabled = Enabled
configure-auth-targetFilterTalkAdmin = Talk Admin
configure-auth-targetFilterCommentStream = Comment Stream
configure-auth-redirectURI = Redirect URI
configure-auth-registration = Registration
configure-auth-registrationDescription =
  Allow users that have not signed up before with this authentication
  integration to register for a new account.
configure-auth-registrationCheckBox = Allow Registration
configure-auth-pleaseEnableAuthForAdmin =
  Please enable at least one authentication integration for Talk Admin
configure-auth-confirmNoAuthForCommentStream =
  No authentication integration has been enabled for the Comment Stream.
  Do you really want to continue?

configure-auth-facebook-loginWith = Login with Facebook
configure-auth-facebook-toEnableIntegration =
  To enable the integration with Facebook Authentication,
  you need to create and set up a web application.
  For more information visit: <link></link>.
configure-auth-facebook-useLoginOn = Use Facebook login on

configure-auth-google-loginWith = Login with Google
configure-auth-google-toEnableIntegration =
  To enable the integration with Google Authentication you need
  to create and set up a web application. For more information visit:
  <link></link>.
configure-auth-google-useLoginOn = Use Google login on

configure-auth-sso-loginWith = Login with Single Sign On
configure-auth-sso-useLoginOn = Use Single Sign On login on
configure-auth-sso-key = Key
configure-auth-sso-regenerate = Regenerate
configure-auth-sso-regenerateAt = KEY GENERATED AT:
  { DATETIME($date, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric") }
configure-auth-sso-regenerateWarning =
  Regenerating a key will invalidate any existing user sessions,
  and all signed-in users will be signed out.

configure-auth-local-loginWith = Login with Email Authentication
configure-auth-local-useLoginOn = Use Email Authentication login on

configure-auth-displayNamesConfig-title = Display Names
configure-auth-displayNamesConfig-explanationShort =
  Some Authentication Integrations include a Display Name as well as a User Name.
configure-auth-displayNamesConfig-explanationLong =
  A User Name has to be unique (there can only be one Juan_Doe, for example),
  whereas a Display Name does not. If your authentication provider allows for Display Names,
  you can enable this option. This allows for fewer strange names (Juan_Doe23245) –
  however it could also be used to spoof/impersonate another user.
configure-auth-displayNamesConfig-showDisplayNames = Show Display Names (if available)
configure-auth-displayNamesConfig-hideDisplayNames = Hide Display Names (if available)

configure-auth-oidc-loginWith = Login with OpenID Connect
configure-auth-oidc-toLearnMore = To learn more: <link></link>
configure-auth-oidc-providerName = Provider Name
configure-auth-oidc-providerNameDescription =
  The provider of the OpenID Connect integration. This will be used when the name of the provider
  needs to be displayed, e.g. “Log in with &lt;Facebook&gt;”.
configure-auth-oidc-issuer = Issuer
configure-auth-oidc-issuerDescription =
  After entering your Issuer information, click the Discover button to have Talk complete
  the remaining fields. You may also enter the information manually.
configure-auth-oidc-authorizationURL = Authorization URL
configure-auth-oidc-tokenURL = Token URL
configure-auth-oidc-jwksURI = JWKS URI
configure-auth-oidc-useLoginOn = Use OpenID Connect login on

### Moderation
configure-moderation-apiKey = API Key

configure-moderation-akismet-title = Akismet Spam Detection Filter
configure-moderation-akismet-explanation =
  Submitted comments are passed to the Akismet API for spam detection.
  If a comment is determined to be spam, it will prompt the user,
  indicating that the comment might be considered spam.
  If the user continues after this point with the still spam-like comment,
  the comment will be marked as containing spam, <strong>will not be published</strong> and
  are placed in the <strong>Pending Queue for review by a moderator</strong>. If approved by a moderator,
  the comment will be published.

#### Akismet
configure-moderation-akismet-filter = Spam Detection Filter
configure-moderation-akismet-accountNote =
  Note: You must add your active domain(s)
  in your Akismet account: <externalLink>https://akismet.com/account/</externalLink>
configure-moderation-akismet-siteURL = Site URL

configure-moderation-perspective-title = Perspective Toxic Comment Filter
configure-moderation-perspective-explanation =
  Using the Perspective API, the Toxic Comment filter warns users when comments exceed the predefined toxicity
  threshold. Comments with a toxicity score above the threshold <strong>will not be published</strong> and are placed in
  the <strong>Pending Queue for review by a moderator</strong>. If approved by a moderator, the comment will be published.

#### Perspective
configure-moderation-perspective-filter = Toxic Comment Filter
configure-moderation-perspective-toxicityThreshold = Toxicity Threshold
configure-moderation-perspective-toxicityThresholdDescription =
  This value can be set a percentage between 0 and 100. This number represents the likelihood that a
  comment is toxic, according to Perspective API. By default the treshold is set to { $default }.
configure-moderation-perspective-allowStoreCommentData = Allow Google to Store Comment Data
configure-moderation-perspective-allowStoreCommentDataDescription =
  Stored comments will be used for future research and community model building purposes to
  improve the API over time
configure-moderation-perspective-customEndpoint = Custom Endpoint
configure-moderation-perspective-defaultEndpoint =
  By default the endpoint is set to { $default }. You may override this here.
configure-moderation-perspective-accountNote =
  For additional information on how to set up the Perspective Toxic Comment Filter please visit:
  <externalLink>https://github.com/conversationai/perspectiveapi/blob/master/quickstart.md</externalLink>

#### Banned Words Configuration
configure-wordList-banned-bannedWordsAndPhrases = Banned Words and Phrases
configure-wordList-banned-explanation =
  Comments containing a word or phrase in the banned words list are <strong>automatically rejected and are not published</strong>.
configure-wordList-banned-wordList = Banned Word List
configure-wordList-banned-wordListDetail =
  Separate banned words or phrases with a new line. Attempting to copy
  and paste a comma separated list? <externalLink>Learn how to convert your list
  to a new line separated list.</externalLink>

#### Suspect Words Configuration
configure-wordList-suspect-bannedWordsAndPhrases = Suspect Words and Phrases
configure-wordList-suspect-explanation =
  Comments containing a word or phrase in the Suspect Words List
  are <strong>placed into the Reported Queue for moderator review and are
  published (if comments are not pre-moderated).</strong>
configure-wordList-suspect-wordList = Suspect Word List
configure-wordList-suspect-wordListDetail =
  Separate suspect words or phrases with a new line. Attempting to copy
  and paste a comma separated list? <externalLink>Learn how to convert your list
  to a new line separated list.</externalLink>

### Advanced
configure-advanced-customCSS = Custom CSS
configure-advanced-customCSS-explanation =
  URL of a CSS stylesheet that will override default Embed Stream styles. Can be internal or external.
configure-advanced-permittedDomains = Permitted Domains
configure-advanced-permittedDomains-explanation =
  Domains where your Talk instance is allowed to be embedded.
  Typical use is localhost, staging.yourdomain.com,
  yourdomain.com, etc.

## Decision History
decisionHistory-youWillSeeAList =
  You will see a list of your post moderation actions here.
decisionHistory-showMoreButton =
  Show More
decisionHistory-yourDecisionHistory = Your Decision History
decisionHistory-rejectedCommentBy = Rejected comment by <username></username>
decisionHistory-acceptedCommentBy = Accepted comment by <username></username>
decisionHistory-goToComment = Go to comment

## moderate
moderate-navigation-reported = reported
moderate-navigation-pending = Pending
moderate-navigation-unmoderated = unmoderated
moderate-navigation-rejected = rejected

moderate-marker-preMod = Pre-Mod
moderate-marker-link = Link
moderate-marker-bannedWord = Banned Word
moderate-marker-suspectWord = Suspect Word
moderate-marker-spam = Spam
moderate-marker-toxic = Toxic
moderate-marker-karma = Karma
moderate-marker-bodyCount = Body Count
moderate-marker-offensive = Offensive

moderate-inReplyTo = Reply to <username><username>
moderate-viewContext = View Context
moderate-rejectButton =
  .aria-label = Reject
moderate-acceptButton =
  .aria-label = Accept
moderate-decision = Decision

moderate-single-goToModerationQueues = Go to moderation queues
moderate-single-singleCommentView = Single Comment View


## Create Username

createUsername-createUsernameHeader = Create Username
createUsername-whatItIs =
  Your username is a unique identifier that will appear on all of your comments.
createUsername-createUsernameButton = Create Username
createUsername-usernameLabel = Username
createUsername-usernameDescription = You may use “_” and “.” Spaces not permitted.
createUsername-usernameTextField =
  .placeholder = Username

## Add Email Address
addEmailAddress-addEmailAddressHeader = Add Email Address

addEmailAddress-emailAddressLabel = Email Address
addEmailAddress-emailAddressTextField =
  .placeholder = Email Address

addEmailAddress-confirmEmailAddressLabel = Confirm Email Address
addEmailAddress-confirmEmailAddressTextField =
  .placeholder = Confirm Email Address

addEmailAddress-whatItIs =
  For your added security, we require users to add an email address to their accounts.

addEmailAddress-addEmailAddressButton =
  Add Email Address

## Create Password
createPassword-createPasswordHeader = Create Password
createPassword-whatItIs =
  To protect against unauthorized changes to your account,
  we require users to create a password.
createPassword-createPasswordButton =
  Create Password

createPassword-passwordLabel = Password
createPassword-passwordDescription = Must be at least {$minLength} characters
createPassword-passwordTextField =
  .placeholder = Password
