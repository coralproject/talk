### Localization for Admin

## General
general-notAvailable = Non disponibile
general-none = Nessuno
general-noTextContent = Nessun contesto

## Story Status
storyStatus-open = Aperto
storyStatus-closed = Chiuso
storyStatus-archiving = Archiviato
storyStatus-archived = Archiviato

## Roles
role-admin = Admin
role-moderator = Moderatore
role-siteModerator = Moderatore del sito
role-organizationModerator = Moderator dell’organizzazione
role-staff = Staff
role-commenter = Commentatore

role-plural-admin = Admins
role-plural-moderator = Moderatori
role-plural-staff = Staff
role-plural-commenter = Commentatori

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

## User Statuses
userStatus-active = Attivo
userStatus-banned = Bannato
userStatus-siteBanned = Bannato dal sito
userStatus-banned-all = Bannato (all)
userStatus-banned-count = Bannato ({$count})
userStatus-suspended = Sospeso
userStatus-premod = Sempre pre-moderato
userStatus-warned = Avvisato

# Queue Sort
queue-sortMenu-newest = Ultimo
queue-sortMenu-oldest = Primo

## Navigation
navigation-moderate = Moderate
navigation-community = Community
navigation-stories = Stories
navigation-configure = Configure
navigation-dashboard = Dashboard

## User Menu
userMenu-signOut = Sign Out
userMenu-viewLatestRelease = View Latest Release
userMenu-reportBug = Segnala un bug o dai un feedback
userMenu-popover =
  .description = Una finestra di dialogo del menu utente con i relativi collegamenti e azioni

## Restricted
restricted-currentlySignedInTo = Attualmente registrato a
restricted-noPermissionInfo = Non hai il permesso per accedere a questa pagina.
restricted-signedInAs = Sei registrato come: <strong>{ $username }</strong>
restricted-signInWithADifferentAccount = Registrati con un account diverso
restricted-contactAdmin = Se pensi che sia un errore, contatta il nostro amministratore per assistenza.

## Login

# Sign In
login-signInTo = Sign in to
login-signIn-enterAccountDetailsBelow = Inserisci I dettagli del tuo account qui sotto

login-emailAddressLabel = Indirizzo e-mail
login-emailAddressTextField =
  .placeholder = Indirizzo e-mail

login-signIn-passwordLabel = Password
login-signIn-passwordTextField =
  .placeholder = Password

login-signIn-signInWithEmail = Entra con l’e-mail
login-orSeparator = O
login-signIn-forgot-password = Password dimenticata?

login-signInWithFacebook = Accedi con Facebook
login-signInWithGoogle = Accedi con Google
login-signInWithOIDC = Accedi con { $name }

# Create Username

createUsername-createUsernameHeader = Crea Username
createUsername-whatItIs =
 Il tuo username apparirà come tuo identificativo nei tuoi commenti.
createUsername-createUsernameButton = Crea Username
createUsername-usernameLabel = Username
createUsername-usernameDescription = Puoi usare “_” e “.” Non sono ammessi spazi.
createUsername-usernameTextField =
  .placeholder = Username

# Add Email Address
addEmailAddress-addEmailAddressHeader = Aggiungi indirizzo e-mail

addEmailAddress-emailAddressLabel = Indirizzo e-mail
addEmailAddress-emailAddressTextField =
  .placeholder = Indirizzo e-mail

addEmailAddress-confirmEmailAddressLabel = Conferma indirizzo e-mail
addEmailAddress-confirmEmailAddressTextField =
  .placeholder = Conferma indirizzo e-mail

addEmailAddress-whatItIs =
  Per una magigore sicurezza, chiediamo agli utenti di aggiungere un indirizzo e-mail ai propri account.

addEmailAddress-addEmailAddressButton =
  Aggiungi indirizzo e-mail

# Create Password
createPassword-createPasswordHeader = Crea Password
createPassword-whatItIs =
 Per proteggerti da modifiche non autorizzate del tuo account, chiediamo agli utenti di creare una password.
createPassword-createPasswordButton =
  Crea Password

createPassword-passwordLabel = Password
createPassword-passwordDescription = Deve essere almeno di {$minLength} caratteri
createPassword-passwordTextField =
  .placeholder = Password

# Forgot Password
forgotPassword-forgotPasswordHeader = Password dimenticata?
forgotPassword-checkEmailHeader = Controlla la tua e-mail
forgotPassword-gotBackToSignIn = Torna alla pagina per accedere
forgotPassword-checkEmail-receiveEmail =
  Se c’è un account associate con <strong>{ $email }</strong>,
  Riceverai un’e-mail con un link per creare una nuova password.
forgotPassword-enterEmailAndGetALink =
  Inserisci il tuo indirizzo e-mail qui sotto e ti invieremo un link per resettare la tua password.
forgotPassword-emailAddressLabel = Indirizzo e-mail
forgotPassword-emailAddressTextField =
  .placeholder = Indirizzo e-mail
forgotPassword-sendEmailButton = Invia email

# Link Account
linkAccount-linkAccountHeader = Link Account
linkAccount-alreadyAssociated =
  L’e-mail <strong>{ $email }</strong> è già associata ad un account. Se vuoi collegarli, inserisci la password.
linkAccount-passwordLabel = Password
linkAccount-passwordTextField =
  .label = Password
linkAccount-linkAccountButton = Link Account
linkAccount-useDifferentEmail = Usa un indirizzo e-mail diverso

## Configure

configure-experimentalFeature = Experimental Feature

configure-unsavedInputWarning =
  Non hai salvato le modifiche. Sei sicuro di voler continuare?

configure-sideBarNavigation-general = Generale
configure-sideBarNavigation-authentication = Autenticazione
configure-sideBarNavigation-moderation = Moderazione
configure-sideBarNavigation-moderation-comments = Commenti
configure-sideBarNavigation-moderation-users = Users
configure-sideBarNavigation-organization = Organizzazione
configure-sideBarNavigation-moderationPhases = Fasi Moderazione
configure-sideBarNavigation-advanced = Avanzato
configure-sideBarNavigation-email = E-mail
configure-sideBarNavigation-bannedAndSuspectWords = Parole bannate e sospette
configure-sideBarNavigation-slack = Slack
configure-sideBarNavigation-webhooks = Webhooks

configure-sideBar-saveChanges = Salva modifice
configure-configurationSubHeader = Configurazione
configure-onOffField-on = On
configure-onOffField-off = Off
configure-radioButton-allow = Permetti
configure-radioButton-dontAllow = Non permettere

### Moderation Phases

configure-moderationPhases-generatedAt = KEY GENERATED AT:
  { DATETIME($date, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric") }
configure-moderationPhases-phaseNotFound = Fase moderazione sterna non trovata
configure-moderationPhases-experimentalFeature =
  La funzione delle fasi di moderazione personalizzata è attualmente in fase di sviluppo attivo.
  Please <ContactUsLink>contact us with any feedback or requests</ContactUsLink>.
configure-moderationPhases-header-title = Moderation Phases
configure-moderationPhases-description =
  Configura una fase di moderazione esterna per automatizzare alcune azioni. Le richieste di moderazione saranno codificate e firmate in JSON. Per saperne di più sulle richieste di moderazione, visita il nostro sito <externalLink>docs</externalLink>.
configure-moderationPhases-addExternalModerationPhaseButton =
  Aggiungi fase di moderazione esterna
configure-moderationPhases-moderationPhases = Fasi di moderazione
configure-moderationPhases-name = Nome
configure-moderationPhases-status = Status
configure-moderationPhases-noExternalModerationPhases =
  Non ci sono fasi di moderazione esterna configurate, aggiungine una sopra.
configure-moderationPhases-enabledModerationPhase = Attivato
configure-moderationPhases-disableModerationPhase = Disattivato
configure-moderationPhases-detailsButton = Details <icon>keyboard_arrow_right</icon>
configure-moderationPhases-addExternalModerationPhase = Aggiungi fase di moderazione esterna
configure-moderationPhases-updateExternalModerationPhaseButton = Aggiorna dettagli
configure-moderationPhases-cancelButton = Cancella
configure-moderationPhases-format = Format del corpo del commento
configure-moderationPhases-endpointURL = Callback URL
configure-moderationPhases-timeout = Timeout
configure-moderationPhases-timeout-details =
  Il tempo che Coral aspetterà la tua risposta di moderazione in millisecondi.
configure-moderationPhases-format-details =
 Il formato in cui Coral invierà il corpo del commento. Per impostazione predefinita, Coral invia il commento nel formato originale codificato in HTML. Se "Plain Text" è selezionato, verrà invece inviata la versione HTML stripped.
configure-moderationPhases-format-html = HTML
configure-moderationPhases-format-plain = Plain Text
configure-moderationPhases-endpointURL-details =
 L'URL a cui saranno inviate le richieste di moderazione di Coral. L'URL fornito deve rispondere entro il timeout designato o la decisione dell'azione di moderazione sarà saltata.
configure-moderationPhases-configureExternalModerationPhase =
  Configura fase di moderazione esterna
configure-moderationPhases-phaseDetails = Dettagli di fase
onfigure-moderationPhases-status = Status
configure-moderationPhases-signingSecret = Firma digitale
configure-moderationPhases-signingSecretDescription =
  La seguente firma digitale è usata per firmare i payload di richiesta inviati all'URL. Per saperne di più sulla firma dei webhook, visita il nostro sito <externalLink>docs</externalLink>.
configure-moderationPhases-phaseStatus = Status fase
configure-moderationPhases-status = Status
configure-moderationPhases-signingSecret = Firma digitale
configure-moderationPhases-signingSecretDescription =
 La seguente firma digitale è usata per firmare i payload di richiesta inviati all'URL. Per saperne di più sulla firma dei webhook, visita il nostro sito <externalLink>docs</externalLink>.
configure-moderationPhases-dangerZone = Zona pericolosa
configure-moderationPhases-rotateSigningSecret = Ruota firma digitale
configure-moderationPhases-rotateSigningSecretDescription =
  La rotazione della firma digitale vi permetterà di sostituire in modo sicuro una firma digitale utilizzata in produzione con un ritardo.
configure-moderationPhases-rotateSigningSecretButton = Ruota firma digitale

configure-moderationPhases-disableExternalModerationPhase =
  Disattiva a fase di moderazione esterna
configure-moderationPhases-disableExternalModerationPhaseDescription =
  Questa fase di moderazione esterna è attualmente attivata. Disattivandola, nessuna nuova richiesta di moderazione sarà inviata all'URL fornito.
configure-moderationPhases-disableExternalModerationPhaseButton = Disattiva fase
configure-moderationPhases-enableExternalModerationPhase =
  Attiva fase di moderazione esterna
configure-moderationPhases-enableExternalModerationPhaseDescription =
  Questa fase di moderazione esterna è attualmente disattivata. Attivandola, le nuove richieste di moderazione saranno inviate all'URL fornito.
configure-moderationPhases-enableExternalModerationPhaseButton = Attiva fase
configure-moderationPhases-deleteExternalModerationPhase =
  Cancella fase di moderazione esterna
configure-moderationPhases-deleteExternalModerationPhaseDescription =
  La cancellazione di questa fase di moderazione esterna fermerà ogni nuova richiesta di moderazione dall'essere inviata a questo URL e rimuoverà tutte le impostazioni associate.
configure-moderationPhases-deleteExternalModerationPhaseButton = Cancella fase
configure-moderationPhases-rotateSigningSecret = Ruota firma digitale
configure-moderationPhases-rotateSigningSecretHelper =
  Dopo la sua scadenza, le firme non saranno più generate con la vecchia firma digitale.
configure-moderationPhases-expiresOldSecret =
  Fai scadere la vecchia firma digitale
configure-moderationPhases-expiresOldSecretImmediately =
  Immediatamente
configure-moderationPhases-expiresOldSecretHoursFromNow =
  { $hours ->
    [1] 1 ora
    *[other] { $hours } ore
  } da ora
configure-moderationPhases-rotateSigningSecretSuccessUseNewSecret =
  La firma digitale della fase di moderazione esterna è stata ruotata. Assicurati di di aggiornare le tue integrazioni per utilizzare la nuova firma digitale qui sotto.
configure-moderationPhases-confirmDisable =
  Disattivando questa fase di moderazione esterna, tutte le nuove richieste di moderazione dall'essere inviata a questo URL. Sei sicuro di voler continuare?
configure-moderationPhases-confirmEnable =
 Attivando questa fase di moderazione esterna, tutte le nuove richieste di moderazione dall'essere inviata a questo URL. Sei sicuro di voler continuare?configure-moderationPhases-confirmDelete =
 L'eliminazione di questa fase di moderazione esterna fermerà qualsiasi nuova richiesta di moderazione dall'essere inviata a questo URL e rimuoverà tutte le impostazioni associate. Sei sicuro di voler continuare?

### Webhooks

configure-webhooks-generatedAt = KEY GENERATED AT:
  { DATETIME($date, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric") }
configure-webhooks-experimentalFeature =
  La funzione webhook è attualmente in fase di sviluppo attivo. Gli eventi possono essere aggiunti o rimossi. Per favore <ContactUsLink>contattaci con un feedback o una richiesta</ContactUsLink>.
configure-webhooks-webhookEndpointNotFound = Endpoint webhook non trovato
configure-webhooks-header-title = Configura webhook endpoint
configure-webhooks-description =
  Configura un endpoint per inviare evenri quando avvengono eventi in Coral. Questi eventi saranno codificati e firmati in JSON. Per saperne di più sulla firma dei webhook, visita il nostro sito <externalLink>Webhook Guide</externalLink>.
configure-webhooks-addEndpoint = Aggiungi webhook endpoint
configure-webhooks-addEndpointButton = Aggiungi webhook endpoint
configure-webhooks-endpoints = Endpoints
configure-webhooks-url = URL
configure-webhooks-status = Status
configure-webhooks-noEndpoints = Non ci sono endpoint webhook configurati, aggiungine uno sopra.
configure-webhooks-enabledWebhookEndpoint = Attivato
configure-webhooks-disabledWebhookEndpoint = Disattivato
configure-webhooks-endpointURL = Endpoint URL
configure-webhooks-cancelButton = Cancella
configure-webhooks-updateWebhookEndpointButton = Aggiorna endpoint webhook
configure-webhooks-eventsToSend = Eventi da mandare
configure-webhooks-clearEventsToSend = Cancella
configure-webhooks-eventsToSendDescription =
  Questi sono gli eventi che sono registrati a questo particolare endpoint. Visita il nostro <externalLink>Webhook Guide</externalLink> per lo schema di questi eventi.
  Ogni evento che corrisponde a quanto segue sarà inviato all'endpoint se è abilitato:
configure-webhooks-allEvents =
  L’endpoint riceverà tutti gli eventi, compresi quelli aggiunti in futuro.
configure-webhooks-selectedEvents =
  { $count } { $count ->
    [1] evento
    *[other] eventi
  } selected.
configure-webhooks-selectAnEvent =
  Seleziona eventi sopra o <button>receive all events</button>.
configure-webhooks-configureWebhookEndpoint = Configura endpoint webhook
configure-webhooks-confirmEnable =
  Abilitando l’endpoint webhook inizierai a inviare eventi a questo URL. Sei sicuro di voler continuare?
configure-webhooks-confirmDisable =
  Disabilitando questo endpoint webhook si impedisce l'invio di nuovi eventi a questo URL. Sei sicuro di voler continuare?
configure-webhooks-confirmDelete =
  L'eliminazione di questo endpoint webhook impedirà l'invio di qualsiasi nuovo evento a questo URL e rimuoverà tutte le impostazioni associate a questo endpoint webhook. Sei sicuro di voler continuare?
configure-webhooks-dangerZone = Zona pericolosa
configure-webhooks-rotateSigningSecret = Ruota firma digitale
configure-webhooks-rotateSigningSecretDescription =
  La rotazione della firma digitale permette di sostituire in modo sicuro la firma digitale usata in produzione con un ritardo.
configure-webhooks-rotateSigningSecretButton = Ruota firma digitale
configure-webhooks-rotateSigningSecretHelper =
  Dopo la sua scadenza, le firme non saranno più generate con la vecchia firma digitale.
configure-webhooks-rotateSigningSecretSuccessUseNewSecret =
  La firma digitale dell'endpoint webhook è stata ruotata. Assicurati di di aggiornare le tue integrazioni per utilizzare la nuova firma digitale qui sotto.
configure-webhooks-disableEndpoint = Disattiva endpoint
configure-webhooks-disableEndpointDescription =
  Questo endpoint è attualmente abilitato. Disabilitando questo endpoint nessun nuovo evento sarà inviato all'URL fornito.
configure-webhooks-disableEndpointButton = Disattiva endpoint
configure-webhooks-enableEndpoint = Attiva endpoint
configure-webhooks-enableEndpointDescription =
  Questo endpoint è attualmente disabilitato. Abilitando questo endpoint i nuovi eventi saranno inviati all'URL fornito.
configure-webhooks-enableEndpointButton = Attiva endpoint
configure-webhooks-deleteEndpoint = Cancella endpoint
configure-webhooks-deleteEndpointDescription =
  La cancellazione dell'endpoint impedirà l'invio di nuovi eventi all'URL fornito.
configure-webhooks-deleteEndpointButton = Cancella endpoint
configure-webhooks-endpointStatus = Status ndpoint
configure-webhooks-signingSecret = Firma digitale
configure-webhooks-signingSecretDescription =
  La seguente firma digitale è usata per firmare i payload di richiesta inviati all'URL. Per saperne di più sulla firma dei webhook, visita il nostro sito
  <externalLink>Webhook Guide</externalLink>.
configure-webhooks-expiresOldSecret = Fai scadere la vecchia firma digitale
configure-webhooks-expiresOldSecretImmediately = Immediatamente
configure-webhooks-expiresOldSecretHoursFromNow =
  { $hours ->
    [1] 1 ora
    *[other] { $hours } ore
  }  da ora
configure-webhooks-detailsButton = Details <icon>keyboard_arrow_right</icon>

### General
configure-general-guidelines-title = Riassunto delle linee guida della community
configure-general-guidelines-explanation =
 Questo apparirà sopra i commenti in tutto il sito.
  Puoi formattare il testo usando Markdown.
 Maggiori informazioni su come usare Markdown qui: <externalLink>https://www.markdownguide.org/cheat-sheet/</externalLink>
configure-general-guidelines-showCommunityGuidelines = Mostra riassunto delle linee guida della community

#### Bio
configure-general-memberBio-title = Biografia membro
configure-general-memberBio-explanation =
  Permettere ai commentatori di aggiungere una biografia al loro profilo. Nota: Questo può aumentare il carico di lavoro dei moderatori perché le biografie dei membri possono essere segnalate.
configure-general-memberBio-label = Permetti biografie membri

#### Locale
configure-general-locale-language = Lingua
configure-general-locale-chooseLanguage = Scegli la lingua per la tua community Coral.
configure-general-locale-invalidLanguage =
  La precedente lingua selezionata <lang></lang> non esiste più. Scegli una lingue differente.

#### Sitewide Commenting
configure-general-sitewideCommenting-title = Commento in tutto il sito
configure-general-sitewideCommenting-explanation =
  Aprire o chiudere i flussi di commenti per i nuovi commenti in tutto il sito.
  Quando i nuovi commenti sono disattivati, i nuovi commenti non possono essere inseriti, ma i commenti esistenti possono continuare a ricevere reazioni, essere segnalati ed essere condivisi.
configure-general-sitewideCommenting-enableNewCommentsSitewide =
  Abilitare i nuovi commenti in tutto il sito
configure-general-sitewideCommenting-onCommentStreamsOpened =
  On - Flussi di commenti aperti per nuovi commenti
configure-general-sitewideCommenting-offCommentStreamsClosed =
  Off - Flussi di commenti chiusi per nuovi commenti
configure-general-sitewideCommenting-message = Messaggio sui commenti chiusi in tutto il sito
configure-general-sitewideCommenting-messageExplanation =
  Scrivi un messaggio che sarà visualizzato quando i flussi di commenti sono chiusi in tutto il sito

#### Embed Links
configure-general-embedLinks-title = Embedded media
configure-general-embedLinks-desc = Consenti ai commentatori di aggiungere un video di YouTube, un Tweet o una GIF dalla libreria di GIPHY alla fine del loro commento
configure-general-embedLinks-enableTwitterEmbeds = Consenti Twitter embed
configure-general-embedLinks-enableYouTubeEmbeds = Consenti YouTube embed
configure-general-embedLinks-enableGiphyEmbeds = Consenti GIFs da GIPHY
configure-general-embedLinks-enableExternalEmbeds = Attiva external media

configure-general-embedLinks-On = Sì
configure-general-embedLinks-Off = No

configure-general-embedLinks-giphyMaxRating = Valutazione del contenuto delle GIF
configure-general-embedLinks-giphyMaxRating-desc = Seleziona la valutazione del contenuto massimo per le GIF che appariranno nel risultato della ricerca dei commentatori

configure-general-embedLinks-giphyMaxRating-g = G
configure-general-embedLinks-giphyMaxRating-g-desc = Contenuto appropriato per tutte le età
configure-general-embedLinks-giphyMaxRating-pg = PG
configure-general-embedLinks-giphyMaxRating-pg-desc = Contenuto che è generalmente sicuro per tutti, ma si consiglia la guida dei genitori per i bambini.
configure-general-embedLinks-giphyMaxRating-pg13 = PG-13
configure-general-embedLinks-giphyMaxRating-pg13-desc = Lievi allusioni sessuali, lieve uso di sostanze, lievi bestemmie o immagini minacciose. Può includere immagini di persone seminude, ma NON mostra veri genitali umani o nudità.
configure-general-embedLinks-giphyMaxRating-r = R
configure-general-embedLinks-giphyMaxRating-r-desc = Linguaggio forte, forti allusioni sessuali, violenza e uso di droghe illegali; non adatto ad adolescenti o giovani. Nessuna nudità.

configure-general-embedLinks-configuration = Configurazione
configure-general-embedLinks-configuration-desc =
  Per ulteriori informazioni sull'API di GIPHY, visita il sito: <externalLink>https://developers.giphy.com/docs/api</externalLink>
configure-general-embedLinks-giphyAPIKey = GIPHY API key


#### Configure Announcements

configure-general-announcements-title = Annuncio Community
configure-general-announcements-description =
  Aggiungi un annuncio temporaneo che apparirà in cima a tutti i flussi di commenti della tua organizzazione per un determinato periodo di tempo.
configure-general-announcements-delete = Rimuovi annuncio
configure-general-announcements-add = Aggiungi annuncio
configure-general-announcements-start = Inizia annuncio
configure-general-announcements-cancel = Cancellla
configure-general-announcements-current-label = Annuncio attuale
configure-general-announcements-current-duration =
  Questo annuncio si chiuderà automaticamente tra: { $timestamp }
configure-general-announcements-duration = Mostra questo annuncio per

#### Closing Comment Streams
configure-general-closingCommentStreams-title = Commenti di chiusura
configure-general-closingCommentStreams-explanation = Imposta commenti di chiusura da chiudere dopo un determinate period di tempo dopo una pubblicazione
configure-general-closingCommentStreams-closeCommentsAutomatically = Chiudi commenti automaticamente
configure-general-closingCommentStreams-closeCommentsAfter = Chiudi commenti dopo

#### Comment Length
configure-general-commentLength-title = Lunghezza commento
configure-general-commentLength-maxCommentLength = Lunghezza massima commento
configure-general-commentLength-setLimit =
  Imposta i requisiti di lunghezza minima e massima dei commenti.
  Gli spazi vuoti all'inizio e alla fine di un commento saranno tagliati.
configure-general-commentLength-limitCommentLength = Limita lunghezza commento
configure-general-commentLength-minCommentLength = Lunghezza minima commento
configure-general-commentLength-characters = Caratteri
configure-general-commentLength-textField =
  .placeholder = Nessun limite
configure-general-commentLength-validateLongerThanMin =
  Inserisci un numero più lungo della lunghezza minima

#### Comment Editing
configure-general-commentEditing-title = Modifica commento
configure-general-commentEditing-explanation =
  Imposta un limite sul tempo che i commentatori hanno per modificare i loro commenti in tutto il sito.
  I commenti modificati sono contrassegnati come (Modificato) nel flusso dei commenti e nel
  pannello di moderazione.
configure-general-commentEditing-commentEditTimeFrame = Tempi di modifica dei commenti
configure-general-commentEditing-seconds = Secondi

#### Flatten replies
configure-general-flattenReplies-title = Risposte piatte
configure-general-flattenReplies-enabled = Risposte piatte attivate
configure-general-flattenReplies-explanation =
  Cambia il modo in cui vengono visualizzati i livelli delle risposte. Quando è abilitato, le risposte ai commenti possono andare fino a quattro livelli di profondità prima di non essere più rientrate nella pagina. Quando è disattivato, dopo una profondità di quattro risposte, il resto della conversazione viene visualizzato in una vista dedicata lontano dagli altri commenti.

#### Closed Stream Message
configure-general-closedStreamMessage-title = Messaggio chiuso sul flusso dei commenti
configure-general-closedStreamMessage-explanation = Scrivi un messaggio che appaia quando una storia è chiusa per i commenti.

### Organization
configure-organization-name = Nome organizzazione
configure-organization-sites = Siti
configure-organization-nameExplanation =
  Il nome della tua organizzazione apparirà nelle e-mail inviate da { -product-name } ai membri della tua comunità e organizzazione.
configure-organization-sites-explanation =
  Aggiungi un nuovo sito alla tua organizzazione o modifica i dettagli di un sito esistente.
configure-organization-sites-add-site = <icon>add</icon> Aggiungi sito
configure-organization-email = Organizzazione e-mail
configure-organization-emailExplanation =
 Questo indirizzo e-mail sarà utilizzato come nelle e-mail e in tutta la piattaforma
  per i membri della comunità per mettersi in contatto con l'organizzazione se
  avere domande sullo stato dei loro account o su questioni di moderazione.
  domande sulla moderazione.
configure-organization-url = Organizzazione URL
configure-organization-urlExplanation =
  L'url della tua organizzazione apparirà nelle e-mail inviate da { -product-name } ai membri della tua comunità e organizzazione.

### Sites
configure-sites-site-details = Dettagli <icon>keyboard_arrow_right</icon>
configure-sites-add-new-site = Aggiungi un nuovo sito a { $site }
configure-sites-add-success = { $site } è stato aggiunto a { $org }
configure-sites-edit-success = Le modifiche a { $site } sono state salvate.
configure-sites-site-form-name = Nome sito
configure-sites-site-form-name-explanation = Il nome del sito apparirà sulle e-mail inviate da Coral alla tua community e ai membri dell’organizzazione.
configure-sites-site-form-url = URL sito
configure-sites-site-form-url-explanation = Questo url apparirà nelle e-mail inviate da Coral ai membri della tua comunità.
configure-sites-site-form-email = Indirizzo e-mail del sito
configure-sites-site-form-url-explanation = Questo indirizzo e-mail serve ai membri della comunità per contattarti con domande o se hanno bisogno di aiuto. Esempio: comments@yoursite.com
configure-sites-site-form-domains = I domini consentiti del sito
configure-sites-site-form-domains-explanation = Domini in cui i tuoi flussi di commenti Coral possono essere incorporati (ex. http://localhost:3000, https://staging.domain.com, https://domain.com).
configure-sites-site-form-submit = <icon>add</icon> Aggiungi sito
configure-sites-site-form-cancel = Cancella
configure-sites-site-form-save = Salva modifiche
configure-sites-site-edit = Edit { $site } dettagli
configure-sites-site-form-embed-code = Incorpora codice
sites-emptyMessage = Non abbiamo trovato nessun sito corrispondente ai tuoi criteri.
sites-selector-allSites = Tutti i siti
site-filter-option-allSites = Tutti i siti

site-selector-all-sites = Tutti i siti
stories-filter-sites-allSites = Tutti i siti
stories-filter-statuses = Status
stories-column-site = Sito
site-table-siteName = Nome sito
stories-filter-sites = Sito

site-search-searchButton =
  .aria-label = Cerca
site-search-textField =
  .aria-label = Cerca tramite il nome del sito
site-search-textField =
  .placeholder = Cerca tramite il nome del sito
site-search-none-found = Nessun sito è stato trovato con questa ricerca
specificSitesSelect-validation = Devi selezionare almeno un sito.

stories-column-actions = Azioni
stories-column-rescrape = Trascina di nuovo

stories-actionsButton =
  .aria-label = Seleziona azione
stories-actions-popover =
  .description = Un menu a tendina per selezionare le azioni della storia
stories-actions-rescrape = Trascina di nuovo
stories-actions-close = Chiudi storia
stories-actions-open = Apri storia
stories-actions-archive = Archivia storia
stories-actions-unarchive = Togli storia dall’archivio

### Sections

moderate-section-selector-allSections = Tutte le sezioni
moderate-section-selector-uncategorized = Non categorizzato
moderate-section-uncategorized = Non categorizzato

### Email

configure-email = Email settings
configure-email-configBoxEnabled = Abilitato
configure-email-fromNameLabel = Dal name
configure-email-fromNameDescription =
  Nome come apparirà su tutte le e-mail in uscita
configure-email-fromEmailLabel = Dall'indirizzo e-mail
configure-email-fromEmailDescription =
  Indirizzo e-mail che sarà utilizzato per inviare messaggi
configure-email-smtpHostLabel = SMTP host
configure-email-smtpHostDescription = (ex. smtp.sendgrid.net)
configure-email-smtpPortLabel = SMTP port
configure-email-smtpPortDescription = (ex. 25)
configure-email-smtpTLSLabel = TLS
configure-email-smtpAuthenticationLabel = SMTP autenticazione
configure-email-smtpCredentialsHeader = Credenziali e-mail
configure-email-smtpUsernameLabel = Username
configure-email-smtpPasswordLabel = Password
configure-email-send-test = Manda e-mail di testo

### Authentication

configure-auth-clientID = Client ID
configure-auth-clientSecret = Client secret
configure-auth-configBoxEnabled = Abilitato
configure-auth-targetFilterCoralAdmin = { -product-name } Admin
configure-auth-targetFilterCommentStream = Comment Stream
configure-auth-redirectURI = Redirect URI
configure-auth-registration = Registrazione
configure-auth-registrationDescription =
  Permettere agli utenti che non si sono registrati prima con questa autenticazione
  di registrarsi per un nuovo account.
configure-auth-registrationCheckBox = Consenti registrazione
configure-auth-pleaseEnableAuthForAdmin =
  Please enable at least one authentication integration for { -product-name } Admin
configure-auth-confirmNoAuthForCommentStream =
 Nessuna integrazione di autenticazione è stata abilitata per il flusso dei commenti.
  Vuoi davvero continuare?

configure-auth-facebook-loginWith = Accedi con Facebook
configure-auth-facebook-toEnableIntegration =
  Per abilitare l'integrazione con Facebook Authentication,
  è necessario creare e impostare un'applicazione web.
  Per maggiori informazioni visita: <Link></Link>.
configure-auth-facebook-useLoginOn = Usa Facebook per entrare

configure-auth-google-loginWith = Accedi con Google
configure-auth-google-toEnableIntegration =
  Per abilitare l'integrazione con Google Authentication è necessario
  creare e impostare un'applicazione web. Per maggiori informazioni visita:
  <Link></Link>.
configure-auth-google-useLoginOn = Usa Google per entrare

configure-auth-sso-loginWith = Accedi con Single Sign On
configure-auth-sso-useLoginOn = Usa Single Sign On per entrare
configure-auth-sso-key = Chiave
configure-auth-sso-regenerate = Rigenera
configure-auth-sso-regenerateAt = CHIAVE RIGENERATA A:
  { DATETIME($date, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric") }
configure-auth-sso-regenerateHonoredWarning =
  Quando si rigenera una chiave, i token firmati con la chiave precedente saranno onorati per 30 giorni.

configure-auth-sso-description =
  Per abilitare l'integrazione con il tuo sistema di autenticazione esistente,
  è necessario creare un token JWT per la connessione. Si può imparare
  di più sulla creazione di un token JWT con <IntroLink>questa introduzione</IntroLink>. Vedere il nostro
  <DocLink>documentazione</DocLink> per ulteriori informazioni sul single sign on.

configure-auth-sso-rotate-keys = Chiavi
configure-auth-sso-rotate-keyID = Chiavi ID
configure-auth-sso-rotate-secret = Secret
configure-auth-sso-rotate-copySecret =
  .aria-label = Copia Secret

configure-auth-sso-rotate-date =
  { DATETIME($date, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric") }
configure-auth-sso-rotate-activeSince = Attivo da
configure-auth-sso-rotate-inactiveAt = Disattivo da
configure-auth-sso-rotate-inactiveSince = Inattivo da

configure-auth-sso-rotate-status = Status
configure-auth-sso-rotate-statusActive = Attivo
configure-auth-sso-rotate-statusExpiring = In scadenza
configure-auth-sso-rotate-statusExpired = Scaduto
configure-auth-sso-rotate-statusUnknown = Sconosciuto

configure-auth-sso-rotate-expiringTooltip =
  Una chiave SSO è in scadenza quando è programmata per la rotazione.
configure-auth-sso-rotate-expiringTooltip-toggleButton =
  .aria-label = Alterna la visibilità del tooltip in scadenza
configure-auth-sso-rotate-expiredTooltip =
  Una chiave SSO è scaduta quando è stata ruotata fuori uso.
configure-auth-sso-rotate-expiredTooltip-toggleButton =
  Alterna la visibilità del tooltip scaduto

configure-auth-sso-rotate-rotate = Ruota
configure-auth-sso-rotate-deactivateNow = Disattivare ora
configure-auth-sso-rotate-delete = Cancella

configure-auth-sso-rotate-now = Ora
configure-auth-sso-rotate-10seconds = 10 secondi da ora
configure-auth-sso-rotate-1day = 1 giorno da ora
configure-auth-sso-rotate-1week = 1 settimana da ora
configure-auth-sso-rotate-30days = 30 giorni da ora
configure-auth-sso-rotate-dropdown-description =
  .description = Un menu a tendina per ruotare la chiave SSO

configure-auth-local-loginWith = Accesso con autenticazione e-mail
configure-auth-local-useLoginOn = Utilizzare l'autenticazione e-mail per il login su
configure-auth-local-forceAdminLocalAuth =
  L'autorizzazione locale dell'amministratore è stata abilitata in modo permanente.
  Questo per garantire che i team del servizio Coral possano accedere al pannello di amministrazione.

configure-auth-oidc-loginWith = Accesso con OpenID Connect
configure-auth-oidc-toLearnMore = Per saperne di più: <Link></Link>
configure-auth-oidc-providerName = Nome provider
configure-auth-oidc-providerNameDescription =
 Il provider dell'integrazione OpenID Connect. Sarà usato quando il nome del provider
  deve essere visualizzato, e.g. “Log in with &lt;Facebook&gt;”.
configure-auth-oidc-issuer = Emittente
configure-auth-oidc-issuerDescription =
  Dopo aver inserito le informazioni sull'emittente, fare clic sul pulsante Scopri per far completare { -nome-prodotto }
  i campi rimanenti. Puoi anche inserire le informazioni manualmente.
configure-auth-oidc-authorizationURL = Autorizzazione URL
configure-auth-oidc-tokenURL = Token URL
configure-auth-oidc-jwksURI = JWKS URI
configure-auth-oidc-useLoginOn = Usa OpenID Connect per entrare

configure-auth-settings = Impostazioni sessione
configure-auth-settings-session-duration-label = Durata sessione

### Moderation

### Recent Comment History

configure-moderation-recentCommentHistory-title = Cronologia recente
configure-moderation-recentCommentHistory-timeFrame = Periodo di tempo della cronologia dei commenti recenti
configure-moderation-recentCommentHistory-timeFrame-description =
  Quantità di tempo per calcolare il tasso di rifiuto di un commentatore.
configure-moderation-recentCommentHistory-enabled = Filtro della cronologia recente
configure-moderation-recentCommentHistory-enabled-description =
  Impedisce ai recidivi di pubblicare commenti senza approvazione.
  Quando il tasso di rifiuto di un commentatore è superiore alla soglia, i suoi
  commenti vengono inviati a Pending per l'approvazione del moderatore. Questo non si
  si applica ai commenti dello Staff.
configure-moderation-recentCommentHistory-triggerRejectionRate = Soglia del tasso di rifiuto
configure-moderation-recentCommentHistory-triggerRejectionRate-description =
  Commenti respinti ÷ (commenti respinti + commenti pubblicati)
  nell'arco di tempo di cui sopra, in percentuale. Non include
  i commenti in sospeso per tossicità, spam o pre-moderazione.

#### Pre-Moderation
configure-moderation-preModeration-title = Pre-moderazione
configure-moderation-preModeration-explanation =
Quando la pre-moderazione è attiva, i commenti non saranno pubblicati a meno che
  approvati da un moderatore.
configure-moderation-preModeration-moderation =
  Pre-modera tutti i commenti
configure-moderation-preModeration-premodLinksEnable =
  Pre-modera tutti i commenti che contengono link
configure-moderation-specificSites = Siti specifici
configure-moderation-allSites = Tutti i siti

configure-moderation-apiKey = Chiavi API

configure-moderation-akismet-title = Filtro di rilevamento dello spam
configure-moderation-akismet-explanation =
  Il filtro API di Akismet avverte gli utenti quando un commento è determinato come probabile
  essere spam. I commenti che Akismet ritiene essere spam non saranno pubblicati
  e vengono messi in coda in attesa di revisione da parte di un moderatore.
  Se approvato da un moderatore, il commento sarà pubblicato.

configure-moderation-premModeration-premodSuspectWordsEnable =
  Pre-moderare tutti i commenti che contengono parole sospette
configure-moderation-premModeration-premodSuspectWordsDescription =
  Puoi visualizzare e modificare la tua lista di parole sospette<wordListLink>qui</wordListLink>

#### Akismet
configure-moderation-akismet-filter = Filtro di rilevamento dello spam
configure-moderation-akismet-ipBased = Rilevamento dello spam basato su IP
configure-moderation-akismet-accountNote =
  Nota: è necessario aggiungere il/i tuo/i dominio/i attivo/i
Nel tuo account Akismet: <externalLink>https://akismet.com/account/</externalLink>
configure-moderation-akismet-siteURL = URL sito


#### Perspective
configure-moderation-perspective-title = Filtro per i commenti tossici
