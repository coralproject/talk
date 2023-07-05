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
restricted-signedInAs = Du er logget ind som: <strong>{ $username }</strong>
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
login-orSeparator = Eller

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
configure-radioButton-allow = Tilladt
configure-radioButton-dontAllow = Ikke tilladt

### General
configure-general-guidelines-title = Oversigt over fællesskabsretningslinjer
configure-general-guidelines-explanation =
  Skriv en oversigt over dine fællesskabsretningslinjer,
  der vises øverst i hver side af kommentarstrømmen.
  Dit resume kan formateres ved hjælp af Markdown Syntax.
  Mere information om hvordan du bruger Markdown kan findes
  her: <externalLink>https://www.markdownguide.org/cheat-sheet/</externalLink>
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
configure-email-smtpHostDescription = (eksempel smtp.sendgrid.net)
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
configure-auth-redirectURI = Omdiriger URI
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

configure-auth-facebook-loginWith = Log ind med Facebook
configure-auth-facebook-toEnableIntegration =
  For at aktivere integrationen med Facebook-godkendelse skal
  du oprette og konfigurere en webapplikation.
  For mere information besøg: <Link></Link>.
configure-auth-facebook-useLoginOn = Brug Facebook til at logge på

configure-auth-google-loginWith = Log ind med Google
configure-auth-google-toEnableIntegration =
  For at aktivere integrationen med Google-godkendelse skal
  du oprette og konfigurere en webapplikation.
  For mere information besøg: <Link></Link>.
configure-auth-google-useLoginOn = Brug Google til at logge på

configure-auth-sso-loginWith = Log ind med Single Sign On
configure-auth-sso-useLoginOn = Brug Single Sign On til at logge på
configure-auth-sso-key = Nøgle
configure-auth-sso-regenerate = Regenerer
configure-auth-sso-regenerateAt = Nøgle genereret på:
  { DATETIME($date, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric") }

configure-auth-local-loginWith = Log ind med e-mail-godkendelse
configure-auth-local-useLoginOn = Brug e-mail-godkendelse til at logge på

configure-auth-oidc-loginWith = Log ind med OpenID Connect
configure-auth-oidc-toLearnMore = For at lære mere: <Link></Link>
configure-auth-oidc-providerName = Udbyderens navn
configure-auth-oidc-providerNameDescription =
  Udbyderen af OpenID Connect-integrationen. Dette bruges, når udbyderens navn skal vises, f.eks. “Log ind med  &lt;Facebook&gt;”.
configure-auth-oidc-issuer = Udsteder
configure-auth-oidc-issuerDescription =
  Når du har indtastet dine udstederoplysninger,
  skal du klikke på knappen Opdag for at få { -product-name }
  til at udfylde de resterende felter. Du kan også
  indtaste oplysningerne manuelt.
configure-auth-oidc-authorizationURL = Autoriserings-URL
configure-auth-oidc-tokenURL = Token URL
configure-auth-oidc-jwksURI = JWKS URI
configure-auth-oidc-useLoginOn = Brug Open ID Connect til at logge på

### Moderation
#### Pre-Moderation
configure-moderation-preModeration-title = Pre-moderation
configure-moderation-preModeration-explanation =
  Når pre-moderation er aktiveret, offentliggøres kommentarer ikke,
  medmindre de er godkendt af en moderator.
configure-moderation-preModeration-moderation =
  Formoderer alle kommentarer overalt
configure-moderation-preModeration-premodLinksEnable =
  Formodererede kommentarer, der indeholder links overalt

configure-moderation-apiKey = API-nøgle

configure-moderation-akismet-title = Akismet-spamdetekteringsfilter
configure-moderation-akismet-explanation =
  Indsendte kommentarer videresendes til Akismet API til spamdetektion.
  Hvis en kommentar er bestemt til at være spam, vil den bede brugeren
  og indikere, at kommentaren kan betragtes som spam. Hvis brugeren
  fortsætter efter dette punkt med den stadig spam-lignende kommentar,
  markeres kommentaren som indeholdende spam, offentliggøres ikke og
  placeres i den ventende kø til gennemgang af en moderator.
  Hvis godkendt af en moderator, vil kommentaren blive offentliggjort.

#### Akismet
configure-moderation-akismet-filter = Spamdetekteringsfilter
configure-moderation-akismet-accountNote =
  Bemærk: Du skal tilføje dit / de aktive domæner
  på din Akismet-konto: <externalLink>https://akismet.com/account/</externalLink>
configure-moderation-akismet-siteURL = Hjemmeside URL

configure-moderation-perspective-title = Perspektivtoksisk kommentarfilter
configure-moderation-perspective-explanation =
  Ved hjælp af Perspective API advarer filteret om toksisk
  kommentar brugerne, når kommentarer overskrider den
  foruddefinerede toksicitetsgrænse. Kommentarer med en
  toksicitetsscore over tærsklen offentliggøres ikke og
  placeres i den ventende kø til gennemgang af en moderator.
  Hvis godkendt af en moderator, vil kommentaren blive offentliggjort.

#### Perspective
configure-moderation-perspective-filter = Giftig kommentarfilter
configure-moderation-perspective-toxicityThreshold = Toksicitetsgrænse
configure-moderation-perspective-toxicityThresholdDescription =
  Denne værdi kan indstilles til en procentdel mellem 0 og 100.
  Dette tal repræsenterer sandsynligheden for, at en kommentar er giftig,
  ifølge Perspective API. Som standard er tærsklen indstillet til { $default }.
configure-moderation-perspective-toxicityModel = Toksicitetsmodel
cofigure-moderation-perspective-toxicityModelDescription =
  Vælg din perspektivmodel. Standard er { $default }.
  Du kan finde ud af mere om modelvalg <externalLink>her</externalLink>.
configure-moderation-perspective-allowStoreCommentData = Tillad Google at gemme kommissionsdata
configure-moderation-perspective-allowStoreCommentDataDescription =
  Gemte kommentarer vil blive brugt til fremtidig forskning og opbygning af samfundsmodeller til forbedring af API over tid.
configure-moderation-perspective-customEndpoint = Brugerdefineret slutpunkt
configure-moderation-perspective-defaultEndpoint =
  Som standard er slutpunktet indstillet til { $default }. Du kan tilsidesætte dette her.
configure-moderation-perspective-accountNote =
  For yderligere information om, hvordan man konfigurerer filteret for perspektivtoksisk kommentar, kan du besøge: <externalLink>https://github.com/conversationai/perspectiveapi#readme</externalLink>

#### Banned Words Configuration
configure-wordList-banned-bannedWordsAndPhrases = Forbudte ord og sætninger
configure-wordList-banned-explanation =
  Kommentarer, der indeholder et ord eller en sætning i listen over forbudte ord, afvises automatisk og offentliggøres ikke.
configure-wordList-banned-wordList = Liste over forbudte ord
#### Suspect Words Configuration
configure-wordList-suspect-bannedWordsAndPhrases = Mistænkte ord og sætninger
configure-wordList-suspect-explanation =
  Kommentarer, der indeholder et ord eller en sætning
  i listen over mistænkte ord, placeres i den rapporterede
  kø til moderatorgennemgang og offentliggøres
  (hvis kommentarer ikke er før-modereret).
configure-wordList-suspect-wordList = Mistænkte ordliste

### Advanced
configure-advanced-customCSS = Tilpasset CSS
configure-advanced-customCSS-override =
  URL til et CSS-stilark, der tilsidesætter standardindlejring af streams.

configure-advanced-permittedDomains = Tilladte domæner

configure-advanced-liveUpdates = Kommentar Stream Live-opdateringer
configure-advanced-liveUpdates-explanation =
  Når det er aktiveret, vil der blive realtid indlæst og opdateret af kommentarer, når nye kommentarer og svar offentliggøres.

configure-advanced-embedCode-title = Integrer kode
configure-advanced-embedCode-explanation =
  Kopier og indsæt nedenstående kode i dit CMS for at integrere Coral-kommentarestreams i hver af dit websteds historier.

configure-advanced-embedCode-comment =
  Fravælg disse linjer og erstatt med ID'et for
  historiens ID og URL fra dit CMS for at angive
  strammeste integration. Se vores dokumentation på
  https://docs.coralproject.net for al konfiguration
  muligheder.

## Decision History
decisionHistory-popover =
  .description = En dialog der viser beslutningshistorikken
decisionHistory-youWillSeeAList =
  Du vil se en liste over dine handlinger til moderering af indlæg her.
decisionHistory-showMoreButton =
  Vis mere
decisionHistory-yourDecisionHistory = Din beslutningshistorie
decisionHistory-rejectedCommentBy = Afvist kommentar af <Username></Username>
decisionHistory-approvedCommentBy = Godkendt kommentar af <Username></Username>
decisionHistory-goToComment = Gå til kommentar

## moderate
moderate-navigation-reported = Rapporteret
moderate-navigation-pending = Verserende
moderate-navigation-unmoderated = Umodereret
moderate-navigation-rejected = Afvist

moderate-marker-preMod = Pre-Mod
moderate-marker-link = Link
moderate-marker-bannedWord = Forbudt ord
moderate-marker-suspectWord = Mistænkte ord
moderate-marker-spam = Spam
moderate-marker-spamDetected = Spam opdaget
moderate-marker-toxic = Giftig
moderate-marker-karma = Karma
moderate-marker-bodyCount = Ordtælling
moderate-marker-offensive = Offensiv

moderate-markers-details = Detaljer
moderate-flagDetails-offensive = Offensiv
moderate-flagDetails-spam = Spam

moderate-flagDetails-toxicityScore = Toksicitetsresultat
moderate-toxicityLabel-likely = Sandsynligvis <score></score>
moderate-toxicityLabel-unlikely = Usandsynligt <score></score>
moderate-toxicityLabel-maybe = Måske <score></score>

moderate-emptyQueue-pending = Godt gjort! Der er ikke flere afventende kommentarer til mo derate.
moderate-emptyQueue-reported = Godt gjort! Der er ikke flere rapporterede kommentarer til moderat.
moderate-emptyQueue-unmoderated = Godt gjort! Alle kommentarer er modereret.
moderate-emptyQueue-rejected = Der er ingen afviste kommentarer.

moderate-comment-inReplyTo = Svar til <Username></Username>
moderate-comment-viewContext = Se sammenhæng
moderate-comment-rejectButton =
  .aria-label = Afvise
moderate-comment-approveButton =
  .aria-label = Godkende
moderate-comment-decision = Afgørelse
moderate-comment-story = Historie
moderate-comment-moderateStory = Moderat historie
moderate-comment-featureText = Fremhæv
moderate-comment-featuredText = Fremhævet
moderate-comment-moderatedBy = Modereret af
moderate-comment-moderatedBySystem = System

moderate-single-goToModerationQueues = Gå til moderationskøer
moderate-single-singleCommentView = Visning af en enkelt kommentar

moderate-queue-viewNew =
  { $count ->
    [1] Se {$count} ny kommentar
    *[other] Se {$count} nye kommentarer
  }

### Moderate Search Bar
moderate-searchBar-allStories = Alle historier
  .title = Alle historier
moderate-searchBar-stories = Historier:
moderate-searchBar-searchButton = Søg
moderate-searchBar-titleNotAvailable =
  .title = Titlen er ikke tilgængelig
moderate-searchBar-comboBox =
  .aria-label = Søg eller hopp til historien
moderate-searchBar-searchForm =
  .aria-label = Historier
moderate-searchBar-currentlyModerating =
  .title = I øjeblikket modererer
moderate-searchBar-searchResultsMostRecentFirst = Søgeresultater (Seneste først)

moderate-searchBar-moderateAllStories = Modererer alle historier
moderate-searchBar-comboBoxTextField =
  .aria-label = Søg eller hopp til historien ...
  .placeholder = Brugertilbudstegn omkring hvert søgeterm (f.eks. "Team", "St. Louis")
moderate-searchBar-goTo = Gå til
moderate-searchBar-seeAllResults = Se alle resultater

### Moderate User History Drawer

moderate-user-drawer-email =
  .title = Email adresse
moderate-user-drawer-created-at =
  .title = Kontooprettelsesdato
moderate-user-drawer-member-id =
  .title = Medlems ID
moderate-user-drawer-tab-all-comments = Alle kommentarer
moderate-user-drawer-tab-rejected-comments = Afvist
moderate-user-drawer-tab-account-history = Kontohistorie
moderate-user-drawer-load-more = Indlæse mere
moderate-user-drawer-all-no-comments = {$username} har ikke indsendt nogen kommentarer.
moderate-user-drawer-rejected-no-comments = {$username} har ingen afviste kommentarer.
moderate-user-drawer-user-not-found = Bruger ikke fundet.
moderate-user-drawer-status-label = Status:

moderate-user-drawer-account-history-system = <icon>computer</icon> System
moderate-user-drawer-account-history-suspension-ended = Suspension sluttede
moderate-user-drawer-account-history-suspension-removed = Suspension removed
moderate-user-drawer-account-history-banned = Forbudt
moderate-user-drawer-account-history-ban-removed = Forbud fjernet
moderate-user-drawer-account-history-no-history = Der er ikke taget nogen handlinger på denne konto

moderate-user-drawer-suspension =
  Suspension, { $value } { $unit ->
    [second] { $value ->
      [1] sekund
      *[other] sekunder
    }
    [minute] { $value ->
      [1] minut
      *[other] minutter
    }
    [hour] { $value ->
      [1] time
      *[other] timer
    }
    [day] { $value ->
      [1] day
      *[other] dage
    }
    [week] { $value ->
      [1] uge
      *[other] uger
    }
    [month] { $value ->
      [1] måned
      *[other] måneder
    }
    [year] { $value ->
      [1] år
      *[other] år
    }
    *[other] unknown unit
  }

## Create Username

createUsername-createUsernameHeader = Lav brugernavn
createUsername-whatItIs =
  Dit brugernavn er en identifikator, der vises på alle dine kommentarer.
createUsername-createUsernameButton = Lav brugernavn
createUsername-usernameLabel = Brugernavn
createUsername-usernameDescription = Du kan bruge “_” og “.” Mellemrum ikke tilladt.
createUsername-usernameTextField =
  .placeholder = Brugernavn

## Add Email Address
addEmailAddress-addEmailAddressHeader = Tilføj e-mail-adresse

addEmailAddress-emailAddressLabel = Email adresse
addEmailAddress-emailAddressTextField =
  .placeholder = Email adresse

addEmailAddress-confirmEmailAddressLabel = Bekræft email adresse
addEmailAddress-confirmEmailAddressTextField =
  .placeholder = Bekræft email adresse

addEmailAddress-whatItIs =
  For din ekstra sikkerhed kræver vi, at brugerne tilføjer en e-mail-adresse til deres konti.

addEmailAddress-addEmailAddressButton =
  Tilføj e-mail-adresse

## Create Password
createPassword-createPasswordHeader = Opret adgangskode
createPassword-whatItIs =
  For at beskytte mod uautoriserede ændringer af din konto kræver vi, at brugerne opretter et kodeord.
createPassword-createPasswordButton =
  Opret adgangskode

createPassword-passwordLabel = Adgangskode
createPassword-passwordDescription = Skal være mindst {$minLength} tegn
createPassword-passwordTextField =
  .placeholder = Adgangskode

## Community
community-emptyMessage = Vi kunne ikke finde nogen i dit samfund, der matcher dine kriterier.

community-filter-searchField =
  .placeholder = Søg efter brugernavn eller e-mail-adresse ...
  .aria-label = Søg efter brugernavn eller e-mail-adresse
community-filter-searchButton =
  .aria-label = Søg

community-filter-roleSelectField =
  .aria-label = Søg efter rolle

community-filter-statusSelectField =
.aria-label = Søg efter brugerstatus

community-changeRoleButton =
  .aria-label = Skift rolle

community-filter-optGroupAudience =
  .label = Publikum
community-filter-optGroupOrganization =
  .label = Organisation
community-filter-search = Søg
community-filter-showMe = Vis mig
community-filter-allRoles = Alle roller
community-filter-allStatuses = Alle statuer

community-column-username = Brugernavn
community-column-email = Email
community-column-memberSince = Medlem siden
community-column-role = Rotatee
community-column-status = Status

community-role-popover =
  .description = En dropdown for at ændre brugerrollen

community-userStatus-popover =
  .description = Et dropdown for at ændre brugerstatus

community-userStatus-banUser = Forbud bruger
community-userStatus-removeBan = Fjern forbud
community-userStatus-suspendUser = Suspender bruger
community-userStatus-removeSuspension = Fjern ophæng
community-userStatus-unknown = Ukendt
community-userStatus-changeButton =
  .aria-label = Skift brugerstatus

community-banModal-areYouSure = Er du sikker på, at du vil forbyde <username></username>?
community-banModal-consequence =
  Når det er forbudt, vil denne bruger ikke længere være i stand til at kommentere, bruge reaktioner eller rapportere kommentarer.
community-banModal-cancel = Afbestille
community-banModal-banUser = Forbud bruger
community-banModal-customize = Tilpas forbud e-mail-besked
community-banModal-emailTemplate =
  Hej { $username },

  En person med adgang til din konto har overtrådt vores fællesskabsretningslinjer. Som et resultat er din konto forbudt. Du vil ikke længere være i stand til at kommentere, reagere eller rapportere kommentarer.

community-suspendModal-areYouSure = Suspenderer <strong>{ $username }</strong>?
community-suspendModal-consequence =
  Når den er suspenderet, kan denne bruger ikke længere kommentere, bruge reaktioner eller rapportere kommentarer.
community-suspendModal-duration-3600 = 1 time
community-suspendModal-duration-10800 = 3 timer
community-suspendModal-duration-86400 = 24 timer
community-suspendModal-duration-604800 = 7 dage
community-suspendModal-cancel = Afbestille
community-suspendModal-suspendUser = Suspender bruger
community-suspendModal-emailTemplate =
  Hej { $username },

  I henhold til { $organizationName }'s community-retningslinjer er din konto midlertidigt suspenderet. Under suspensionen vil du ikke være i stand til at kommentere, markere eller samarbejde med andre kommentatorer. Genindgå samtalen om { framework-timeago-time }

community-suspendModal-customize = Tilpas suspension af e-mail-meddelelse

community-suspendModal-success =
  <strong>{ $username }</strong> er blevet suspenderet i <strong>{ $duration }</strong>

community-suspendModal-success-close = Luk
community-suspendModal-selectDuration = Vælg ophængslængde

community-invite-inviteMember = Inviter medlemmer til din organisation
community-invite-emailAddressLabel = Email adresse:
community-invite-inviteMore = Inviter mere
community-invite-inviteAsLabel = Inviter som:
community-invite-sendInvitations = Send invitationer
community-invite-role-staff =
  <strong>Personale rolle:</strong> Modtager en "Staff" -emblem, og kommentarer godkendes automatisk. Kan ikke moderere eller ændre nogen konfiguration.
community-invite-role-moderator =
  <strong>Moderator rolle:</strong> Modtager en "Staff" -emblem, og kommentarer godkendes automatisk. Har fulde moderationsprivilegier (godkend, afvis og funktion kommentarer). Kan konfigurere individuelle artikler, men ingen konfigurationsrettigheder på hele webstedet.
community-invite-role-admin =
  <strong>Administratorrolle:</strong> Modtager en "Staff" -emblem, og kommentarer godkendes automatisk. Har fulde moderationsprivilegier (godkend, afvis og funktion kommentarer). Kan konfigurere individuelle artikler og har konfigurationsrettigheder på hele webstedet.
community-invite-invitationsSent = Dine invitationer er sendt!
community-invite-close = Luk
community-invite-invite = Invitere

## Stories
stories-emptyMessage = Der er i øjeblikket ingen offentliggjorte historier.
stories-noMatchMessage = Vi kunne ikke finde nogen historier, der matcher dine kriterier.

stories-filter-searchField =
  .placeholder = Søg efter historietitel eller forfatter ...
  .aria-label = Søg efter historietitel eller forfatter
stories-filter-searchButton =
  .aria-label = Søg

stories-filter-statusSelectField =
  .aria-label = Søg efter status

stories-changeStatusButton =
  .aria-label = Skift status

stories-filter-search = Søg
stories-filter-showMe = Vis mig
stories-filter-allStories = Alle historier
stories-filter-openStories = Åben historier
stories-filter-closedStories = Lukkede historier

stories-column-title = Titel
stories-column-author = Forfatter
stories-column-publishDate = Udgivelsesdato
stories-column-status = Status
stories-column-clickToModerate = Klik på titel for at moderere historien

stories-status-popover =
  .description = En dropdown for at ændre historiestatusen

## Invite

invite-youHaveBeenInvited = Du er blevet inviteret til at deltage { $organizationName }
invite-finishSettingUpAccount = Afslut opsætningen af kontoen for:
invite-createAccount = Opret konto
invite-passwordLabel = Adgangskode
invite-passwordDescription = Skal være mindst { $minLength } tegn
invite-passwordTextField =
  .placeholder = Adgangskode
invite-usernameLabel = Brugernavn
invite-usernameDescription = Du kan bruge “_” og “.”
invite-usernameTextField =
  .placeholder = Brugernavn
invite-oopsSorry = Undskyld!
invite-successful = Din konto er blevet oprettet
invite-youMayNowSignIn = Du kan nu logge på { -product-name } ved hjælp af:
invite-goToAdmin = Gå til { -product-name } Admin
invite-goToOrganization = Gå til { $organizationName }
invite-tokenNotFound =
  Det specificerede link er ugyldigt. Kontroller, om det blev kopieret korrekt.
