### Lokalisering för Admin

## Allmänt
general-notAvailable = Ej tillgänglig
general-none = Ingen
general-noTextContent = Ingen textinnehåll
general-archived = Arkiverad

## Berättelsestatus
storyStatus-open = Öppen
storyStatus-closed = Stängd
storyStatus-archiving = Arkiverar
storyStatus-archived = Arkiverad
storyStatus-unarchiving = Återställer

## Roller
role-admin = Admin
role-moderator = Moderator
role-siteModerator = Webbplatsmoderator
role-organizationModerator = Organisationsmoderator
role-staff = Personal
role-member = Medlem
role-commenter = Kommentator

role-plural-admin = Admins
role-plural-moderator = Moderatörer
role-plural-staff = Personal
role-plural-member = Medlemmar
role-plural-commenter = Kommentatorer

comments-react =
  .aria-label = {$count ->
    [0] {$reaction} kommentar av {$username}
    *[other] {$reaction} ({$count}) kommentar av {$username}
  }
comments-reacted =
  .aria-label = {$count ->
    [0] {$reaction} kommentar av {$username}
    [one] {$reaction} kommentar av {$username}
    *[other] {$reaction} ({$count}) kommentar av {$username}
  }

## Komponenter
admin-paginatedSelect-filter =
  .aria-label = Filtrera resultat

## Användarstatus
userStatus-active = Aktiv
userStatus-banned = Avstängd
userStatus-siteBanned = Webbplatsavstängd
userStatus-banned-all = Avstängd (alla)
userStatus-banned-count = Avstängd ({$count})
userStatus-suspended = Blockerad
userStatus-premod = Alltid förhandsgranskad
userStatus-warned = Varnad

# Kösortering
queue-sortMenu-newest = Nyast
queue-sortMenu-oldest = Äldst

## Navigering
navigation-moderate = Moderera
navigation-community = Community
navigation-stories = Artiklar
navigation-configure = Konfigurera
navigation-dashboard = Instrumentpanel
navigation-reports = Rapporter

## Användarmeny
userMenu-signOut = Logga ut
userMenu-viewLatestRelease = Visa senaste versionen
userMenu-reportBug = Rapportera en bugg eller ge feedback
userMenu-popover =
  .description = En dialogruta för användarmenyn med relaterade länkar och åtgärder

## Restricted
restricted-currentlySignedInTo = För närvarande inloggad som
restricted-noPermissionInfo = Du har inte behörighet att komma åt den här sidan.
restricted-signedInAs = Du är inloggad som: <strong>{ $username }</strong>
restricted-signInWithADifferentAccount = Logga in med ett annat konto
restricted-contactAdmin = Om du tror att detta är ett fel, kontakta din administratör för hjälp.

## Login

# Sign In
login-signInTo = Logga in på
login-signIn-enterAccountDetailsBelow = Ange dina kontouppgifter nedan

login-emailAddressLabel = E-postadress
login-emailAddressTextField =
  .placeholder = E-postadress

login-signIn-passwordLabel = Lösenord
login-signIn-passwordTextField =
  .placeholder = Lösenord

login-signIn-signInWithEmail = Logga in med e-post
login-orSeparator = Or
login-signIn-forgot-password = Glömt ditt lösenord?

login-signInWithFacebook = Logga in med Facebook
login-signInWithGoogle = Logga in med Google
login-signInWithOIDC = Logga in med { $name }

# Create Username

createUsername-createUsernameHeader = Skapa användarnamn
createUsername-whatItIs =
  Ditt användarnamn är ett alias som visas på alla dina kommentarer.
createUsername-createUsernameButton = Skapa användarnamn
createUsername-usernameLabel = Användarnamn
createUsername-usernameDescription = Du kan använda ”_” och ”.”. Mellanslag är inte tillåtna.
createUsername-usernameTextField =
  .placeholder = Användarnamn

# Add Email Address
addEmailAddress-addEmailAddressHeader = Lägg till e-postadress

addEmailAddress-emailAddressLabel = E-postadress
addEmailAddress-emailAddressTextField =
  .placeholder = E-postadress

addEmailAddress-confirmEmailAddressLabel = Bekräfta E-postadress
addEmailAddress-confirmEmailAddressTextField =
  .placeholder = Bekräfta E-postadress

addEmailAddress-whatItIs =
  För din ökade säkerhet kräver vi att användare lägger till en e-postadress till sina konton.

addEmailAddress-addEmailAddressButton =
  Lägg till e-postadress

# Create Password
createPassword-createPasswordHeader = Skapa lösenord
createPassword-whatItIs =
  För att skydda mot oebhörig åtkomst av kontot
  kräver vi att användare skapar ett lösenord.
createPassword-createPasswordButton =
  Skapa lösenord

createPassword-passwordLabel = Lösenord
createPassword-passwordDescription = Måste vara minst {$minLength} tecken
createPassword-passwordTextField =
  .placeholder = Lösenord

# Glömt lösenord
forgotPassword-forgotPasswordHeader = Glömt lösenord?
forgotPassword-checkEmailHeader = Kontrollera din e-post
forgotPassword-gotBackToSignIn = Gå tillbaka till inloggningssidan
forgotPassword-checkEmail-receiveEmail =
  Om det finns ett konto kopplat till <strong>{ $email }</strong>,
  kommer du att få ett e-postmeddelande med en länk för att skapa ett nytt lösenord.
forgotPassword-enterEmailAndGetALink =
  Ange din e-postadress nedan så skickar vi dig en länk
  för att återställa ditt lösenord.
forgotPassword-emailAddressLabel = E-postadress
forgotPassword-emailAddressTextField =
  .placeholder = E-postadress
forgotPassword-sendEmailButton = Skicka e-post

# Länka konto
linkAccount-linkAccountHeader = Länka konto
linkAccount-alreadyAssociated =
  E-posten <strong>{ $email }</strong> är
  redan kopplad till ett konto. Om du vill länka dessa ange ditt lösenord.
linkAccount-passwordLabel = Lösenord
linkAccount-passwordTextField =
  .label = Lösenord
linkAccount-linkAccountButton = Länka konto
linkAccount-useDifferentEmail = Använd en annan e-postadress

## Konfigurera

configure-experimentalFeature = Experimentell funktion

configure-unsavedInputWarning =
  Du har osparade ändringar. Är du säker på att du vill fortsätta?

configure-sideBarNavigation-general = Allmänt
configure-sideBarNavigation-authentication = Autentisering
configure-sideBarNavigation-moderation = Moderering
configure-sideBarNavigation-moderation-comments = Kommentarer
configure-sideBarNavigation-moderation-users = Användare
configure-sideBarNavigation-organization = Organisation
configure-sideBarNavigation-moderationPhases = Modereringsfaser
configure-sideBarNavigation-advanced = Avancerat
configure-sideBarNavigation-email = E-post
configure-sideBarNavigation-bannedAndSuspectWords = Förbjudna och misstänkta ord
configure-sideBarNavigation-slack = Slack
configure-sideBarNavigation-webhooks = Webhooks

configure-sideBar-saveChanges = Spara ändringar
configure-configurationSubHeader = Konfiguration
configure-onOffField-on = På
configure-onOffField-off = Av
configure-radioButton-allow = Tillåt
configure-radioButton-dontAllow = Tillåt inte

### Modereringsfaser

configure-moderationPhases-generatedAt = NYCKEL SKAPAD:
  { DATETIME($date, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric") }
configure-moderationPhases-phaseNotFound = Extern modereringsfas hittades inte
configure-moderationPhases-experimentalFeature =
  Funktionen för anpassade modereringsfaser är för närvarande under aktiv utveckling.
  Vänligen <ContactUsLink>kontakta oss med feedback eller förfrågningar</ContactUsLink>.
configure-moderationPhases-header-title = Modereringsfaser
configure-moderationPhases-description =
  Konfigurera en extern modereringsfas för att automatisera vissa modererings
  åtgärder. Modereringsförfrågningar kommer att vara JSON-kodade och signerade. För
  att lära dig mer om modereringsförfrågningar, besök våra <externalLink>dokument</externalLink>.
configure-moderationPhases-addExternalModerationPhaseButton =
  Lägg till extern modereringsfas
configure-moderationPhases-moderationPhases = Modereringsfaser
configure-moderationPhases-name = Namn
configure-moderationPhases-status = Status
configure-moderationPhases-noExternalModerationPhases =
  Det finns inga konfigurerade externa modereringsfaser, lägg till en ovan.
configure-moderationPhases-enabledModerationPhase = Aktiverad
configure-moderationPhases-disableModerationPhase = Inaktiverad
configure-moderationPhases-detailsButton = Detaljer <icon></icon>
configure-moderationPhases-addExternalModerationPhase = Lägg till extern modereringsfas
configure-moderationPhases-updateExternalModerationPhaseButton = Uppdatera detaljer
configure-moderationPhases-cancelButton = Avbryt
configure-moderationPhases-format = Kommentarsformat
configure-moderationPhases-endpointURL = Återuppringnings-URL
configure-moderationPhases-timeout = Timeout
configure-moderationPhases-timeout-details =
  Den tid Coral kommer att vänta på ditt modereringssvar i millisekunder.
configure-moderationPhases-format-details =
  Formatet som Coral kommer att skicka kommentaren i. Som standard kommer Coral
  att skicka kommentaren i det ursprungliga HTML-kodade formatet. Om "Ren text" är
  valt, kommer den HTML-rensade versionen att skickas istället.
configure-moderationPhases-format-html = HTML
configure-moderationPhases-format-plain = Ren text
configure-moderationPhases-endpointURL-details =
  URL:en som Coral modereringsförfrågningar kommer att POST:as till. Den angivna URL:en
  måste svara inom den angivna timeouten eller beslutet om modereringsåtgärden kommer att hoppas över.
configure-moderationPhases-configureExternalModerationPhase =
  Konfigurera extern modereringsfas
configure-moderationPhases-phaseDetails = Fasdetaljer
configure-moderationPhases-status = Status
configure-moderationPhases-signingSecret = Signeringshemlighet
configure-moderationPhases-signingSecretDescription =
  Följande signeringshemlighet används för att signera begärande nyttolaster som skickas
  till URL:en. För att lära dig mer om webhooksignering, besök våra <externalLink>dokument</externalLink>.
configure-moderationPhases-phaseStatus = Fasstatus
configure-moderationPhases-status = Status
configure-moderationPhases-signingSecret = Signeringshemlighet
configure-moderationPhases-signingSecretDescription =
  Följande signeringshemlighet används för att signera begärande nyttolaster som skickas till URL:en.
  För att lära dig mer om webhooksignering, besök våra <externalLink>dokument</externalLink>.
configure-moderationPhases-dangerZone = Farozon
configure-moderationPhases-rotateSigningSecret = Rotera signeringshemlighet
configure-moderationPhases-rotateSigningSecretDescription =
  Att rotera signeringshemligheten kommer att tillåta dig att säkert ersätta en signerings
  hemlighet som används i produktion med en fördröjning.
configure-moderationPhases-rotateSigningSecretButton = Rotera signeringshemlighet

configure-moderationPhases-disableExternalModerationPhase =
  Inaktivera extern modereringsfas
configure-moderationPhases-disableExternalModerationPhaseDescription =
  Denna externa modereringsfas är för närvarande aktiverad. Genom att inaktivera kommer inga nya
  modereringsförfrågningar att skickas till den angivna URL:en.
configure-moderationPhases-disableExternalModerationPhaseButton = Inaktivera fas
configure-moderationPhases-enableExternalModerationPhase =
  Aktivera extern modereringsfas
configure-moderationPhases-enableExternalModerationPhaseDescription =
  Denna externa modereringsfas är för närvarande inaktiverad. Genom att aktivera kommer nya
  modereringsförfrågningar att skickas till den angivna URL:en.
configure-moderationPhases-enableExternalModerationPhaseButton = Aktivera fas
configure-moderationPhases-deleteExternalModerationPhase =
  Ta bort extern modereringsfas
configure-moderationPhases-deleteExternalModerationPhaseDescription =
  Att ta bort denna externa modereringsfas kommer att stoppa alla nya modereringsförfrågningar
  från att skickas till denna URL och kommer att ta bort alla associerade inställningar.
configure-moderationPhases-deleteExternalModerationPhaseButton = Ta bort fas
configure-moderationPhases-rotateSigningSecret = Rotera signeringshemlighet
configure-moderationPhases-rotateSigningSecretHelper =
  Efter det att den löper ut, kommer signaturer inte längre att genereras med den gamla hemligheten.
configure-moderationPhases-expiresOldSecret =
  Låt den gamla hemligheten löpa ut
configure-moderationPhases-expiresOldSecretImmediately =
  Omedelbart
configure-moderationPhases-expiresOldSecretHoursFromNow =
  { $hours ->
    [1] 1 timme
    *[other] { $hours } timmar
  } från nu
configure-moderationPhases-rotateSigningSecretSuccessUseNewSecret =
  Signeringshemligheten för extern modereringsfas har roterats. Vänligen se till att du
  uppdaterar dina integrationer för att använda den nya hemligheten nedan.
configure-moderationPhases-confirmDisable =
  Att inaktivera denna externa modereringsfas kommer att stoppa alla nya modereringsförfrågningar
  från att skickas till denna URL. Är du säker på att du vill fortsätta?
configure-moderationPhases-confirmEnable =
  Att aktivera den externa modereringsfasen kommer att börja skicka modereringsförfrågningar
  till denna URL. Är du säker på att du vill fortsätta?
configure-moderationPhases-confirmDelete =
  Att ta bort denna externa modereringsfas kommer att stoppa alla nya modereringsförfrågningar
  från att skickas till denna URL och kommer att ta bort alla associerade inställningar. Är
  du säker på att du vill fortsätta?

### Webhooks

configure-webhooks-generatedAt = NYCKEL SKAPAD:
  { DATETIME($date, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric") }
configure-webhooks-experimentalFeature =
  Webhookfunktionen är för närvarande under aktiv utveckling. Händelser kan läggas till
  eller tas bort. Vänligen <ContactUsLink>kontakta oss med feedback eller förfrågningar</ContactUsLink>.
configure-webhooks-webhookEndpointNotFound = Webhookändpunkt hittades inte
configure-webhooks-header-title = Konfigurera webhookändpunkt
configure-webhooks-description =
  Konfigurera en ändpunkt för att skicka händelser till när händelser inträffar inom
  Coral. Dessa händelser kommer att vara JSON-kodade och signerade. För att lära dig mer
  om webhooksignering, besök vår <externalLink>Webhook Guide</externalLink>.
configure-webhooks-addEndpoint = Lägg till webhookändpunkt
configure-webhooks-addEndpointButton = Lägg till webhookändpunkt
configure-webhooks-endpoints = Ändpunkter
configure-webhooks-url = URL
configure-webhooks-status = Status
configure-webhooks-noEndpoints = Det finns inga konfigurerade webhookändpunkter, lägg till en ovan.
configure-webhooks-enabledWebhookEndpoint = Aktiverad
configure-webhooks-disabledWebhookEndpoint = Inaktiverad
configure-webhooks-endpointURL = Ändpunkts-URL
configure-webhooks-cancelButton = Avbryt
configure-webhooks-updateWebhookEndpointButton = Uppdatera webhookändpunkt
configure-webhooks-eventsToSend = Händelser att skicka
configure-webhooks-clearEventsToSend = Rensa
configure-webhooks-eventsToSendDescription =
  Detta är händelserna som är registrerade till denna specifika ändpunkt. Besök
  vår <externalLink>Webhook Guide</externalLink> för schemat för dessa händelser.
  Alla händelser som matchar följande kommer att skickas till ändpunkten om den är
  aktiverad:
configure-webhooks-allEvents =
  Ändpunkten kommer att ta emot alla händelser, inklusive de som läggs till i framtiden.
configure-webhooks-selectedEvents =
  { $count } { $count ->
    [1] händelse
    *[other] händelser
  } valda.
configure-webhooks-selectAnEvent =
  Välj händelser ovan eller <button>ta emot alla händelser</button>.
configure-webhooks-configureWebhookEndpoint = Konfigurera webhookändpunkt
configure-webhooks-confirmEnable =
  Att aktivera webhookändpunkten kommer att börja skicka händelser till denna URL. Är du säker på att du vill fortsätta?
configure-webhooks-confirmDisable =
  Att inaktivera denna webhookändpunkt kommer att stoppa alla nya händelser från att skickas till denna URL. Är du säker på att du vill fortsätta?
configure-webhooks-confirmDelete =
  Att ta bort denna webhookändpunkt kommer att stoppa alla nya händelser från att skickas till denna URL, och ta bort alla associerade inställningar med denna webhookändpunkt. Är du säker på att du vill fortsätta?
configure-webhooks-dangerZone = Farozon
configure-webhooks-rotateSigningSecret = Rotera signeringshemlighet
configure-webhooks-rotateSigningSecretDescription =
  Att rotera signeringshemligheten kommer att tillåta dig att säkert ersätta en signerings
  hemlighet som används i produktion med en fördröjning.
configure-webhooks-rotateSigningSecretButton = Rotera signeringshemlighet
configure-webhooks-rotateSigningSecretHelper =
  Efter det att den löper ut, kommer signaturer inte längre att genereras med den gamla hemligheten.
configure-webhooks-rotateSigningSecretSuccessUseNewSecret =
  Signeringshemligheten för webhookändpunkten har roterats. Vänligen se till
  att du uppdaterar dina integrationer för att använda den nya hemligheten nedan.
configure-webhooks-disableEndpoint = Inaktivera ändpunkt
configure-webhooks-disableEndpointDescription =
  Denna ändpunkt är för närvarande aktiverad. Genom att inaktivera denna ändpunkt kommer inga nya händelser
  att skickas till den angivna URL:en.
configure-webhooks-disableEndpointButton = Inaktivera ändpunkt
configure-webhooks-enableEndpoint = Aktivera ändpunkt
configure-webhooks-enableEndpointDescription =
  Denna ändpunkt är för närvarande inaktiverad. Genom att aktivera denna ändpunkt kommer nya händelser att
  skickas till den angivna URL:en.
configure-webhooks-enableEndpointButton = Aktivera ändpunkt
configure-webhooks-deleteEndpoint = Ta bort ändpunkt
configure-webhooks-deleteEndpointDescription =
  Att ta bort ändpunkten kommer att förhindra att nya händelser skickas till den angivna
  URL:en.
configure-webhooks-deleteEndpointButton = Ta bort ändpunkt
configure-webhooks-endpointStatus = Ändpunktsstatus
configure-webhooks-signingSecret = Signeringshemlighet
configure-webhooks-signingSecretDescription =
  Följande signeringshemlighet används för att signera begärande nyttolaster som skickas
  till URL:en. För att lära dig mer om webhooksignering, besök vår
  <externalLink>Webhook Guide</externalLink>.
configure-webhooks-expiresOldSecret = Låt den gamla hemligheten löpa ut
configure-webhooks-expiresOldSecretImmediately = Omedelbart
configure-webhooks-expiresOldSecretHoursFromNow =
  { $hours ->
    [1] 1 timme
    *[other] { $hours } timmar
  }  från nu
configure-webhooks-detailsButton = Detaljer <icon></icon>

### Allmänt
configure-general-guidelines-title = Sammanfattning av communityriktlinjer
configure-general-guidelines-explanation =
  Detta kommer att visas ovanför kommentarerna på hela webbplatsen.
  Du kan formatera texten med Markdown.
  Mer information om hur du använder Markdown
  här: <externalLink>https://www.markdownguide.org/cheat-sheet/</externalLink>
configure-general-guidelines-showCommunityGuidelines = Visa sammanfattning av communityriktlinjer

#### Bio
configure-general-memberBio-title = Profilinfo
configure-general-memberBio-explanation =
  Tillåt kommentatorer att lägga till en bio i sin profil. Obs: Detta kan öka moderatorns arbetsbörda eftersom profilinfo kan anmälas.
configure-general-memberBio-label = Tillåt profilinfo

#### Locale
configure-general-locale-language = Språk
configure-general-locale-chooseLanguage = Välj språket för din Coral-community.
configure-general-locale-invalidLanguage =
  Det tidigare valda språket <lang></lang> finns inte längre. Vänligen välj ett annat språk.

#### Sitewide Commenting
configure-general-sitewideCommenting-title = Webbplatsövergripande kommentering
configure-general-sitewideCommenting-explanation =
  Öppna eller stäng kommentarstrådar för nya kommentarer webbplatsövergripande.
  När nya kommentarer är avstängda kan inga nya kommentarer
  skickas in, men befintliga kommentarer kan fortsätta att ta emot
  reaktioner, anmälas och delas.
configure-general-sitewideCommenting-enableNewCommentsSitewide =
  Aktivera nya kommentarer över hela webbplatsen
configure-general-sitewideCommenting-onCommentStreamsOpened =
  På - Kommentarstrådar öppnade för nya kommentarer
configure-general-sitewideCommenting-offCommentStreamsClosed =
  Av - Kommentarstrådar stängda för nya kommentarer
configure-general-sitewideCommenting-message = Meddelande för stängda kommentarer över hela webbplatsen
configure-general-sitewideCommenting-messageExplanation =
  Skriv ett meddelande som kommer att visas när kommentarstrådar är stängda över hela webbplatsen

#### Bädda in länkar
configure-general-embedLinks-title = Inbäddade medier
configure-general-embedLinks-desc =
configure-general-embedLinks-desc =
  Tillåt kommentatorer att lägga till en YouTube-video, X inlägg eller GIF i slutet av deras kommentar
configure-general-embedLinks-enableTwitterEmbeds = Tillåt inbäddning av X-inlägg
configure-general-embedLinks-enableYouTubeEmbeds = Tillåt YouTube-inbäddningar
configure-general-embedLinks-enableGiphyEmbeds = Tillåt GIFs från GIPHY
configure-general-embedLinks-enableExternalEmbeds = Aktivera externa medier

configure-general-embedLinks-On = Ja
configure-general-embedLinks-Off = Nej

configure-general-embedLinks-giphyMaxRating = GIF-innehållsbetyg
configure-general-embedLinks-giphyMaxRating-desc = Välj det högsta innehållsbetyget för de GIFs som kommer att visas i kommentatorernas sökresultat

configure-general-embedLinks-giphyMaxRating-g = G
configure-general-embedLinks-giphyMaxRating-g-desc = Innehåll som är lämpligt för alla åldrar
configure-general-embedLinks-giphyMaxRating-pg = PG
configure-general-embedLinks-giphyMaxRating-pg-desc = Innehåll som generellt är säkert för alla, men där föräldraråd till barn rekommenderas.
configure-general-embedLinks-giphyMaxRating-pg13 = PG-13
configure-general-embedLinks-giphyMaxRating-pg13-desc = Milda sexuella anspelningar, milt bruk av substanser, milt svordomar eller hotfulla bilder. Kan inkludera bilder på halvnakna personer, men VISAR INTE riktig mänsklig genitalia eller nakenhet.
configure-general-embedLinks-giphyMaxRating-r = R
configure-general-embedLinks-giphyMaxRating-r-desc = Grovt språk, starka sexuella anspelningar, våld och olagligt drogbruk; inte lämpligt för tonåringar eller yngre. Ingen nakenhet.

configure-general-embedLinks-configuration = Konfiguration
configure-general-embedLinks-configuration-desc =
  För ytterligare information om GIPHYs API vänligen besök: <externalLink>https://developers.giphy.com/docs/api</externalLink>
configure-general-embedLinks-giphyAPIKey = GIPHY API-nyckel


#### Konfigurera Meddelanden

configure-general-announcements-title = Gemenskapsmeddelande
configure-general-announcements-description =
  Lägg till ett tillfälligt meddelande som kommer att visas överst på alla dina organisationers kommentarstrådar under en specifik tid.
configure-general-announcements-delete = Ta bort meddelande
configure-general-announcements-add = Lägg till meddelande
configure-general-announcements-start = Starta meddelande
configure-general-announcements-cancel = Avbryt
configure-general-announcements-current-label = Aktuellt meddelande
configure-general-announcements-current-duration =
  Detta meddelande kommer automatiskt att avslutas den: { $timestamp }
configure-general-announcements-duration = Visa detta meddelande för

#### Stänga Kommentarstrådar
configure-general-closingCommentStreams-title = Stänga kommentarstrådar
configure-general-closingCommentStreams-explanation = Ställ in så att kommentarstrådar stängs efter en definierad tidsperiod efter en artikels publicering
configure-general-closingCommentStreams-closeCommentsAutomatically = Stäng kommentarer automatiskt
configure-general-closingCommentStreams-closeCommentsAfter = Stäng kommentarer efter

#### Kommentarslängd
configure-general-commentLength-title = Kommentarslängd
configure-general-commentLength-maxCommentLength = Maximal kommentarslängd
configure-general-commentLength-setLimit =
  Ställ in minimi- och maximikrav på kommentarslängd.
  Blanksteg i början och slutet av en kommentar kommer att trimmas.
configure-general-commentLength-limitCommentLength = Begränsa kommentarslängd
configure-general-commentLength-minCommentLength = Minsta kommentarslängd
configure-general-commentLength-characters = Tecken
configure-general-commentLength-textField =
  .placeholder = Ingen gräns
configure-general-commentLength-validateLongerThanMin =
  Ange ett tal som är längre än den minsta längden

#### Redigera Kommentar
configure-general-commentEditing-title = Redigera kommentar
configure-general-commentEditing-explanation =
  Ställ in en gräns för hur länge kommentatorer har på sig att redigera sina kommentarer över hela webbplatsen.
  Redigerade kommentarer markeras som (Redigerad) i kommentarstråd och
  modereringspanelen.
configure-general-commentEditing-commentEditTimeFrame = Tidsram för kommentarredigering
configure-general-commentEditing-seconds = Sekunder

#### Plattar till svar
configure-general-flattenReplies-title = Plattar till svar
configure-general-flattenReplies-enabled = Plattning av svar aktiverad
configure-general-flattenReplies-explanation =
  Ändra hur nivåer av svar visas. När aktiverat kan svar på kommentarer gå upp till sju nivåer djupt innan de inte längre är indragna på sidan. När inaktiverat, efter ett djup av sju svar, visas resten av konversationen i en dedikerad vy bort från de andra kommentarerna.

configure-general-featuredBy-title = Utvald av
configure-general-featuredBy-enabled = Utvald av aktiverat
configure-general-featuredBy-explanation = Lägg till moderatornamn till visning av utvald kommentar

configure-general-topCommenter-title = Toppskribent
configure-general-topCommenter-explanation = Lägg till Toppskribent-märke till kommentatorer med utvalda kommentarer de senaste 10 dagarna
configure-general-topCommenter-enabled = Toppskribent

configure-general-flairBadge-header = Anpassade användarsymboler
configure-general-flairBadge-description = Uppmuntra användarengagemang och deltagande genom att lägga till anpassade användarsymboler
  för din webbplats. Märken kan tilldelas som en del av ditt <externalLink>JWT-påstående</externalLink>.
configure-general-flairBadge-enable-label = Aktivera anpassade användarsymboler
configure-general-flairBadge-add = Symbol-URL
configure-general-flairBadge-add-helperText =
  Klistra in webbadressen för din anpassade användarsymbol. Stödda filtyper: png, jpeg, jpg och gif
configure-general-flairBadge-url-error =
  URL:en är ogiltig eller har en filtyp som inte stöds.
configure-general-flairBadge-add-name = Symbolnamn
configure-general-flairBadge-add-name-helperText =
  Namnge symbolen med en beskrivande identifierare
configure-general-flairBadge-name-permittedCharacters =
  Endast bokstäver, siffror och specialtecken - . är tillåtna.
configure-general-flairBadge-add-button = Lägg till
configure-general-flairBadge-table-flairName = Namn
configure-general-flairBadge-table-flairURL = URL
configure-general-flairBadge-table-preview = Förhandsgranskning
configure-general-flairBadge-table-deleteButton = <icon></icon> Ta bort
configure-general-flairBadge-table-empty = Ingen anpassad användarsymbol tillagd för denna webbplats

#### In-page notifications
configure-general-inPageNotifications-title = Notiser på sidan
configure-general-inPageNotifications-explanation = Lägg till Notiser till Coral. När det är aktiverat kan kommentatorer ta emot
  notiser när de får alla svar, endast svar från medlemmar i ditt
  team, när en väntande kommentar publiceras. Kommentatorer kan avaktivera
  visuella notiser i sina profilinställningar. Detta kommer att ta bort e-postnotifikationer.
configure-general-inPageNotifications-enabled = Notiser på sidan aktiverade
configure-general-inPageNotifications-floatingBellIndicator = Flytande notissymbol

#### Meddelande för Stängd Tråd
configure-general-closedStreamMessage-title = Meddelande för stängd kommentarstråd
configure-general-closedStreamMessage-explanation = Skriv ett meddelande som visas när en artikel är stängd för kommentering.

### Organisation
configure-organization-name = Organisationsnamn
configure-organization-sites = Webbplatser
configure-organization-nameExplanation =
  Ditt organisationsnamn kommer att visas i e-postmeddelanden som { -product-name } skickar till din gemenskap och organisationsmedlemmar.
configure-organization-sites-explanation =
  Lägg till en ny webbplats till din organisation eller redigera en befintlig webbplats detaljer.
configure-organization-sites-add-site = <icon></icon> Lägg till webbplats
configure-organization-email = Organisations e-post
configure-organization-emailExplanation =
  Denna e-postadress kommer att användas i e-postmeddelanden och över plattformen
  för att gemenskapsmedlemmar ska kunna komma i kontakt med organisationen om de
  har några frågor om statusen på deras konton eller
  modereringsfrågor.
configure-organization-url = Organisations-URL
configure-organization-urlExplanation =
  Din organisations-url kommer att visas i e-postmeddelanden som { -product-name } skickar till din gemenskap och organisationsmedlemmar.

### Webbplatser
configure-sites-site-details = Detaljer <icon></icon>
configure-sites-add-new-site = Lägg till en ny webbplats till { $site }
configure-sites-add-success = { $site } har lagts till i { $org }
configure-sites-edit-success = Ändringar till { $site } har sparats.
configure-sites-site-form-name = Webbplatsnamn
configure-sites-site-form-name-explanation = Webbplatsnamnet kommer att visas på e-post skickat av Coral till din community och organisationsmedlemmar.
configure-sites-site-form-url = Webbplatsens URL
configure-sites-site-form-url-explanation = Denna URL kommer att visas på e-post skickat av Coral till dina communitymedlemmar.
configure-sites-site-form-email = Webbplatsens e-postadress
configure-sites-site-form-url-explanation = Denna e-postadress är för communitymedlemmar att kontakta dig med frågor eller om de behöver hjälp. t.ex. comments@yoursite.com
configure-sites-site-form-domains = Tillåtna domäner för webbplatsen
configure-sites-site-form-domains-explanation = Domäner där dina Coral kommentarstrådar är tillåtna att bli inbäddade (ex. http://localhost:3000, https://staging.domain.com, https://domain.com).
configure-sites-site-form-submit = <icon></icon> Lägg till webbplats
configure-sites-site-form-cancel = Avbryt
configure-sites-site-form-save = Spara ändringar
configure-sites-site-edit = Redigera { $site } detaljer
configure-sites-site-form-embed-code = Inbäddningskod
sites-emptyMessage = Vi kunde inte hitta några webbplatser som matchar dina kriterier.
sites-selector-allSites = Alla webbplatser
site-filter-option-allSites = Alla webbplatser

site-selector-all-sites = Alla webbplatser
stories-filter-sites-allSites = Alla webbplatser
stories-filter-statuses = Status
stories-column-site = Webbplats
site-table-siteName = Webbplatsnamn
stories-filter-sites = Webbplats

site-search-searchButton =
  .aria-label = Sök
site-search-textField =
  .aria-label = Sök efter webbplatsnamn
site-search-textField =
  .placeholder = Sök efter webbplatsnamn
site-search-none-found = Inga webbplatser hittades med den sökningen
specificSitesSelect-validation = Du måste välja minst en webbplats.

stories-column-actions = Åtgärder
stories-column-rescrape = Skrapa om

stories-openInfoDrawer =
  .aria-label = Öppna Info Lådan
stories-actions-popover =
  .description = En rullgardinsmeny för att välja artikelåtgärder
stories-actions-rescrape = Skrapa om
stories-actions-close = Stäng artikel
stories-actions-open = Öppna artikel
stories-actions-archive = Arkivera artikel
stories-actions-unarchive = Avarkivera artikel
stories-actions-isUnarchiving = Avarkiverar

### Avsnitt

moderate-section-selector-allSections = Alla avsnitt
moderate-section-selector-uncategorized = Okategoriserad
moderate-section-uncategorized = Okategoriserad

### E-post

configure-email = E-postinställningar
configure-email-configBoxEnabled = Aktiverad
configure-email-fromNameLabel = Från namn
configure-email-fromNameDescription =
  Namnet som det kommer att visas på alla utgående e-postmeddelanden
configure-email-fromEmailLabel = Från e-postadress
configure-email-fromEmailDescription =
  E-postadress som kommer att användas för att skicka meddelanden
configure-email-smtpHostLabel = SMTP-värd
configure-email-smtpHostDescription = (t.ex. smtp.sendgrid.net)
configure-email-smtpPortLabel = SMTP-port
configure-email-smtpPortDescription = (t.ex. 25)
configure-email-smtpTLSLabel = TLS
configure-email-smtpAuthenticationLabel = SMTP-autentisering
configure-email-smtpCredentialsHeader = E-postuppgifter
configure-email-smtpUsernameLabel = Användarnamn
configure-email-smtpPasswordLabel = Lösenord
configure-email-send-test = Skicka test e-post

### Autentisering

configure-auth-clientID = Klient-ID
configure-auth-clientSecret = Klienthemlighet
configure-auth-configBoxEnabled = Aktiverad
configure-auth-targetFilterCoralAdmin = { -product-name } Admin
configure-auth-targetFilterCommentStream = Kommentarström
configure-auth-redirectURI = Omdirigerings-URI
configure-auth-registration = Registrering
configure-auth-registrationDescription =
  Tillåt användare som inte tidigare har registrerat sig med denna autentiseringsintegration att registrera ett nytt konto.
configure-auth-registrationCheckBox = Tillåt registrering
configure-auth-pleaseEnableAuthForAdmin =
  Vänligen aktivera minst en autentiseringsintegration för { -product-name } Admin
configure-auth-confirmNoAuthForCommentStream =
  Ingen autentiseringsintegration har aktiverats för Kommentarströmmen. Vill du verkligen fortsätta?

configure-auth-facebook-loginWith = Logga in med Facebook
configure-auth-facebook-toEnableIntegration =
  För att aktivera integrationen med Facebook-autentisering,
  behöver du skapa och konfigurera en webbapplikation.
  För mer information besök: <Link></Link>.
configure-auth-facebook-useLoginOn = Använd Facebook-inloggning på

configure-auth-google-loginWith = Logga in med Google
configure-auth-google-toEnableIntegration =
  För att aktivera integrationen med Google-autentisering behöver du
  skapa och konfigurera en webbapplikation. För mer information besök:
  <Link></Link>.
configure-auth-google-useLoginOn = Använd Google-inloggning på

configure-auth-sso-loginWith = Logga in med Single Sign On
configure-auth-sso-useLoginOn = Använd Single Sign On-inloggning på
configure-auth-sso-key = Nyckel
configure-auth-sso-regenerate = Återskapa
configure-auth-sso-regenerateAt = NYCKEL SKAPAD:
  { DATETIME($date, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric") }
configure-auth-sso-regenerateHonoredWarning =
  När en nyckel återskapas, kommer tokens signerade med den tidigare nyckeln att hedras i 30 dagar.

configure-auth-sso-description =
  För att aktivera integration med ditt befintliga autentiseringssystem,
  behöver du skapa en JWT-token för att ansluta. Du kan lära dig
  mer om att skapa en JWT-token med <IntroLink>denna introduktion</IntroLink>. Se vår
  <DocLink>dokumentation</DocLink> för ytterligare information om single sign on.

configure-auth-sso-rotate-keys = Nycklar
configure-auth-sso-rotate-keyID = Nyckel-ID
configure-auth-sso-rotate-secret = Hemlighet
configure-auth-sso-rotate-copySecret =
  .aria-label = Kopiera Hemlighet

configure-auth-sso-rotate-date =
  { DATETIME($date, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric") }
configure-auth-sso-rotate-activeSince = Aktiv sedan
configure-auth-sso-rotate-inactiveAt = Inaktiv vid
configure-auth-sso-rotate-inactiveSince = Inaktiv sedan

configure-auth-sso-rotate-status = Status
configure-auth-sso-rotate-statusActive = Aktiv
configure-auth-sso-rotate-statusExpiring = Håller på att löpa ut
configure-auth-sso-rotate-statusExpired = Utgången
configure-auth-sso-rotate-statusUnknown = Okänd

configure-auth-sso-rotate-expiringTooltip =
  En SSO-nyckel håller på att löpa ut när den är schemalagd för rotation.
configure-auth-sso-rotate-expiringTooltip-toggleButton =
  .aria-label = Växla synlighet för utgångstips
configure-auth-sso-rotate-expiredTooltip =
  En SSO-nyckel är utgången när den har roterats ur användning.
configure-auth-sso-rotate-expiredTooltip-toggleButton =
  Växla synlighet för utgånget tips

configure-auth-sso-rotate-rotate = Rotera
configure-auth-sso-rotate-deactivateNow = Avaktivera nu
configure-auth-sso-rotate-delete = Radera

configure-auth-sso-rotate-now = Nu
configure-auth-sso-rotate-10seconds = 10 sekunder från nu
configure-auth-sso-rotate-1day = 1 dag från nu
configure-auth-sso-rotate-1week = 1 vecka från nu
configure-auth-sso-rotate-30days = 30 dagar från nu
configure-auth-sso-rotate-dropdown-description =
  .description = En rullgardinsmeny för att rotera SSO-nyckeln

configure-auth-local-loginWith = Logga in med e-postautentisering
configure-auth-local-useLoginOn = Använd inloggning med e-postautentisering på
configure-auth-local-forceAdminLocalAuth =
  Lokal adminautentisering har permanent aktiverats.
  Detta är för att säkerställa att Coral serviceteam kan komma åt administrationspanelen.

configure-auth-oidc-loginWith = Logga in med OpenID Connect
configure-auth-oidc-toLearnMore = För att lära dig mer: <Link></Link>
configure-auth-oidc-providerName = Leverantörsnamn
configure-auth-oidc-providerNameDescription =
  Leverantören av OpenID Connect-integrationen. Detta kommer att användas när leverantörens namn
  behöver visas, t.ex. "Logga in med &lt;Facebook&gt;".
configure-auth-oidc-issuer = Utfärdare
configure-auth-oidc-issuerDescription =
  Efter att ha angett din utfärdarinformation, klicka på Upptäck-knappen för att låta { -product-name } slutföra
  de återstående fälten. Du kan också ange informationen manuellt.
configure-auth-oidc-authorizationURL = Auktoriserings-URL
configure-auth-oidc-tokenURL = Token-URL
configure-auth-oidc-jwksURI = JWKS URI
configure-auth-oidc-useLoginOn = Använd OpenID Connect-inloggning på

configure-auth-settings = Sessioninställningar
configure-auth-settings-session-duration-label = Sessionens varaktighet

### Moderering

### Senaste kommentarhistoriken

configure-moderation-recentCommentHistory-title = Senaste historiken
configure-moderation-recentCommentHistory-timeFrame = Tidsperiod för senaste kommentarhistorik
configure-moderation-recentCommentHistory-timeFrame-description =
  Tidsperiod för att beräkna en kommentators avvisningsfrekvens.
configure-moderation-recentCommentHistory-enabled = Filter för senaste historik
configure-moderation-recentCommentHistory-enabled-description =
  Förhindrar återfallsförbrytare från att publicera kommentarer utan godkännande.
  När en kommentators avvisningsfrekvens är över tröskelvärdet, skickas deras
  kommentarer till Väntande för moderatorgodkännande. Detta gäller inte för personalens kommentarer.
configure-moderation-recentCommentHistory-triggerRejectionRate = Tröskelvärde för avvisningsfrekvens
configure-moderation-recentCommentHistory-triggerRejectionRate-description =
  Avvisade kommentarer ÷ (avvisade kommentarer + publicerade kommentarer)
  över ovanstående tidsram, som en procentandel. Det inkluderar inte
  kommentarer som väntar på grund av toxicitet, spam eller förhandsmoderering.

#### Externa länkar för moderatorer
configure-moderation-externalLinks-title = Externa länkar för moderatorer
configure-moderation-externalLinks-profile-explanation = När ett URL-format inkluderas
  nedan, läggs externa profillänkar till användarlådan inuti modererings-
  gränssnittet. Du kan använda formatet $USER_NAME för att infoga användarnamnet eller $USER_ID
  för att infoga användarens unika ID-nummer.
configure-moderation-externalLinks-profile-label = Externt profil-URL-mönster
configure-moderation-externalLinks-profile-input =
  .placeholder = https://example.com/users/$USER_NAME

#### Förhandsmoderering
configure-moderation-preModeration-title = Förhandsmoderering
configure-moderation-preModeration-explanation =
  När förhandsmoderering är aktiverad kommer kommentarer inte att publiceras om de inte
  godkänts av en moderator.
configure-moderation-preModeration-moderation =
  Förhandsmoderera alla kommentarer
configure-moderation-preModeration-premodLinksEnable =
  Förhandsmoderera alla kommentarer som innehåller länkar

#### Moderera alla/specifika webbplatser alternativ
configure-moderation-specificSites = Specifika webbplatser
configure-moderation-allSites = Alla webbplatser

configure-moderation-apiKey = API-nyckel

configure-moderation-akismet-title = Spamdetekteringsfilter
configure-moderation-akismet-explanation =
  Akismet API-filtret varnar användare när en kommentar sannolikt är spam. Kommentarer som Akismet anser vara spam publiceras inte
  och placeras i kö för granskning av en moderator.
  Om en moderator godkänner kommentaren kommer den att publiceras.

configure-moderation-premModeration-premodSuspectWordsEnable =
  Förhandsmoderera alla kommentarer som innehåller misstänkta ord
configure-moderation-premModeration-premodSuspectWordsDescription =
  Du kan visa och redigera din lista över misstänkta ord <wordListLink>här</wordListLink>

#### Akismet
configure-moderation-akismet-filter = Spamdetekteringsfilter
configure-moderation-akismet-ipBased = IP-baserad spamdetektering
configure-moderation-akismet-accountNote =
  Notera: Du måste lägga till dina aktiva domäner
  i ditt Akismet-konto: <externalLink>https://akismet.com/account/</externalLink>
configure-moderation-akismet-siteURL = Webbplatsens URL

#### Perspective
configure-moderation-perspective-title = Filter för toxiska kommentarer
configure-moderation-perspective-explanation =
  Med hjälp av Perspective API varnar filtret för toxiska kommentarer användare
  när kommentarer överskrider den fördefinierade tröskeln för toxicitet.
  Kommentarer med en toxicitetsscore över tröskeln <strong>kommer inte att publiceras</strong> och placeras i
  <strong>kön för granskning av en moderator</strong>.
  Om en moderator godkänner kommentaren kommer den att publiceras.
configure-moderation-perspective-filter = Filter för toxiska kommentarer
configure-moderation-perspective-toxicityThreshold = Toxicitetströskel
configure-moderation-perspective-toxicityThresholdDescription =
  Detta värde kan ställas in som en procentandel mellan 0 och 100. Detta nummer representerar sannolikheten att en
  kommentar är toxisk, enligt Perspective API. Som standard är tröskeln inställd på { $default }.
configure-moderation-perspective-toxicityModel = Toxicitetsmodell
configure-moderation-perspective-toxicityModelDescription =
  Välj din Perspective-modell. Standard är { $default }.
  Du kan läsa mer om modellval <externalLink>här</externalLink>.
configure-moderation-perspective-allowStoreCommentData = Tillåt Google att lagra kommentardata
configure-moderation-perspective-allowStoreCommentDataDescription =
  Lagrade kommentarer kommer att användas för framtida forskning och byggande av gemenskapsmodeller för att
  förbättra API:n över tid.
configure-moderation-perspective-allowSendFeedback =
  Tillåt Coral att skicka modereringsåtgärder till Google
configure-moderation-perspective-allowSendFeedbackDescription =
  Skickade modereringsåtgärder kommer att användas för framtida forskning och
  byggande av gemenskapsmodeller för att förbättra API:n över tid.
configure-moderation-perspective-customEndpoint = Anpassad ändpunkt
configure-moderation-perspective-defaultEndpoint =
  Som standard är ändpunkten inställd på { $default }. Du kan överskriva detta här.
configure-moderation-perspective-accountNote =
  För ytterligare information om hur du ställer in Perspective Toxic Comment Filter, besök:
  <externalLink>https://github.com/conversationai/perspectiveapi#readme</externalLink>

configure-moderation-newCommenters-title = Godkännande av nya kommentatorer
configure-moderation-newCommenters-enable = Aktivera godkännande av nya kommentatorer
configure-moderation-newCommenters-description =
  När detta är aktivt, kommer initiala kommentarer från en ny kommentator att skickas till Väntande
  för moderatorgodkännande innan publicering.
configure-moderation-newCommenters-enable-description = Aktivera förhandsmoderering för nya kommentatorer
configure-moderation-newCommenters-approvedCommentsThreshold = Antal kommentarer som måste godkännas
configure-moderation-newCommenters-approvedCommentsThreshold-description =
  Antalet kommentarer en användare måste få godkända innan de inte
  behöver förhandsmodereras
configure-moderation-newCommenters-comments = kommentarer

#### E-postdomän
configure-moderation-emailDomains-header = E-postdomän
configure-moderation-emailDomains-description = Skapa regler för att vidta åtgärder mot konton eller kommentarer baserat på kontoinnehavarens e-postadressdomän. Åtgärden gäller endast nyskapade konton.
configure-moderation-emailDomains-add = Lägg till e-postdomän
configure-moderation-emailDomains-edit = Redigera e-postdomän
configure-moderation-emailDomains-addDomain = <icon></icon> Lägg till domän
configure-moderation-emailDomains-table-domain = Domän
configure-moderation-emailDomains-table-action = Åtgärd
configure-moderation-emailDomains-table-edit = <icon></icon> Redigera
configure-moderation-emailDomains-table-delete = <icon></icon> Radera
configure-moderation-emailDomains-form-label-domain = Domän
configure-moderation-emailDomains-form-label-moderationAction = Modereringsåtgärd
configure-moderation-emailDomains-banAllUsers = Stäng av alla nya konton
configure-moderation-emailDomains-alwaysPremod = Förhandsmoderera alltid kommentarer
configure-moderation-emailDomains-form-cancel = Avbryt
configure-moderation-emailDomains-form-addDomain = Lägg till domän
configure-moderation-emailDomains-form-editDomain = Uppdatera
configure-moderation-emailDomains-confirmDelete = Att radera denna e-postdomän kommer att stoppa alla nya konton skapade med den från att bli avstängda eller alltid förhandsmodererade. Är du säker på att du vill fortsätta?
configure-moderation-emailDomains-form-description-add = Lägg till en domän och välj den åtgärd som ska vidtas vid varje nytt konto skapat med den angivna domänen.
configure-moderation-emailDomains-form-description-edit = Uppdatera domänen eller åtgärden som ska vidtas vid varje nytt konto med den angivna domänen.
configure-moderation-emailDomains-exceptions-header = Undantag
configure-moderation-emailDomains-exceptions-helperText = Dessa domäner kan inte bannlysas. Domäner ska skrivas utan www, till exempel "gmail.com". Separera domäner med ett kommatecken och ett mellanslag.

configure-moderation-emailDomains-showCurrent = Visa nuvarande domänlista
configure-moderation-emailDomains-hideCurrent = Dölj nuvarande domänlista
configure-moderation-emailDomains-filterByStatus = 
  .aria-label = Filtrera efter e-postdomänstatus
configuration-moderation-emailDomains-empty = Det finns inga e-postdomäner konfigurerade.

configure-moderation-emailDomains-allDomains = Alla domäner
configure-moderation-emailDomains-preMod = För-moderering
configure-moderation-emailDomains-banned = Bannlysta

#### Förhandsmoderera e-postadresskonfiguration

configure-moderation-premoderateEmailAddress-title = E-postadress
configure-moderation-premoderateEmailAddress-enabled =
  Förhandsmoderera e-post med för många punkter
configure-moderation-premoderateEmailAddress-enabled-description =
  Om en användare har tre eller fler punkter i första delen av deras
  e-postadress (före @), sätt deras status till att förhandsmoderera
  kommentarer. E-postadresser med 3 eller fler punkter kan ha en mycket hög spam
  korrelation. Det kan vara användbart att proaktivt förhandsmoderera dem.

#### Konfiguration av bannlysta ord
configure-wordList-banned-bannedWordsAndPhrases = Bannlysta ord och fraser
configure-wordList-banned-explanation =
  Kommentarer som innehåller ett ord eller en fras i listan över bannlysta ord <strong>avvisas automatiskt och publiceras inte</strong>.
configure-wordList-banned-wordList = Lista över bannlysta ord
configure-wordList-banned-wordListDetailInstructions =
  Separera bannlysta ord eller fraser med en ny rad. Ord/fraser är inte skiftlägeskänsliga.

#### Konfiguration av misstänkta ord
configure-wordList-suspect-bannedWordsAndPhrases = Misstänkta ord och fraser
configure-wordList-suspect-explanation =
  Kommentarer som innehåller ett ord eller en fras i listan över misstänkta ord
  <strong>placeras i kön för moderatorgranskning och publiceras
  (om kommentarer inte förhandsmodereras).</strong>
configure-wordList-suspect-explanationSuspectWordsList =
  Kommentarer som innehåller ett ord eller en fras i listan över misstänkta ord
  <strong>placeras i kön för granskning och publiceras inte
  om de inte godkänns av en moderator.</strong>
configure-wordList-suspect-wordList = Lista över misstänkta ord
configure-wordList-suspect-wordListDetailInstructions =
  Separera misstänkta ord eller fraser med en ny rad. Ord/fraser är inte skiftlägeskänsliga.

### Avancerat
configure-advanced-customCSS = Anpassad CSS
configure-advanced-customCSS-override =
  URL till ett CSS-stilmall som kommer att ersätta standard Embed Stream-stilar.
configure-advanced-customCSS-stylesheetURL = Anpassad CSS-URL
configure-advanced-customCSS-fontsStylesheetURL = Anpassad CSS-URL för teckensnitt
configure-advanced-customCSS-containsFontFace =
  URL till en anpassad CSS-stilmall som innehåller alla @font-face
  definitioner som behövs av ovanstående stilmall.

configure-advanced-embeddedComments = Inbäddade kommentarer
configure-advanced-embeddedComments-subheader = För webbplatser som använder oEmbed
configure-advanced-embeddedCommentReplies-explanation = När aktiverat kommer en svara-knapp
  att visas med varje inbäddad kommentar för att uppmuntra ytterligare diskussion om den
  specifika kommentaren eller artikeln.
configure-advanced-embeddedCommentReplies-label = Tillåt svar på inbäddade kommentarer

configure-advanced-oembedAllowedOrigins-header = oEmbed tillåtna domäner
configure-advanced-oembedAllowedOrigins-description = Domäner som är tillåtna att göra anrop till oEmbed API (t.ex. http://localhost:3000, https://staging.domain.com, https://domain.com).
configure-advanced-oembedAllowedOrigins-label = oEmbed tillåtna domäner

configure-advanced-permittedDomains = Tillåtna domäner
configure-advanced-permittedDomains-description =
  Domäner där din { -product-name } instans är tillåten att bli inbäddad
  inklusive schemat (t.ex. http://localhost:3000, https://staging.domain.com,
  https://domain.com).

configure-advanced-liveUpdates = Liveuppdateringar av kommentarstråd
configure-advanced-liveUpdates-explanation =
  När aktiverat kommer kommentarer att laddas och uppdateras i realtid.
  När inaktiverat måste användare uppdatera sidan för att se nya kommentarer.

configure-advanced-embedCode-title = Inbäddningskod
configure-advanced-embedCode-explanation =
  Kopiera och klistra in koden nedan i ditt CMS för att inbädda Coral kommentarstrådar i
  varje av din webbplats artiklar.

configure-advanced-embedCode-comment =
  Avkommentera dessa rader och ersätt med ID för
  artikeln och URL från ditt CMS för att skapa den
  tätaste integrationen. Referera till vår dokumentation på
  https://docs.coralproject.net för alla konfigurations-alternativ.

configure-advanced-amp = Accelerated Mobile Pages
configure-advanced-amp-explanation =
  Aktivera stöd för <LinkToAMP>AMP</LinkToAMP> på kommentarstråden.
  När aktiverat, behöver du lägga till Coral’s AMP inbäddningskod till din sida.
  Se vår <LinkToDocs>dokumentation</LinkToDocs> för mer
  detaljer. Aktivera Stöd.

configure-advanced-for-review-queue = Granska alla anmälningar
configure-advanced-for-review-queue-explanation =
  När en kommentar har godkänts, kommer den inte att visas i listan igen
  även om ytterligare användare anmäler den. Denna funktion lägger till en "För granskning"-kö,
  vilket möjliggör för moderatorer att se alla anmälningar från användare i systemet och manuellt
  markera dem som "Granskade".
configure-advanced-for-review-queue-label = Visa kön "För granskning"

## Decision History
decisionHistory-popover =
  .description = En dialog som visar beslutshistoriken
decisionHistory-youWillSeeAList =
  Du kommer att se en lista över dina modereringsåtgärder för inlägg här.
decisionHistory-showMoreButton =
  Visa Mer
decisionHistory-yourDecisionHistory = Din Beslutshistorik
decisionHistory-rejectedCommentBy = Avvisad kommentar av <Username></Username>
decisionHistory-approvedCommentBy = Godkänd kommentar av <Username></Username>
decisionHistory-goToComment = Gå till kommentaren

### Slack

configure-slack-header-title = Slack-integrationer
configure-slack-description =
  Skicka automatiskt kommentarer från Corals modereringsköer till Slack-kanaler. Du behöver administratörsåtkomst till Slack för att ställa in detta. För steg på hur du skapar en Slack-app, se vår <externalLink>dokumentation</externalLink>.
configure-slack-notRecommended =
  Rekommenderas inte för webbplatser med mer än 10K kommentarer per månad.
configure-slack-addChannel = Lägg till kanal

configure-slack-channel-defaultName = Ny kanal
configure-slack-channel-enabled = Aktiverad
configure-slack-channel-remove = Ta bort kanal
configure-slack-channel-name-label = Namn
configure-slack-channel-name-description =
  Detta är endast för din information, för att lätt identifiera varje Slack-anslutning. Slack meddelar oss inte namnet på kanal/kanaler du kopplar till Coral.
configure-slack-channel-hookURL-label = Webhook-URL
configure-slack-channel-hookURL-description =
  Slack tillhandahåller en kanalspecifik URL för att aktivera webhook-anslutningar. För att hitta URL:en för en av dina Slack-kanaler, följ instruktionerna <externalLink>här</externalLink>.
configure-slack-channel-triggers-label =
  Ta emot meddelanden i denna Slack-kanal för
configure-slack-channel-triggers-reportedComments = Anmälda kommentarer
configure-slack-channel-triggers-pendingComments = Väntande kommentarer
configure-slack-channel-triggers-featuredComments = Utvalda kommentarer
configure-slack-channel-triggers-allComments = Alla kommentarer
configure-slack-channel-triggers-staffComments = Personalens kommentarer

## moderate
moderate-navigation-reported = anmälda
moderate-navigation-pending = Väntande
moderate-navigation-unmoderated = omodererade
moderate-navigation-rejected = avvisade
moderate-navigation-approved = godkända
moderate-navigation-comment-count = { SHORT_NUMBER($count) }
moderate-navigation-forReview = för granskning

moderate-marker-preMod = För-moderering
moderate-marker-link = Länk
moderate-marker-bannedWord = Förbjudet ord
moderate-marker-bio = Bio
moderate-marker-illegal = Olagligt innehåll
moderate-marker-possibleBannedWord = Möjligt förbjudet ord
moderate-marker-suspectWord = Misstänkt ord
moderate-marker-possibleSuspectWord = Möjligt misstänkt ord
moderate-marker-spam = Spam
moderate-marker-spamDetected = Spam upptäckt
moderate-marker-toxic = Giftigt
moderate-marker-recentHistory = Senaste historiken
moderate-marker-bodyCount = Kroppsräkning
moderate-marker-offensive = Stötande
moderate-marker-abusive = Kränkande
moderate-marker-newCommenter = Ny kommentator
moderate-marker-repeatPost = Upprepat inlägg
moderate-marker-other = Annat
moderate-marker-preMod-userEmail = Användarens e-post

moderate-markers-details = Detaljer
moderate-flagDetails-latestReports = Senaste rapporterna
moderate-flagDetails-offensive = Stötande
moderate-flagDetails-abusive = Kränkande
moderate-flagDetails-spam = Spam
moderate-flagDetails-bio = Bio
moderate-flagDetails-other = Annat
moderate-flagDetails-illegalContent = Olagligt innehåll
moderate-flagDetails-viewDSAReport = Visa DSA-rapport

moderate-card-flag-details-anonymousUser = Anonym användare

moderate-flagDetails-toxicityScore = Toxicitetsscore
moderate-toxicityLabel-likely = Troligen <score></score>
moderate-toxicityLabel-unlikely = Osannolikt <score></score>
moderate-toxicityLabel-maybe = Kanske <score></score>

moderate-linkDetails-label = Kopiera länk till denna kommentar
moderate-in-stream-link-copy = I tråden
moderate-in-moderation-link-copy = I moderering

moderate-decisionDetails-decisionLabel = Beslut
moderate-decisionDetails-rejected = Avvisad
moderate-decisionDetails-reasonLabel = Orsak
moderate-decisionDetails-lawBrokenLabel = Brott mot lag
moderate-decisionDetails-customReasonLabel = Anpassad orsak
moderate-decisionDetails-detailedExplanationLabel = Detaljerad förklaring

moderate-emptyQueue-pending = Bra jobbat! Det finns inga fler väntande kommentarer att moderera.
moderate-emptyQueue-reported = Bra jobbat! Det finns inga fler anmälda kommentarer att moderera.
moderate-emptyQueue-unmoderated = Bra jobbat! Alla kommentarer har modererats.
moderate-emptyQueue-rejected = Det finns inga avvisade kommentarer.
moderate-emptyQueue-approved = Det finns inga godkända kommentarer.

moderate-comment-edited = (redigerad)
moderate-comment-inReplyTo = Svar till <Username></Username>
moderate-comment-viewContext = Visa sammanhang
moderate-comment-viewConversation = Visa konversation
moderate-comment-rejectButton =
  .aria-label = Avvisa
moderate-comment-approveButton =
  .aria-label = Godkänn
moderate-comment-decision = Beslut
moderate-comment-story = Artikel
moderate-comment-storyLabel = Kommentar på
moderate-comment-moderateStory = Moderera artikel
moderate-comment-featureText = Framhäv
moderate-comment-featuredText = Utvald
moderate-comment-moderatedBy = Modererad av
moderate-comment-moderatedBySystem = Systemet
moderate-comment-play-gif = Spela GIF
moderate-comment-load-video = Ladda video

moderate-single-goToModerationQueues = Gå till modereringsköer
moderate-single-singleCommentView = Enskild kommentarsvy

moderate-queue-viewNew =
  { $count ->
    [1] Visa {$count} ny kommentar
    *[other] Visa {$count} nya kommentarer
  }

moderate-comment-deleted-body =
  Denna kommentar är inte längre tillgänglig. Kommentatorn har raderat sitt konto.

### Moderate Search Bar
moderate-searchBar-allStories = Alla artiklar
  .title = Alla artiklar
moderate-searchBar-noStories = Vi kunde inte hitta några artiklar som matchar dina kriterier
moderate-searchBar-stories = Artiklar:
moderate-searchBar-searchButton = Sök
moderate-searchBar-titleNotAvailable =
  .title = Titel inte tillgänglig
moderate-searchBar-comboBox =
  .aria-label = Sök eller hoppa till artikel
moderate-searchBar-searchForm =
  .aria-label = Artiklar
moderate-searchBar-currentlyModerating =
  .title = Modererar för närvarande
moderate-searchBar-searchResults = Sökresultat
moderate-searchBar-searchResultsMostRecentFirst = Sökresultat (Senaste först)
moderate-searchBar-searchResultsMostRelevantFirst = Sökresultat (Mest relevanta först)
moderate-searchBar-moderateAllStories = Moderera alla artiklar
moderate-searchBar-comboBoxTextField =
  .aria-label = Sök eller hoppa till artikel...
  .placeholder = sök efter artikelns titel, författare, url, id, etc.
moderate-searchBar-goTo = Gå till
moderate-searchBar-seeAllResults = Se alla resultat

moderateCardDetails-tab-info = Info
moderateCardDetails-tab-decision = Beslut
moderateCardDetails-tab-edits = Redigeringshistorik
moderateCardDetails-tab-automatedActions = Automatiserade åtgärder
moderateCardDetails-tab-reactions = Reaktioner
moderateCardDetails-tab-reactions-loadMore = Ladda mer
moderateCardDetails-tab-noIssuesFound = Inga problem hittades
moderateCardDetails-tab-missingPhase = Kördes inte

moderateCardDetails-tab-externalMod-status = Status
moderateCardDetails-tab-externalMod-flags = Flaggor
moderateCardDetails-tab-externalMod-tags = Taggar

moderateCardDetails-tab-externalMod-none = Ingen
moderateCardDetails-tab-externalMod-approved = Godkänd
moderateCardDetails-tab-externalMod-rejected = Avvisad
moderateCardDetails-tab-externalMod-premod = För-modererad
moderateCardDetails-tab-externalMod-systemWithheld = Tillbakahållen av systemet

### Moderate User History Drawer

moderate-user-drawer-email =
  .title = E-postadress
moderate-user-drawer-created-at =
  .title = Kontots skapelsedatum
moderate-user-drawer-member-id =
  .title = Medlems-ID
moderate-user-drawer-external-profile-URL =
  .title = Extern profil-URL
moderate-user-drawer-external-profile-URL-link = Extern profil-URL
moderate-user-drawer-tab-all-comments = Alla kommentarer
moderate-user-drawer-tab-rejected-comments = Avvisade
moderate-user-drawer-tab-account-history = Kontohistorik
moderate-user-drawer-tab-notes = Anteckningar
moderate-user-drawer-load-more = Ladda fler
moderate-user-drawer-all-no-comments = {$username} har inte skickat in några kommentarer.
moderate-user-drawer-rejected-no-comments = {$username} har inga avvisade kommentarer.
moderate-user-drawer-user-not-found = Användare hittades inte.
moderate-user-drawer-status-label = Status:
moderate-user-drawer-bio-title = Medlemsbio
moderate-user-drawer-username-not-available = Användarnamn inte tillgängligt
moderate-user-drawer-username-not-available-tooltip-title = Användarnamn inte tillgängligt
moderate-user-drawer-username-not-available-tooltip-body = Användaren slutförde inte kontoinställningsprocessen

moderate-user-drawer-account-history-system = <icon></icon> System
moderate-user-drawer-account-history-suspension-ended = Blockering avslutad
moderate-user-drawer-account-history-suspension-removed = Blockering borttagen
moderate-user-drawer-account-history-banned = Avstängd
moderate-user-drawer-account-history-account-domain-banned = Användardomän avstängd
moderate-user-drawer-account-history-ban-removed = Avstängning borttagen
moderate-user-drawer-account-history-site-banned = Webbplatsavstängd
moderate-user-drawer-account-history-site-ban-removed = Webbplatsavstängning borttagen
moderate-user-drawer-account-history-no-history = Inga åtgärder har vidtagits på detta konto
moderate-user-drawer-username-change = Användarnamnsändring
moderate-user-drawer-username-change-new = Nytt:
moderate-user-drawer-username-change-old = Gammalt:

moderate-user-drawer-account-history-premod-set = Alltid för-moderera
moderate-user-drawer-account-history-premod-removed = För-moderering borttagen

moderate-user-drawer-account-history-modMessage-sent = Användare meddelad
moderate-user-drawer-account-history-modMessage-acknowledged = Meddelande mottaget den { $acknowledgedAt }

moderate-user-drawer-newCommenter = Ny kommentator

moderate-user-drawer-suspension =
  Avstängning, { $value } { $unit ->
    [second] { $value ->
      [1] sekund
      *[other] sekunder
    }
    [minute] { $value ->
      [1] minut
      *[other] minuter
    }
    [hour] { $value ->
      [1] timme
      *[other] timmar
    }
    [day] { $value ->
      [1] dag
      *[other] dagar
    }
    [week] { $value ->
      [1] vecka
      *[other] veckor
    }
    [month] { $value ->
      [1] månad
      *[other] månader
    }
    [year] { $value ->
      [1] år
      *[other] år
    }
    *[other] okänd enhet
  }

moderate-user-drawer-deleteAccount-popover =
  .description = En popupmeny för att radera en användares konto
moderate-user-drawer-deleteAccount-button =
  .aria-label = Radera konto
moderate-user-drawer-deleteAccount-popover-confirm = Skriv in "{ $text }" för att bekräfta
moderate-user-drawer-deleteAccount-popover-title = Radera konto
moderate-user-drawer-deleteAccount-popover-username = Användarnamn
moderate-user-drawer-deleteAccount-popover-header-description = Att radera kontot kommer
moderate-user-drawer-deleteAccount-popover-description-list-removeComments = Ta bort alla kommentarer skrivna av denna användare från databasen.
moderate-user-drawer-deleteAccount-popover-description-list-deleteAll = Radera allt register om detta konto. Användaren
  kan sedan skapa ett nytt konto med samma e-postadress. Om du istället vill stänga av denna användare och behålla deras
  historik,tryck på "AVBRYT" och använd rullgardinsmenyn nedanför användarnamnet.
moderate-user-drawer-deleteAccount-popover-callout = Detta tar bort alla uppgifter om denna användare
moderate-user-drawer-deleteAccount-popover-timeframe = Detta träder i kraft om 24 timmar.
moderate-user-drawer-deleteAccount-popover-cancelButton = Avbryt
moderate-user-drawer-deleteAccount-popover-deleteButton = Radera

moderate-user-drawer-deleteAccount-scheduled-callout = Användarradering aktiverad
moderate-user-drawer-deleteAccount-scheduled-timeframe = Detta kommer att ske den { $deletionDate }.
moderate-user-drawer-deleteAccount-scheduled-cancelDeletion = Avbryt användarradering

moderate-user-drawer-user-scheduled-deletion = Användare schemalagd för radering
moderate-user-drawer-user-deletion-canceled = Begäran om användarradering avbruten

moderate-user-drawer-account-history-deletion-scheduled = Radering schemalagd för { $createdAt }
moderate-user-drawer-account-history-canceled-at = Avbruten den { $createdAt }
moderate-user-drawer-account-history-updated-at = Uppdaterad den { $createdAt }

moderate-user-drawer-recent-history-title = Senaste kommentarshistoriken
moderate-user-drawer-recent-history-calculated =
  Beräknat över de senaste { framework-timeago-time }
moderate-user-drawer-recent-history-rejected = Avvisade
moderate-user-drawer-recent-history-tooltip-title = Hur beräknas detta?
moderate-user-drawer-recent-history-tooltip-body =
  Avvisade kommentarer ÷ (avvisade kommentarer + publicerade kommentarer).
  Tröskelvärdet kan ändras av administratörer i Konfigurera > Moderering.
moderate-user-drawer-recent-history-tooltip-button =
  .aria-label = Växla senaste kommentarshistorikens info
moderate-user-drawer-recent-history-tooltip-submitted = Inlämnade

moderate-user-drawer-notes-field =
  .placeholder = Lämna en anteckning...
moderate-user-drawer-notes-button = Lägg till anteckning
moderatorNote-left-by = Lämnad av
moderatorNote-delete = Radera

moderate-user-drawer-all-comments-archiveThreshold-allOfThisUsers =
  Alla denna användares kommentarer från de föregående { $value } { $unit ->
    [second] { $value ->
      [1] sekund
      *[other] sekunder
    }
    [minute] { $value ->
      [1] minut
      *[other] minuter
    }
    [hour] { $value ->
      [1] timme
      *[other] timmar
    }
    [day] { $value ->
      [1] dag
      *[other] dagar
    }
    [week] { $value ->
      [1] vecka
      *[other] veckor
    }
    [month] { $value ->
      [1] månad
      *[other] månader
    }
    [year] { $value ->
      [1] år
      *[other] år
    }
    *[other] okänd enhet
  }.

# För granskningskö

moderate-forReview-reviewedButton =
  .aria-label = Granskad
moderate-forReview-markAsReviewedButton =
  .aria-label = Markera som granskad
moderate-forReview-time = Tid
moderate-forReview-comment = Kommentar
moderate-forReview-reportedBy = Rapporterad av
moderate-forReview-reason = Orsak
moderate-forReview-description = Beskrivning
moderate-forReview-reviewed = Granskad

moderate-forReview-detectedBannedWord = Förbjudet ord
moderate-forReview-detectedLinks = Länkar
moderate-forReview-detectedNewCommenter = Ny kommentator
moderate-forReview-detectedPreModUser = Förhandsmodererad användare
moderate-forReview-detectedRecentHistory = Senaste historiken
moderate-forReview-detectedRepeatPost = Upprepad kommentar
moderate-forReview-detectedSpam = Spam
moderate-forReview-detectedSuspectWord = Misstänkt ord
moderate-forReview-detectedToxic = Giftigt språk
moderate-forReview-reportedAbusive = Kränkande
moderate-forReview-reportedBio = Användarbio
moderate-forReview-reportedOffensive = Stötande
moderate-forReview-reportedOther = Annat
moderate-forReview-reportedSpam = Spam

# Archive

moderate-archived-queue-title = Denna artikel har arkiverats
moderate-archived-queue-noModerationActions =
  Inga modereringsåtgärder kan utföras på kommentarerna när en artikel är arkiverad.
moderate-archived-queue-toPerformTheseActions =
  För att utföra dessa åtgärder, avarkivera artikeln.

## Community
community-emptyMessage = Vi kunde inte hitta någon i din community som matchar dina kriterier.

community-filter-searchField =
  .placeholder = Sök efter användarnamn eller e-postadress...
  .aria-label = Sök efter användarnamn eller e-postadress
community-filter-searchButton =
  .aria-label = Sök

community-filter-roleSelectField =
  .aria-label = Sök efter roll

community-filter-statusSelectField =
  .aria-label = Sök efter användarstatus

community-changeRoleButton =
  .aria-label = Ändra roll

community-assignMySitesToModerator = Tilldela moderator till mina webbplatser
community-removeMySitesFromModerator = Ta bort moderator från mina webbplatser
community-assignMySitesToMember = Tilldela medlem till mina webbplatser
community-removeMySitesFromMember = Ta bort medlem från mina webbplatser
community-stillHaveSiteModeratorPrivileges = De kommer fortfarande att ha Site Moderator-privilegier för:
community-stillHaveMemberPrivileges = De kommer fortfarande att ha Medlemsprivilegier för:
community-userNoLongerPermitted = Användaren kommer inte längre att tillåtas att göra modereringsbeslut eller tilldela avstängningar på:
community-memberNoLongerPermitted = Användaren kommer inte längre att få Medlemsprivilegier på:
community-assignThisUser = Tilldela denna användare till
community-assignYourSitesTo = Tilldela dina webbplatser till <strong>{ $username }</strong>
community-siteModeratorsArePermitted = Webbplatsmoderatorer tillåts göra modereringsbeslut och utfärda avstängningar på de webbplatser de är tilldelade.
community-membersArePermitted = Medlemmar tillåts att få en badge på de webbplatser de är tilldelade.
community-removeSiteModeratorPermissions = Ta bort Site Moderator-privilegier
community-removeMemberPermissions = Ta bort Medlemsprivilegier

community-filter-optGroupAudience =
  .label = Publik
community-filter-optGroupOrganization =
  .label = Organisation
community-filter-search = Sök
community-filter-showMe = Visa Mig
community-filter-allRoles = Alla Roller
community-filter-allStatuses = Alla Statusar

community-column-username = Användarnamn
community-column-username-not-available = Användarnamn inte tillgängligt
community-column-email-not-available = E-post inte tillgänglig
community-column-username-deleted = Raderad
community-column-email = E-post
community-column-memberSince = Medlem Sedan
community-column-role = Roll
community-column-status = Status

community-role-popover =
  .description = En rullgardinsmeny för att ändra användarrollen

community-siteRoleActions-popover =
  .description = En rullgardinsmeny för att befordra/degradera en användare till/från webbplatser

community-userStatus-popover =
  .description = En rullgardinsmeny för att ändra användarstatus

community-userStatus-manageBan = Hantera avstängning
community-userStatus-suspendUser = Blockera användare
community-userStatus-suspend = Blockera
community-userStatus-suspendEverywhere = Blockera överallt
community-userStatus-removeSuspension = Ta bort blockering
community-userStatus-removeUserSuspension = Ta bort blockering
community-userStatus-unknown = Okänd
community-userStatus-changeButton =
  .aria-label = Ändra användarstatus
community-userStatus-premodUser = Alltid förhandsmoderera
community-userStatus-removePremod = Ta bort förhandsmoderering

community-banModal-allSites-title = Är du säker på att du vill stänga av <username></username>?
community-banModal-banEmailDomain-title = Blockera E-postdomän
community-banModal-banEmailDomain = Stänga av alla nya kommentarskonton från { $domain }
community-banModal-banEmailDomain-callOut = Detta kommer att förhindra att någon kommentator använder denna e-postdomän
community-banModal-banEmailDomain-confirmationText = Skriv in "{ $text }" för att bekräfta
community-banModal-specificSites-title = Är du säker på att du vill hantera avstängningen för <username></username>?
community-banModal-noSites-title = Är du säker på att du vill återaktivera <username></username>?
community-banModal-allSites-consequence =
  När avstängd kommer denna användare inte längre att kunna kommentera, använda reaktioner eller rapportera kommentarer.
community-banModal-noSites-consequence =
  När återaktiverad kommer denna användare att kunna kommentera, använda reaktioner och rapportera kommentarer.
community-banModal-specificSites-consequence =
  Denna åtgärd kommer att påverka vilka webbplatser användaren kan kommentera på, använda reaktioner och rapportera kommentarer.
community-banModal-cancel = Avbryt
community-banModal-updateBan = Spara
community-banModal-ban = Avstänga
community-banModal-unban = Återaktivera
community-banModal-customize = Anpassa avstängningsmeddelande
community-banModal-reject-existing = Avvisa alla kommentarer av denna användare
community-banModal-reject-existing-specificSites = Avvisa alla kommentarer på dessa webbplatser
community-banModal-reject-existing-singleSite = Avvisa alla kommentarer på denna webbplats

community-banModal-noSites = Inga webbplatser
community-banModal-banFrom = Stäng av från
community-banModal-allSites = Alla webbplatser
community-banModal-specificSites = Specifika webbplatser

community-suspendModal-areYouSure = Blockera av <strong>{ $username }</strong>?
community-suspendModal-consequence =
  När blockerad kommer denna användare inte längre att kunna kommentera, använda reaktioner eller rapportera kommentarer.
community-suspendModal-duration-3600 = 1 timme
community-suspendModal-duration-10800 = 3 timmar
community-suspendModal-duration-86400 = 24 timmar
community-suspendModal-duration-604800 = 7 dagar
community-suspendModal-cancel = Avbryt
community-suspendModal-suspendUser = Blockera användare
community-suspendModal-emailTemplate =
  Hej { $username },

  I enlighet med { $organizationName }s communityriktlinjer har ditt konto tillfälligt stängts av. Under avstängningen kommer du inte att kunna kommentera, flagga eller interagera med andra kommentatorer. Du är välkommen tillbaka till konversationen om { framework-timeago-time }.

community-suspendModal-customize = Anpassa blockeringsmeddelande

community-suspendModal-success =
  <strong>{ $username }</strong> har blivit blockerad i <strong>{ $duration }</strong>

community-suspendModal-success-close = Stäng
community-suspendModal-selectDuration = Välj längd på blockeringen

community-premodModal-areYouSure =
  Är du säker på att du alltid vill förhandsmoderera <strong>{ $username }</strong>?
community-premodModal-consequence =
  Alla deras kommentarer kommer att hamna i kön för godkännande tills du tar bort denna status.
community-premodModal-cancel = Avbryt
community-premodModal-premodUser = Ja, förhandsmoderera alltid

community-siteRoleModal-assignSites =
  Tilldela webbplatser för <strong>{ $username }</strong>
community-siteRoleModal-assignSitesDescription-siteModerator =
  Webbplatsmoderatorer tillåts göra modereringsbeslut och utfärda avstängningar på de webbplatser de är tilldelade.
community-siteRoleModal-cancel = Avbryt
community-siteRoleModal-update = Uppdatera
community-siteRoleModal-selectSites-siteModerator = Välj webbplatser att moderera
community-siteRoleModal-selectSites-member = Välj webbplatser för denna användare att vara medlem av
community-siteRoleModal-noSites = Inga webbplatser

community-invite-inviteMember = Bjud in medlemmar till din organisation
community-invite-emailAddressLabel = E-postadress:
community-invite-inviteMore = Bjud in fler
community-invite-inviteAsLabel = Bjud in som:
community-invite-sendInvitations = Skicka inbjudningar
community-invite-role-staff =
  <strong>Personalroll:</strong> Tilldelas en “Personal”-märkning, och
  kommentarer godkänns automatiskt. Kan inte moderera
  eller ändra någon { -product-name }-konfiguration.
community-invite-role-moderator =
  <strong>Moderatorroll:</strong> Tilldelas en
  “Personal”-märkning, och kommentarer godkänns automatiskt.
  Har fulla modereringsprivilegier (godkänna,
  avvisa och framhäva kommentarer). Kan konfigurera enskilda
  artiklar men inga webbplatsövergripande konfigurationsprivilegier.
community-invite-role-admin =
  <strong>Adminroll:</strong> Tilldelas en “Personal”-märkning, och
  kommentarer godkänns automatiskt. Har fulla
  modereringsprivilegier (godkänna, avvisa och framhäva
  kommentarer). Kan konfigurera enskilda artiklar och har
  webbplatsövergripande konfigurationsprivilegier.
community-invite-invitationsSent = Dina inbjudningar har skickats!
community-invite-close = Stäng
community-invite-invite = Bjud in

community-warnModal-success =
  En varning har skickats till <strong>{ $username }</strong>.
community-warnModal-success-close = Ok
community-warnModal-areYouSure = Varna <strong>{ $username }</strong>?
community-warnModal-consequence = En varning kan förbättra en kommentators beteende utan blockering eller avstängning. Användaren måste erkänna varningen innan de kan fortsätta kommentera.
community-warnModal-message-label = Meddelande
community-warnModal-message-required = Krävs
community-warnModal-message-description = Förklara för denna användare hur de ska ändra sitt beteende på din webbplats.
community-warnModal-cancel = Avbryt
community-warnModal-warnUser = Varna användare
community-userStatus-warn = Varna
community-userStatus-warnEverywhere = Varna överallt
community-userStatus-message = Meddelande

community-modMessageModal-success = Ett meddelande har skickats till <strong>{ $username }</strong>.
community-modMessageModal-success-close = Ok
community-modMessageModal-areYouSure = Meddela <strong>{ $username }</strong>?
community-modMessageModal-consequence = Skicka ett meddelande till en kommentator som endast är synligt för dem.
community-modMessageModal-message-label = Meddelande
community-modMessageModal-message-required = Krävs
community-modMessageModal-cancel = Avbryt
community-modMessageModal-messageUser = Meddela användare

## Stories
stories-emptyMessage = Det finns för närvarande inga publicerade artiklar.
stories-noMatchMessage = Vi kunde inte hitta några artiklar som matchar dina kriterier.

stories-filter-searchField =
  .placeholder = Sök efter artikelns titel eller författare...
  .aria-label = Sök efter artikelns titel eller författare
stories-filter-searchButton =
  .aria-label = Sök

stories-filter-statusSelectField =
  .aria-label = Sök efter status

stories-changeStatusButton =
  .aria-label = Ändra status

stories-filter-search = Sök
stories-filter-showMe = Visa Mig
stories-filter-allStories = Alla Artiklar
stories-filter-openStories = Öppna Artiklar
stories-filter-closedStories = Stängda Artiklar

stories-column-title = Titel
stories-column-author = Författare
stories-column-publishDate = Publiceringsdatum
stories-column-status = Status
stories-column-clickToModerate = Klicka på titeln för att moderera artikeln
stories-column-reportedCount = Anmälda
stories-column-pendingCount = Väntande
stories-column-publishedCount = Publicerade

stories-status-popover =
  .description = En rullgardinsmeny för att ändra artikelns status

storyInfoDrawer-rescrapeTriggered = Startad
storyInfoDrawer-triggerRescrape = Hämta om metadata
storyInfoDrawer-title = Artikeldetaljer
storyInfoDrawer-titleNotAvailable = Artikelns titel inte tillgänglig
storyInfoDrawer-authorNotAvailable = Författare inte tillgänglig
storyInfoDrawer-publishDateNotAvailable = Publiceringsdatum inte tillgängligt
storyInfoDrawer-scrapedMetaData = Hämtad metadata
storyInfoDrawer-configure = Konfigurera
storyInfoDrawer-storyStatus-open = Öppen
storyInfoDrawer-storyStatus-closed = Stängd
storyInfoDrawer-moderateStory = Moderera
storyInfoDrawerSettings-premodLinksEnable = Förhandsmoderera kommentarer som innehåller länkar
storyInfoDrawerSettings-premodCommentsEnable = Förhandsmoderera alla kommentarer
storyInfoDrawerSettings-moderation = Moderering
storyInfoDrawerSettings-moderationMode-pre = Förhands
storyInfoDrawerSettings-moderationMode-post = Efterhands
storyInfoDrawerSettings-update = Uppdatera
storyInfoDrawer-storyStatus-archiving = Arkiverar
storyInfoDrawer-storyStatus-archived = Arkiverad
storyInfoDrawer-cacheStory-recache = Återhämta artikeln
storyInfoDrawer-cacheStory-recaching = Återhämtar
storyInfoDrawer-cacheStory-cached = Hämtad
storyInfoDrawer-cacheStory-uncacheStory = Rensa cache
storyInfoDrawer-cacheStory-uncaching = Rensar

## Invite

invite-youHaveBeenInvited = Du har blivit inbjuden att gå med i { $organizationName }
invite-finishSettingUpAccount = Slutför inställningen av kontot för:
invite-createAccount = Skapa konto
invite-passwordLabel = Lösenord
invite-passwordDescription = Måste vara minst { $minLength } tecken
invite-passwordTextField =
  .placeholder = Lösenord
invite-usernameLabel = Användarnamn
invite-usernameDescription = Du får använda "_" och "."
invite-usernameTextField =
  .placeholder = Användarnamn
invite-oopsSorry = Hoppsan, förlåt!
invite-successful = Ditt konto har skapats
invite-youMayNowSignIn = Du kan nu logga in på { -product-name } med:
invite-goToAdmin = Gå till { -product-name } Admin
invite-goToOrganization = Gå till { $organizationName }
invite-tokenNotFound =
  Den angivna länken är ogiltig, kontrollera om den kopierades korrekt.

userDetails-banned-on = <strong>Avstängd den</strong> { $timestamp }
userDetails-banned-by = <strong>av</strong> { $username }
userDetails-suspended-by = <strong>Blockerad av</strong> { $username }
userDetails-suspension-start = <strong>Start:</strong> { $timestamp }
userDetails-suspension-end = <strong>Slut:</strong> { $timestamp }

userDetails-warned-on = <strong>Varnad den</strong> { $timestamp }
userDetails-warned-by = <strong>av</strong> { $username }
userDetails-warned-explanation = Användaren har inte erkänt varningen.

configure-general-reactions-title = Reaktioner
configure-general-reactions-explanation =
  Låt din community engagera sig med varandra och uttrycka sig
  med enklicksreaktioner. Som standard tillåter Coral kommentatorer att "Gilla"
  varandras kommentarer.
configure-general-reactions-label = Etikett för reaktion
configure-general-reactions-input =
  .placeholder = T.ex. Gille
configure-general-reactions-active-label = Aktiv etikett för reaktion
configure-general-reactions-active-input =
  .placeholder = T.ex. Gillad
configure-general-reactions-sort-label = Sorteringsetikett
configure-general-reactions-sort-input =
  .placeholder = T.ex. Mest gillad
configure-general-reactions-preview = Förhandsgranska
configure-general-reaction-sortMenu-sortBy = Sortera efter

configure-general-newCommenter-title = Märke för nya kommentatorer
configure-general-newCommenter-explanation = Lägg till <icon></icon> märke till kommentatorer som skapat sina konton de senaste sju dagarna.
configure-general-newCommenter-enabled = Aktivera märken för nya kommentatorer

configure-general-badges-title = Medlemsmärken
configure-general-badges-explanation =
  Visa ett anpassat märke för användare med specifika roller. Detta märke visas
  i kommentarsflödet och i admin-gränssnittet.
configure-general-badges-label = Text för märke
configure-general-badges-staff-member-input =
  .placeholder = T.ex. Personal
configure-general-badges-moderator-input =
  .placeholder = T.ex. Moderator
configure-general-badges-admin-input =
  .placeholder = T.ex. Admin
configure-general-badges-member-input =
  .placeholder = T.ex. Medlem
configure-general-badges-preview = Förhandsgranska
configure-general-badges-staff-member-label = Text för personalmärke
configure-general-badges-admin-label = Text för adminmärke
configure-general-badges-moderator-label = Text för moderatormärke
configure-general-badges-member-label = Text för medlemsmärke

configure-general-rte-title = Kommentarer med rik text
configure-general-rte-express = Ge din community fler sätt att uttrycka sig utöver ren text med formatering av rik text.
configure-general-rte-richTextComments = Kommentarer med rik text
configure-general-rte-onBasicFeatures = På - fetstil, kursiv, blockcitat och punktlistor
configure-general-rte-additional = Ytterligare alternativ för rik text
configure-general-rte-strikethrough = Genomstruken
configure-general-rte-spoiler = Spoiler
configure-general-rte-spoilerDesc =
  Ord och fraser formaterade som Spoiler är dolda bakom en
  mörk bakgrund tills läsaren väljer att avslöja texten.

configure-general-dsaConfig-title = Funktionssätt för Digital Services Act
configure-general-dsaConfig-description =
  EU:s Digital Services Act (DSA) kräver att utgivare baserade i EU eller som riktar sig till EU-medborgare tillhandahåller vissa funktioner till sina kommentatorer och moderatorer.
  <br/>
  <br/>
  Corals DSA-verktyg inkluderar:
  <br/>
  <ul style="padding-inline-start: var(--spacing-5);">
    <li>Ett dedikerat flöde för kommentarer som rapporteras som olagliga</li>
    <li>Obligatoriska modereringsorsaker för varje avvisad kommentar</li>
    <li>Notifieringar till kommentatorer för rapportering av olagliga kommentarer och avvisade kommentarer</li>
    <li>Obligatorisk text som förklarar metoder för omprövning/överklagande, om någon</li>
  </ul>
configure-general-dsaConfig-reportingAndModerationExperience =
  DSA-rapportering och modereringsupplevelse
configure-general-dsaConfig-methodOfRedress =
  Välj din metod för omprövning
configure-general-dsaConfig-methodOfRedress-explanation =
  Låt användarna veta om och hur de kan överklaga ett modereringsbeslut
configure-general-dsaConfig-methodOfRedress-none = Ingen
configure-general-dsaConfig-methodOfRedress-email = E-post
configure-general-dsaConfig-methodOfRedress-email-placeholder = moderation@example.com
configure-general-dsaConfig-methodOfRedress-url = URL
configure-general-dsaConfig-methodOfRedress-url-placeholder = https://moderation.example.com

configure-account-features-title = Funktioner för hantering av kommentarskonton
configure-account-features-explanation =
  Du kan aktivera och inaktivera vissa funktioner för dina kommentatorer att använda
  inom deras profil. Dessa funktioner hjälper även till med GDPR-
  efterlevnad.
configure-account-features-allow = Tillåt användare att:
configure-account-features-change-usernames = Ändra sina användarnamn
configure-account-features-change-usernames-details = Användarnamn kan ändras en gång var 14:e dag.
configure-account-features-yes = Ja
configure-account-features-no = Nej
configure-account-features-download-comments = Ladda ner sina kommentarer
configure-account-features-download-comments-details = Kommentatorer kan ladda ner en csv med sin kommentarshistorik.
configure-account-features-delete-account = Radera sitt konto
configure-account-features-delete-account-details =
  Tar bort alla deras kommentardata, användarnamn och e-postadress från webbplatsen och databasen.

configure-account-features-delete-account-fieldDescriptions =
  Tar bort alla deras kommentardata, användarnamn och e-postadress
  från webbplatsen och databasen.

configure-advanced-stories = Skapande av artiklar
configure-advanced-stories-explanation = Avancerade inställningar för hur artiklar skapas inom Coral.
configure-advanced-stories-lazy = Enkelt artikelskapande
configure-advanced-stories-lazy-detail = Aktivera automatiskt skapande av artiklar när de publiceras från ditt CMS.
configure-advanced-stories-scraping = Skrapning av artiklar
configure-advanced-stories-scraping-detail = Aktivera automatisk skrapning av artikelmetadata när de publiceras från ditt CMS.
configure-advanced-stories-proxy = Proxy-URL för skrapning
configure-advanced-stories-proxy-detail =
  När den är specificerad, tillåter skrapningsförfrågningar att använda den angivna
  proxyn. Alla förfrågningar kommer sedan att passera genom den lämpliga
  proxyn som tolkas av <externalLink>npm proxy-agent</externalLink>-paketet.
configure-advanced-stories-custom-user-agent = Anpassad User Agent Header för Skrapare
configure-advanced-stories-custom-user-agent-detail =
  När den är specificerad, åsidosätter den <code>User-Agent</code>-headern som skickas med varje
  skrapningsförfrågan.

configure-advanced-stories-authentication = Autentisering
configure-advanced-stories-scrapingCredentialsHeader = Skrapningsuppgifter
configure-advanced-stories-scraping-usernameLabel = Användarnamn
configure-advanced-stories-scraping-passwordLabel = Lösenord

commentAuthor-status-banned = Avstängd
commentAuthor-status-premod = Förhandsmod
commentAuthor-status-suspended = Blockerad

hotkeysModal-title = Tangentbordsgenvägar
hotkeysModal-navigation-shortcuts = Navigeringsgenvägar
hotkeysModal-shortcuts-next = Nästa kommentar
hotkeysModal-shortcuts-prev = Föregående kommentar
hotkeysModal-shortcuts-search = Öppna sökning
hotkeysModal-shortcuts-jump = Hoppa till specifik kö
hotkeysModal-shortcuts-switch = Byt köer
hotkeysModal-shortcuts-toggle = Växla hjälp för genvägar
hotkeysModal-shortcuts-single-view = Singel-kommentarsvy
hotkeysModal-moderation-decisions = Modereringsbeslut
hotkeysModal-shortcuts-approve = Godkänn
hotkeysModal-shortcuts-reject = Avvisa
hotkeysModal-shortcuts-ban = Stäng av författare
hotkeysModal-shortcuts-zen = Växla singel-kommentarsvy

authcheck-network-error = Ett nätverksfel inträffade. Vänligen uppdatera sidan.

dashboard-heading-last-updated = Senast uppdaterad:

dashboard-today-heading = Dagens aktivitet
dashboard-today-new-comments = Nya kommentarer
dashboard-alltime-new-comments = Totalt någonsin
dashboard-alltime-new-comments-archiveEnabled = { $value } { $unit ->
    [second] { $value ->
      [1] sekund
      *[other] sekunder
    }
    [minute] { $value ->
      [1] minut
      *[other] minuter
    }
    [hour] { $value ->
      [1] timme
      *[other] timmar
    }
    [day] { $value ->
      [1] dag
      *[other] dagar
    }
    [week] { $value ->
      [1] vecka
      *[other] veckor
    }
    [month] { $value ->
      [1] månad
      *[other] månader
    }
    [year] { $value ->
      [1] år
      *[other] år
    }
    *[other] okänd enhet
  } totalt
dashboard-today-rejections = Avvisningsfrekvens
dashboard-alltime-rejections = Genomsnitt sedan start
dashboard-alltime-rejections-archiveEnabled = { $value } { $unit ->
    [second] { $value ->
      [1] sekund
      *[other] sekunder
    }
    [minute] { $value ->
      [1] minut
      *[other] minuter
    }
    [hour] { $value ->
      [1] timme
      *[other] timmar
    }
    [day] { $value ->
      [1] dag
      *[other] dagar
    }
    [week] { $value ->
      [1] vecka
      *[other] veckor
    }
    [month] { $value ->
      [1] månad
      *[other] månader
    }
    [year] { $value ->
      [1] år
      *[other] år
    }
    *[other] okänd enhet
  } genomsnitt
dashboard-today-staffPlus-comments = Kommentarer från personal+
dashboard-alltime-staff-comments = Totalt sedan start
dashboard-alltime-staff-comments-archiveEnabled = { $value } { $unit ->
    [second] { $value ->
      [1] sekund
      *[other] sekunder
    }
    [minute] { $value ->
      [1] minut
      *[other] minuter
    }
    [hour] { $value ->
      [1] timme
      *[other] timmar
    }
    [day] { $value ->
      [1] dag
      *[other] dagar
    }
    [week] { $value ->
      [1] vecka
      *[other] veckor
    }
    [month] { $value ->
      [1] månad
      *[other] månader
    }
    [year] { $value ->
      [1] år
      *[other] år
    }
    *[other] okänd enhet
  } totalt
dashboard-today-signups = Nya communitymedlemmar
dashboard-alltime-signups = Totalt antal medlemmar
dashboard-today-bans = Avstängda medlemmar
dashboard-alltime-bans = Totalt antal avstängda medlemmar

dashboard-top-stories-today-heading = Dagens mest kommenterade artiklar
dashboard-top-stories-table-header-story = Artikel
dashboard-top-stories-table-header-comments = Kommentarer
dashboard-top-stories-no-comments = Inga kommentarer idag

dashboard-commenters-activity-heading = Nya communitymedlemmar denna vecka

dashboard-comment-activity-heading = Kommentaraktivitet per timme
dashboard-comment-activity-tooltip-comments = Kommentarer
dashboard-comment-activity-legend = Genomsnitt senaste 3 dagarna

conversation-modal-conversationOn = Konversation om:
conversation-modal-moderateStory = Moderera artikel
conversation-modal-showMoreParents = Visa mer av denna konversation
conversation-modal-showReplies = Visa svar
conversation-modal-commentNotFound = Kommentaren hittades inte.
conversation-modal-showMoreReplies = Visa fler svar
conversation-modal-header-title = Konversation om:
conversation-modal-header-moderate-link = Moderera artikel
conversation-modal-rejectButton = <icon></icon>Avvisa
  .aria-label = Avvisa
conversation-modal-rejectButton-rejected = <icon></icon>Avvisad
  .aria-label = Avvisad

# DSA-rapporter flik
reportsTable-column-created = Skapad
reportsTable-column-lastUpdated = Senast uppdaterad
reportsTable-column-reportedBy = Rapporterad av
reportsTable-column-reference = Referens
reportsTable-column-lawBroken = Brott mot lag
reportsTable-column-commentAuthor = Kommentarens författare
reportsTable-column-status = Status
reportsTable-emptyReports = Det finns inga DSA-rapporter att visa.

reports-sortMenu-newest = Nyaste
reports-sortMenu-oldest = Äldsta
reports-sortMenu-sortBy = Sortera efter

reports-table-showClosedReports = Visa stängda rapporter
reports-table-showOpenReports = Visa öppna rapporter

reports-singleReport-reportsLinkButton = <icon></icon> Alla DSA-rapporter
reports-singleReport-reportID = Rapport-ID
reports-singleReport-shareButton = <icon></icon> CSV
reports-singleReport-reporter = Rapportör
reports-singleReport-reporterNameNotAvailable = Rapportörens namn inte tillgängligt
reports-singleReport-reportDate = Rapportdatum
reports-singleReport-lawBroken = Vilken lag bröts?
reports-singleReport-explanation = Förklaring
reports-singleReport-comment = Kommentar
reports-singleReport-comment-notAvailable = Denna kommentar är inte tillgänglig.
reports-singleReport-comment-deleted = Denna kommentar är inte längre tillgänglig. Användaren har raderat sitt konto.
reports-singleReport-comment-edited = (redigerad)
reports-singleReport-comment-viewCommentStream = Visa kommentar i strömmen
reports-singleReport-comment-viewCommentModeration = Visa kommentar i moderering
reports-singleReport-comment-rejected = Avvisad
reports-singleReport-comment-unavailableInStream = Ej tillgänglig i strömmen
reports-singleReport-commentOn = Kommentar om
reports-singleReport-history = Historik
reports-singleReport-history-reportSubmitted = Rapport om olagligt innehåll inskickad
reports-singleReport-history-addedNote = { $username } lade till en anteckning
reports-singleReport-history-deleteNoteButton = <icon></icon> Radera
reports-singleReport-history-madeDecision-illegal = { $username } fattade beslut om att denna rapport innehåller olagligt innehåll
reports-singleReport-history-madeDecision-legal = { $username } fattade beslut om att denna rapport inte innehåller olagligt innehåll
reports-singleReport-history-legalGrounds = Juridiska grunder: { $legalGrounds }
reports-singleReport-history-explanation = Förklaring: { $explanation }
reports-singleReport-history-changedStatus = { $username } ändrade status till { $status }
reports-singleReport-reportVoid = Användaren raderade sitt konto. Rapporten är ogiltig.
reports-singleReport-history-sharedReport = { $username } laddade ner denna rapport
reports-singleReport-note-field =
  .placeholder = Lägg till din anteckning...
reports-singleReport-addUpdateButton = <icon></icon> Lägg till uppdatering
reports-singleReport-decisionLabel = Beslut
reports-singleReport-decision-legalGrounds = Juridiska grunder
reports-singleReport-decision-explanation = Detaljerad förklaring
reports-singleReport-makeDecisionButton = <icon></icon> Beslut
reports-singleReport-decision-doesItContain = Innehåller denna kommentar olagligt innehåll?
reports-singleReport-decision-doesItContain-yes = Ja
reports-singleReport-decision-doesItContain-no = Nej

reports-status-awaitingReview = Väntar på granskning
reports-status-inReview = Under granskning
reports-status-completed = Avslutad
reports-status-void = Ogiltig
reports-status-unknown = Okänd status

reports-changeStatusModal-prompt-addNote = Du har lagt till en anteckning. Vill du uppdatera din status till Under granskning.
reports-changeStatusModal-prompt-downloadReport = Du har laddat ner rapporten. Vill du uppdatera din status till Under granskning.
reports-changeStatusModal-prompt-madeDecision = Du har fattat ett beslut. Vill du uppdatera din status till Avslutad.
reports-changeStatusModal-updateButton = Ja, uppdatera
reports-changeStatusModal-dontUpdateButton = Nej
reports-changeStatusModal-header = Uppdatera status?

reports-decisionModal-header = Rapportbeslut
reports-decisionModal-prompt = Verkar denna kommentar innehålla olagligt innehåll?
reports-decisionModal-yes = Ja
reports-decisionModal-no = Nej
reports-decisionModal-submit = Skicka
reports-decisionModal-lawBrokenLabel = Brott mot lag
reports-decisionModal-lawBrokenTextfield =
  .placeholder = Lägg till lag...
reports-decisionModal-detailedExplanationLabel = Detaljerad förklaring
reports-decisionModal-detailedExplanationTextarea =
  .placeholder = Lägg till förklaring...

reports-relatedReports-label = Relaterade rapporter
reports-relatedReports-reportIDLabel = Rapport-ID

reports-anonymousUser = Anonym användare
reports-username-not-available = Användarnamn inte tillgängligt

# Kontrollpanel

controlPanel-redis-redis = Redis
controlPanel-redis-flushRedis = Rensa Redis
controlPanel-redis-flush = Rensa
