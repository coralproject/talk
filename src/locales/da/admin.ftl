### Localization for Admin

## General
general-notAvailable = Ikke tilgængelig

## Story Status
storyStatus-open = Åbne
storyStatus-closed = Lukkede

## Roles
role-admin = Administrator
role-moderator = Moderator
role-staff = Personale
role-commenter = Kommentator

role-plural-admin = Administratorer
role-plural-moderator = Moderatorer
role-plural-staff = Personale
role-plural-commenter = Kommentarer

## User Statuses
userStatus-active = Aktiv
userStatus-banned = Forbudt
userStatus-suspended = Suspenderet

## Navigation
navigation-moderate = Moderer
navigation-community = Samfund
navigation-stories = Historier
navigation-configure = Konfigurer

## User Menu
userMenu-signOut = Log ud
userMenu-viewLatestRelease = Se seneste udgivelse
userMenu-reportBug = Rapporter en fejl, eller giv feedback
userMenu-popover =
  .description = En dialogboks i brugermenuen med relaterede links og handlinger

## Restricted
restricted-currentlySignedInTo = Aktuelt logget ind på
restricted-noPermissionInfo = Du har ikke tilladelse til at få adgang til denne side.
restricted-signedInAs = Du er logget ind som:<Username></Username>
restricted-signInWithADifferentAccount = Log ind med en anden konto
restricted-contactAdmin = Hvis du mener, at dette er en fejl, skal du kontakte din administrator for at få hjælp.

## Login

# Sign In
login-signInTo = Log ind på
login-signIn-enterAccountDetailsBelow = Indtast dine kontooplysninger nedenfor

login-emailAddressLabel = Email adresse
login-emailAddressTextField =
  .placeholder = Email adresse

login-signIn-passwordLabel = Adgangskode
login-signIn-passwordTextField =
  .placeholder = Adgangskode

login-signIn-signInWithEmail = Log ind med e-mail
login-signIn-orSeparator = Eller

login-signInWithFacebook = Log ind med Facebook
login-signInWithGoogle = Log ind med Google
login-signInWithOIDC = Log ind med { $name }

## Configure

configure-unsavedInputWarning =
  Du har ikke gemt input. Er du sikker på, at du vil forlade denne side?

configure-sideBarNavigation-general = Generelle
configure-sideBarNavigation-authentication = Godkendelse
configure-sideBarNavigation-moderation = Moderation
configure-sideBarNavigation-organization = Organisation
configure-sideBarNavigation-advanced = Avancerede
configure-sideBarNavigation-email = Email
configure-sideBarNavigation-bannedAndSuspectWords = Forbudte og mistænkelige ord

configure-sideBar-saveChanges = Gem ændringer
configure-configurationSubHeader = Konfiguration
configure-onOffField-on = Tændt
configure-onOffField-off = Slukket
configure-permissionField-allow = Tilladt
configure-permissionField-dontAllow = Ikke tilladt

### General
configure-general-guidelines-title = Oversigt over fællesskabsretningslinjer
configure-general-guidelines-explanation =
  Skriv en oversigt over dine fællesskabsretningslinjer, 
  der vises øverst i hver side af kommentarstrømmen. 
  Dit resume kan formateres ved hjælp af Markdown Syntax. 
  Mere information om hvordan du bruger Markdown kan findes
  <externalLink>her</externalLink>.
configure-general-guidelines-showCommunityGuidelines = Vis oversigt over fællesskabsretningslinjer

### Sitewide Commenting
configure-general-sitewideCommenting-title = Kommentar på webstedet
configure-general-sitewideCommenting-explanation =
  Åbn eller luk kommentarstrømme for nye kommentarer overalt. 
  Når nye kommentarer deaktiveres overalt, kan nye kommentarer 
  ikke indsendes, men eksisterende kommentarer kan fortsætte 
  med at modtage reaktioner, rapporteres og deles.
configure-general-sitewideCommenting-enableNewCommentsSitewide =
  Aktivér nye kommentarer overalt
configure-general-sitewideCommenting-onCommentStreamsOpened =
  Tændt - Kommentarer åbnes for nye kommentarer
configure-general-sitewideCommenting-offCommentStreamsClosed =
  Slukket - Kommentarer lukket for nye kommentarer
configure-general-sitewideCommenting-message = Meddelelse om lukkede kommentarer på webstedet
configure-general-sitewideCommenting-messageExplanation =
  Skriv en meddelelse, der vises, når kommentarstrømme lukkes i hele webstedet

### Closing Comment Streams
configure-general-closingCommentStreams-title = Lukker kommentarer
configure-general-closingCommentStreams-explanation = Indstil kommentarer til at lukke efter et defineret tidsrum efter en historiens publikation
configure-general-closingCommentStreams-closeCommentsAutomatically = Luk kommentarer automatisk
configure-general-closingCommentStreams-closeCommentsAfter = Luk kommentarer efter

#### Comment Length
configure-general-commentLength-title = Kommentarlængde
configure-general-commentLength-maxCommentLength = Maksimal kommentarlængde
configure-general-commentLength-setLimit = Sæt en grænse for længden af kommentarer på hele siden
configure-general-commentLength-limitCommentLength = Begræns kommentarlængden
configure-general-commentLength-minCommentLength = Minimum kommentarlængde
configure-general-commentLength-characters = Tegn
configure-general-commentLength-textField =
  .placeholder = Ingen grænse
configure-general-commentLength-validateLongerThanMin =
  Indtast et tal længere end minimumslængden

#### Comment Editing
configure-general-commentEditing-title = Kommentarredigering
configure-general-commentEditing-explanation =
  Sæt en grænse for, hvor længe kommentatorer skal redigere deres 
  kommentarer på siden. Redigerede kommentarer markeres som (Redigeret) 
  i kommentarstrømmen og moderationspanelet.
configure-general-commentEditing-commentEditTimeFrame = Kommentar Rediger tidsramme
configure-general-commentEditing-seconds = Sekunder

#### Closed Stream Message
configure-general-closedStreamMessage-title = Besked til lukkede kommentarer
configure-general-closedStreamMessage-explanation = Skriv en meddelelse, der vises, når en historie er lukket for kommentarer.

### Organization
configure-organization-name = Organisationens navn
configure-organization-nameExplanation =
  Dit organisationsnavn vises på e-mails sendt af { -product-name } til dit community og organisationsmedlemmer.
configure-organization-email = Organisations-e-mail
configure-organization-emailExplanation =
  Denne e-mail-adresse bruges som i e-mails og på tværs af platformen, 
  hvor medlemmer af samfundet kan komme i kontakt med organisationen, 
  hvis de har spørgsmål om status for deres konti eller moderationsspørgsmål.

### Email

configure-email = E-mail-indstillinger
configure-email-configBoxEnabled = Aktiveret
configure-email-fromNameLabel = Fra navn
configure-email-fromNameDescription =
  Navngiv, som det vises på alle udgående e-mails
configure-email-fromEmailLabel = Fra e-mail-adresse
configure-email-fromEmailDescription =
  E-mail-adresse, der bruges til at sende meddelelser
configure-email-smtpHostLabel = SMTP vært
configure-email-smtpHostDescription = (eksempel smtp.sendgrid.com)
configure-email-smtpPortLabel = SMTP-port
configure-email-smtpPortDescription = (eksempel 25)
configure-email-smtpTLSLabel = TLS
configure-email-smtpAuthenticationLabel = SMTP-godkendelse
configure-email-smtpCredentialsHeader = E-mail-legitimationsoplysninger
configure-email-smtpUsernameLabel = Brugernavn
configure-email-smtpPasswordLabel = Adgangskode

### Authentication

configure-auth-authIntegrations = Autentificeringsintegrationer
configure-auth-clientID = Klient-id
configure-auth-clientSecret = Klienthemmelighed
configure-auth-configBoxEnabled = Aktiveret
configure-auth-targetFilterCoralAdmin = { -product-name } Administration
configure-auth-targetFilterCommentStream = Kommentarer
configure-auth-redirectURI = Redirect URI
configure-auth-registration = Registrering
configure-auth-registrationDescription =
  Lad brugere, der ikke har tilmeldt sig tidligere med denne 
  godkendelsesintegration, registrere sig for en ny konto.
configure-auth-registrationCheckBox = Tillad registrering
configure-auth-pleaseEnableAuthForAdmin =
  Aktivér mindst én godkendelsesintegration til Administration af { -product-name }
configure-auth-confirmNoAuthForCommentStream =
  Der er ikke aktiveret nogen godkendelsesintegration for kommentarstrømmen. 
  Vil du virkelig fortsætte?

configure-auth-facebook-loginWith = Login with Facebook
configure-auth-facebook-toEnableIntegration =
  For at aktivere integrationen med Facebook-godkendelse skal 
  du oprette og konfigurere en webapplikation. 
  For mere information besøg: <Link></Link>.
configure-auth-facebook-useLoginOn = Brug Facebook-login på

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
configure-auth-sso-regenerateWarning =
  Regenerating a key will invalidate any existing user sessions,
  and all signed-in users will be signed out.

configure-auth-local-loginWith = Login with Email Authentication
configure-auth-local-useLoginOn = Use Email Authentication login on

configure-auth-oidc-loginWith = Login with OpenID Connect
configure-auth-oidc-toLearnMore = To learn more: <Link></Link>
configure-auth-oidc-providerName = Provider Name
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

### Moderation
#### Pre-Moderation
configure-moderation-preModeration-title = Pre-moderation
configure-moderation-preModeration-explanation =
  When pre-moderation is turned on, comments will not be published unless
  approved by a moderator.
configure-moderation-preModeration-moderation =
  Pre-moderate all comments sitewide
configure-moderation-preModeration-premodLinksEnable =
  Pre-moderate comments containing links sitewide

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
  comment is toxic, according to Perspective API. By default the threshold is set to { $default }.
configure-moderation-perspective-toxicityModel = Toxicity Model
configure-moderation-perspective-toxicityModelDescription =
  Choose your Perspective Model. The default is { $default }. You can find out more about model choices <externalLink>here</externalLink>.
configure-moderation-perspective-allowStoreCommentData = Allow Google to Store Comment Data
configure-moderation-perspective-allowStoreCommentDataDescription =
  Stored comments will be used for future research and community model building purposes to
  improve the API over time.
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
  Domains where your { -product-name } instance is allowed to be embedded.
  Typical use is localhost, staging.yourdomain.com,
  yourdomain.com, etc.

configure-advanced-liveUpdates = Comment Stream Live Updates
configure-advanced-liveUpdates-explanation =
  When enabled, there will be real-time loading and updating of comments as new comments and replies are published

configure-advanced-embedCode-title = Embed Code
configure-advanced-embedCode-explanation =
  Copy and paste the code below into your CMS to embed Coral comment streams in
  each of your site’s stories.

configure-advanced-embedCode-comment =
  Uncomment these lines and replace with the ID of the
  story's ID and URL from your CMS to provide the
  tightest integration. Refer to our documentation at
  https://docs.coralproject.net for all the configuration
  options.

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

moderate-markers-details = Details
moderate-flagDetails-offensive = Offensive
moderate-flagDetails-spam = Spam

moderate-flagDetails-toxicityScore = Toxicity Score
moderate-toxicityLabel-likely = Likely <score></score>
moderate-toxicityLabel-unlikely = Unlikely <score></score>
moderate-toxicityLabel-maybe = Maybe <score></score>

moderate-emptyQueue-pending = Nicely done! There are no more pending comments to moderate.
moderate-emptyQueue-reported = Nicely done! There are no more reported comments to moderate.
moderate-emptyQueue-unmoderated = Nicely done! All comments have been moderated.
moderate-emptyQueue-rejected = There are no rejected comments.

moderate-comment-inReplyTo = Reply to <Username></Username>
moderate-comment-viewContext = View Context
moderate-comment-rejectButton =
  .aria-label = Reject
moderate-comment-approveButton =
  .aria-label = Approve
moderate-comment-decision = Decision
moderate-comment-story = Story
moderate-comment-moderateStory = Moderate Story
moderate-comment-featureText = Feature
moderate-comment-featuredText = Featured
moderate-comment-moderatedBy = Moderated By
moderate-comment-moderatedBySystem = System

moderate-single-goToModerationQueues = Go to moderation queues
moderate-single-singleCommentView = Single Comment View

moderate-queue-viewNew =
  { $count ->
    [1] View {$count} new comment
    *[other] View {$count} new comments
  }

### Moderate Search Bar
moderate-searchBar-allStories = All stories
  .title = All stories
moderate-searchBar-noResults = No results
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
moderate-searchBar-searchResultsMostRecentFirst = Search results (Most recent first)
moderate-searchBar-moderateAllStories = Moderate all stories
moderate-searchBar-comboBoxTextField =
  .aria-label = Search or jump to story...
  .placeholder = Use quotation marks around each search term (e.g. “team”, “St. Louis”)
moderate-searchBar-goTo = Go to
moderate-searchBar-seeAllResults = See all results

### Moderate User History Drawer

moderate-user-drawer-email =
  .title = Email address
moderate-user-drawer-created-at =
  .title = Account creation date
moderate-user-drawer-member-id =
  .title = Member ID
moderate-user-drawer-tab-all-comments = All Comments
moderate-user-drawer-tab-rejected-comments = Rejected
moderate-user-drawer-tab-account-history = Account History
moderate-user-drawer-load-more = Load More
moderate-user-drawer-all-no-comments = {$username} has not submitted any comments.
moderate-user-drawer-rejected-no-comments = {$username} does not have any rejected comments.
moderate-user-drawer-user-not-found = User not found.
moderate-user-drawer-status-label = Status:

moderate-user-drawer-account-history-system = <icon>computer</icon> System
moderate-user-drawer-account-history-suspension-ended = Suspension ended
moderate-user-drawer-account-history-suspension-removed = Suspension removed
moderate-user-drawer-account-history-banned = Banned
moderate-user-drawer-account-history-ban-removed = Ban removed
moderate-user-drawer-account-history-no-history = No actions have been taken on this account

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

## Create Username

createUsername-createUsernameHeader = Create Username
createUsername-whatItIs =
  Your username is an identifier that will appear on all of your comments.
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

community-filter-optGroupAudience =
  .label = Audience
community-filter-optGroupOrganization =
  .label = Organization
community-filter-search = Search
community-filter-showMe = Show Me
community-filter-allRoles = All Roles
community-filter-allStatuses = All Statuses

community-column-username = Username
community-column-email = Email
community-column-memberSince = Member Since
community-column-role = Role
community-column-status = Status

community-role-popover =
  .description = A dropdown to change the user role

community-userStatus-popover =
  .description = A dropdown to change the user status

community-userStatus-banUser = Ban User
community-userStatus-removeBan = Remove Ban
community-userStatus-suspendUser = Suspend User
community-userStatus-removeSuspension = Remove Suspension
community-userStatus-unknown = Unknown
community-userStatus-changeButton =
  .aria-label = Change user status

community-banModal-areYouSure = Are you sure you want to ban <strong>{ $username }</strong>?
community-banModal-consequence =
  Once banned, this user will no longer be able to comment, use
  reactions, or report comments.
community-banModal-cancel = Cancel
community-banModal-banUser = Ban User
community-banModal-customize = Customize ban email message
community-banModal-emailTemplate =
  Hello { $username },

  Someone with access to your account has violated our community guidelines. As a result, your account has been banned. You will no longer be able to comment, react or report comments

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
  <strong>Moderator role:</strong> Moderator role: Receives a
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

stories-status-popover =
  .description = A dropdown to change the story status

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
