### Localization for Admin

## General
general-notAvailable = Not available
general-none = None
general-noTextContent = No text content
general-archived = Archived

## Story Status
storyStatus-open = Open
storyStatus-closed = Closed
storyStatus-archiving = Archiving
storyStatus-archived = Archived
storyStatus-unarchiving = Unarchiving

## Roles
role-admin = Admin
role-moderator = Moderator
role-siteModerator = Site Moderator
role-organizationModerator = Organization Moderator
role-staff = Staff
role-member = Member
role-commenter = Commenter

role-plural-admin = Admins
role-plural-moderator = Moderators
role-plural-staff = Staff
role-plural-member = Members
role-plural-commenter = Commenters

comments-react =
  .aria-label = {$count ->
    [0] {$reaction} comment by {$username}
    *[other] {$reaction} ({$count}) comment by {$username}
  }
comments-reacted =
  .aria-label = {$count ->
    [0] {$reaction} comment by {$username}
    [one] {$reaction} comment by {$username}
    *[other] {$reaction} ({$count}) comment by {$username}
  }

## components
admin-paginatedSelect-filter =
  .aria-label = Filter results

## User Statuses
userStatus-active = Active
userStatus-banned = Banned
userStatus-siteBanned = Site banned
userStatus-banned-all = Banned (all)
userStatus-banned-count = Banned ({$count})
userStatus-suspended = Suspended
userStatus-premod = Always pre-moderate
userStatus-warned = Warned

# Queue Sort
queue-sortMenu-newest = Newest
queue-sortMenu-oldest = Oldest

## Navigation
navigation-moderate = Moderate
navigation-community = Community
navigation-stories = Stories
navigation-configure = Configure
navigation-dashboard = Dashboard
navigation-reports = DSA Reports

## User Menu
userMenu-signOut = Sign Out
userMenu-viewLatestRelease = View Latest Release
userMenu-reportBug = Report a Bug or Give Feedback
userMenu-popover =
  .description = A dialog of the user menu with related links and actions

## Restricted
restricted-currentlySignedInTo = Currently signed in to
restricted-noPermissionInfo = You do not have permission to access this page.
restricted-signedInAs = You are signed in as: <strong>{ $username }</strong>
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
login-orSeparator = Or
login-signIn-forgot-password = Forgot your password?

login-signInWithFacebook = Sign in with Facebook
login-signInWithGoogle = Sign in with Google
login-signInWithOIDC = Sign in with { $name }

# Create Username

createUsername-createUsernameHeader = Create Username
createUsername-whatItIs =
  Your username is an identifier that will appear on all of your comments.
createUsername-createUsernameButton = Create Username
createUsername-usernameLabel = Username
createUsername-usernameDescription = You may use “_” and “.” Spaces not permitted.
createUsername-usernameTextField =
  .placeholder = Username

# Add Email Address
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

# Create Password
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

# Forgot Password
forgotPassword-forgotPasswordHeader = Forgot password?
forgotPassword-checkEmailHeader = Check your email
forgotPassword-gotBackToSignIn = Go back to sign in page
forgotPassword-checkEmail-receiveEmail =
  If there is an account associated with <strong>{ $email }</strong>,
  you will receive an email with a link to create a new password.
forgotPassword-enterEmailAndGetALink =
  Enter your email address below and we will send you a link
  to reset your password.
forgotPassword-emailAddressLabel = Email address
forgotPassword-emailAddressTextField =
  .placeholder = Email Address
forgotPassword-sendEmailButton = Send email

# Link Account
linkAccount-linkAccountHeader = Link Account
linkAccount-alreadyAssociated =
  The email <strong>{ $email }</strong> is
  already associated with an account. If you would like to
  link these enter your password.
linkAccount-passwordLabel = Password
linkAccount-passwordTextField =
  .label = Password
linkAccount-linkAccountButton = Link Account
linkAccount-useDifferentEmail = Use a different email address

## Configure

configure-experimentalFeature = Experimental Feature

configure-unsavedInputWarning =
  You have unsaved changes. Are you sure you want to continue?

configure-sideBarNavigation-general = General
configure-sideBarNavigation-authentication = Authentication
configure-sideBarNavigation-moderation = Moderation
configure-sideBarNavigation-moderation-comments = Comments
configure-sideBarNavigation-moderation-users = Users
configure-sideBarNavigation-organization = Organization
configure-sideBarNavigation-moderationPhases = Moderation Phases
configure-sideBarNavigation-advanced = Advanced
configure-sideBarNavigation-email = Email
configure-sideBarNavigation-bannedAndSuspectWords = Banned and Suspect Words
configure-sideBarNavigation-slack = Slack
configure-sideBarNavigation-webhooks = Webhooks

configure-sideBar-saveChanges = Save Changes
configure-configurationSubHeader = Configuration
configure-onOffField-on = On
configure-onOffField-off = Off
configure-radioButton-allow = Allow
configure-radioButton-dontAllow = Don't allow

### Moderation Phases

configure-moderationPhases-generatedAt = KEY GENERATED AT:
  { DATETIME($date, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric") }
configure-moderationPhases-phaseNotFound = External moderation phase not found
configure-moderationPhases-experimentalFeature =
  The custom moderation phases feature is currently in active development.
  Please <ContactUsLink>contact us with any feedback or requests</ContactUsLink>.
configure-moderationPhases-header-title = Moderation Phases
configure-moderationPhases-description =
  Configure a external moderation phase to automate some moderation
  actions. Moderation requests will be JSON encoded and signed. To
  learn more about moderation requests, visit our <externalLink>docs</externalLink>.
configure-moderationPhases-addExternalModerationPhaseButton =
  Add external moderation phase
configure-moderationPhases-moderationPhases = Moderation Phases
configure-moderationPhases-name = Name
configure-moderationPhases-status = Status
configure-moderationPhases-noExternalModerationPhases =
  There are no external moderation phases configured, add one above.
configure-moderationPhases-enabledModerationPhase = Enabled
configure-moderationPhases-disableModerationPhase = Disabled
configure-moderationPhases-detailsButton = Details <icon></icon>
configure-moderationPhases-addExternalModerationPhase = Add external moderation phase
configure-moderationPhases-updateExternalModerationPhaseButton = Update details
configure-moderationPhases-cancelButton = Cancel
configure-moderationPhases-format = Comment Body Format
configure-moderationPhases-endpointURL = Callback URL
configure-moderationPhases-timeout = Timeout
configure-moderationPhases-timeout-details =
  The time that Coral will wait for your moderation response in milliseconds.
configure-moderationPhases-format-details =
  The format that Coral will send the comment body in. By default, Coral will
  send the comment in the original HTML encoded format. If "Plain Text" is
  selected, then the HTML stripped version will be sent instead.
configure-moderationPhases-format-html = HTML
configure-moderationPhases-format-plain = Plain Text
configure-moderationPhases-endpointURL-details =
  The URL that Coral moderation requests will be POST'ed to. The provided URL
  must respond within the designated timeout or the decision of the moderation
  action will be skipped.
configure-moderationPhases-configureExternalModerationPhase =
  Configure external moderation phase
configure-moderationPhases-phaseDetails = Phase details
onfigure-moderationPhases-status = Status
configure-moderationPhases-signingSecret = Signing secret
configure-moderationPhases-signingSecretDescription =
  The following signing secret is used to sign request payloads sent
  to the URL. To learn more about webhook signing, visit our <externalLink>docs</externalLink>.
configure-moderationPhases-phaseStatus = Phase status
configure-moderationPhases-status = Status
configure-moderationPhases-signingSecret = Signing secret
configure-moderationPhases-signingSecretDescription =
  The following signing secret is used to sign request payloads sent to the URL.
  To learn more about webhook signing, visit our <externalLink>docs</externalLink>.
configure-moderationPhases-dangerZone = Danger Zone
configure-moderationPhases-rotateSigningSecret = Rotate signing secret
configure-moderationPhases-rotateSigningSecretDescription =
  Rotating the signing secret will allow to you to safely replace a signing
  secret used in production with a delay.
configure-moderationPhases-rotateSigningSecretButton = Rotate signing secret

configure-moderationPhases-disableExternalModerationPhase =
  Disable external moderation phase
configure-moderationPhases-disableExternalModerationPhaseDescription =
  This external moderation phase is current enabled. By disabling, no new
  moderation queries will be sent to the URL provided.
configure-moderationPhases-disableExternalModerationPhaseButton = Disable phase
configure-moderationPhases-enableExternalModerationPhase =
  Enable external moderation phase
configure-moderationPhases-enableExternalModerationPhaseDescription =
  This external moderation phase is currently disabled. By enabling, new
  moderation queries will be sent to the URL provided.
configure-moderationPhases-enableExternalModerationPhaseButton = Enable phase
configure-moderationPhases-deleteExternalModerationPhase =
  Delete external moderation phase
configure-moderationPhases-deleteExternalModerationPhaseDescription =
  Deleting this external moderation phase will stop any new moderation queries
  from being sent to this URL and will remove all the associated settings.
configure-moderationPhases-deleteExternalModerationPhaseButton = Delete phase
configure-moderationPhases-rotateSigningSecret = Rotate signing secret
configure-moderationPhases-rotateSigningSecretHelper =
  After it expires, signatures will no longer be generated with the old secret.
configure-moderationPhases-expiresOldSecret =
  Expire the old secret
configure-moderationPhases-expiresOldSecretImmediately =
  Immediately
configure-moderationPhases-expiresOldSecretHoursFromNow =
  { $hours ->
    [1] 1 hour
    *[other] { $hours } hours
  } from now
configure-moderationPhases-rotateSigningSecretSuccessUseNewSecret =
  External moderation phase signing secret has been rotated. Please ensure you
  update your integrations to use the new secret below.
configure-moderationPhases-confirmDisable =
  Disabling this external moderation phase will stop any new moderation queries
  from being sent to this URL. Are you sure you want to continue?
configure-moderationPhases-confirmEnable =
  Enabling the external moderation phase will start to send moderation queries
  to this URL. Are you sure you want to continue?
configure-moderationPhases-confirmDelete =
  Deleting this external moderation phase will stop any new moderation queries
  from being sent to this URL and will remove all the associated settings. Are
  you sure you want to continue?

### Webhooks

configure-webhooks-generatedAt = KEY GENERATED AT:
  { DATETIME($date, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric") }
configure-webhooks-experimentalFeature =
  The webhook feature is currently in active development. Events may be
  added or removed. Please <ContactUsLink>contact us with any feedback or requests</ContactUsLink>.
configure-webhooks-webhookEndpointNotFound = Webhook endpoint not found
configure-webhooks-header-title = Configure webhook endpoint
configure-webhooks-description =
  Configure an endpoint to send events to when events occur within
  Coral. These events will be JSON encoded and signed. To learn more
  about webhook signing, visit our <externalLink>Webhook Guide</externalLink>.
configure-webhooks-addEndpoint = Add webhook endpoint
configure-webhooks-addEndpointButton = Add webhook endpoint
configure-webhooks-endpoints = Endpoints
configure-webhooks-url = URL
configure-webhooks-status = Status
configure-webhooks-noEndpoints = There are no webhook endpoints configured, add one above.
configure-webhooks-enabledWebhookEndpoint = Enabled
configure-webhooks-disabledWebhookEndpoint = Disabled
configure-webhooks-endpointURL = Endpoint URL
configure-webhooks-cancelButton = Cancel
configure-webhooks-updateWebhookEndpointButton = Update webhook endpoint
configure-webhooks-eventsToSend = Events to send
configure-webhooks-clearEventsToSend = Clear
configure-webhooks-eventsToSendDescription =
  These are the events that are registered to this particular endpoint. Visit
  our <externalLink>Webhook Guide</externalLink> for the schema of these events.
  Any event matching the following will be sent to the endpoint if it is
  enabled:
configure-webhooks-allEvents =
  The endpoint will receive all events, including any added in the future.
configure-webhooks-selectedEvents =
  { $count } { $count ->
    [1] event
    *[other] events
  } selected.
configure-webhooks-selectAnEvent =
  Select events above or <button>receive all events</button>.
configure-webhooks-configureWebhookEndpoint = Configure webhook endpoint
configure-webhooks-confirmEnable =
  Enabling the webhook endpoint will start to send events to this URL. Are you sure you want to continue?
configure-webhooks-confirmDisable =
  Disabling this webhook endpoint will stop any new events from being sent to this URL. Are you sure you want to continue?
configure-webhooks-confirmDelete =
  Deleting this webhook endpoint will stop any new events from being sent to this URL, and remove all the associated settings with this webhook endpoint. Are you sure you want to continue?
configure-webhooks-dangerZone = Danger Zone
configure-webhooks-rotateSigningSecret = Rotate signing secret
configure-webhooks-rotateSigningSecretDescription =
  Rotating the signing secret will allow to you to safely replace a signing
  secret used in production with a delay.
configure-webhooks-rotateSigningSecretButton = Rotate signing secret
configure-webhooks-rotateSigningSecretHelper =
  After it expires, signatures will no longer be generated with the old secret.
configure-webhooks-rotateSigningSecretSuccessUseNewSecret =
  Webhook endpoint signing secret has been rotated. Please ensure
  you update your integrations to use the new secret below.
configure-webhooks-disableEndpoint = Disable endpoint
configure-webhooks-disableEndpointDescription =
  This endpoint is current enabled. By disabling this endpoint no new events
  will be sent to the URL provided.
configure-webhooks-disableEndpointButton = Disable endpoint
configure-webhooks-enableEndpoint = Enable endpoint
configure-webhooks-enableEndpointDescription =
  This endpoint is current disabled. By enabling this endpoint new events will
  be sent to the URL provided.
configure-webhooks-enableEndpointButton = Enable endpoint
configure-webhooks-deleteEndpoint = Delete endpoint
configure-webhooks-deleteEndpointDescription =
  Deleting the endpoint will prevent any new events from being sent to the URL
  provided.
configure-webhooks-deleteEndpointButton = Delete endpoint
configure-webhooks-endpointStatus = Endpoint status
configure-webhooks-signingSecret = Signing secret
configure-webhooks-signingSecretDescription =
  The following signing secret is used to sign request payloads sent
  to the URL. To learn more about webhook signing, visit our
  <externalLink>Webhook Guide</externalLink>.
configure-webhooks-expiresOldSecret = Expire the old secret
configure-webhooks-expiresOldSecretImmediately = Immediately
configure-webhooks-expiresOldSecretHoursFromNow =
  { $hours ->
    [1] 1 hour
    *[other] { $hours } hours
  }  from now
configure-webhooks-detailsButton = Details <icon></icon>

### General
configure-general-guidelines-title = Community guidelines summary
configure-general-guidelines-explanation =
  This will appear above the comments sitewide.
  You can format the text using Markdown.
  More information on how to use Markdown
  here: <externalLink>https://www.markdownguide.org/cheat-sheet/</externalLink>
configure-general-guidelines-showCommunityGuidelines = Show community guidelines summary

#### Bio
configure-general-memberBio-title = Commenter bios
configure-general-memberBio-explanation =
  Allow commenters to add a bio to their profile. Note: This can increase moderator workload as commenter bios can be reported.
configure-general-memberBio-label = Allow commenter bios

#### Locale
configure-general-locale-language = Language
configure-general-locale-chooseLanguage = Choose the language for your Coral community.
configure-general-locale-invalidLanguage =
  The previously selected language <lang></lang> no longer exists. Please choose a different language.

#### Sitewide Commenting
configure-general-sitewideCommenting-title = Sitewide commenting
configure-general-sitewideCommenting-explanation =
  Open or close comment streams for new comments sitewide.
  When new comments are turned off, new comments cannot be
  submitted, but existing comments can continue to receive
  reactions, be reported, and be shared.
configure-general-sitewideCommenting-enableNewCommentsSitewide =
  Enable new comments sitewide
configure-general-sitewideCommenting-onCommentStreamsOpened =
  On - Comment streams opened for new comments
configure-general-sitewideCommenting-offCommentStreamsClosed =
  Off - Comment streams closed for new comments
configure-general-sitewideCommenting-message = Sitewide closed comments message
configure-general-sitewideCommenting-messageExplanation =
  Write a message that will be displayed when comment streams are closed sitewide

#### Embed Links
configure-general-embedLinks-title = Embedded media
configure-general-embedLinks-desc =
configure-general-embedLinks-description = 
configure-general-embedLinks-description-addASinglePiece =
  Allow commenters to add a single piece of embedded media to the end of a comment
configure-general-embedLinks-enableTwitterEmbeds = Allow X post embeds
configure-general-embedLinks-enableBlueskyEmbeds = Allow Bluesky post embeds
configure-general-embedLinks-enableYouTubeEmbeds = Allow YouTube embeds
configure-general-embedLinks-enableGifs = Allow GIFs
configure-general-embedLinks-enableExternalEmbeds = Enable external media

configure-general-embedLinks-On = Yes
configure-general-embedLinks-Off = No

configure-general-embedLinks-giphyMaxRating = GIF content rating
configure-general-embedLinks-giphyMaxRating-desc = Select the maximum content rating for the GIFs that will appear in commenters’ search results

configure-general-embedLinks-giphyMaxRating-g = G
configure-general-embedLinks-giphyMaxRating-g-desc = Content that is appropriate for all ages
configure-general-embedLinks-giphyMaxRating-pg = PG
configure-general-embedLinks-giphyMaxRating-pg-desc = Content that is generally safe for everyone, but parental guidance for children is advised.
configure-general-embedLinks-giphyMaxRating-pg13 = PG-13
configure-general-embedLinks-giphyMaxRating-pg13-desc = Mild sexual innuendos, mild substance use, mild profanity, or threatening images. May include images of semi-naked people, but DOES NOT show real human genitalia or nudity.
configure-general-embedLinks-giphyMaxRating-r = R
configure-general-embedLinks-giphyMaxRating-r-desc = Strong language, strong sexual innuendo, violence, and illegal drug use; not suitable for teens or younger. No nudity.

configure-general-embedLinks-configuration = Configuration

configure-general-embedLinks-gifProvider = GIF provider
configure-general-embedLinks-gifProvider-desc =
  Determines which provider commenters will search for and show GIFs from.

configure-general-embedLinks-gifs-provider-Giphy = Giphy
configure-general-embedLinks-gifs-provider-Tenor = Tenor

configure-general-embedLinks-configuration-desc =
configure-general-embedLinks-configuration-giphy-desc =
  For additional information on GIPHY’s API please visit: <externalLink>https://developers.giphy.com/docs/api</externalLink>
configure-general-embedLinks-giphyAPIKey = GIPHY API key

configure-general-embedLinks-configuration-tenor-desc =
  For additional information on TENOR’s API please visit: <externalLink>https://developers.google.com/tenor/guides/endpoints</externalLink>
configure-general-embedLinks-tenorAPIKey = TENOR API key


#### Configure Announcements

configure-general-announcements-title = Community announcement
configure-general-announcements-description =
  Add a temporary announcement that will appear at the top of all of your organization’s comment streams for a specific amount of time.
configure-general-announcements-delete = Remove announcement
configure-general-announcements-add = Add announcement
configure-general-announcements-start = Start announcement
configure-general-announcements-cancel = Cancel
configure-general-announcements-current-label = Current announcement
configure-general-announcements-current-duration =
  This announcement will automatically end on: { $timestamp }
configure-general-announcements-duration = Show this announcement for

#### Closing Comment Streams
configure-general-closingCommentStreams-title = Closing comment streams
configure-general-closingCommentStreams-explanation = Set comment streams to close after a defined period of time after a story’s publication
configure-general-closingCommentStreams-closeCommentsAutomatically = Close comments automatically
configure-general-closingCommentStreams-closeCommentsAfter = Close comments after

#### Comment Length
configure-general-commentLength-title = Comment length
configure-general-commentLength-maxCommentLength = Maximum comment length
configure-general-commentLength-setLimit =
  Set minimum and maximum comment length requirements.
  Blank spaces at the beginning and the end of a comment will be trimmed.
configure-general-commentLength-limitCommentLength = Limit comment length
configure-general-commentLength-minCommentLength = Minimum comment length
configure-general-commentLength-characters = Characters
configure-general-commentLength-textField =
  .placeholder = No limit
configure-general-commentLength-validateLongerThanMin =
  Please enter a number longer than the minimum length

#### Comment Editing
configure-general-commentEditing-title = Comment editing
configure-general-commentEditing-explanation =
  Set a limit on how long commenters have to edit their comments sitewide.
  Edited comments are marked as (Edited) on the comment stream and the
  moderation panel.
configure-general-commentEditing-commentEditTimeFrame = Comment edit timeframe
configure-general-commentEditing-seconds = Seconds

#### Flatten replies
configure-general-flattenReplies-title = Flatten replies
configure-general-flattenReplies-enabled = Flatten replies enabled
configure-general-flattenReplies-explanation =
  Change how levels of replies display. When enabled, replies to comments can go up to seven levels deep before they are no longer indented on the page. When disabled, after a depth of seven replies, the rest of the conversation is displayed in a dedicated view away from the other comments.

configure-general-featuredBy-title = Featured by
configure-general-featuredBy-enabled = Featured by enabled
configure-general-featuredBy-explanation = Add moderator name to featured comment display

configure-general-topCommenter-title = Top commenter badge
configure-general-topCommenter-explanation = Add top commenter badge to commenters with featured comments in the last 10 days
configure-general-topCommenter-enabled = Enable top commenter badges

configure-general-flairBadge-header = Custom flair badges
configure-general-flairBadge-description = Encourage user engagement and participation by adding custom flair
  badges for your site. Badges can be allocated as part of your <externalLink>JWT claim</externalLink>.
configure-general-flairBadge-enable-label = Enable custom flair badges
configure-general-flairBadge-add = Flair URL
configure-general-flairBadge-add-helperText =
  Paste the web address for your custom flair badge. Supported file types: png, jpeg, jpg, and gif
configure-general-flairBadge-url-error =
  The URL is invalid or has an unsupported file type.
configure-general-flairBadge-add-name = Flair name
configure-general-flairBadge-add-name-helperText =
  Name the flair with a descriptive identifier
configure-general-flairBadge-name-permittedCharacters =
  Only letters, numbers, and the special characters - . are permitted.
configure-general-flairBadge-add-button = Add
configure-general-flairBadge-table-flairName = Name
configure-general-flairBadge-table-flairURL = URL
configure-general-flairBadge-table-preview = Preview
configure-general-flairBadge-table-deleteButton = <icon></icon> Delete
configure-general-flairBadge-table-empty = No custom flair added for this site

#### In-page notifications
configure-general-inPageNotifications-title = In-page notifications
configure-general-inPageNotifications-explanation = Add notifications to Coral. When enabled, commenters can receive
  notifications when they receive all replies, replies only from members
  of your team, when a Pending comment is published. Commenters can
  disable visual notification indicators in their Profile preferences. This will remove e-mail notifications.
configure-general-inPageNotifications-enabled = In-page notifications enabled
configure-general-inPageNotifications-floatingBellIndicator = Floating bell indicator

#### Closed Stream Message
configure-general-closedStreamMessage-title = Closed comment stream message
configure-general-closedStreamMessage-explanation = Write a message to appear when a story is closed for commenting.

### Organization
configure-organization-name = Organization name
configure-organization-sites = Sites
configure-organization-nameExplanation =
  Your organization name will appear on emails sent by { -product-name } to your community and organization members.
configure-organization-sites-explanation =
  Add a new site to your organization or edit an existing site's details.
configure-organization-sites-add-site = <icon></icon> Add site
configure-organization-email = Organization email
configure-organization-emailExplanation =
  This email address will be used as in emails and across the platform
  for community members to get in touch with the organization should
  they have any questions about the status of their accounts or
  moderation questions.
configure-organization-url = Organization URL
configure-organization-urlExplanation =
  Your organization url will appear on emails sent by { -product-name } to your community and organization members.

### Sites
configure-sites-site-details = Details <icon></icon>
configure-sites-add-new-site = Add a new site to { $site }
configure-sites-add-success = { $site } has been added to { $org }
configure-sites-edit-success = Changes to { $site } have been saved.
configure-sites-site-form-name = Site name
configure-sites-site-form-name-explanation = Site name will appear on emails sent by Coral to your community and organization members.
configure-sites-site-form-url = Site URL
configure-sites-site-form-url-explanation = This url will appear on emails sent by Coral to your community members.
configure-sites-site-form-email = Site email address
configure-sites-site-form-url-explanation = This email address is for community members to contact you with questions or if they need help. e.g. comments@yoursite.com
configure-sites-site-form-domains = Site permitted domains
configure-sites-site-form-domains-explanation = Domains where your Coral comment streams are allowed to be embedded (ex. http://localhost:3000, https://staging.domain.com, https://domain.com).
configure-sites-site-form-submit = <icon></icon> Add site
configure-sites-site-form-cancel = Cancel
configure-sites-site-form-save = Save changes
configure-sites-site-edit = Edit { $site } details
configure-sites-site-form-embed-code = Embed code
sites-emptyMessage = We could not find any sites matching your criteria.
sites-selector-allSites = All sites
site-filter-option-allSites = All sites

site-selector-all-sites = All sites
stories-filter-sites-allSites = All sites
stories-filter-statuses = Status
stories-column-site = Site
site-table-siteName = Site name
stories-filter-sites = Site

site-search-searchButton =
  .aria-label = Search
site-search-textField =
  .aria-label = Search by site name
site-search-textField =
  .placeholder = Search by site name
site-search-none-found = No sites were found with that search
specificSitesSelect-validation = You must select at least one site.

stories-column-actions = Actions
stories-column-rescrape = Re-scrape

stories-openInfoDrawer =
  .aria-label = Open Info Drawer
stories-actions-popover =
  .description = A dropdown to select story actions
stories-actions-rescrape = Re-scrape
stories-actions-close = Close story
stories-actions-open = Open story
stories-actions-archive = Archive story
stories-actions-unarchive = Unarchive story
stories-actions-isUnarchiving = Unarchiving

### Sections

moderate-section-selector-allSections = All Sections
moderate-section-selector-uncategorized = Uncategorized
moderate-section-uncategorized = Uncategorized

### Email

configure-email = Email settings
configure-email-configBoxEnabled = Enabled
configure-email-fromNameLabel = From name
configure-email-fromNameDescription =
  Name as it will appear on all outgoing emails
configure-email-fromEmailLabel = From email address
configure-email-fromEmailDescription =
  Email address that will be used to send messages
configure-email-smtpHostLabel = SMTP host
configure-email-smtpHostDescription = (ex. smtp.sendgrid.net)
configure-email-smtpPortLabel = SMTP port
configure-email-smtpPortDescription = (ex. 25)
configure-email-smtpTLSLabel = TLS
configure-email-smtpAuthenticationLabel = SMTP authentication
configure-email-smtpCredentialsHeader = Email credentials
configure-email-smtpUsernameLabel = Username
configure-email-smtpPasswordLabel = Password
configure-email-send-test = Send test email

### Authentication

configure-auth-clientID = Client ID
configure-auth-clientSecret = Client secret
configure-auth-configBoxEnabled = Enabled
configure-auth-targetFilterCoralAdmin = { -product-name } Admin
configure-auth-targetFilterCommentStream = Comment Stream
configure-auth-redirectURI = Redirect URI
configure-auth-registration = Registration
configure-auth-registrationDescription =
  Allow users that have not signed up before with this authentication
  integration to register for a new account.
configure-auth-registrationCheckBox = Allow Registration
configure-auth-pleaseEnableAuthForAdmin =
  Please enable at least one authentication integration for { -product-name } Admin
configure-auth-confirmNoAuthForCommentStream =
  No authentication integration has been enabled for the Comment Stream.
  Do you really want to continue?

configure-auth-facebook-loginWith = Login with Facebook
configure-auth-facebook-toEnableIntegration =
  To enable the integration with Facebook Authentication,
  you need to create and set up a web application.
  For more information visit: <Link></Link>.
configure-auth-facebook-useLoginOn = Use Facebook login on

configure-auth-google-loginWith = Login with Google
configure-auth-google-toEnableIntegration =
  To enable the integration with Google Authentication you need
  to create and set up a web application. For more information visit:
  <Link></Link>.
configure-auth-google-useLoginOn = Use Google login on

configure-auth-sso-loginWith = Login with Single Sign On
configure-auth-sso-useLoginOn = Use Single Sign On login on
configure-auth-sso-key = Key
configure-auth-sso-regenerate = Regenerate
configure-auth-sso-regenerateAt = KEY GENERATED AT:
  { DATETIME($date, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric") }
configure-auth-sso-regenerateHonoredWarning =
  When regenerating a key, tokens signed with the previous key will be honored for 30 days.

configure-auth-sso-description =
  To enable integration with your existing authentication system,
  you will need to create a JWT Token to connect. You can learn
  more about creating a JWT Token with <IntroLink>this introduction</IntroLink>. See our
  <DocLink>documentation</DocLink> for additional information on single sign on.

configure-auth-sso-rotate-keys = Keys
configure-auth-sso-rotate-keyID = Key ID
configure-auth-sso-rotate-secret = Secret
configure-auth-sso-rotate-copySecret =
  .aria-label = Copy Secret

configure-auth-sso-rotate-date =
  { DATETIME($date, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric") }
configure-auth-sso-rotate-activeSince = Active Since
configure-auth-sso-rotate-inactiveAt = Inactive At
configure-auth-sso-rotate-inactiveSince = Inactive Since

configure-auth-sso-rotate-status = Status
configure-auth-sso-rotate-statusActive = Active
configure-auth-sso-rotate-statusExpiring = Expiring
configure-auth-sso-rotate-statusExpired = Expired
configure-auth-sso-rotate-statusUnknown = Unknown

configure-auth-sso-rotate-expiringTooltip =
  An SSO key is expiring when it is scheduled for rotation.
configure-auth-sso-rotate-expiringTooltip-toggleButton =
  .aria-label = Toggle expiring tooltip visibility
configure-auth-sso-rotate-expiredTooltip =
  An SSO key is expired when it has been rotated out of use.
configure-auth-sso-rotate-expiredTooltip-toggleButton =
  Toggle expired tooltip visibility

configure-auth-sso-rotate-rotate = Rotate
configure-auth-sso-rotate-deactivateNow = Deactivate Now
configure-auth-sso-rotate-delete = Delete

configure-auth-sso-rotate-now = Now
configure-auth-sso-rotate-10seconds = 10 seconds from now
configure-auth-sso-rotate-1day = 1 day from now
configure-auth-sso-rotate-1week = 1 week from now
configure-auth-sso-rotate-30days = 30 days from now
configure-auth-sso-rotate-dropdown-description =
  .description = A dropdown to rotate the SSO key

configure-auth-local-loginWith = Login with email authentication
configure-auth-local-useLoginOn = Use email authentication login on
configure-auth-local-forceAdminLocalAuth =
  Admin local auth has been permanently enabled.
  This is to ensure that Coral service teams can access the administration panel.

configure-auth-oidc-loginWith = Login with OpenID Connect
configure-auth-oidc-toLearnMore = To learn more: <Link></Link>
configure-auth-oidc-providerName = Provider name
configure-auth-oidc-providerNameDescription =
  The provider of the OpenID Connect integration. This will be used when the name of the provider
  needs to be displayed, e.g. “Log in with &lt;Facebook&gt;”.
configure-auth-oidc-issuer = Issuer
configure-auth-oidc-issuerDescription =
  After entering your Issuer information, click the Discover button to have { -product-name } complete
  the remaining fields. You may also enter the information manually.
configure-auth-oidc-authorizationURL = Authorization URL
configure-auth-oidc-tokenURL = Token URL
configure-auth-oidc-jwksURI = JWKS URI
configure-auth-oidc-useLoginOn = Use OpenID Connect login on

configure-auth-settings = Session settings
configure-auth-settings-session-duration-label = Session duration

### Moderation

### Recent Comment History

configure-moderation-recentCommentHistory-title = Recent history
configure-moderation-recentCommentHistory-timeFrame = Recent comment history time period
configure-moderation-recentCommentHistory-timeFrame-description =
  Amount of time to calculate a commenter's rejection rate.
configure-moderation-recentCommentHistory-enabled = Recent history filter
configure-moderation-recentCommentHistory-enabled-description =
  Prevents repeat offenders from publishing comments without approval.
  When a commenter's rejection rate is above the threshold, their
  comments are sent to Pending for moderator approval. This does not
  apply to Staff comments.
configure-moderation-recentCommentHistory-triggerRejectionRate = Rejection rate threshold
configure-moderation-recentCommentHistory-triggerRejectionRate-description =
  Rejected comments ÷ (rejected comments + published comments)
  over the timeframe above, as a percentage. It does not include
  comments pending for toxicity, spam or pre-moderation.

#### External links for moderators
configure-moderation-externalLinks-title = External links for moderators
configure-moderation-externalLinks-profile-explanation = When a URL format is included
  below, external profile links are added to the user drawer inside the moderation
  interface. You can use the format $USER_NAME to insert the username or $USER_ID
  to insert the user’s unique ID number.
configure-moderation-externalLinks-profile-label = External profile URL pattern
configure-moderation-externalLinks-profile-input =
  .placeholder = https://example.com/users/$USER_NAME

#### Pre-Moderation
configure-moderation-preModeration-title = Pre-moderation
configure-moderation-preModeration-explanation =
  When pre-moderation is turned on, comments will not be published unless
  approved by a moderator.
configure-moderation-preModeration-moderation =
  Pre-moderate all comments
configure-moderation-preModeration-premodLinksEnable =
  Pre-moderate all comments containing links

#### Moderation all/specific sites options
configure-moderation-specificSites = Specific sites
configure-moderation-allSites = All sites

configure-moderation-apiKey = API key

configure-moderation-akismet-title = Spam detection filter
configure-moderation-akismet-explanation =
  The Akismet API filter warns users when a comment is determined likely
  to be spam. Comments that Akismet thinks are spam will not be published
  and are placed in the Pending Queue for review by a moderator.
  If approved by a moderator, the comment will be published.

configure-moderation-premModeration-premodSuspectWordsEnable =
  Pre-moderate all comments containing Suspect Words
configure-moderation-premModeration-premodSuspectWordsDescription =
  You can view and edit your Suspect Word list <wordListLink>here</wordListLink>

#### Akismet
configure-moderation-akismet-filter = Spam detection filter
configure-moderation-akismet-ipBased = IP-based spam detection
configure-moderation-akismet-accountNote =
  Note: You must add your active domain(s)
  in your Akismet account: <externalLink>https://akismet.com/account/</externalLink>
configure-moderation-akismet-siteURL = Site URL


#### Perspective
configure-moderation-perspective-title = Toxic comment filter
configure-moderation-perspective-explanation =
  Using the Perspective API, the Toxic Comment filter warns users
  when comments exceed the predefined toxicity threshold.
  Comments with a toxicity score above the threshold
  <strong>will not be published</strong> and are placed in
  the <strong>Pending Queue for review by a moderator</strong>.
  If approved by a moderator, the comment will be published.
configure-moderation-perspective-filter = Toxic comment filter
configure-moderation-perspective-toxicityThreshold = Toxicity threshold
configure-moderation-perspective-toxicityThresholdDescription =
  This value can be set a percentage between 0 and 100. This number represents the likelihood that a
  comment is toxic, according to Perspective API. By default the threshold is set to { $default }.
configure-moderation-perspective-toxicityModel = Toxicity model
configure-moderation-perspective-toxicityModelDescription =
  Choose your Perspective Model. The default is { $default }.
  You can find out more about model choices <externalLink>here</externalLink>.
configure-moderation-perspective-allowStoreCommentData = Allow Google to store comment data
configure-moderation-perspective-allowStoreCommentDataDescription =
  Stored comments will be used for future research and community model building purposes to
  improve the API over time.
configure-moderation-perspective-allowSendFeedback =
  Allow Coral to send moderation actions to Google
configure-moderation-perspective-allowSendFeedbackDescription =
  Sent moderation actions will be used for future research and
  community model building purposes to improve the API over time.
configure-moderation-perspective-customEndpoint = Custom endpoint
configure-moderation-perspective-defaultEndpoint =
  By default the endpoint is set to { $default }. You may override this here.
configure-moderation-perspective-accountNote =
  For additional information on how to set up the Perspective Toxic Comment Filter please visit:
  <externalLink>https://github.com/conversationai/perspectiveapi#readme</externalLink>

configure-moderation-newCommenters-title = New commenter approval
configure-moderation-newCommenters-enable = Enable new commenter approval
configure-moderation-newCommenters-description =
  When this is active, initial comments by a new commenter will be sent to Pending
  for moderator approval before publication.
configure-moderation-newCommenters-enable-description = Enable pre-moderation for new commenters
configure-moderation-newCommenters-approvedCommentsThreshold = Number of comments that must be approved
configure-moderation-newCommenters-approvedCommentsThreshold-description =
  The number of comments a user must have approved before they do
  not have to be premoderated
configure-moderation-newCommenters-comments = comments

#### Unmoderated counts
configure-moderation-unmoderatedCounts-title = Unmoderated counts
configure-moderation-unmoderatedCounts-enabled = Show the number of unmoderated comments in the queue

#### Email domain
configure-moderation-emailDomains-header = Email domain
configure-moderation-emailDomains-description = Create rules to take action on accounts or comments based on the account holder's email address domain.
configure-moderation-emailDomains-add = Add email domain
configure-moderation-emailDomains-edit = Edit email domain
configure-moderation-emailDomains-addDomain = <icon></icon> Add domain
configure-moderation-emailDomains-table-domain = Domain
configure-moderation-emailDomains-table-action = Action
configure-moderation-emailDomains-table-edit = <icon></icon> Edit
configure-moderation-emailDomains-table-delete = <icon></icon> Delete
configure-moderation-emailDomains-form-label-domain = Domain
configure-moderation-emailDomains-form-label-moderationAction = Moderation action
configure-moderation-emailDomains-banAllUsers = Ban all new commenter accounts
configure-moderation-emailDomains-alwaysPremod = Always pre-moderate comments
configure-moderation-emailDomains-form-cancel = Cancel
configure-moderation-emailDomains-form-addDomain = Add domain
configure-moderation-emailDomains-form-editDomain = Update
configure-moderation-emailDomains-confirmDelete = Deleting this email domain will stop any new accounts created with it from being banned or always pre-moderated. Are you sure you want to continue?
configure-moderation-emailDomains-form-description-add = Add a domain and select the action that should be taken when on every new account created using the specified domain.
configure-moderation-emailDomains-form-description-edit = Update the domain or action that should be taken when on every new account using the specified domain.
configure-moderation-emailDomains-exceptions-header = Exceptions
configure-moderation-emailDomains-exceptions-helperText = These domains cannot be banned. Domains should be written without www, for example "gmail.com". Separate domains with a comma and a space.
configure-moderation-emailDomains-exceptions-ban-premod-helperText = These domains cannot be banned or pre-moderated. Domains should be written without www, for example "gmail.com". Separate domains with a comma and a space.

configure-moderation-emailDomains-showCurrent = Show current domain list
configure-moderation-emailDomains-hideCurrent = Hide current domain list
configure-moderation-emailDomains-filterByStatus = 
  .aria-label = Filter by email domain status
configuration-moderation-emailDomains-empty = There are no email domains configured.

configure-moderation-emailDomains-allDomains = All domains
configure-moderation-emailDomains-preMod = Pre-mod
configure-moderation-emailDomains-banned = Banned

configure-moderation-emailDomains-disposableEmailDomains-enabled = Disposable email domains
configure-moderation-emailDomains-disposableEmailDomains-helper-text = If a new user registers using a disposable email address, set their status to 'always pre-moderate comments.' Accounts with disposable email addresses can have a high spam / troll correlation.
configure-moderation-emailDomains-disposableEmailDomains-updating = Updating
configure-moderation-emailDomains-disposableEmailDomains-update-button = Update disposable domains
configure-moderation-emailDomains-disposableEmailDomains-list-linkText = disposable-email-domains
configure-moderation-emailDomains-disposableEmailDomains-update-button-helper-text = The email domains come from the <link></link> list, which is regularly updated. Use the button below to import their latest list.

#### Pre-moderate  Email Address Configuration

configure-moderation-premoderateEmailAddress-title = Email address
configure-moderation-premoderateEmailAddress-enabled =
  Pre-moderate emails with too many periods
configure-moderation-premoderateEmailAddress-enabled-description =
  If a user has three or more periods in the first part of their
  email address (before the @), set their status to pre-moderate
  comments. Emails with 3 or more periods can have a very high spam
  correlation. It can be useful to pro-actively pre-moderate them.
configure-moderation-premoderateEmailAliases-enabled =
  Pre-moderate email aliases
configure-moderation-premoderateEmailAliases-enabled-description =
configure-moderation-premoderateEmailAliases-enabled-description-ifThePreviousAccountWas =
  If a user signs up for a new account with an email address that is
  an alias (using a + sign) of an existing account, set their status
  to pre-moderate comments. If the previous account was banned, the
  new account will be banned as well. Email aliases are commonly
  used by spammers and trolls to evade bans.

#### Banned Words Configuration
configure-wordList-banned-bannedWordsAndPhrases = Banned words and phrases
configure-wordList-banned-explanation =
  Comments containing a word or phrase in the banned words list are <strong>automatically rejected and are not published</strong>.
configure-wordList-banned-wordList = Banned word list
configure-wordList-banned-wordListDetailInstructions =
  Separate banned words or phrases with a new line. Words/phrases are not case sensitive.

#### Suspect Words Configuration
configure-wordList-suspect-bannedWordsAndPhrases = Suspect words and phrases
configure-wordList-suspect-explanation =
  Comments containing a word or phrase in the Suspect Words List
  are <strong>placed into the Reported Queue for moderator review and are
  published (if comments are not pre-moderated).</strong>
configure-wordList-suspect-explanationSuspectWordsList =
  Comments containing a word or phrase in the Suspect Words List are
  <strong>placed into the Pending Queue for moderator review and are not
  published unless approved by a moderator.</strong>
configure-wordList-suspect-wordList = Suspect word list
configure-wordList-suspect-wordListDetailInstructions =
  Separate suspect words or phrases with a new line. Words/phrases are not case sensitive.

### Advanced
configure-advanced-customCSS = Custom CSS
configure-advanced-customCSS-override =
  URL of a CSS stylesheet that will override default Embed Stream styles.
configure-advanced-customCSS-stylesheetURL = Custom CSS Stylesheet URL
configure-advanced-customCSS-fontsStylesheetURL = Custom CSS Stylesheet URL for Font Faces
configure-advanced-customCSS-containsFontFace =
  URL to a custom CSS stylesheet that contains all @font-face
  definitions needed by above stylesheet.

configure-advanced-embeddedComments = Embedded comments
configure-advanced-embeddedComments-subheader = For sites using oEmbed
configure-advanced-embeddedCommentReplies-explanation = When enabled, a reply button
  will appear with each embedded comment to encourage additional discussion on that
  specific comment or story.
configure-advanced-embeddedCommentReplies-label = Allow replies to embedded comments

configure-advanced-oembedAllowedOrigins-header = oEmbed permitted domains
configure-advanced-oembedAllowedOrigins-description = Domains that are permitted to make calls to the oEmbed API (ex. http://localhost:3000, https://staging.domain.com, https://domain.com).
configure-advanced-oembedAllowedOrigins-label = oEmbed permitted domains

configure-advanced-permittedDomains = Permitted domains
configure-advanced-permittedDomains-description =
  Domains where your { -product-name } instance is allowed to be embedded
  including the scheme (ex. http://localhost:3000, https://staging.domain.com,
  https://domain.com).

configure-advanced-liveUpdates = Comment stream live updates
configure-advanced-liveUpdates-explanation =
  When enabled, there will be real-time loading and updating of comments.
  When disabled, users will have to refresh the page to see new comments.

configure-advanced-embedCode-title = Embed code
configure-advanced-embedCode-explanation =
  Copy and paste the code below into your CMS to embed Coral comment streams in
  each of your site’s stories.

configure-advanced-embedCode-comment =
  Uncomment these lines and replace with the ID of the
  story's ID and URL from your CMS to provide the
  tightest integration. Refer to our documentation at
  https://docs.coralproject.net for all the configuration
  options.

configure-advanced-amp = Accelerated Mobile Pages
configure-advanced-amp-explanation =
  Enable support for <LinkToAMP>AMP</LinkToAMP> on the comment stream.
  Once enabled, you will need to add Coral’s AMP embed code to your page
  template. See our <LinkToDocs>documentation</LinkToDocs> for more
  details. Enable Enable Support.

configure-advanced-for-review-queue = Review all user reports
configure-advanced-for-review-queue-explanation =
  Once a comment is approved, it won't appear again in the reported queue
  even if additional users report it. This feature adds a "For review" queue,
  allowing moderators to see all user reports in the system, and manually
  mark them as "Reviewed".
configure-advanced-for-review-queue-label = Show "For review" queue

## Decision History
decisionHistory-popover =
  .description = A dialog showing the decision history
decisionHistory-youWillSeeAList =
  You will see a list of your post moderation actions here.
decisionHistory-showMoreButton =
  Show More
decisionHistory-yourDecisionHistory = Your Decision History
decisionHistory-rejectedCommentBy = Rejected comment by <Username></Username>
decisionHistory-approvedCommentBy = Approved comment by <Username></Username>
decisionHistory-goToComment = Go to comment

### Slack

configure-slack-header-title = Slack Integrations
configure-slack-description =
  Automatically send comments from Coral moderation queues to Slack
  channels. You will need Slack admin access to set this up. For
  steps on how to create a Slack App see our <externalLink>documentation</externalLink>.
configure-slack-notRecommended =
  Not recommended for sites with more than 10K comments per month.
configure-slack-addChannel = Add Channel

configure-slack-channel-defaultName = New channel
configure-slack-channel-enabled = Enabled
configure-slack-channel-remove = Remove Channel
configure-slack-channel-name-label = Name
configure-slack-channel-name-description =
  This is only for your information, to easily identify
  each Slack connection. Slack does not tell us the name
  of the channel/s you're connecting to Coral.
configure-slack-channel-hookURL-label = Webhook URL
configure-slack-channel-hookURL-description =
  Slack provides a channel-specific URL to activate webhook
  connections. To find the URL for one of your Slack channels,
  follow the instructions <externalLink>here</externalLink>.
configure-slack-channel-triggers-label =
  Receive notifications in this Slack channel for
configure-slack-channel-triggers-reportedComments = Reported Comments
configure-slack-channel-triggers-pendingComments = Pending Comments
configure-slack-channel-triggers-featuredComments = Featured Comments
configure-slack-channel-triggers-allComments = All Comments
configure-slack-channel-triggers-staffComments = Staff Comments

## moderate
moderate-navigation-reported = reported
moderate-navigation-pending = Pending
moderate-navigation-unmoderated = unmoderated
moderate-navigation-rejected = rejected
moderate-navigation-approved = approved
moderate-navigation-comment-count = { SHORT_NUMBER($count) }
moderate-navigation-forReview = for review

moderate-marker-preMod = Pre-mod
moderate-marker-link = Link
moderate-marker-bannedWord = Banned word
moderate-marker-bio = Bio
moderate-marker-illegal = Potentially illegal content
moderate-marker-possibleBannedWord = Possible Banned Word
moderate-marker-suspectWord = Suspect word
moderate-marker-possibleSuspectWord = Possible Suspect Word
moderate-marker-spam = Spam
moderate-marker-spamDetected = Spam detected
moderate-marker-toxic = Toxic
moderate-marker-recentHistory = Recent history
moderate-marker-bodyCount = Body count
moderate-marker-offensive = Offensive
moderate-marker-abusive = Abusive
moderate-marker-newCommenter = New commenter
moderate-marker-repeatPost = Repeat comment
moderate-marker-other = Other
moderate-marker-preMod-userEmail = User email

moderate-markers-details = Details
moderate-flagDetails-latestReports = Latest reports
moderate-flagDetails-offensive = Offensive
moderate-flagDetails-abusive = Abusive
moderate-flagDetails-spam = Spam
moderate-flagDetails-bio = Bio
moderate-flagDetails-other = Other
moderate-flagDetails-illegalContent = Potentially illegal content
moderate-flagDetails-viewDSAReport = View DSA Report

moderate-card-flag-details-anonymousUser = Anonymous user

moderate-flagDetails-toxicityScore = Toxicity Score
moderate-toxicityLabel-likely = Likely <score></score>
moderate-toxicityLabel-unlikely = Unlikely <score></score>
moderate-toxicityLabel-maybe = Maybe <score></score>

moderate-linkDetails-label = Copy link to this comment
moderate-in-stream-link-copy = In Stream
moderate-in-moderation-link-copy = In Moderation

moderate-decisionDetails-decisionLabel = Decision
moderate-decisionDetails-rejected = Rejected
moderate-decisionDetails-reasonLabel = Reason
moderate-decisionDetails-lawBrokenLabel = Law broken
moderate-decisionDetails-customReasonLabel = Custom reason
moderate-decisionDetails-detailedExplanationLabel = Detailed explanation

moderate-emptyQueue-pending = Nicely done! There are no more pending comments to moderate.
moderate-emptyQueue-reported = Nicely done! There are no more reported comments to moderate.
moderate-emptyQueue-unmoderated = Nicely done! All comments have been moderated.
moderate-emptyQueue-rejected = There are no rejected comments.
moderate-emptyQueue-approved = There are no approved comments.

moderate-comment-edited = (edited)
moderate-comment-inReplyTo = Reply to <Username></Username>
moderate-comment-viewContext = View Context
moderate-comment-viewConversation = View Conversation
moderate-comment-rejectButton =
  .aria-label = Reject
moderate-comment-approveButton =
  .aria-label = Approve
moderate-comment-decision = Decision
moderate-comment-story = Story
moderate-comment-storyLabel = Comment On
moderate-comment-moderateStory = Moderate Story
moderate-comment-featureText = Feature
moderate-comment-featuredText = Featured
moderate-comment-moderatedBy = Moderated By
moderate-comment-moderatedBySystem = System
moderate-comment-play-gif = Play GIF
moderate-comment-load-video = Load Video

moderate-single-goToModerationQueues = Go to moderation queues
moderate-single-singleCommentView = Single Comment View

moderate-queue-viewNew =
  { $count ->
    [1] View {$count} new comment
    *[other] View {$count} new comments
  }

moderate-comment-deleted-body =
  This comment is no longer available. The commenter has deleted their account.

### Moderate Search Bar
moderate-searchBar-allStories = All stories
  .title = All stories
moderate-searchBar-noStories = We could not find any stories matching your criteria
moderate-searchBar-stories = Stories:
moderate-searchBar-searchButton = Search
moderate-searchBar-titleNotAvailable =
  .title = Title not available
moderate-searchBar-comboBox =
  .aria-label = Search or jump to story
moderate-searchBar-searchForm =
  .aria-label = Stories
moderate-searchBar-currentlyModerating =
  .title = Currently moderating
moderate-searchBar-searchResults = Search results
moderate-searchBar-searchResultsMostRecentFirst = Search results (Most recent first)
moderate-searchBar-searchResultsMostRelevantFirst = Search results (Most relevant first)
moderate-searchBar-moderateAllStories = Moderate all stories
moderate-searchBar-comboBoxTextField =
  .aria-label = Search or jump to story...
  .placeholder = search by story title, author, url, id, etc.
moderate-searchBar-goTo = Go to
moderate-searchBar-seeAllResults = See all results

moderateCardDetails-tab-info = Info
moderateCardDetails-tab-decision = Decision
moderateCardDetails-tab-edits = Edit history
moderateCardDetails-tab-automatedActions = Automated actions
moderateCardDetails-tab-reactions = Reactions
moderateCardDetails-tab-reactions-loadMore = Load More
moderateCardDetails-tab-noIssuesFound = No issues found
moderateCardDetails-tab-missingPhase = Was not run

moderateCardDetails-tab-externalMod-status = Status
moderateCardDetails-tab-externalMod-flags = Flags
moderateCardDetails-tab-externalMod-tags = Tags

moderateCardDetails-tab-externalMod-none = None
moderateCardDetails-tab-externalMod-approved = Approved
moderateCardDetails-tab-externalMod-rejected = Rejected
moderateCardDetails-tab-externalMod-premod = Pre-moderated
moderateCardDetails-tab-externalMod-systemWithheld = System withheld

### Moderate User History Drawer

moderate-user-drawer-email =
  .title = Email address
moderate-user-drawer-created-at =
  .title = Account creation date
moderate-user-drawer-member-id =
  .title = Member ID
moderate-user-drawer-external-profile-URL =
  .title = External profile URL
moderate-user-drawer-external-profile-URL-link = External profile URL
moderate-user-drawer-tab-all-comments = All Comments
moderate-user-drawer-tab-rejected-comments = Rejected
moderate-user-drawer-tab-account-history = Account History
moderate-user-drawer-tab-notes = Notes
moderate-user-drawer-load-more = Load More
moderate-user-drawer-all-no-comments = {$username} has not submitted any comments.
moderate-user-drawer-rejected-no-comments = {$username} does not have any rejected comments.
moderate-user-drawer-user-not-found = User not found.
moderate-user-drawer-status-label = Status:
moderate-user-drawer-bio-title = Member bio
moderate-user-drawer-username-not-available = Username not available
moderate-user-drawer-username-not-available-tooltip-title = Username not available
moderate-user-drawer-username-not-available-tooltip-body = User did not complete account setup process

moderate-user-drawer-account-history-system = <icon></icon> System
moderate-user-drawer-account-history-suspension-ended = Suspension ended
moderate-user-drawer-account-history-suspension-removed = Suspension removed
moderate-user-drawer-account-history-banned = Banned
moderate-user-drawer-account-history-account-domain-banned =
moderate-user-drawer-account-history-account-domain-or-alias-banned =
  Account domain or alias banned
moderate-user-drawer-account-history-ban-removed = Ban removed
moderate-user-drawer-account-history-site-banned = Site banned
moderate-user-drawer-account-history-site-ban-removed = Site ban removed
moderate-user-drawer-account-history-no-history = No actions have been taken on this account
moderate-user-drawer-username-change = Username change
moderate-user-drawer-username-change-new = New:
moderate-user-drawer-username-change-old = Old:

moderate-user-drawer-account-history-premod-set = Always pre-moderate
moderate-user-drawer-account-history-premod-removed = Removed pre-moderate

moderate-user-drawer-account-history-modMessage-sent = User messaged
moderate-user-drawer-account-history-modMessage-acknowledged = Message acknowledged at { $acknowledgedAt }

moderate-user-drawer-newCommenter = New commenter

moderate-user-drawer-suspension =
  Suspension, { $value } { $unit ->
    [second] { $value ->
      [1] second
      *[other] seconds
    }
    [minute] { $value ->
      [1] minute
      *[other] minutes
    }
    [hour] { $value ->
      [1] hour
      *[other] hours
    }
    [day] { $value ->
      [1] day
      *[other] days
    }
    [week] { $value ->
      [1] week
      *[other] weeks
    }
    [month] { $value ->
      [1] month
      *[other] months
    }
    [year] { $value ->
      [1] year
      *[other] years
    }
    *[other] unknown unit
  }

moderate-user-drawer-deleteAccount-popover =
  .description = A popover menu to delete a user's account
moderate-user-drawer-deleteAccount-button =
  .aria-label = Delete account
moderate-user-drawer-deleteAccount-popover-confirm = Type in "{ $text }" to confirm
moderate-user-drawer-deleteAccount-popover-title = Delete account
moderate-user-drawer-deleteAccount-popover-username = Username
moderate-user-drawer-deleteAccount-popover-header-description = Delete account will
moderate-user-drawer-deleteAccount-popover-description-list-removeComments = Remove all comments written by this user from the database.
moderate-user-drawer-deleteAccount-popover-description-list-deleteAll = Delete all record of this account. The 
  user could then create a new account using the same email address. If you want to Ban this user instead and 
  retain their history, press "CANCEL" and use the Status dropdown below the username.
moderate-user-drawer-deleteAccount-popover-callout = This removes all records of this user
moderate-user-drawer-deleteAccount-popover-timeframe = This will go into effect in 24 hours.
moderate-user-drawer-deleteAccount-popover-cancelButton = Cancel
moderate-user-drawer-deleteAccount-popover-deleteButton = Delete

moderate-user-drawer-deleteAccount-scheduled-callout = User deletion activated
moderate-user-drawer-deleteAccount-scheduled-timeframe = This will occur at { $deletionDate }.
moderate-user-drawer-deleteAccount-scheduled-cancelDeletion = Cancel user deletion

moderate-user-drawer-user-scheduled-deletion = User scheduled for deletion
moderate-user-drawer-user-deletion-canceled = User deletion request canceled

moderate-user-drawer-account-history-deletion-scheduled = Deletion scheduled for { $createdAt }
moderate-user-drawer-account-history-canceled-at = Canceled at { $createdAt }
moderate-user-drawer-account-history-updated-at = Updated at { $createdAt }

moderate-user-drawer-recent-history-title = Recent comment history
moderate-user-drawer-recent-history-calculated =
  Calculated over the last { framework-timeago-time }
moderate-user-drawer-recent-history-rejected = Rejected
moderate-user-drawer-recent-history-tooltip-title = How is this calculated?
moderate-user-drawer-recent-history-tooltip-body =
  Rejected comments ÷ (rejected comments + published comments).
  The threshold can be changed by administrators in Configure > Moderation.
moderate-user-drawer-recent-history-tooltip-button =
  .aria-label = Toggle recent comment history tooltip
moderate-user-drawer-recent-history-tooltip-submitted = Submitted

moderate-user-drawer-notes-field =
  .placeholder = Leave a note...
moderate-user-drawer-notes-button = Add note
moderatorNote-left-by = Left by
moderatorNote-delete = Delete

moderate-user-drawer-all-comments-archiveThreshold-allOfThisUsers =
  All of this user’s comments from the previous { $value } { $unit ->
    [second] { $value ->
      [1] second
      *[other] seconds
    }
    [minute] { $value ->
      [1] minute
      *[other] minutes
    }
    [hour] { $value ->
      [1] hour
      *[other] hours
    }
    [day] { $value ->
      [1] day
      *[other] days
    }
    [week] { $value ->
      [1] week
      *[other] weeks
    }
    [month] { $value ->
      [1] month
      *[other] months
    }
    [year] { $value ->
      [1] year
      *[other] years
    }
    *[other] unknown unit
  }.

# For Review Queue

moderate-forReview-reviewedButton =
  .aria-label = Reviewed
moderate-forReview-markAsReviewedButton =
  .aria-label = Mark as reviewed
moderate-forReview-time = Time
moderate-forReview-comment = Comment
moderate-forReview-reportedBy = Reported by
moderate-forReview-reason = Reason
moderate-forReview-description = Description
moderate-forReview-reviewed = Reviewed

moderate-forReview-detectedBannedWord = Banned word
moderate-forReview-detectedLinks = Links
moderate-forReview-detectedNewCommenter = New commenter
moderate-forReview-detectedPreModUser = Pre-moderated user
moderate-forReview-detectedRecentHistory = Recent history
moderate-forReview-detectedRepeatPost = Repeat post
moderate-forReview-detectedSpam = Spam
moderate-forReview-detectedSuspectWord = Suspect word
moderate-forReview-detectedToxic = Toxic language
moderate-forReview-reportedAbusive = Abusive
moderate-forReview-reportedBio = User bio
moderate-forReview-reportedOffensive = Offensive
moderate-forReview-reportedOther = Other
moderate-forReview-reportedSpam = Spam

# Archive

moderate-archived-queue-title = This story has been archived
moderate-archived-queue-noModerationActions =
  No moderation actions can be made on the comments when a story is archived.
moderate-archived-queue-toPerformTheseActions =
  To perform these actions, unarchive the story.

## Community
community-emptyMessage = We could not find anyone in your community matching your criteria.

community-filter-searchField =
  .placeholder = Search by username or email address...
  .aria-label = Search by username or email address
community-filter-searchButton =
  .aria-label = Search

community-filter-roleSelectField =
  .aria-label = Search by role

community-filter-statusSelectField =
  .aria-label = Search by user status

community-changeRoleButton =
  .aria-label = Change role

community-assignMySitesToModerator = Assign moderator to my sites
community-removeMySitesFromModerator = Remove moderator from my sites
community-assignMySitesToMember = Assign member to my sites
community-removeMySitesFromMember = Remove member from my sites
community-stillHaveSiteModeratorPrivileges = They will still have Site Moderator privileges for:
community-stillHaveMemberPrivileges = They will still have Member privileges for:
community-userNoLongerPermitted = User will no longer be permitted to make moderation decisions or assign suspensions on:
community-memberNoLongerPermitted = User will no longer receive Member privileges on:
community-assignThisUser = Assign this user to
community-assignYourSitesTo = Assign your sites to <strong>{ $username }</strong>
community-siteModeratorsArePermitted = Site moderators are permitted to make moderation decisions and issue suspensions on the sites they are assigned.
community-membersArePermitted = Members are permitted to receive a badge on the sites they are assigned.
community-removeSiteModeratorPermissions = Remove Site Moderator permissions
community-removeMemberPermissions = Remove Member permissions

community-filter-optGroupAudience =
  .label = Audience
community-filter-optGroupOrganization =
  .label = Organization
community-filter-search = Search
community-filter-showMe = Show Me
community-filter-allRoles = All Roles
community-filter-allStatuses = All Statuses

community-column-username = Username
community-column-username-not-available = Username not available
community-column-email-not-available = Email not available
community-column-username-deleted = Deleted
community-column-email = Email
community-column-memberSince = Member Since
community-column-role = Role
community-column-status = Status

community-role-popover =
  .description = A dropdown to change the user role

community-siteRoleActions-popover =
  .description = A dropdown to promote/demote a user to/from sites

community-userStatus-popover =
  .description = A dropdown to change the user status

community-userStatus-manageBan = Manage Ban
community-userStatus-suspendUser = Suspend User
community-userStatus-suspend = Suspend
community-userStatus-suspendEverywhere = Suspend everywhere
community-userStatus-removeSuspension = Remove Suspension
community-userStatus-removeUserSuspension = Remove suspension
community-userStatus-unknown = Unknown
community-userStatus-changeButton =
  .aria-label = Change user status
community-userStatus-premodUser = Always pre-moderate
community-userStatus-removePremod = Remove pre-moderate

community-banModal-allSites-title = Are you sure you want to ban <username></username>?
community-banModal-banEmailDomain-title = Email domain ban
community-banModal-banEmailDomain = Ban all commenter accounts from { $domain }
community-banModal-banEmailDomain-callOut = This will prevent any commenter from using this email domain
community-banModal-banEmailDomain-confirmationText = Type in "{ $text }" to confirm
community-banModal-specificSites-title = Are you sure you want to manage the ban status of <username></username>?
community-banModal-noSites-title = Are you sure you want to unban <username></username>?
community-banModal-allSites-consequence =
  Once banned, this user will no longer be able to comment, use
  reactions, or report comments.
community-banModal-noSites-consequence =
  Once unbanned, this user will be able to comment, use reactions, and report comments.
community-banModal-specificSites-consequence =
  This action will affect which sites on which the user is able to comment, use reactions, and report comments.
community-banModal-cancel = Cancel
community-banModal-updateBan = Save
community-banModal-ban = Ban
community-banModal-unban = Unban
community-banModal-customize = Customize ban email message
community-banModal-reject-existing = Reject all comments by this user
community-banModal-reject-existing-specificSites = Reject all comments on these sites
community-banModal-reject-existing-singleSite = Reject all comments on this site

community-banModal-noSites = No sites
community-banModal-banFrom = Ban from
community-banModal-allSites = All sites
community-banModal-specificSites = Specific sites

community-suspendModal-areYouSure = Suspend <strong>{ $username }</strong>?
community-suspendModal-consequence =
  Once suspended, this user will no longer be able to comment, use
  reactions, or report comments.
community-suspendModal-duration-3600 = 1 hour
community-suspendModal-duration-10800 = 3 hours
community-suspendModal-duration-86400 = 24 hours
community-suspendModal-duration-604800 = 7 days
community-suspendModal-cancel = Cancel
community-suspendModal-suspendUser = Suspend User
community-suspendModal-emailTemplate =
  Hello { $username },

  In accordance with { $organizationName }'s community guidelines, your account has been temporarily suspended. During the suspension, you will be unable to comment, flag or engage with fellow commenters. Please rejoin the conversation in { framework-timeago-time }.

community-suspendModal-customize = Customize suspension email message

community-suspendModal-success =
  <strong>{ $username }</strong> has been suspended for <strong>{ $duration }</strong>

community-suspendModal-success-close = Close
community-suspendModal-selectDuration = Select suspension length

community-premodModal-areYouSure =
  Are you sure you want to always pre-moderate <strong>{ $username }</strong>?
community-premodModal-consequence =
  All their comments will go to the Pending queue until you remove this status.
community-premodModal-cancel = Cancel
community-premodModal-premodUser = Yes, always pre-moderate

community-siteRoleModal-assignSites =
  Assign sites for <strong>{ $username }</strong>
community-siteRoleModal-assignSitesDescription-siteModerator =
  Site moderators are permitted to make moderation decisions and issue suspensions on the sites they are assigned.
community-siteRoleModal-cancel = Cancel
community-siteRoleModal-update = Update
community-siteRoleModal-selectSites-siteModerator = Select sites to moderate
community-siteRoleModal-selectSites-member = Select sites for this user to be a member of
community-siteRoleModal-noSites = No sites

community-invite-inviteMember = Invite members to your organization
community-invite-emailAddressLabel = Email address:
community-invite-inviteMore = Invite more
community-invite-inviteAsLabel = Invite as:
community-invite-sendInvitations = Send invitations
community-invite-role-staff =
  <strong>Staff role:</strong> Receives a “Staff” badge, and
  comments are automatically approved. Cannot moderate
  or change any { -product-name } configuration.
community-invite-role-moderator =
  <strong>Moderator role:</strong> Receives a
  “Staff” badge, and comments are automatically
  approved. Has full moderation privileges (approve,
  reject and feature comments). Can configure individual
  articles but no site-wide configuration privileges.
community-invite-role-admin =
  <strong>Admin role:</strong> Receives a “Staff” badge, and
  comments are automatically approved. Has full
  moderation privileges (approve, reject and feature
  comments). Can configure individual articles and has
  site-wide configuration privileges.
community-invite-invitationsSent = Your invitations have been sent!
community-invite-close = Close
community-invite-invite = Invite

community-warnModal-success =
  A warning has been sent to <strong>{ $username }</strong>.
community-warnModal-success-close = Ok
community-warnModal-areYouSure = Warn <strong>{ $username }</strong>?
community-warnModal-consequence = A warning can improve a commenter's conduct without a suspension or ban. The user must acknowledge the warning before they can continue commenting.
community-warnModal-message-label = Message
community-warnModal-message-required = Required
community-warnModal-message-description = Explain to this user how they should change their behavior on your site.
community-warnModal-cancel = Cancel
community-warnModal-warnUser = Warn user
community-userStatus-warn = Warn
community-userStatus-warnEverywhere = Warn everywhere
community-userStatus-message = Message

community-modMessageModal-success = A message has been sent to <strong>{ $username }</strong>.
community-modMessageModal-success-close = Ok
community-modMessageModal-areYouSure = Message <strong>{ $username }</strong>?
community-modMessageModal-consequence = Send a message to a commenter that is visible only to them.
community-modMessageModal-message-label = Message
community-modMessageModal-message-required = Required
community-modMessageModal-cancel = Cancel
community-modMessageModal-messageUser = Message user

## Stories
stories-emptyMessage = There are currently no published stories.
stories-noMatchMessage = We could not find any stories matching your criteria.

stories-filter-searchField =
  .placeholder = Search by story title or author...
  .aria-label = Search by story title or author
stories-filter-searchButton =
  .aria-label = Search

stories-filter-statusSelectField =
  .aria-label = Search by status

stories-changeStatusButton =
  .aria-label = Change status

stories-filter-search = Search
stories-filter-showMe = Show Me
stories-filter-allStories = All Stories
stories-filter-openStories = Open Stories
stories-filter-closedStories = Closed Stories

stories-column-title = Title
stories-column-author = Author
stories-column-publishDate = Publish Date
stories-column-status = Status
stories-column-clickToModerate = Click title to moderate story
stories-column-reportedCount = Reported
stories-column-pendingCount = Pending
stories-column-publishedCount = Published

stories-status-popover =
  .description = A dropdown to change the story status

storyInfoDrawer-rescrapeTriggered = Triggered
storyInfoDrawer-triggerRescrape = Rescrape Metadata
storyInfoDrawer-title = Story Details
storyInfoDrawer-titleNotAvailable = Story title not available
storyInfoDrawer-authorNotAvailable = Author not available
storyInfoDrawer-publishDateNotAvailable = Publish date not available
storyInfoDrawer-scrapedMetaData = Scraped metadata
storyInfoDrawer-configure = Configure
storyInfoDrawer-storyStatus-open = Open
storyInfoDrawer-storyStatus-closed = Closed
storyInfoDrawer-moderateStory = Moderate
storyInfoDrawerSettings-premodLinksEnable = Pre-moderate comments containing links
storyInfoDrawerSettings-premodCommentsEnable = Pre-moderate all comments
storyInfoDrawerSettings-moderation = Moderation
storyInfoDrawerSettings-moderationMode-pre = Pre
storyInfoDrawerSettings-moderationMode-post = Post
storyInfoDrawerSettings-update = Update
storyInfoDrawer-storyStatus-archiving = Archiving
storyInfoDrawer-storyStatus-archived = Archived
storyInfoDrawer-cacheStory-recache = Recache story
storyInfoDrawer-cacheStory-recaching = Recaching
storyInfoDrawer-cacheStory-cached = Cached
storyInfoDrawer-cacheStory-uncacheStory = Uncache story
storyInfoDrawer-cacheStory-uncaching = Uncaching

## Invite

invite-youHaveBeenInvited = You've been invited to join { $organizationName }
invite-finishSettingUpAccount = Finish setting up the account for:
invite-createAccount = Create Account
invite-passwordLabel = Password
invite-passwordDescription = Must be at least { $minLength } characters
invite-passwordTextField =
  .placeholder = Password
invite-usernameLabel = Username
invite-usernameDescription = You may use “_” and “.”
invite-usernameTextField =
  .placeholder = Username
invite-oopsSorry = Oops Sorry!
invite-successful = Your account has been created
invite-youMayNowSignIn = You may now sign-in to { -product-name } using:
invite-goToAdmin = Go to { -product-name } Admin
invite-goToOrganization = Go to { $organizationName }
invite-tokenNotFound =
  The specified link is invalid, check to see if it was copied correctly.

userDetails-banned-on = <strong>Banned on</strong> { $timestamp }
userDetails-banned-by = <strong>by</strong> { $username }
userDetails-suspended-by = <strong>Suspended by</strong> { $username }
userDetails-suspension-start = <strong>Start:</strong> { $timestamp }
userDetails-suspension-end = <strong>End:</strong> { $timestamp }

userDetails-warned-on = <strong>Warned on</strong> { $timestamp }
userDetails-warned-by = <strong>by</strong> { $username }
userDetails-warned-explanation = User has not acknowledged the warning.

configure-general-reactions-title = Reactions
configure-general-reactions-explanation =
  Allow your community to engage with one another and express themselves
  with one-click reactions. By default, Coral allows commenters to "Respect"
  each other's comments.
configure-general-reactions-label = Reaction label
configure-general-reactions-input =
  .placeholder = E.g. Respect
configure-general-reactions-active-label = Active reaction label
configure-general-reactions-active-input =
  .placeholder = E.g. Respected
configure-general-reactions-sort-label = Sort label
configure-general-reactions-sort-input =
  .placeholder = E.g. Most Respected
configure-general-reactions-preview = Preview
configure-general-reaction-sortMenu-sortBy = Sort by

configure-general-newCommenter-title = New commenter badge
configure-general-newCommenter-explanation = Add <icon></icon> badge to commenters who created their accounts in the past seven days.
configure-general-newCommenter-enabled = Enable new commenter badges

configure-general-badges-title = Member badges
configure-general-badges-explanation =
  Show a custom badge for users with specified roles. This badge appears
  on the comment stream and in the admin interface.
configure-general-badges-label = Badge text
configure-general-badges-staff-member-input =
  .placeholder = E.g. Staff
configure-general-badges-moderator-input =
  .placeholder = E.g. Moderator
configure-general-badges-admin-input =
  .placeholder = E.g. Admin
configure-general-badges-member-input =
  .placeholder = E.g. Member
configure-general-badges-preview = Preview
configure-general-badges-staff-member-label = Staff member badge text
configure-general-badges-admin-label = Admin badge text
configure-general-badges-moderator-label = Moderator badge text
configure-general-badges-member-label = Member badge text

configure-general-rte-title = Rich-text comments
configure-general-rte-express = Give your community more ways to express themselves beyond plain text with rich-text formatting.
configure-general-rte-richTextComments = Rich-text comments
configure-general-rte-onBasicFeatures = On - bold, italics, block quotes, and bulleted lists
configure-general-rte-additional = Additional rich-text options
configure-general-rte-strikethrough = Strikethrough
configure-general-rte-spoiler = Spoiler
configure-general-rte-spoilerDesc =
  Words and phrases formatted as Spoiler are hidden behind a
  dark background until the reader chooses to reveal the text.

configure-general-dsaConfig-title = Digital Services Act feature set
configure-general-dsaConfig-description =
  The EU Digital Services Act (DSA) requires that publishers based in the EU or targeting EU citizens provide certain features to their commenters and moderators.
  <br/>
  <br/>
  Coral's DSA toolset includes:
  <br/>
  <ul style="padding-inline-start: var(--spacing-5);">
    <li>A dedicated flow for comments reported as illegal</li>
    <li>Compulsory moderation reasons for every rejected comment</li>
    <li>Commenter notifications for illegal comment reporting and rejected comments</li>
    <li>Compulsory text explaining methods of redress/appeal, if any</li>
  </ul>
configure-general-dsaConfig-reportingAndModerationExperience =
  DSA reporting and moderation experience
configure-general-dsaConfig-methodOfRedress =
  Select your method of redress
configure-general-dsaConfig-methodOfRedress-explanation =
  Let users know if and how they can appeal a moderation decision
configure-general-dsaConfig-methodOfRedress-none = None
configure-general-dsaConfig-methodOfRedress-email = Email
configure-general-dsaConfig-methodOfRedress-email-placeholder = moderation@example.com
configure-general-dsaConfig-methodOfRedress-url = URL
configure-general-dsaConfig-methodOfRedress-url-placeholder = https://moderation.example.com

configure-account-features-title = Commenter account management features
configure-account-features-explanation =
  You can enable and disable certain features for your commenters to use
  within their Profile. These features also assist towards GDPR
  compliance.
configure-account-features-allow = Allow users to:
configure-account-features-change-usernames = Change their usernames
configure-account-features-change-usernames-details = Usernames can be changed once every 14 days.
configure-account-features-yes = Yes
configure-account-features-no = No
configure-account-features-download-comments = Download their comments
configure-account-features-download-comments-details = Commenters can download a csv of their comment history.
configure-account-features-delete-account = Delete their account
configure-account-features-delete-account-details =
  Removes all of their comment data, username, and email address from the site and the database.

configure-account-features-delete-account-fieldDescriptions =
  Removes all of their comment data, username, and email
  address from the site and the database.

configure-advanced-stories = Story creation
configure-advanced-stories-explanation = Advanced settings for how stories are created within Coral.
configure-advanced-stories-lazy = Lazy story creation
configure-advanced-stories-lazy-detail = Enable stories to be automatically created when they are published from your CMS.
configure-advanced-stories-scraping = Story scraping
configure-advanced-stories-scraping-detail = Enable story metadata to be automatically scraped when they are published from your CMS.
configure-advanced-stories-proxy = Scraper proxy url
configure-advanced-stories-proxy-detail =
  When specified, allows scraping requests to use the provided
  proxy. All requests will then be passed through the appropriote
  proxy as parsed by the <externalLink>npm proxy-agent</externalLink> package.
configure-advanced-stories-custom-user-agent = Custom Scraper User Agent Header
configure-advanced-stories-custom-user-agent-detail =
  When specified, overrides the <code>User-Agent</code> header sent with each
  scrape request.

configure-advanced-stories-authentication = Authentication
configure-advanced-stories-scrapingCredentialsHeader = Scraping credentials
configure-advanced-stories-scraping-usernameLabel = Username
configure-advanced-stories-scraping-passwordLabel = Password

commentAuthor-status-banned = Banned
commentAuthor-status-premod = Pre-mod
commentAuthor-status-suspended = Suspended

hotkeysModal-title = Keyboard shortcuts
hotkeysModal-navigation-shortcuts = Navigation shortcuts
hotkeysModal-shortcuts-next = Next comment
hotkeysModal-shortcuts-prev = Previous comment
hotkeysModal-shortcuts-search = Open search
hotkeysModal-shortcuts-jump = Jump to specific queue
hotkeysModal-shortcuts-switch = Switch queues
hotkeysModal-shortcuts-toggle = Toggle shortcuts help
hotkeysModal-shortcuts-single-view = Single comment view
hotkeysModal-moderation-decisions = Moderation decisions
hotkeysModal-shortcuts-approve = Approve
hotkeysModal-shortcuts-reject = Reject
hotkeysModal-shortcuts-ban = Ban comment author
hotkeysModal-shortcuts-zen = Toggle single-comment view

authcheck-network-error = A network error occurred. Please refresh the page.

dashboard-heading-last-updated = Last updated:

dashboard-today-heading = Today's activity
dashboard-today-new-comments = New comments
dashboard-alltime-new-comments = All time total
dashboard-alltime-new-comments-archiveEnabled = { $value } { $unit ->
    [second] { $value ->
      [1] second
      *[other] seconds
    }
    [minute] { $value ->
      [1] minute
      *[other] minutes
    }
    [hour] { $value ->
      [1] hour
      *[other] hours
    }
    [day] { $value ->
      [1] day
      *[other] days
    }
    [week] { $value ->
      [1] week
      *[other] weeks
    }
    [month] { $value ->
      [1] month
      *[other] months
    }
    [year] { $value ->
      [1] year
      *[other] years
    }
    *[other] unknown unit
  } total
dashboard-today-rejections = Rejection rate
dashboard-alltime-rejections = All time average
dashboard-alltime-rejections-archiveEnabled = { $value } { $unit ->
    [second] { $value ->
      [1] second
      *[other] seconds
    }
    [minute] { $value ->
      [1] minute
      *[other] minutes
    }
    [hour] { $value ->
      [1] hour
      *[other] hours
    }
    [day] { $value ->
      [1] day
      *[other] days
    }
    [week] { $value ->
      [1] week
      *[other] weeks
    }
    [month] { $value ->
      [1] month
      *[other] months
    }
    [year] { $value ->
      [1] year
      *[other] years
    }
    *[other] unknown unit
  } average
dashboard-today-staffPlus-comments = Staff+ comments
dashboard-alltime-staff-comments = All time total
dashboard-alltime-staff-comments-archiveEnabled = { $value } { $unit ->
    [second] { $value ->
      [1] second
      *[other] seconds
    }
    [minute] { $value ->
      [1] minute
      *[other] minutes
    }
    [hour] { $value ->
      [1] hour
      *[other] hours
    }
    [day] { $value ->
      [1] day
      *[other] days
    }
    [week] { $value ->
      [1] week
      *[other] weeks
    }
    [month] { $value ->
      [1] month
      *[other] months
    }
    [year] { $value ->
      [1] year
      *[other] years
    }
    *[other] unknown unit
  } total
dashboard-today-signups = New community members
dashboard-alltime-signups = Total members
dashboard-today-bans = Banned members
dashboard-alltime-bans = Total banned members

dashboard-top-stories-today-heading = Today's most commented stories
dashboard-top-stories-table-header-story = Story
dashboard-top-stories-table-header-comments = Comments
dashboard-top-stories-no-comments = No comments today

dashboard-commenters-activity-heading = New community members this week

dashboard-comment-activity-heading = Hourly comment activity
dashboard-comment-activity-tooltip-comments = Comments
dashboard-comment-activity-legend = Average last 3 days

conversation-modal-conversationOn = Conversation on:
conversation-modal-moderateStory = Moderate story
conversation-modal-showMoreParents = Show more of this conversation
conversation-modal-showReplies = Show replies
conversation-modal-commentNotFound = Comment not found.
conversation-modal-showMoreReplies = Show more replies
conversation-modal-header-title = Conversation on:
conversation-modal-header-moderate-link = Moderate story
conversation-modal-rejectButton = <icon></icon>Reject
  .aria-label = Reject
conversation-modal-rejectButton-rejected = <icon></icon>Rejected
  .aria-label = Rejected

# DSA Reports tab
reportsTable-column-created = Created
reportsTable-column-lastUpdated = Last updated
reportsTable-column-reportedBy = Reported by
reportsTable-column-reference = Reference
reportsTable-column-lawBroken = Law broken
reportsTable-column-commentAuthor = Comment author
reportsTable-column-status = Status
reportsTable-emptyReports = There are no DSA reports to display.

reports-sortMenu-newest = Newest
reports-sortMenu-oldest = Oldest
reports-sortMenu-sortBy = Sort by

reports-table-showClosedReports = Show closed reports
reports-table-showOpenReports = Show open reports

reports-singleReport-reportsLinkButton = <icon></icon> All DSA Reports
reports-singleReport-reportID = Report ID
reports-singleReport-shareButton = <icon></icon> CSV
reports-singleReport-reporter = Reporter
reports-singleReport-reporterNameNotAvailable = Reporter name not available
reports-singleReport-reportDate = Report date
reports-singleReport-lawBroken = What law was broken?
reports-singleReport-explanation = Explanation
reports-singleReport-comment = Comment
reports-singleReport-comment-notAvailable = This comment is not available.
reports-singleReport-comment-deleted = This comment is no longer available. The commenter has deleted their account.
reports-singleReport-comment-edited = (edited)
reports-singleReport-comment-viewCommentStream = View comment in stream
reports-singleReport-comment-viewCommentModeration = View comment in moderation
reports-singleReport-comment-rejected = Rejected
reports-singleReport-comment-unavailableInStream = Unavailable in stream
reports-singleReport-commentOn = Comment on
reports-singleReport-history = History
reports-singleReport-history-reportSubmitted = Illegal content report submitted
reports-singleReport-history-addedNote = { $username } added a note
reports-singleReport-history-deleteNoteButton = <icon></icon> Delete
reports-singleReport-history-madeDecision-illegal = { $username } made a decision that this report contains potentially illegal content
reports-singleReport-history-madeDecision-legal = { $username } made a decision that this report does not contain potentially illegal content
reports-singleReport-history-legalGrounds = Legal grounds: { $legalGrounds }
reports-singleReport-history-explanation = Explanation: { $explanation }
reports-singleReport-history-changedStatus = { $username } changed status to { $status }
reports-singleReport-reportVoid = User deleted their account. Report is void.
reports-singleReport-history-sharedReport = { $username } downloaded this report
reports-singleReport-note-field =
  .placeholder = Add your note...
reports-singleReport-addUpdateButton = <icon></icon> Add update
reports-singleReport-decisionLabel = Decision
reports-singleReport-decision-legalGrounds = Legal grounds
reports-singleReport-decision-explanation = Detailed explanation
reports-singleReport-makeDecisionButton = <icon></icon> Decision
reports-singleReport-decision-doesItContain = Does this comment contain potentially illegal content?
reports-singleReport-decision-doesItContain-yes = Yes
reports-singleReport-decision-doesItContain-no = No

reports-status-awaitingReview = Awaiting review
reports-status-inReview = In review
reports-status-completed = Completed
reports-status-void = Void
reports-status-unknown = Unknown status

reports-changeStatusModal-prompt-addNote = You have added a note. Would you like to update your status to In review.
reports-changeStatusModal-prompt-downloadReport = You have downloaded the report. Would you like to update your status to In review.
reports-changeStatusModal-prompt-madeDecision = You have made a decision. Would you like to update your status to Completed.
reports-changeStatusModal-updateButton = Yes, update
reports-changeStatusModal-dontUpdateButton = No
reports-changeStatusModal-header = Update status?

reports-decisionModal-header = Report decision
reports-decisionModal-prompt = Does this comment appear to contain potentially illegal content?
reports-decisionModal-yes = Yes
reports-decisionModal-no = No
reports-decisionModal-submit = Submit
reports-decisionModal-lawBrokenLabel = Law broken
reports-decisionModal-lawBrokenTextfield =
  .placeholder = Add law...
reports-decisionModal-detailedExplanationLabel = Detailed explanation
reports-decisionModal-detailedExplanationTextarea =
  .placeholder = Add explanation...

reports-relatedReports-label = Related reports
reports-relatedReports-reportIDLabel = Report ID

reports-anonymousUser = Anonymous user
reports-username-not-available = Username not available

# Control panel

controlPanel-redis-redis = Redis
controlPanel-redis-flushRedis = Flush Redis
controlPanel-redis-flush = Flush
