### Localization for Admin

## General
general-notAvailable = Niet beschikbaar
general-none = Geen
general-noTextContent = Geen tekst inhoud
general-archived = Gearchiveerd

## Story Status
storyStatus-open = Open
storyStatus-closed = Gesloten
storyStatus-archiving = Archiveren
storyStatus-archived = Gearchiveerd
storyStatus-unarchiving = Dearchiveren

## Roles
role-admin = Admin
role-moderator = Moderator
role-siteModerator = Site Moderator
role-organizationModerator = Organisatie Moderator
role-staff = Redactie
role-member = Lid
role-commenter = Reageerder

role-plural-admin = Admins
role-plural-moderator = Moderators
role-plural-staff = Redactie
role-plural-member = Lid
role-plural-commenter = Reageerder

comments-react =
  .aria-label = {$count ->
    [0] {$reaction} reactie van {$username}
    *[other] {$reaction} ({$count}) reactie van {$username}
  }
comments-reacted =
  .aria-label = {$count ->
    [0] {$reaction} reacties van {$username}
    [one] {$reaction} reacties van {$username}
    *[other] {$reaction} ({$count}) reacties van {$username}
  }

## User Statuses
userStatus-active = Actief
userStatus-banned = Verbannen
userStatus-siteBanned = Site verbannen
userStatus-banned-all = Verbannen (allemaal)
userStatus-banned-count = Verbannen ({$count})
userStatus-suspended = Geschorst
userStatus-premod = Altijd naar pre-moderatie
userStatus-warned = Gewaarschuwd

# Queue Sort
queue-sortMenu-newest = Nieuw
queue-sortMenu-oldest = Oud

## Navigation
navigation-moderate = Modereer
navigation-community = Community
navigation-stories = Artikelen
navigation-configure = Instellen
navigation-dashboard = Dashboard

## User Menu
userMenu-signOut = Uitloggen
userMenu-viewLatestRelease = Bekijk Laatste Release
userMenu-reportBug = Rapporteer een bug of geef feedback
userMenu-popover =
  .description = Een dialoog van het gebruikersmenu met gerelateerde links en acties

## Restricted
restricted-currentlySignedInTo = Momenteel ingelogd op
restricted-noPermissionInfo = Je hebt geen toestemming om deze pagina te openen.
restricted-signedInAs = Je bent ingelogd als: <strong>{ $username }</strong>
restricted-signInWithADifferentAccount =  Log in met een andere gebruikersnaam
restricted-contactAdmin = Als je denkt dat dit een fout is, neem dan contact op met je beheerder voor hulp.

## Login

# Sign In
login-signInTo = Log in op
login-signIn-enterAccountDetailsBelow = Vul hieronder je accountgegevens in

login-emailAddressLabel = E-mailadres
login-emailAddressTextField =
  .placeholder = E-mailadres

login-signIn-passwordLabel = Wachtwoord
login-signIn-passwordTextField =
  .placeholder = Wachtwoord

login-signIn-signInWithEmail = Login met E-mailadres
login-orSeparator = Of
login-signIn-forgot-password = Wachtwoord vergeten?

login-signInWithFacebook = Login met Facebook
login-signInWithGoogle = Login met Google
login-signInWithOIDC = Login met { $name }

# Create Username

createUsername-createUsernameHeader = Gebruikersnaam aanmaken
createUsername-whatItIs =
  Je gebruikersnaam is een identificatie die verschijnt bij al je reacties.
createUsername-createUsernameButton = Gebruikersnaam aanmaken
createUsername-usernameLabel = Gebruikersnaam
createUsername-usernameDescription = Je mag “_” en “.” gebruiken. Spaties zijn niet toegestaan.
createUsername-usernameTextField =
  .placeholder = Gebruikersnaam

# Add Email Address
addEmailAddress-addEmailAddressHeader = E-mailadres toevoegen

addEmailAddress-emailAddressLabel = E-mailadres
addEmailAddress-emailAddressTextField =
  .placeholder = E-mailadres

addEmailAddress-confirmEmailAddressLabel = Bevestig e-mailadres
addEmailAddress-confirmEmailAddressTextField =
.placeholder = Bevestig e-mailadres

addEmailAddress-whatItIs =
  Voor extra beveiliging vragen wij gebruikers om een e-mailadres toe te voegen aan hun account.

addEmailAddress-addEmailAddressButton =
  E-mailadres toevoegen

# Create Password
createPassword-createPasswordHeader = Wachtwoord aanmaken
createPassword-whatItIs =
  Om ongeautoriseerde wijzigingen aan je account te voorkomen,
  vragen wij gebruikers om een wachtwoord aan te maken.
createPassword-createPasswordButton =
  Wachtwoord aanmaken

createPassword-passwordLabel = Wachtwoord
createPassword-passwordDescription = Moet minstens {$minLength} tekens bevatten
createPassword-passwordTextField =
  .placeholder = Wachtwoord

# Forgot Password
forgotPassword-forgotPasswordHeader = Wachtwoord vergeten?
forgotPassword-checkEmailHeader = Controleer je e-mail
forgotPassword-gotBackToSignIn = Terug naar inlogpagina
forgotPassword-checkEmail-receiveEmail =
  Als er een account is gekoppeld aan <strong>{ $email }</strong>,
  dan ontvang je een e-mail met een link om een nieuw wachtwoord aan te maken.
forgotPassword-enterEmailAndGetALink =
  Voer hieronder je e-mailadres in en we sturen je een link
  om je wachtwoord opnieuw in te stellen.
forgotPassword-emailAddressLabel = E-mailadres
forgotPassword-emailAddressTextField =
  .placeholder = E-mailadres
forgotPassword-sendEmailButton = E-mail versturen

# Link Account
linkAccount-linkAccountHeader = Account koppelen
linkAccount-alreadyAssociated =
  Het e-mailadres <strong>{ $email }</strong> is al gekoppeld aan een account.
  Als je deze wilt koppelen, voer dan je wachtwoord in.
linkAccount-passwordLabel = Wachtwoord
linkAccount-passwordTextField =
  .label = Wachtwoord
linkAccount-linkAccountButton = Account koppelen
linkAccount-useDifferentEmail = Gebruik een ander e-mailadres

## Configure

configure-experimentalFeature = Experimentele functionaliteit

configure-unsavedInputWarning =
  Je hebt niet-opgeslagen wijzigingen. Weet je zeker dat je door wilt gaan?

configure-sideBarNavigation-general = Algemeen
configure-sideBarNavigation-authentication = Authenticatie
configure-sideBarNavigation-moderation = Moderatie
configure-sideBarNavigation-moderation-comments = Reacties
configure-sideBarNavigation-moderation-users = Gebruikers
configure-sideBarNavigation-organization = Organisatie
configure-sideBarNavigation-moderationPhases = Moderatie Fases
configure-sideBarNavigation-advanced = Geavanceerd
configure-sideBarNavigation-email = E-mail
configure-sideBarNavigation-bannedAndSuspectWords = Zwarte en Grijze woordenlijst
configure-sideBarNavigation-slack = Slack
configure-sideBarNavigation-webhooks = Webhooks

configure-sideBar-saveChanges = Veranderingen opslaan
configure-configurationSubHeader = Configuratie
configure-onOffField-on = Aan
configure-onOffField-off = Uit
configure-radioButton-allow = Toestaan
configure-radioButton-dontAllow = Niet toestaan

### Moderation Phases

configure-moderationPhases-generatedAt = KEY GENERATED AT:
  { DATETIME($date, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric") }
configure-moderationPhases-phaseNotFound = Externe moderatiefase niet gevonden
configure-moderationPhases-experimentalFeature =
  De functie voor aangepaste moderatiefases is momenteel in actieve ontwikkeling.
  Neem <ContactUsLink>contact met ons op voor feedback of verzoeken</ContactUsLink>.
configure-moderationPhases-header-title = Moderatiefases
configure-moderationPhases-description =
  Configureer een externe moderatiefase om sommige moderatieacties te automatiseren.
  Moderatieverzoeken worden JSON-gecodeerd en ondertekend.
  Bezoek onze <externalLink>documentatie</externalLink> voor meer informatie over moderatieverzoeken.
configure-moderationPhases-addExternalModerationPhaseButton =
  Externe moderatiefase toevoegen
configure-moderationPhases-moderationPhases = Moderatiefases
configure-moderationPhases-name = Naam
configure-moderationPhases-status = Status
configure-moderationPhases-noExternalModerationPhases =
  Er zijn geen externe moderatiefases geconfigureerd, voeg er hierboven één toe.
configure-moderationPhases-enabledModerationPhase = Ingeschakeld
configure-moderationPhases-disableModerationPhase = Uitgeschakeld
configure-moderationPhases-detailsButton = Details <icon>keyboard_arrow_right</icon>
configure-moderationPhases-addExternalModerationPhase = Externe moderatiefase toevoegen
configure-moderationPhases-updateExternalModerationPhaseButton = Details bijwerken
configure-moderationPhases-cancelButton = Annuleren
configure-moderationPhases-format = Comment Body Format
configure-moderationPhases-endpointURL = Callback URL
configure-moderationPhases-timeout = Time-out
configure-moderationPhases-timeout-details =
  De tijd dat Coral zal wachten op je moderatie reactie in milliseconden.
configure-moderationPhases-format-details =
  Het formaat waarin Coral het reactie body zal verzenden. Standaard zal Coral
  de reactie in de oorspronkelijke HTML-gecodeerde indeling verzenden. Als "Platte tekst" is
  geselecteerd, dan zal de HTML-gestripte versie in plaats daarvan worden verzonden
configure-moderationPhases-format-html = HTML
configure-moderationPhases-format-plain = Platte tekst
configure-moderationPhases-endpointURL-details =
  De URL waarop Coral-moderatieverzoeken worden gepost. De opgegeven URL
  moet binnen de aangewezen time-out reageren of de beslissing van de moderatie
  actie zal worden overgeslagen.
configure-moderationPhases-configureExternalModerationPhase =
  Externe moderatiefase configureren
configure-moderationPhases-phaseDetails = Fase details
onfigure-moderationPhases-status = Status
configure-moderationPhases-signingSecret = Ondertekening geheim
configure-moderationPhases-signingSecretDescription =
  De volgende signing secret wordt gebruikt om verzoek payloads te ondertekenen die
  naar de URL worden gestuurd. Bezoek onze <externalLink>documentatie</externalLink> om meer te leren over webhook ondertekening.
configure-moderationPhases-phaseStatus = Fase status
configure-moderationPhases-status = Status
configure-moderationPhases-signingSecret = Signing secret
configure-moderationPhases-signingSecretDescription =
  De volgende signing secret wordt gebruikt om verzoek payloads te ondertekenen die naar de URL worden gestuurd.
  Bezoek onze <externalLink>documentatie</externalLink> om meer te leren over webhook ondertekening.
configure-moderationPhases-dangerZone = Gevarenzone
configure-moderationPhases-rotateSigningSecret = Signing secret roteren
configure-moderationPhases-rotateSigningSecretDescription =
  Door de signing secret te roteren kun je veilig een signing secret dat in productie wordt gebruikt vervangen met vertraging.
configure-moderationPhases-rotateSigningSecretButton = Rotateer signing secret

configure-moderationPhases-disableExternalModerationPhase =
  Uitschakelen externe moderatiefase
configure-moderationPhases-disableExternalModerationPhaseDescription =
  Deze externe moderatiefase is momenteel ingeschakeld. Door uit te schakelen
  worden er geen nieuwe moderatie-aanvragen meer naar de opgegeven URL gestuurd.
configure-moderationPhases-disableExternalModerationPhaseButton = Fase uitschakelen
configure-moderationPhases-enableExternalModerationPhase =
  Inschakelen externe moderatiefase
configure-moderationPhases-enableExternalModerationPhaseDescription =
  Deze externe moderatiefase is momenteel uitgeschakeld. Door in te schakelen,
  worden er nieuwe moderatie-aanvragen naar de opgegeven URL gestuurd.
configure-moderationPhases-enableExternalModerationPhaseButton = Fase inschakelen
configure-moderationPhases-deleteExternalModerationPhase =
  Verwijderen externe moderatiefase
configure-moderationPhases-deleteExternalModerationPhaseDescription =
  Het verwijderen van deze externe moderatiefase zal er voor zorgen dat er geen nieuwe
  moderatie-aanvragen naar deze URL meer worden gestuurd. Daarnaast worden alle bijbehorende
  instellingen verwijderd.
configure-moderationPhases-deleteExternalModerationPhaseButton = Fase verwijderen
configure-moderationPhases-rotateSigningSecret = Roteren signing secret
configure-moderationPhases-rotateSigningSecretHelper =
  Na verloop van tijd worden er geen handtekeningen meer gegenereerd met het oude secret.
configure-moderationPhases-expiresOldSecret =
  Verlopen van oud secret
configure-moderationPhases-expiresOldSecretImmediately =
  Onmiddellijk
configure-moderationPhases-expiresOldSecretHoursFromNow =
  { $hours ->
  [1] 1 uur
  *[other] { $hours } uur
  } vanaf nu
configure-moderationPhases-rotateSigningSecretSuccessUseNewSecret =
  Het ondertekeningsgeheim van de externe moderatiefase is geroteerd. Zorg ervoor dat
  je integraties worden bijgewerkt om het nieuwe secret hieronder te gebruiken.
configure-moderationPhases-confirmDisable =
  Door deze externe moderatiefase uit te schakelen, worden er geen nieuwe moderatie-aanvragen
  meer naar deze URL gestuurd. Weet je zeker dat je door wilt gaan?
configure-moderationPhases-confirmEnable =
  Door de externe moderatiefase in te schakelen, worden er weer moderatie-aanvragen
  naar deze URL gestuurd. Weet je zeker dat je door wilt gaan?
configure-moderationPhases-confirmDelete =
  Het verwijderen van deze externe moderatiefase zal er voor zorgen dat er geen nieuwe
  moderatie-aanvragen naar deze URL meer worden gestuurd. Daarnaast worden alle bijbehorende
  instellingen verwijderd. Weet je zeker dat je door wilt gaan?

### Webhooks

configure-webhooks-generatedAt = KEY GENERATED AT:
  { DATETIME($date, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric") }
configure-webhooks-experimentalFeature =
  De webhook-functie is momenteel in actieve ontwikkeling.
  Er kunnen evenementen worden toegevoegd of verwijderd. Neem <ContactUsLink>contact met ons op voor feedback of verzoeken</ContactUsLink>.
configure-webhooks-webhookEndpointNotFound = Webhook-eindpunt niet gevonden
configure-webhooks-header-title = Configureer webhook-eindpunt
configure-webhooks-description =
  Configureer een eindpunt om gebeurtenissen naartoe te sturen wanneer er gebeurtenissen optreden binnen Coral.
  Deze gebeurtenissen worden gecodeerd in JSON en ondertekend.
  Voor meer informatie over webhook-ondertekening, bezoek onze <externalLink>Webhook-gids</externalLink>.
configure-webhooks-addEndpoint = Voeg webhook-eindpunt toe
configure-webhooks-addEndpointButton = Voeg webhook-eindpunt toe
configure-webhooks-endpoints = Eindpunten
configure-webhooks-url = URL
configure-webhooks-status = Status
configure-webhooks-noEndpoints = Er zijn geen webhook-eindpunten geconfigureerd, voeg er hierboven een toe.
configure-webhooks-enabledWebhookEndpoint = Ingeschakeld
configure-webhooks-disabledWebhookEndpoint = Uitgeschakeld
configure-webhooks-endpointURL = Eindpunt-URL
configure-webhooks-cancelButton = Annuleren
configure-webhooks-updateWebhookEndpointButton = Werk webhook-eindpunt bij
configure-webhooks-eventsToSend = Te verzenden gebeurtenissen
configure-webhooks-clearEventsToSend = Wissen
configure-webhooks-eventsToSendDescription =
  Dit zijn de gebeurtenissen die zijn geregistreerd voor dit specifieke eindpunt.
  Bezoek onze <externalLink>Webhook-gids</externalLink> voor het schema van deze gebeurtenissen.
  Elke gebeurtenis die overeenkomt met het volgende, wordt naar het eindpunt gestuurd als het is ingeschakeld:
configure-webhooks-allEvents =
  Het eindpunt ontvangt alle gebeurtenissen, inclusief die welke in de toekomst worden toegevoegd.
configure-webhooks-selectedEvents =
  { $count } { $count ->
    [1] gebeurtenis
    *[other] gebeurtenissen
  } geselecteerd.
configure-webhooks-selectAnEvent =
  Selecteer hierboven gebeurtenissen of <button>ontvang alle gebeurtenissen</button>.
configure-webhooks-configureWebhookEndpoint = Configureer webhook-eindpunt
configure-webhooks-confirmEnable =
  Door het inschakelen van het webhook-eindpunt worden gebeurtenissen naar deze URL gestuurd. Weet je zeker dat je door wilt gaan?
configure-webhooks-confirmDisable =
  Door het uitschakelen van dit webhook-eindpunt worden er geen nieuwe gebeurtenissen meer naar deze URL gestuurd. Weet je zeker dat je door wilt gaan?
configure-webhooks-confirmDelete =
  Door het verwijderen van dit webhook-eindpunt worden er geen nieuwe gebeurtenissen meer naar deze URL gestuurd en worden alle bijbehorende instellingen verwijderd. Weet je zeker dat je door wilt gaan?
configure-webhooks-dangerZone = Gevarenzone
configure-webhooks-rotateSigningSecret = Roteer signing secret
configure-webhooks-rotateSigningSecretDescription =
  Het roteren van de signing secret zal het veilig vervangen van een gebruikte signing secret in productie met vertraging mogelijk maken.
configure-webhooks-rotateSigningSecretButton = Roteer signing secret
configure-webhooks-rotateSigningSecretHelper =
  Nadat het verloopt worden er geen handtekeningen meer gegenereerd met de oude secret.
configure-webhooks-rotateSigningSecretSuccessUseNewSecret =
  De signing secret van het webhook-eindpunt is geroteerd. Zorg ervoor
  dat je je integraties bijwerkt om de nieuwe sleutel hieronder te gebruiken.
configure-webhooks-disableEndpoint = Eindpunt uitschakelen
configure-webhooks-disableEndpointDescription =
  Dit eindpunt is momenteel ingeschakeld.
  Door dit eindpunt uit te schakelen worden er geen nieuwe gebeurtenissen meer naar de opgegeven URL gestuurd.
configure-webhooks-disableEndpointButton = Eindpunt uitschakelen
configure-webhooks-enableEndpoint = Eindpunt inschakelen
configure-webhooks-enableEndpointDescription =
  Dit eindpunt is momenteel uitgeschakeld.
  Door dit eindpunt in te schakelen, worden er nieuwe gebeurtenissen naar de opgegeven URL gestuurd.
configure-webhooks-enableEndpointButton = Eindpunt inschakelen
configure-webhooks-deleteEndpoint = Eindpunt verwijderen
configure-webhooks-deleteEndpointDescription =
  Door het verwijderen van het eindpunt worden er geen nieuwe gebeurtenissen meer naar de opgegeven URL gestuurd.
configure-webhooks-deleteEndpointButton = Eindpunt verwijderen
configure-webhooks-endpointStatus = Eindpuntstatus
configure-webhooks-signingSecret = Signing secret
configure-webhooks-signingSecretDescription =
  De volgende signing secret wordt gebruikt om request payloads te ondertekenen die naar de URL worden gestuurd.
  Voor meer informatie over webhook-ondertekening, raadpleeg je onze
  <externalLink>Webhook-gids</externalLink>.
configure-webhooks-expiresOldSecret = Laat de oude secret vervallen
configure-webhooks-expiresOldSecretImmediately = Onmiddellijk
configure-webhooks-expiresOldSecretHoursFromNow =
  { $hours ->
    [1] 1 uur
    *[other] { $hours } uur
  }  vanaf nu
configure-webhooks-detailsButton = Details <icon>keyboard_arrow_right</icon>

### General
configure-general-guidelines-title = Samenvatting van richtlijnen van de community
configure-general-guidelines-explanation =
  Dit zal boven de reacties op de hele site verschijnen.
  Je kunt de tekst opmaken met Markdown.
  Meer informatie over het gebruik van Markdown vind je hier: <externalLink>https://www.markdownguide.org/cheat-sheet/</externalLink>
configure-general-guidelines-showCommunityGuidelines = Toon samenvatting van communityrichtlijnen

#### Bio
configure-general-memberBio-title = Biografieën van reageerders
configure-general-memberBio-explanation =
  Sta toe dat reageerders een biografie aan hun profiel toevoegen. Let op: dit kan de werklast van moderators verhogen omdat biografieën van reageerders kunnen worden gerapporteerd.
configure-general-memberBio-label = Sta biografieën van reageerders toe

#### Locale
configure-general-locale-language = Taal
configure-general-locale-chooseLanguage = Kies de taal voor je Coral-gemeenschap.
configure-general-locale-invalidLanguage =
  De eerder geselecteerde taal <lang></lang> bestaat niet meer. Kies een andere taal.

#### Sitewide Commenting
configure-general-sitewideCommenting-title = Sitewide reageren
configure-general-sitewideCommenting-explanation =
  Open of sluit reactiestreams voor nieuwe reacties op de hele site.
  Als nieuwe reacties zijn uitgeschakeld, kunnen nieuwe reacties niet worden ingediend,
  maar bestaande reacties kunnen respects blijven ontvangen, worden gerapporteerd en gedeeld.
configure-general-sitewideCommenting-enableNewCommentsSitewide =
  Schakel nieuwe reacties over de hele site in
configure-general-sitewideCommenting-onCommentStreamsOpened =
  Aan - Reactiestreams geopend voor nieuwe reacties
configure-general-sitewideCommenting-offCommentStreamsClosed =
  Uit - Reactiestreams gesloten voor nieuwe reacties
configure-general-sitewideCommenting-message = Bericht waarom reageren gesloten is over de hele site
configure-general-sitewideCommenting-messageExplanation =
  Schrijf een bericht dat wordt weergegeven wanneer reactiestreams voor de hele site worden gesloten

#### Embed Links
configure-general-embedLinks-title = Embedded media
configure-general-embedLinks-desc = Sta reageerders toe om een YouTube-video, tweet of GIF uit GIPHYs bibliotheek aan het einde van hun reactie toe te voegen
configure-general-embedLinks-enableTwitterEmbeds = Sta Twitter-embeds toe
configure-general-embedLinks-enableYouTubeEmbeds = Sta YouTube-embeds toe
configure-general-embedLinks-enableGiphyEmbeds = Sta GIFs van GIPHY toe
configure-general-embedLinks-enableExternalEmbeds = Externe media toestaan

configure-general-embedLinks-On = Ja
configure-general-embedLinks-Off = Nee

configure-general-embedLinks-giphyMaxRating = GIF content rating
configure-general-embedLinks-giphyMaxRating-desc = Selecteer de maximale content rating voor de GIFs die in de zoekresultaten van commentatoren verschijnen.

configure-general-embedLinks-giphyMaxRating-g = G
configure-general-embedLinks-giphyMaxRating-g-desc = Inhoud die geschikt is voor alle leeftijden
configure-general-embedLinks-giphyMaxRating-pg = PG
configure-general-embedLinks-giphyMaxRating-pg-desc =  Inhoud die over het algemeen veilig is voor iedereen, maar ouderlijk toezicht voor kinderen wordt aanbevolen.
configure-general-embedLinks-giphyMaxRating-pg13 = PG-13
configure-general-embedLinks-giphyMaxRating-pg13-desc = Lichte seksuele toespelingen, licht drugsgebruik, lichte grofheid of bedreigende beelden. Kan afbeeldingen van halfnaakte mensen bevatten, maar TOONT GEEN echte menselijke geslachtsdelen of naaktheid.
configure-general-embedLinks-giphyMaxRating-r = R
configure-general-embedLinks-giphyMaxRating-r-desc = Sterke taal, sterke seksuele toespelingen, geweld en illegaal drugsgebruik; niet geschikt voor tieners of jonger. Geen naaktheid.

configure-general-embedLinks-configuration = Configuratie
configure-general-embedLinks-configuration-desc =
  Voor aanvullende informatie over de API van GIPHY kun je terecht op: <externalLink>https://developers.giphy.com/docs/api</externalLink>
configure-general-embedLinks-giphyAPIKey = GIPHY API key


#### Configure Announcements

configure-general-announcements-title = Gemeenschapsaankondiging
configure-general-announcements-description =
  Voeg een tijdelijke aankondiging toe die gedurende een bepaalde tijd bovenaan alle reactiestromen van je organisatie zal verschijnen.
configure-general-announcements-delete = Verwijder aankondiging
configure-general-announcements-add = Aankondiging toevoegen
configure-general-announcements-start = Start aankondiging
configure-general-announcements-cancel = Annuleren
configure-general-announcements-current-label = Huidige aankondiging
configure-general-announcements-current-duration =
  Deze aankondiging eindigt automatisch op: { $timestamp }
configure-general-announcements-duration = Toon deze aankondiging voor

#### Closing Comment Streams
configure-general-closingCommentStreams-title = Reactiestromen sluiten
configure-general-closingCommentStreams-explanation = Stel reactiestromen in om na een bepaalde periode na publicatie van een artikel te sluiten
configure-general-closingCommentStreams-closeCommentsAutomatically = Sluit reacties automatisch
configure-general-closingCommentStreams-closeCommentsAfter = Sluit reacties na

#### Comment Length
configure-general-commentLength-title = Lengte reacties
configure-general-commentLength-maxCommentLength = Maximale lengte reactie
configure-general-commentLength-setLimit =
  Stel minimale en maximale lengte-eisen voor reacties in.
  Spaties aan het begin en het einde van een reactie worden verwijderd.
configure-general-commentLength-limitCommentLength = Beperk reactielengte
configure-general-commentLength-minCommentLength = Minimale lengte reactie
configure-general-commentLength-characters = Tekens
configure-general-commentLength-textField =
  .placeholder = Geen limiet
configure-general-commentLength-validateLongerThanMin =
  Voer alstublieft een nummer in dat langer is dan de minimale lengte

#### Comment Editing
configure-general-commentEditing-title = Commentaar bewerken
configure-general-commentEditing-explanation =
  Stel een limiet in voor hoelang commentaars de tijd hebben om hun commentaar sitewide te bewerken.
  Bewerkte commentaren worden aangeduid als (Bewerkt) in de commentaar stream en het moderatiepaneel.
configure-general-commentEditing-commentEditTimeFrame = Tijdslimiet voor commentaar bewerken
configure-general-commentEditing-seconds = Seconden

#### Flatten replies
configure-general-flattenReplies-title = Flatten reacties
configure-general-flattenReplies-enabled = Flatten reacties aan
configure-general-flattenReplies-explanation =
  Wijzig hoe niveaus van antwoorden worden weergegeven. Indien ingeschakeld, kunnen antwoorden op reacties tot zeven niveaus diep gaan voordat ze niet langer ingesprongen zijn op de pagina. Indien uitgeschakeld, wordt na een diepte van zeven antwoorden de rest van het gesprek weergegeven in een speciale weergave, weg van de andere reacties.

configure-general-featuredBy-title = Uitgelicht door
configure-general-featuredBy-enabled = Uitgelicht door ingeschakeld
configure-general-featuredBy-explanation = Toon naam van de moderator bij een uitgelichte reactie

#### Closed Stream Message
configure-general-closedStreamMessage-title = Gesloten reactiestreambericht
configure-general-closedStreamMessage-explanation = Schrijf een bericht dat verschijnt wanneer een artikel is gesloten voor reacties.

### Organization
configure-organization-name = Organisatie naam
configure-organization-sites = Sites
configure-organization-nameExplanation =
  De naam van je organisatie wordt weergegeven in e-mails die door { -product-name } naar je community- en organisatieleden worden verzonden.
configure-organization-sites-explanation =
  Voeg een nieuwe site toe aan je organisatie of bewerk de details van een bestaande site.
configure-organization-sites-add-site = <icon>add</icon> Site toevoegen
configure-organization-email = Organisatie e-mail
configure-organization-emailExplanation =
  Dit e-mailadres wordt gebruikt in e-mails en op het hele platform
   voor leden van de gemeenschap om in contact te komen met de organisatie mochten
   ze vragen hebben over de status van hun account of
   moderatie vragen.
configure-organization-url = Organisatie-URL
configure-organization-urlExplanation =
  De URL van je organisatie wordt weergegeven in e-mails die door { -product-name } naar je community- en organisatieleden worden verzonden.

### Sites
configure-sites-site-details = Details <icon>keyboard_arrow_right</icon>
configure-sites-add-new-site = Voeg een nieuwe site toe aan { $site }
configure-sites-add-success = { $site } is toegevoegd aan { $org }
configure-sites-edit-success = Wijzigingen aan { $site } zijn opgeslagen.
configure-sites-site-form-name = Sitenaam
configure-sites-site-form-name-explanation = De sitenaam verschijnt op e-mails die Coral stuurt naar je gemeenschaps- en organisatieleden.
configure-sites-site-form-url = Site-URL
configure-sites-site-form-url-explanation = Deze URL verschijnt op e-mails die Coral stuurt naar je gemeenschapsleden.
configure-sites-site-form-email = E-mailadres van de site
configure-sites-site-form-url-explanation = Dit e-mailadres is bedoeld voor gemeenschapsleden om contact met je op te nemen als ze vragen hebben of hulp nodig hebben, bijv. comments@yoursite.com
configure-sites-site-form-domains = Toegestane domeinen van de site
configure-sites-site-form-domains-explanation = Domeinen waarop je Coral commentaar streams mogen worden ingesloten (bijv. http://localhost:3000, https://staging.domain.com, https://domain.com).
configure-sites-site-form-submit = <icon>add</icon> Site toevoegen
configure-sites-site-form-cancel = Annuleren
configure-sites-site-form-save = Wijzigingen opslaan
configure-sites-site-edit = Bewerk details van { $site }
configure-sites-site-form-embed-code = Insluitcode
sites-emptyMessage = We hebben geen sites gevonden die overeenkomen met je criteria.
sites-selector-allSites = Alle sites
site-filter-option-allSites = Alle sites

site-selector-all-sites = Alle sites
stories-filter-sites-allSites = Alle sites
stories-filter-statuses = Status
stories-column-site = Site
site-table-siteName = Site naam
stories-filter-sites = Site

site-search-searchButton =
  .aria-label = Zoek
site-search-textField =
  .aria-label = Zoek op site naam
site-search-textField =
  .placeholder = Zoek op site naam
site-search-none-found = Geen sites gevonden met die zoekopdracht
specificSitesSelect-validation = Je moet minimaal 1 site selecteren.

stories-column-actions = Acties
stories-column-rescrape = Re-scrape

stories-openInfoDrawer =
  .aria-label = Open Informatie La
stories-actions-popover =
  .description = Een dropdown om artikel acties te selecteren
stories-actions-rescrape = Re-scrape
stories-actions-close = Artikel sluiten
stories-actions-open = Artikel openen
stories-actions-archive = Archiveer artikel
stories-actions-unarchive = Dearchiveer artikel
stories-actions-isUnarchiving = Bezig met dearchiveren

### Sections

moderate-section-selector-allSections = Alle Secties
moderate-section-selector-uncategorized = Ongecategoriseerd
moderate-section-uncategorized = Ongecategoriseerd

### Email

configure-email = E-mail instellingen
configure-email-configBoxEnabled = Aan
configure-email-fromNameLabel = Van naam
configure-email-fromNameDescription =
  Naam zoals deze zal verschijnen op alle uitgaande e-mails
configure-email-fromEmailLabel = Van e-mailadres
configure-email-fromEmailDescription =
  E-mailadres dat wordt gebruikt om berichten mee te versturen
configure-email-smtpHostLabel = SMTP host
configure-email-smtpHostDescription = (ex. smtp.sendgrid.net)
configure-email-smtpPortLabel = SMTP port
configure-email-smtpPortDescription = (ex. 25)
configure-email-smtpTLSLabel = TLS
configure-email-smtpAuthenticationLabel = SMTP authenticatie
configure-email-smtpCredentialsHeader = E-mail credentials
configure-email-smtpUsernameLabel = Gebruikersnaam
configure-email-smtpPasswordLabel = Wachtwoord
configure-email-send-test = Verstuur test e-mail

### Authentication

configure-auth-clientID = Client ID
configure-auth-clientSecret = Client secret
configure-auth-configBoxEnabled = Aan
configure-auth-targetFilterCoralAdmin = { -product-name } Admin
configure-auth-targetFilterCommentStream = Reactiestroom
configure-auth-redirectURI = Redirect URI
configure-auth-registration = Registratie
configure-auth-registrationDescription =
  Sta nieuwe gebruikers toe om zich te registreren voor een nieuw account via deze authenticatie-integratie.
configure-auth-registrationCheckBox = Sta Registratie toe
configure-auth-pleaseEnableAuthForAdmin =
  Schakel ten minste één authenticatie-integratie in voor { -product-name } Admin
configure-auth-confirmNoAuthForCommentStream =
  Er is geen authenticatie-integratie ingeschakeld voor de Comment Stream. Wil je echt doorgaan?

configure-auth-facebook-loginWith = Inloggen met Facebook
configure-auth-facebook-toEnableIntegration =
  Om de integratie met Facebook Authenticatie in te schakelen, moet je een webapplicatie aanmaken en instellen.
  Voor meer informatie bezoek: <Link></Link>.
configure-auth-facebook-useLoginOn = Gebruik Facebook-login op

configure-auth-google-loginWith = Inloggen met Google
configure-auth-google-toEnableIntegration =
  Om de integratie met Google Authenticatie in te schakelen, moet je een webapplicatie aanmaken en instellen.
  Voor meer informatie bezoek: <Link></Link>.
configure-auth-google-useLoginOn = Gebruik Google-login op

configure-auth-sso-loginWith = Login with Single Sign On
configure-auth-sso-useLoginOn =  Gebruik Single Sign On-login op
configure-auth-sso-key = Sleutel
configure-auth-sso-regenerate = Opnieuw genereren
configure-auth-sso-regenerateAt = SLEUTEL GEGENEREERD OP:
  { DATETIME($date, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric") }
configure-auth-sso-regenerateHonoredWarning =
  Bij het opnieuw genereren van een sleutel zullen tokens die zijn ondertekend met de vorige sleutel gedurende 30 dagen worden geaccepteerd.

configure-auth-sso-description =
  Om integratie met je bestaande authenticatiesysteem mogelijk te maken, moet je een JWT-token aanmaken om te verbinden.
  Je kunt meer leren over het maken van een JWT-token met <IntroLink>deze inleiding</IntroLink>.
  Raadpleeg onze <DocLink>documentatie</DocLink> voor aanvullende informatie over single sign-on.

configure-auth-sso-rotate-keys = Keys
configure-auth-sso-rotate-keyID = Key ID
configure-auth-sso-rotate-secret = Secret
configure-auth-sso-rotate-copySecret =
  .aria-label = Kopieer Secret

configure-auth-sso-rotate-date =
  { DATETIME($date, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric") }
configure-auth-sso-rotate-activeSince = Actief Sinds
configure-auth-sso-rotate-inactiveAt = Inactief om
configure-auth-sso-rotate-inactiveSince = Inactief sinds

configure-auth-sso-rotate-status = Status
configure-auth-sso-rotate-statusActive = Actief
configure-auth-sso-rotate-statusExpiring = Vervalt binnenkort
configure-auth-sso-rotate-statusExpired = Verlopen
configure-auth-sso-rotate-statusUnknown = Onbekend

configure-auth-sso-rotate-expiringTooltip =
  Een SSO-sleutel vervalt wanneer deze gepland is om te worden geroteerd.
configure-auth-sso-rotate-expiringTooltip-toggleButton =
  .aria-label = Expirende tooltip zichtbaarheid aanpassen
configure-auth-sso-rotate-expiredTooltip =
  Een SSO-sleutel is verlopen wanneer deze niet meer in gebruik is.
configure-auth-sso-rotate-expiredTooltip-toggleButton =
  Verlopen tooltip zichtbaarheid aanpassen

configure-auth-sso-rotate-rotate = Roteer
configure-auth-sso-rotate-deactivateNow = Nu deactiveren
configure-auth-sso-rotate-delete = Verwijderen

configure-auth-sso-rotate-now = Nu
configure-auth-sso-rotate-10seconds = 10 seconden vanaf nu
configure-auth-sso-rotate-1day = 1 dag vanaf nu
configure-auth-sso-rotate-1week = 1 week vanaf nu
configure-auth-sso-rotate-30days = 30 dagen vanaf nu
configure-auth-sso-rotate-dropdown-description =
  .description = Een dropdown om de SSO-sleutel te roteren

configure-auth-local-loginWith = Inloggen met e-mail authenticatie
configure-auth-local-useLoginOn = E-mail authenticatie inloggen gebruiken op
configure-auth-local-forceAdminLocalAuth =
  Admin lokale authenticatie is permanent ingeschakeld.
  Dit is om ervoor te zorgen dat Coral service teams toegang hebben tot het beheerderspaneel.

configure-auth-oidc-loginWith = Inloggen met OpenID Connect
configure-auth-oidc-toLearnMore = Meer informatie: <Link></Link>
configure-auth-oidc-providerName = Naam van de provider
configure-auth-oidc-providerNameDescription =
  De provider van de OpenID Connect-integratie. Dit wordt gebruikt wanneer de naam van de provider
  moet worden weergegeven, bijv. "Inloggen met <Facebook>".
configure-auth-oidc-issuer = Uitgever
configure-auth-oidc-issuerDescription =
  Nadat je je Uitgever informatie heeft ingevoerd, klik je op de Discover-knop om { -product-name }
  de resterende velden in te laten vullen. Je kunt de informatie ook handmatig invoeren.
configure-auth-oidc-authorizationURL = Autorisatie-URL
configure-auth-oidc-tokenURL = Token-URL
configure-auth-oidc-jwksURI = JWKS-URI
configure-auth-oidc-useLoginOn = Gebruik OpenID Connect-login op

configure-auth-settings = Sessie-instellingen
configure-auth-settings-session-duration-label = Duur van sessie

### Moderation

### Recent Comment History

configure-moderation-recentCommentHistory-title = Recente geschiedenis
configure-moderation-recentCommentHistory-timeFrame = Tijdvak recente commentaargeschiedenis
configure-moderation-recentCommentHistory-timeFrame-description =
  Tijdsperiode om het afwijzingspercentage van een commenter te berekenen.
configure-moderation-recentCommentHistory-enabled = Filter voor recente geschiedenis
configure-moderation-recentCommentHistory-enabled-description =
  Voorkomt dat recidivisten reacties kunnen plaatsen zonder goedkeuring.
  Wanneer het afwijzingspercentage van een commenter boven de drempel ligt, worden hun reacties
  naar "In afwachting" gestuurd voor goedkeuring door een moderator. Dit geldt niet voor reacties van
  medewerkers.
configure-moderation-recentCommentHistory-triggerRejectionRate = Drempelwaarde afwijzingspercentage
configure-moderation-recentCommentHistory-triggerRejectionRate-description =
  Afgewezen reacties Ã· (afgewezen reacties + gepubliceerde reacties)
  over de hierboven ingestelde tijd, als een percentage. Het omvat geen reacties die in
  afwachting zijn van moderatie voor toxiciteit, spam of voorafmoderatie.

#### External links for moderators
configure-moderation-externalLinks-title = Externe links voor moderators
configure-moderation-externalLinks-profile-explanation = Wanneer een URL-indeling hieronder is opgenomen,
  worden externe profiellinks toegevoegd aan de gebruikerslade binnen de moderatie-interface.
  Je kunt de indeling $USER_NAME gebruiken om de gebruikersnaam in te voeren of $USER_ID
  om het unieke ID-nummer van de gebruiker in te voegen.
configure-moderation-externalLinks-profile-label = Externe profiel-URL-indeling
configure-moderation-externalLinks-profile-input =
  .placeholder = https://example.com/users/$USER_NAME

#### Pre-Moderation
configure-moderation-preModeration-title = Pre-moderatie
configure-moderation-preModeration-explanation =
  Als pre-moderatie is ingeschakeld, worden reacties niet gepubliceerd tenzij goedgekeurd door een moderator.
configure-moderation-preModeration-moderation =
  Pre-moderate alle reacties
configure-moderation-preModeration-premodLinksEnable =
  Pre-moderate alle reacties die links bevatten

#### Moderation all/specific sites options
configure-moderation-specificSites = Specifieke sites
configure-moderation-allSites = Alle sites

configure-moderation-apiKey = API key

configure-moderation-akismet-title = Spamdetectiefilter
configure-moderation-akismet-explanation =
  De Akismet API-filter waarschuwt gebruikers wanneer een reactie waarschijnlijk spam is.
  Reacties die door Akismet als spam worden beschouwd, worden niet gepubliceerd en worden in de wachtrij geplaatst voor beoordeling door een moderator.
  Als de reactie wordt goedgekeurd door een moderator, wordt deze gepubliceerd.

configure-moderation-premModeration-premodSuspectWordsEnable =
  Pre-moderate alle reacties die een Verdacht Woord bevatten
configure-moderation-premModeration-premodSuspectWordsDescription =
  Je kunt de <wordListLink>Verdachte Woorden lijst inzien of wijzigen</wordListLink>.

#### Akismet
configure-moderation-akismet-filter = Spamdetectiefilter
configure-moderation-akismet-ipBased = IP-gebaseerde spamdetectie
configure-moderation-akismet-accountNote =
  Opmerking: Je moet je actieve domein(en) toevoegen
  aan je Akismet-account: <externalLink>https://akismet.com/account/</externalLink>
configure-moderation-akismet-siteURL = Site-URL


#### Perspective
configure-moderation-perspective-title = Toxiciteitsfilter voor reacties
configure-moderation-perspective-explanation =
  Met behulp van de Perspective API waarschuwt het Toxiciteitsfilter voor reacties gebruikers
  wanneer reacties de vooraf gedefinieerde toxiciteitsdrempel overschrijden.
  Reacties met een toxiciteitsscore boven de drempel
  <strong>worden niet gepubliceerd</strong> en worden in de
  <strong>wachtrij geplaatst voor beoordeling door een moderator</strong>
configure-moderation-perspective-filter = Toxiciteitsfilter voor reacties
configure-moderation-perspective-toxicityThreshold = Toxiciteitsdrempel
configure-moderation-perspective-toxicityThresholdDescription =
  Deze waarde kan worden ingesteld als een percentage tussen 0 en 100. Dit getal vertegenwoordigt de waarschijnlijkheid dat een
  reactie giftig is, volgens de Perspective API. De drempel is standaard ingesteld op { $default }.
configure-moderation-perspective-toxicityModel = Toxiciteitsmodel
configure-moderation-perspective-toxicityModelDescription =
  Kies je Perspective Model. De standaard is { $default }.
  Meer informatie over modelkeuzes vind je <externalLink>hier</externalLink>
configure-moderation-perspective-allowStoreCommentData = Toestaan ​​dat Google reactiegegevens opslaat
configure-moderation-perspective-allowStoreCommentDataDescription =
  Opgeslagen reacties zullen worden gebruikt voor toekomstig onderzoek en community-modelontwikkelingsdoeleinden om
  de API in de loop van de tijd te verbeteren.
configure-moderation-perspective-allowSendFeedback =
  Coral toestaan ​​om moderatieacties naar Google te sturen
configure-moderation-perspective-allowSendFeedbackDescription =
  Verstuurde moderatie acties worden gebruikt voor toekomstig onderzoek en
  modelontwikkeling voor de gemeenschap om de API in de loop der tijd te verbeteren.
configure-moderation-perspective-customEndpoint = Aangepast eindpunt
configure-moderation-perspective-defaultEndpoint =
  Standaard is het eindpunt ingesteld op { $default }. Je kunt dit hier overschrijven.
configure-moderation-perspective-accountNote =
  Voor aanvullende informatie over het instellen van de Perspective Toxic Comment Filter, ga naar:
  <externalLink>https://github.com/conversationai/perspectiveapi#readme</externalLink>

configure-moderation-newCommenters-title = Goedkeuring voor nieuwe commentaar schrijvers
configure-moderation-newCommenters-enable = Goedkeuring voor nieuwe commentaar schrijvers inschakelen
configure-moderation-newCommenters-description =
  Wanneer dit actief is, worden de eerste reacties van een nieuwe commentaar schrijver ter goedkeuring
  naar "In behandeling" gestuurd voor publicatie.
configure-moderation-newCommenters-enable-description = Schakel pre-moderatie in voor nieuwe commentaar schrijvers
configure-moderation-newCommenters-approvedCommentsThreshold = Aantal goedgekeurde commentaren dat nodig is
configure-moderation-newCommenters-approvedCommentsThreshold-description =
  Het aantal commentaren dat een gebruiker moet hebben goedgekeurd voordat deze niet
  meer hoeft te worden voorgecontroleerd.
configure-moderation-newCommenters-comments = reacties

#### Email domain
configure-moderation-emailDomains-header = E-maildomein
configure-moderation-emailDomains-description = Maak regels om actie te ondernemen op accounts of reacties op basis van het e-maildomein van de accounthouder. Actie is alleen van toepassing op nieuw aangemaakte accounts.
configure-moderation-emailDomains-add = E-maildomein toevoegen
configure-moderation-emailDomains-edit = E-maildomein bewerken
configure-moderation-emailDomains-addDomain = <icon>toevoegen</icon> Domein toevoegen
configure-moderation-emailDomains-table-domain = Domein
configure-moderation-emailDomains-table-action = Actie
configure-moderation-emailDomains-table-edit = <icon>bewerken</icon> Bewerken
configure-moderation-emailDomains-table-delete = <icon>verwijderen</icon> Verwijderen
configure-moderation-emailDomains-form-label-domain = Domein
configure-moderation-emailDomains-form-label-moderationAction = Moderatieactie
configure-moderation-emailDomains-banAllUsers = Blokkeer alle nieuwe commenter-accounts
configure-moderation-emailDomains-alwaysPremod = Altijd pre-modereren van reacties
configure-moderation-emailDomains-form-cancel = Annuleren
configure-moderation-emailDomains-form-addDomain = Domein toevoegen
configure-moderation-emailDomains-form-editDomain = Bijwerken
configure-moderation-emailDomains-confirmDelete = Het verwijderen van dit e-maildomein zal ervoor zorgen dat alle nieuwe accounts die hiermee worden aangemaakt niet worden geblokkeerd of altijd pre-gemodereerd. Weet je zeker dat je door wilt gaan?
configure-moderation-emailDomains-form-description-add = Voeg een domein toe en selecteer de actie die moet worden ondernomen bij elk nieuw account dat met het opgegeven domein is aangemaakt.
configure-moderation-emailDomains-form-description-edit = Werk het domein of de actie bij die moet worden ondernomen bij elk nieuw account met het opgegeven domein.

#### Banned Words Configuration
configure-wordList-banned-bannedWordsAndPhrases = Zwarte woordenlijst
configure-wordList-banned-explanation =
  Reacties met een woord erin dat op de zwarte woordenlijst staat worden <strong>automatisch afgekeurd</strong>.
configure-wordList-banned-wordList = Zwarte woordenlijst
configure-wordList-banned-wordListDetailInstructions =
  Scheid de woorden of zinsneden door middel van een enter. Woorden/zinsnedes zijn niet hoofdlettergevoelig.

#### Suspect Words Configuration
configure-wordList-suspect-bannedWordsAndPhrases = Grijze woordenlijst
configure-wordList-suspect-explanation =
  Reacties met een woord erin dat op de grijze woordenlijst staan worden automatisch naar Pre-moderatie gestuurd en worden niet gepubliceerd totdat zij goedgekeurd zijn door een moderator.
configure-wordList-suspect-explanationSuspectWordsList =
  Reacties met een woord erin dat op de grijze woordenlijst staan worden automatisch naar Pre-moderatie gestuurd en worden niet gepubliceerd totdat zij goedgekeurd zijn door een moderator.
configure-wordList-suspect-wordList = Grijze woordenlijst
configure-wordList-suspect-wordListDetailInstructions =
  Scheid de woorden of zinsneden door middel van een enter. Woorden/zinsnedes zijn niet hoofdlettergevoelig.

### Advanced
configure-advanced-customCSS = Aangepaste CSS
configure-advanced-customCSS-override =
  URL van een CSS-stijlblad dat de standaard Embed Stream-stijlen zal overschrijven.
configure-advanced-customCSS-stylesheetURL = URL van aangepast CSS-stijlblad
configure-advanced-customCSS-fontsStylesheetURL = URL van aangepast CSS-stijlblad voor lettertypen
configure-advanced-customCSS-containsFontFace =
  URL naar een aangepast CSS-stijlblad dat alle @font-face definities bevat die nodig zijn door het bovenstaande stijlblad.

configure-advanced-permittedDomains = Toegestane domeinen
configure-advanced-permittedDomains-description =
  Domeinen waarop je { -product-name } instantie is toegestaan om te worden ingebed
  inclusief het schema (bijv. http://localhost:3000, https://staging.domain.com,
  https://domain.com).

configure-advanced-liveUpdates = Live updates voor commentaar stream
configure-advanced-liveUpdates-explanation =
  Wanneer ingeschakeld, zal er real-time laden en bijwerken van reacties zijn.
  Wanneer uitgeschakeld, moeten gebruikers de pagina vernieuwen om nieuwe reacties te zien.

configure-advanced-embedCode-title = Insluitcode
configure-advanced-embedCode-explanation =
  Kopieer en plak de onderstaande code in je CMS om Coral-commentaarstreams in te sluiten
  in elk van de artikelen van je site.

configure-advanced-embedCode-comment =
  Verwijder de commentaartekens bij deze regels en vervang de ID van het artikel en de URL van je CMS om de meest nauwkeurige integratie te bieden.
  Raadpleeg onze documentatie op https://docs.coralproject.net voor alle configuratie-opties.

configure-advanced-amp = Accelerated Mobile Pages
configure-advanced-amp-explanation =
  Schakel ondersteuning in voor <LinkToAMP>AMP</LinkToAMP> op de reactietroom.
  Zodra dit is ingeschakeld, moet je Corals AMP-inbedcode toevoegen aan je paginasjabloon.
  Zie onze <LinkToDocs>documentatie</LinkToDocs> voor meer details. Schakel Ondersteuning inschakelen.

configure-advanced-for-review-queue = Bekijk alle gebruikersrapporten
configure-advanced-for-review-queue-explanation =
  Zodra een reactie is goedgekeurd, verschijnt deze niet meer in de gerapporteerde wachtrij, zelfs als er extra gebruikers reacties melden.
  Deze functie voegt een "Voor review" wachtrij toe, waarmee moderators alle gebruikersrapporten in het systeem kunnen zien en ze handmatig kunnen markeren als "Beoordeeld".
configure-advanced-for-review-queue-label = Toon "Voor review" wachtrij

## Decision History
decisionHistory-popover =
  .description = Een dialoogvenster met de beslissingsgeschiedenis
decisionHistory-youWillSeeAList =
  Hier zie je een lijst van de moderatie-acties die je hebt uitgevoerd.
decisionHistory-showMoreButton =
  Toon Meer
decisionHistory-yourDecisionHistory = Jouw modereer geschiedenis
decisionHistory-rejectedCommentBy = Afgekeurde reactie van <Username></Username>
decisionHistory-approvedCommentBy = Goedgekeurde reactie van <Username></Username>
decisionHistory-goToComment = Ga naar reactie

### Slack

configure-slack-header-title = Slack-integraties
configure-slack-description =
  Stuur automatisch reacties vanuit Coral moderatie-wachtrijen naar Slack-kanalen.
  Je hebt Slack-beheerdersrechten nodig om dit in te stellen.
  Raadpleeg onze <externalLink>documentatie</externalLink> voor stappen over hoe je een Slack-app kunt maken.
configure-slack-notRecommended =
  Niet aanbevolen voor sites met meer dan 10.000 reacties per maand.
configure-slack-addChannel = Kanaal toevoegen

configure-slack-channel-defaultName = Nieuw kanaal
configure-slack-channel-enabled = Ingeschakeld
configure-slack-channel-remove = Kanaal verwijderen
configure-slack-channel-name-label = Naam
configure-slack-channel-name-description =
  Dit is alleen ter informatie, om elke Slack-verbinding gemakkelijk te identificeren. Slack vertelt ons niet de naam van het kanaal/de kanalen waarmee je verbinding maakt met Coral.
configure-slack-channel-hookURL-label = Webhook-URL
configure-slack-channel-hookURL-description =
  Slack biedt een kanaalspecifieke URL om webhook-verbindingen te activeren. Volg de instructies <externalLink>hier</externalLink> om de URL voor een van je Slack-kanalen te vinden.
configure-slack-channel-triggers-label =
  Ontvang meldingen in dit Slack-kanaal voor
configure-slack-channel-triggers-reportedComments = Gerapporteerde Reacties
configure-slack-channel-triggers-pendingComments = Pre-mod Reacties
configure-slack-channel-triggers-featuredComments = Uitgelichte Reacties
configure-slack-channel-triggers-allComments = Alle Reacties
configure-slack-channel-triggers-staffComments = Beheerder Reacties

## moderate
moderate-navigation-reported = Gerapporteerd
moderate-navigation-pending = Pre-moderatie
moderate-navigation-unmoderated = Ongemodereerd
moderate-navigation-rejected = Afgewezen
moderate-navigation-approved = Goedgekeurd
moderate-navigation-comment-count = { SHORT_NUMBER($count) }
moderate-navigation-forReview = Gerapporteerd

moderate-marker-preMod = Pre-mod
moderate-marker-link = Link
moderate-marker-bannedWord = Verboden Woord
moderate-marker-bio = Bio
moderate-marker-possibleBannedWord = Mogelijk Verboden Woord
moderate-marker-suspectWord = Verdacht Woord
moderate-marker-possibleSuspectWord = Mogelijk Verdacht Woord
moderate-marker-spam = Spam
moderate-marker-spamDetected = Spam gedetecteerd
moderate-marker-toxic = Toxic
moderate-marker-recentHistory = Recente geschiedenis
moderate-marker-bodyCount = Body count
moderate-marker-offensive = Aanstootgevend (Offensive)
moderate-marker-abusive = Aanstootgevend (Abusive)
moderate-marker-newCommenter = Nieuwe reageerder
moderate-marker-repeatPost = Herhaalde reactie
moderate-marker-other = Anders

moderate-markers-details = Details
moderate-flagDetails-latestReports = Laatste rapportages
moderate-flagDetails-offensive = Aanstootgevend (offensive)
moderate-flagDetails-abusive = Aanstootgevend (Abusive)
moderate-flagDetails-spam = Spam
moderate-flagDetails-bio = Bio
moderate-flagDetails-other = Anders

moderate-flagDetails-toxicityScore = Toxicity Score
moderate-toxicityLabel-likely = Likely <score></score>
moderate-toxicityLabel-unlikely = Unlikely <score></score>
moderate-toxicityLabel-maybe = Maybe <score></score>

moderate-linkDetails-label = Kopieer link naar deze reactie
moderate-in-stream-link-copy = Op de website
moderate-in-moderation-link-copy = In Moderatie

moderate-emptyQueue-pending = Gefeliciteerd! Er zijn geen reacties meer in behandeling om te modereren.
moderate-emptyQueue-reported = Chapeau! Er zijn geen reacties meer gerapporteerd om te modereren.
moderate-emptyQueue-unmoderated = Keurig gedaan! Alle reacties zijn gemodereerd.
moderate-emptyQueue-rejected = Er zijn geen afgewezen reacties.
moderate-emptyQueue-approved = Er zijn geen goedgekeurde reacties.

moderate-comment-edited = (gewijzigd)
moderate-comment-inReplyTo = Antwoord op <Username></Username>
moderate-comment-viewContext = Toon Context
moderate-comment-viewConversation = Bekijk Discussie
moderate-comment-rejectButton =
  .aria-label = Afwijzen
moderate-comment-approveButton =
  .aria-label = Goedkeuren
moderate-comment-decision = Beslissing
moderate-comment-story = Artikel
moderate-comment-storyLabel = Reactie Bij
moderate-comment-moderateStory = Modereer Artikel
moderate-comment-featureText = Uitlichten
moderate-comment-featuredText = Uitgelicht
moderate-comment-moderatedBy = Gemodereerd door
moderate-comment-moderatedBySystem = Systeem
moderate-comment-play-gif = Toon GIF
moderate-comment-load-video = Laad Video

moderate-single-goToModerationQueues = Ga na de moderatie wachtrijen
moderate-single-singleCommentView = Toon Enkele Reactie

moderate-queue-viewNew =
  { $count ->
    [1] Toon {$count} nieuwe reactie
    *[other] Toon {$count} nieuwe reacties
  }

moderate-comment-deleted-body =
  Deze reactie is niet meer beschikbaar. De reageerder heeft zijn account verwijderd.

### Moderate Search Bar
moderate-searchBar-allStories = Alle artikelen
  .title = Alle artikelen
moderate-searchBar-noStories = We konden geen artikelen vinden die aan je criteria voldoen
moderate-searchBar-stories = Artikelen:
moderate-searchBar-searchButton = Zoek
moderate-searchBar-titleNotAvailable =
  .title = Titel is niet beschikbaar
moderate-searchBar-comboBox =
  .aria-label = Zoek of spring naar het artikelen
moderate-searchBar-searchForm =
  .aria-label = Artikelen
moderate-searchBar-currentlyModerating =
  .title = Momenteel aan het modereren
moderate-searchBar-searchResults = Zoekresultaten
moderate-searchBar-searchResultsMostRecentFirst = Zoekresultaten (Meest recente eerst)
moderate-searchBar-searchResultsMostRelevantFirst = Zoekresultaten (Meest relevante eerst)
moderate-searchBar-moderateAllStories = Modereer alle artikelen
moderate-searchBar-comboBoxTextField =
  .aria-label = Zoek of spring naar het artikel...
  .placeholder = zoek op artikelnaam, auteur, url, id, etc.
moderate-searchBar-goTo = Ga naar
moderate-searchBar-seeAllResults = Toon alle resultaten

moderateCardDetails-tab-info = Informatie
moderateCardDetails-tab-edits = Wijzig geschiedenis
moderateCardDetails-tab-automatedActions = Geautomatiseerde acties
moderateCardDetails-tab-reactions = Reacties
moderateCardDetails-tab-reactions-loadMore = Laad Meer
moderateCardDetails-tab-noIssuesFound = Geen problemen gevonden
moderateCardDetails-tab-missingPhase = Was niet uitgevoerd

moderateCardDetails-tab-externalMod-status = Status
moderateCardDetails-tab-externalMod-flags = Flags
moderateCardDetails-tab-externalMod-tags = Tags

moderateCardDetails-tab-externalMod-none = Geen
moderateCardDetails-tab-externalMod-approved = Goedgekeurd
moderateCardDetails-tab-externalMod-rejected = Afgekeurd
moderateCardDetails-tab-externalMod-premod = Pre-moderatie
moderateCardDetails-tab-externalMod-systemWithheld = Systeem ingehouden

### Moderate User History Drawer

moderate-user-drawer-email =
  .title = E-mailadres
moderate-user-drawer-created-at =
  .title = Aanmaakdatum account
moderate-user-drawer-member-id =
  .title = Gebruikers ID
moderate-user-drawer-external-profile-URL =
  .title = Externe profiel URL
moderate-user-drawer-external-profile-URL-link = Externe profiel URL
moderate-user-drawer-tab-all-comments = Alle Reacties
moderate-user-drawer-tab-rejected-comments = Afgekeurd
moderate-user-drawer-tab-account-history = Accountgeschiedenis
moderate-user-drawer-tab-notes = Notities
moderate-user-drawer-load-more = Meer laden
moderate-user-drawer-all-no-comments = {$username} heeft geen reacties ingediend.
moderate-user-drawer-rejected-no-comments = {$username} heeft geen afgewezen reacties.
moderate-user-drawer-user-not-found = Gebruiker niet gevonden.
moderate-user-drawer-status-label = Status:
moderate-user-drawer-bio-title = Gebruikers biografie
moderate-user-drawer-username-not-available = Gebruikersnaam niet beschikbaar
moderate-user-drawer-username-not-available-tooltip-title = Gebruikersnaam niet beschikbaar
moderate-user-drawer-username-not-available-tooltip-body = De gebruiker heeft het accountconfiguratieproces niet voltooid

moderate-user-drawer-account-history-system = <icon>computer</icon> Systeem
moderate-user-drawer-account-history-suspension-ended = De schorsing is beÃ«indigd
moderate-user-drawer-account-history-suspension-removed = Schorsing verwijderd
moderate-user-drawer-account-history-banned = Verbannen
moderate-user-drawer-account-history-ban-removed = Ban verwijderd
moderate-user-drawer-account-history-site-banned = Site verbannen
moderate-user-drawer-account-history-site-ban-removed = Site verbanning verwijderd
moderate-user-drawer-account-history-no-history = Er zijn geen acties ondernomen op dit account

moderate-user-drawer-username-change = Gebruikersnaam aanpassing
moderate-user-drawer-username-change-new = Nieuw:
moderate-user-drawer-username-change-old = Oud:

moderate-user-drawer-account-history-premod-set = Altijd pre-modereren
moderate-user-drawer-account-history-premod-removed = Pre-modereren verwijderd

moderate-user-drawer-account-history-modMessage-sent = Gebruiker bericht
moderate-user-drawer-account-history-modMessage-acknowledged = Bericht bevestigd op { $acknowledgedAt }

moderate-user-drawer-suspension =
  Schorsing, { $value } { $unit ->
    [second] { $value ->
      [1] seconde
      *[other] seconden
    }
    [minute] { $value ->
      [1] minuut
      *[other] minuten
    }
    [hour] { $value ->
      [1] uur
      *[other] uur
    }
    [day] { $value ->
      [1] dag
      *[other] dagen
    }
    [week] { $value ->
      [1] week
      *[other] weken
    }
    [month] { $value ->
      [1] maand
      *[other] maanden
    }
    [year] { $value ->
      [1] jaar
      *[other] jaren
    }
    *[other] onbekende eenheid
  }


moderate-user-drawer-recent-history-title = Recente reactiegeschiedenis
moderate-user-drawer-recent-history-calculated =
  Berekent onver de laatste { framework-timeago-time }
moderate-user-drawer-recent-history-rejected = Afgekeurd
moderate-user-drawer-recent-history-tooltip-title = Hoe is dit berekent?
moderate-user-drawer-recent-history-tooltip-body =
  Afgekeurde reacties Ã· (afgekeurede reacties + geaccepteerde reacties).
  De drempel kan door beheerders worden gewijzigd in Instellen > Moderatie.
moderate-user-drawer-recent-history-tooltip-button =
  .aria-label = Schakel tooltip recente reactiegeschiedenis in
moderate-user-drawer-recent-history-tooltip-submitted = Ingediend

moderate-user-drawer-notes-field =
  .placeholder = Laat een notitie achter...
moderate-user-drawer-notes-button = Notitie toevoegen
moderatorNote-left-by = Achtergelaten door
moderatorNote-delete = Verwijder

moderate-user-drawer-all-comments-archiveThreshold-allOfThisUsers =
  Alle reacties van deze gebruiker van afgelopen { $value } { $unit ->
    [second] { $value ->
      [1] seconde
      *[other] seconden
    }
    [minute] { $value ->
      [1] minuut
      *[other] minuten
    }
    [hour] { $value ->
      [1] uur
      *[other] uren
    }
    [day] { $value ->
      [1] dag
      *[other] dagen
    }
    [week] { $value ->
      [1] week
      *[other] weken
    }
    [month] { $value ->
      [1] maand
      *[other] maanden
    }
    [year] { $value ->
      [1] jaar
      *[other] jaren
    }
    *[other] onbekende eenheid
  }.

# For Review Queue

moderate-forReview-reviewedButton =
  .aria-label = Beoordeeld
moderate-forReview-markAsReviewedButton =
  .aria-label = Markeer als beoordeeld
moderate-forReview-time = Tijd
moderate-forReview-comment = Reactie
moderate-forReview-reportedBy = Gerapporteerd door
moderate-forReview-reason = Reden
moderate-forReview-description = Omschrijving
moderate-forReview-reviewed = Beoordeeld

moderate-forReview-detectedBannedWord = Verboden woord
moderate-forReview-detectedLinks = Links
moderate-forReview-detectedNewCommenter = Nieuwe reageerder
moderate-forReview-detectedPreModUser = Pre-moderate door gebruiker
moderate-forReview-detectedRecentHistory = Recente geschiedenis
moderate-forReview-detectedRepeatPost = Herhalende post
moderate-forReview-detectedSpam = Spam
moderate-forReview-detectedSuspectWord = Verdacht woord
moderate-forReview-detectedToxic = Grof taalgebruik
moderate-forReview-reportedAbusive = Aanstootgevend (abusive)
moderate-forReview-reportedBio = Biografie van gebruiker
moderate-forReview-reportedOffensive = Aanstootgevend (offensive)
moderate-forReview-reportedOther = Anders
moderate-forReview-reportedSpam = Spam

# Archive

moderate-archived-queue-title = Dit artikel is gearchiveerd
moderate-archived-queue-noModerationActions =
  Er kunnen geen moderatie-acties worden uitgevoerd op de reacties wanneer een artikel is gearchiveerd.
moderate-archived-queue-toPerformTheseActions =
  Om deze acties uit te voeren, moet het artikel worden gedearchiveerd.

## Community
community-emptyMessage = We konden niemand in je gemeenschap vinden die aan je criteria voldoet.

community-filter-searchField =
  .placeholder = Zoek op gebruikersnaam of e-mailadres...
  .aria-label = Zoek op gebruikersnaam of e-mailadres
community-filter-searchButton =
  .aria-label = Zoek

community-filter-roleSelectField =
  .aria-label = Zoek op rol

community-filter-statusSelectField =
  .aria-label = Zoek op gebruikersstatus

community-changeRoleButton =
  .aria-label = Rol wijzigen

community-assignMySitesToModerator = Moderator toewijzen aan mijn sites
community-removeMySitesFromModerator = Moderator verwijderen van mijn sites
community-assignMySitesToMember = Lid toewijzen aan mijn sites
community-removeMySitesFromMember = Lid verwijderen van mijn sites
community-stillHaveSiteModeratorPrivileges = Ze behouden nog steeds de Site Moderator-bevoegdheden voor:
community-stillHaveMemberPrivileges = Ze behouden nog steeds de Lid-bevoegdheden voor:
community-userNoLongerPermitted = De gebruiker mag geen moderatiebeslissingen meer nemen of schorsingen toewijzen op:
community-memberNoLongerPermitted = De gebruiker ontvangt geen Lid-bevoegdheden meer op:
community-assignThisUser = Wijs deze gebruiker toe aan
community-assignYourSitesTo = Wijs je sites toe aan <strong>{ $username }</strong>
community-siteModeratorsArePermitted = Site-moderators mogen moderatiebeslissingen nemen en schorsingen toewijzen op de sites waaraan ze zijn toegewezen.
community-membersArePermitted = Leden mogen een badge ontvangen op de sites waaraan ze zijn toegewezen.
community-removeSiteModeratorPermissions = Verwijder Site Moderator-bevoegdheden
community-removeMemberPermissions = Verwijder Lid-bevoegdheden

community-filter-optGroupAudience =
  .label = Publiek
community-filter-optGroupOrganization =
  .label = Organisatie
community-filter-search = Zoek
community-filter-showMe = Laat zien
community-filter-allRoles = Alle Rollen
community-filter-allStatuses = Alle Statussen

community-column-username = Gebruikersnaam
community-column-username-not-available = Gebruikersnaam is niet beschikbaar
community-column-email-not-available = E-mailadres is niet beschikbaar
community-column-username-deleted = Verwijderd
community-column-email = E-mailadres
community-column-memberSince = Lid sinds
community-column-role = Rol
community-column-status = Status

community-role-popover =
  .description = Een dropdown om de gebruikersrol te wijzigen

community-siteRoleActions-popover =
  .description = Een dropdown om een gebruiker te bevorderen/degraderen tot/van sites

community-userStatus-popover =
  .description = Een dropdown om de gebruikersstatus te wijzigen

community-userStatus-manageBan = Beheer Ban
community-userStatus-suspendUser = Schors Gebruiker
community-userStatus-suspend = Schors
community-userStatus-suspendEverywhere = Schors overal
community-userStatus-removeSuspension = Verwijder schorsing
community-userStatus-removeUserSuspension = Verwijder schorsing
community-userStatus-unknown = Onbekend
community-userStatus-changeButton =
  .aria-label = Wijzig gebruiker status
community-userStatus-premodUser = Altijd pre-modereren
community-userStatus-removePremod = Verwijder pre-modereren
community-userStatus-warnEverywhere = Waarschuw Overal
community-userStatus-warn = Waarschuw
community-userStatus-message = Stuur bericht


community-banModal-allSites-title = Weet je zeker dat je <username></username> wilt verbannen?
community-banModal-banEmailDomain = Blokkeer alle nieuwe accounts op { $domain }
community-banModal-specificSites-title = Weet je zeker dat je de verbanningsstatus van <username></username> wilt beheren?
community-banModal-noSites-title = Weet je zeker dat je de verbanning van <username></username> wilt opheffen?
community-banModal-allSites-consequence =
  Nadat deze persoon verbannen is, zal hij/zij geen reacties meer kunnen plaatsen, reacties geven, of reacties rapporteren.
community-banModal-noSites-consequence =
  Nadat deze persoon weer toegestaan is, zal hij/zij weer reacties kunnen plaatsen, reacties geven, en reacties rapporteren.
community-banModal-specificSites-consequence =
  Deze actie zal van invloed zijn op welke sites de gebruiker reacties kan plaatsen, reacties kan geven en reacties kan rapporteren.
community-banModal-cancel = Annuleren
community-banModal-updateBan = Opslaan
community-banModal-ban = Verbannen
community-banModal-unban = Verbanning opheffen
community-banModal-customize = Aanpassen van de verbannings-e-mailbericht
community-banModal-reject-existing = Alle reacties van deze gebruiker afwijzen
community-banModal-reject-existing-specificSites = Alle reacties op deze sites afwijzen
community-banModal-reject-existing-singleSite = Alle reacties op deze site afwijzen

community-banModal-noSites = Geen sites
community-banModal-banFrom = Verbannen vanaf
community-banModal-allSites = Alle sites
community-banModal-specificSites = Specifieke sites

community-suspendModal-areYouSure = Schors <strong>{ $username }</strong>?
community-suspendModal-consequence =
  Eenmaal geschorst, kan deze gebruiker niet langer reageren, respect geven,
  of reacties rapporteren.
community-suspendModal-duration-3600 = 1 uur
community-suspendModal-duration-10800 = 3 uur
community-suspendModal-duration-86400 = 24 uur
community-suspendModal-duration-604800 = 7 dagen
community-suspendModal-cancel = Annuleren
community-suspendModal-suspendUser = Schors Gebruiker
community-suspendModal-emailTemplate =
  Hallo { $username },

  In overeenstemming met de communityrichtlijnen van { $organizationName } is je account tijdelijk geschorst. Tijdens de schorsing kun je geen reacties geven, markeren of contact opnemen met andere reageerders. Neem over { framework-timeago-time } opnieuw deel aan het gesprek.

community-suspendModal-customize = E-mailbericht aanpassen

community-suspendModal-success =
  <strong>{ $username }</strong> is geschorst voor <strong>{ $duration }</strong>

community-suspendModal-success-close = Afsluiten
community-suspendModal-selectDuration = Kies schorsings duur

community-premodModal-areYouSure =
  Weet je zeker dat je <strong>{ $username }</strong> altijd vooraf wilt modereren?
community-premodModal-consequence =
  Alle reacties zullen naar de Wachtende rij gaan totdat je deze status verwijdert.
community-premodModal-cancel = Annuleren
community-premodModal-premodUser = Ja, altijd vooraf modereren

community-siteRoleModal-assignSites =
  Toewijzen van sites voor <strong>{ $username }</strong>
community-siteRoleModal-assignSitesDescription-siteModerator =
  Site-moderatoren zijn toegestaan om moderatiebeslissingen te nemen en schorsingen uit te geven op de sites waarop ze zijn toegewezen.
community-siteRoleModal-cancel = Annuleren
community-siteRoleModal-update = Bijwerken
community-siteRoleModal-selectSites-siteModerator = Selecteer sites om te modereren
community-siteRoleModal-selectSites-member = Selecteer sites waarvan deze gebruiker lid moet worden
community-siteRoleModal-noSites = Geen sites

community-invite-inviteMember = Nodig leden uit voor je organisatie
community-invite-emailAddressLabel = E-mailadres:
community-invite-inviteMore = Nodig meer mensen uit
community-invite-inviteAsLabel = Uitnodigen als:
community-invite-sendInvitations = Verstuur uitnodigingen
community-invite-role-staff =
  <strong>Medewerker-rol:</strong> Ontvangt een Medewerker-badge en
  reacties worden automatisch goedgekeurd. Kan geen moderatie doen
  of { -product-name } configuratie veranderen.
community-invite-role-moderator =
  <strong>Moderator-rol:</strong> Ontvangt een Medewerker-badge en
  reacties worden automatisch goedgekeurd. Heeft volledige moderatie bevoegdheden (reacties goedkeuren, afwijzen en uitlichten). Kan individuele artikelen configureren maar heeft geen site-brede configuratiebevoegdheden.
community-invite-role-admin =
  <strong>Beheerder-rol:</strong> Ontvangt een Medewerker-badge en
  reacties worden automatisch goedgekeurd. Heeft volledige moderatie bevoegdheden (reacties goedkeuren, afwijzen en uitlichten). Kan individuele artikelen en site-brede configuraties aanpassen.
community-invite-invitationsSent = Je uitnodigingen zijn verstuurd!
community-invite-close = Sluit
community-invite-invite = Uitnodigen

community-warnModal-success =
  Een waarschuwing is gestuurd naar <strong>{ $username }</strong>.
community-warnModal-success-close = Ok
community-warnModal-areYouSure = Waarschuw <strong>{ $username }</strong>?
community-warnModal-consequence =
  Een waarschuwing kan het gedrag van een reageerder verbeteren zonder een schorsing of ban.
  De gebruiker moet de waarschuwing erkennen voordat hij/zij verder kan reageren.
community-warnModal-message-label = Bericht
community-warnModal-message-required = Vereist
community-warnModal-message-description = Leg deze gebruiker uit hoe hij/zij zijn/haar gedrag op je site moet aanpassen.
community-warnModal-cancel = Annuleren
community-warnModal-warnUser = Gebruiker waarschuwen
community-userStatus-warn = Waarschuwen
community-userStatus-warnEverywhere = Overal waarschuwen
community-userStatus-message = Bericht

community-modMessageModal-success = Een bericht is gestuurd naar <strong>{ $username }</strong>.
community-modMessageModal-success-close = Ok
community-modMessageModal-areYouSure = Stuur een bericht naar <strong>{ $username }</strong>?
community-modMessageModal-consequence = Stuur een bericht naar een reageerder dat alleen voor hem/haar zichtbaar is.
community-modMessageModal-message-label = Bericht
community-modMessageModal-message-required = Vereist
community-modMessageModal-cancel = Annuleren
community-modMessageModal-messageUser = Gebruiker berichten

## Stories
stories-emptyMessage = Er zijn momenteel geen gepubliceerde artikelen.
stories-noMatchMessage = We konden geen artikelen vinden die overeenkomen met je criteria.

stories-filter-searchField =
  .placeholder = Zoek op artikelnaam of auteur...
  .aria-label = Zoek op artikelnaam of auteur
stories-filter-searchButton =
  .aria-label = Zoek

stories-filter-statusSelectField =
  .aria-label = Zoek op status

stories-changeStatusButton =
  .aria-label = Wijzig status

stories-filter-search = Zoek
stories-filter-showMe = Toon
stories-filter-allStories = Alle artikelen
stories-filter-openStories = Open Artikelen
stories-filter-closedStories = Gesloten Artikelen

stories-column-title = Artikel
stories-column-author = Auteur
stories-column-publishDate = Gepubliseerd
stories-column-status = Status
stories-column-clickToModerate = Klik op de kop stuk te modereren
stories-column-reportedCount = Gerapporteerd
stories-column-pendingCount = Pre-mod
stories-column-publishedCount = Goedgekeurd

stories-status-popover =
  .description = Een dropdown om de artikelstatus te wijzigen.

storyInfoDrawer-rescrapeTriggered = Triggered
storyInfoDrawer-triggerRescrape = Haal metadata op
storyInfoDrawer-title = Artikel Details
storyInfoDrawer-titleNotAvailable = Artikelnaam niet beschikbaar
storyInfoDrawer-authorNotAvailable = Auteur niet beschikbaar
storyInfoDrawer-publishDateNotAvailable = Publiseer datum niet beschikbaar
storyInfoDrawer-scrapedMetaData = Scraped metadata
storyInfoDrawer-configure = Configureren
storyInfoDrawer-storyStatus-open = Open
storyInfoDrawer-storyStatus-closed = Gesloten
storyInfoDrawer-moderateStory = Modereer
storyInfoDrawerSettings-premodLinksEnable = Pre-modereer reacties die links bevatten
storyInfoDrawerSettings-premodCommentsEnable = Pre-modereer alle reacties
storyInfoDrawerSettings-moderation = Moderatie
storyInfoDrawerSettings-moderationMode-pre = Pre
storyInfoDrawerSettings-moderationMode-post = Post
storyInfoDrawerSettings-update = Update
storyInfoDrawer-storyStatus-archiving = Archiveren
storyInfoDrawer-storyStatus-archived = Gearchiveerd
storyInfoDrawer-cacheStory-recache = Recache artikel
storyInfoDrawer-cacheStory-recaching = Recaching
storyInfoDrawer-cacheStory-cached = Cached
storyInfoDrawer-cacheStory-uncacheStory = Uncache artikel
storyInfoDrawer-cacheStory-uncaching = Uncaching

## Invite

invite-youHaveBeenInvited = Je bent uitgenodigd om lid te worden van { $organizationName }.
invite-finishSettingUpAccount = Voltooi het instellen van het account voor:
invite-createAccount = Account aanmaken
invite-passwordLabel = Wachtwoord
invite-passwordDescription = Moet minimaal { $minLength } tekens bevatten.
invite-passwordTextField =
  .placeholder = Wachtwoord
invite-usernameLabel = Gebruikersnaam
invite-usernameDescription = Je kunt “_” en “.” gebruiken.
invite-usernameTextField =
  .placeholder = Gebruikersnaam
invite-oopsSorry = Oeps sorry!
invite-successful = Je account is aangemaakt.
invite-youMayNowSignIn = Je kunt nu inloggen op { -product-name } met behulp van:
invite-goToAdmin = Ga naar { -product-name } Admin
invite-goToOrganization = Ga naar { $organizationName }
invite-tokenNotFound =
  De opgegeven link is ongeldig, controleer of deze correct is gekopieerd.

userDetails-banned-on = <strong>Verbannen op</strong> { $timestamp }
userDetails-banned-by = <strong>door</strong> { $username }
userDetails-suspended-by = <strong>Geschorst door</strong> { $username }
userDetails-suspension-start = <strong>Start:</strong> { $timestamp }
userDetails-suspension-end = <strong>Einde:</strong> { $timestamp }

userDetails-warned-on = <strong>Gewaarschuwd op</strong> { $timestamp }
userDetails-warned-by = <strong>door</strong> { $username }
userDetails-warned-explanation = Gebruiker heeft de waarschuwing niet erkend.

configure-general-reactions-title = Reacties
configure-general-reactions-explanation =
  Laat je community met elkaar in contact komen en zich uiten
  met één klik reacties. Standaard staat Coral toe dat reageerders
  elkaars reacties "Respecteren".
configure-general-reactions-label = Label voor reactie
configure-general-reactions-input =
  .placeholder = Bijv. Respect
configure-general-reactions-active-label = Actieve label voor reactie
configure-general-reactions-active-input =
  .placeholder = Bijv. Gerespecteerd
configure-general-reactions-sort-label = Sorteren op label
configure-general-reactions-sort-input =
  .placeholder = Bijv. Meest Gerespecteerd
configure-general-reactions-preview = Voorbeeld
configure-general-reaction-sortMenu-sortBy = Sorteren op

configure-general-badges-title = Lidmaatschap badges
configure-general-badges-explanation =
  Toon een aangepaste badge voor gebruikers met specifieke rollen. Deze badge wordt
  weergegeven in de reactiestroom en in de beheerdersinterface.
configure-general-badges-label = Badge tekst
configure-general-badges-staff-member-input =
.placeholder = Bijv. Staff
configure-general-badges-moderator-input =
.placeholder = Bijv. Moderator
configure-general-badges-admin-input =
.placeholder = Bijv. Admin
configure-general-badges-member-input =
.placeholder = Bijv. Lid
configure-general-badges-preview = Voorbeeld
configure-general-badges-staff-member-label = Tekst voor Staff lidmaatschap badge
configure-general-badges-admin-label = Tekst voor Admin badge
configure-general-badges-moderator-label = Tekst voor Moderator badge
configure-general-badges-member-label = Tekst voor Lidmaatschap badge

configure-general-rte-title = Rich-text reacties
configure-general-rte-express = Geef je community meer manieren om zichzelf uit te drukken dan alleen platte tekst met rijke opmaak.
configure-general-rte-richTextComments = Rich-text reacties
configure-general-rte-onBasicFeatures = Aan - vet, cursief, blokcitaten en opsommingstekens
configure-general-rte-additional = Extra rijke opmaak opties
configure-general-rte-strikethrough = Doorhalen
configure-general-rte-spoiler = Spoiler
configure-general-rte-spoilerDesc =
  Woorden en zinnen opgemaakt als Spoiler worden achter een
  donkere achtergrond verborgen totdat de lezer ervoor kiest om de tekst te onthullen.

configure-account-features-title = Beheerfuncties voor commentaargebruikers
configure-account-features-explanation =
  Je kunt bepaalde functies in- en uitschakelen voor commentaargebruikers
  binnen hun profiel. Deze functies dragen ook bij aan GDPR-naleving.
configure-account-features-allow = Sta gebruikers toe om:
configure-account-features-change-usernames = Hun gebruikersnaam te wijzigen
configure-account-features-change-usernames-details = Gebruikersnamen kunnen om de 14 dagen worden gewijzigd.
configure-account-features-yes = Ja
configure-account-features-no = Nee
configure-account-features-download-comments = Hun reacties te downloaden
configure-account-features-download-comments-details = Commentatoren kunnen een CSV-bestand downloaden van hun reactiegeschiedenis.
configure-account-features-delete-account = Hun account te verwijderen
configure-account-features-delete-account-details =
  Verwijdert alle reactie-gegevens, gebruikersnaam en e-mailadres van de site en de database.

configure-account-features-delete-account-fieldDescriptions =
  Verwijdert alle reactie-gegevens, gebruikersnaam en e-mailadres
  van de site en de database.

configure-advanced-stories = Artikelcreatie
configure-advanced-stories-explanation = Geavanceerde instellingen voor hoe artikelen worden gemaakt binnen Coral.
configure-advanced-stories-lazy = Lazy artikel-creatie
configure-advanced-stories-lazy-detail = Schakel artikelen in die automatisch worden aangemaakt wanneer ze worden gepubliceerd vanuit je CMS.
configure-advanced-stories-scraping = Story scraping
configure-advanced-stories-scraping-detail = Schakel in dat artikelmetadata automatisch wordt gescraped wanneer deze vanuit je CMS worden gepubliceerd.
configure-advanced-stories-proxy = Scraper proxy-URL
configure-advanced-stories-proxy-detail =
  Wanneer gespecificeerd, kunnen scraping-verzoeken de opgegeven
  proxy gebruiken. Alle verzoeken worden dan via de juiste
  proxy geleid zoals geïnterpreteerd door het <externalLink>npm proxy-agent</externalLink> pakket.
configure-advanced-stories-custom-user-agent = Aangepaste scraper User Agent-header
configure-advanced-stories-custom-user-agent-detail =
  Wanneer gespecificeerd, wordt de <code>User-Agent</code>-header overschreven
  die met elk scrape-verzoek wordt verzonden.

configure-advanced-stories-authentication = Authenticatie
configure-advanced-stories-scrapingCredentialsHeader = Scraping credentials
configure-advanced-stories-scraping-usernameLabel = Gebruikersnaam
configure-advanced-stories-scraping-passwordLabel = Wachtwoord

commentAuthor-status-banned = Verbannen
commentAuthor-status-premod = Pre-mod
commentAuthor-status-suspended = Geschorst

hotkeysModal-title = Toetsenbord sneltoetsen
hotkeysModal-navigation-shortcuts = Navigeer sneltoetsen
hotkeysModal-shortcuts-next = Volgende reactie
hotkeysModal-shortcuts-prev = Vorige reactie
hotkeysModal-shortcuts-search = Open zoek
hotkeysModal-shortcuts-jump = Spring naar specifieke wachtrij
hotkeysModal-shortcuts-switch = Wachtrijen wisselen
hotkeysModal-shortcuts-toggle = Toon sneltoetsen hulp
hotkeysModal-shortcuts-single-view = Enkele reactie view
hotkeysModal-moderation-decisions = Modereer beslissingen
hotkeysModal-shortcuts-approve = Goedkeuren
hotkeysModal-shortcuts-reject = Afwijzen
hotkeysModal-shortcuts-ban = Auteur reactie verbannen
hotkeysModal-shortcuts-zen = Schakel de weergave met één reactie in of uit

authcheck-network-error = Er is een netwerkfout opgetreden. Gelieve de pagina te vernieuwen.

dashboard-heading-last-updated = Laatst gewijzigd:

dashboard-today-heading = Activiteit van vandaag
dashboard-today-new-comments = Nieuwe reacties
dashboard-alltime-new-comments = Totaal van alle tijden
dashboard-alltime-new-comments-archiveEnabled = { $value } { $unit ->
    [second] { $value ->
      [1] seconde
      *[other] seconden
    }
    [minute] { $value ->
      [1] minuut
      *[other] minuten
    }
    [hour] { $value ->
      [1] uur
      *[other] uren
    }
    [day] { $value ->
      [1] dag
      *[other] dagen
    }
    [week] { $value ->
      [1] week
      *[other] weken
    }
    [month] { $value ->
      [1] maand
      *[other] maanden
    }
    [year] { $value ->
      [1] jaar
      *[other] jaren
    }
    *[other] onbekende eenheid
  } totaal
dashboard-today-rejections = Afwijzingspercentage
dashboard-alltime-rejections = Gemiddelde van alle tijden
dashboard-alltime-rejections-archiveEnabled = { $value } { $unit ->
    [second] { $value ->
      [1] seconde
      *[other] seconden
    }
    [minute] { $value ->
      [1] minuut
      *[other] minuten
    }
    [hour] { $value ->
      [1] uur
      *[other] uren
    }
    [day] { $value ->
      [1] dag
      *[other] dagen
    }
    [week] { $value ->
      [1] week
      *[other] weken
    }
    [month] { $value ->
      [1] maand
      *[other] maanden
    }
    [year] { $value ->
      [1] jaar
      *[other] jaren
    }
    *[other] onbekende eenheid
  } gemiddeld
dashboard-today-staffPlus-comments = Redactie+ reacties
dashboard-alltime-staff-comments = Totaal van alle tijden
dashboard-alltime-staff-comments-archiveEnabled = { $value } { $unit ->
    [second] { $value ->
      [1] seconde
      *[other] seonden
    }
    [minute] { $value ->
      [1] minuut
      *[other] minuten
    }
    [hour] { $value ->
      [1] uur
      *[other] uren
    }
    [day] { $value ->
      [1] dag
      *[other] dagen
    }
    [week] { $value ->
      [1] week
      *[other] weken
    }
    [month] { $value ->
      [1] maand
      *[other] maanden
    }
    [year] { $value ->
      [1] jaar
      *[other] jaren
    }
    *[other] onbekende eenheid
  } totaal
dashboard-today-signups = Nieuwe leden
dashboard-alltime-signups = Totaal leden
dashboard-today-bans = Verbannen leden
dashboard-alltime-bans = Totaal verbannen leden

dashboard-top-stories-today-heading = De meest becommentarieerde artikelen van vandaag
dashboard-top-stories-table-header-story = Artikel
dashboard-top-stories-table-header-comments = Reacties
dashboard-top-stories-no-comments = Geen reacties vandaag

dashboard-commenters-activity-heading = Nieuwe leden van de community deze week

dashboard-comment-activity-heading = Commentaaractiviteit per uur
dashboard-comment-activity-tooltip-comments = Reacties
dashboard-comment-activity-legend = Gemiddelde laatste 3 dagen

conversation-modal-conversationOn = Conversatie op:
conversation-modal-moderateStory = Modereer artikel
conversation-modal-showMoreParents = Toon meer van deze conversatie
conversation-modal-showReplies = Toon reacties
conversation-modal-commentNotFound = Reactie is niet gevonden.
conversation-modal-showMoreReplies = Toon meer reacties
conversation-modal-header-title = Conversatie op:
conversation-modal-header-moderate-link = Modereer artikel
