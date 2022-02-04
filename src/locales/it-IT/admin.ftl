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

moderate-markers-details = Details
moderate-flagDetails-offensive = Offensive
moderate-flagDetails-abusive = Abusive
moderate-flagDetails-spam = Spam
moderate-flagDetails-other = Other

moderate-flagDetails-toxicityScore = Toxicity Score
moderate-toxicityLabel-likely = Likely <score></score>
moderate-toxicityLabel-unlikely = Unlikely <score></score>
moderate-toxicityLabel-maybe = Maybe <score></score>

moderate-linkDetails-label = Copy link to this comment
moderate-in-stream-link-copy = In Stream
moderate-in-moderation-link-copy = In Moderation

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

moderate-user-drawer-account-history-system = <icon>computer</icon> System
moderate-user-drawer-account-history-suspension-ended = Suspension ended
moderate-user-drawer-account-history-suspension-removed = Suspension removed
moderate-user-drawer-account-history-banned = Banned
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

community-assignMySites = Assign my sites
community-removeMySites = Remove my sites
community-stillHaveSiteModeratorPrivileges = They will still have Site Moderator privileges for:
community-userNoLongerPermitted = User will no longer be permitted to make moderation decisions or assign suspensions on:
community-assignThisUser = Assign this user to
community-assignYourSitesTo = Assign your sites to <strong>{ $username }</strong>
community-siteModeratorsArePermitted = Site moderators are permitted to make moderation decisions and issue suspensions on the sites they are assigned.
community-removeSiteModeratorPermissions = Remove Site Moderator permissions

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

community-siteModeratorActions-popover =
  .description = A dropdown to promote/demote a user to/from sites

community-userStatus-popover =
  .description = A dropdown to change the user status

community-userStatus-banUser = Ban User
community-userStatus-ban = Ban
community-userStatus-removeBan = Remove Ban
community-userStatus-removeUserBan = Remove ban
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

community-banModal-areYouSure = Are you sure you want to ban <username></username>?
community-banModal-consequence =
  Once banned, this user will no longer be able to comment, use
  reactions, or report comments.
community-banModal-cancel = Cancel
community-banModal-banUser = Ban User
community-banModal-customize = Customize ban email message
community-banModal-reject-existing = Reject all comments by this user

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

community-siteModeratorModal-assignSites =
  Assign sites for <strong>{ $username }</strong>
community-siteModeratorModal-assignSitesDescription =
  Site moderators are permitted to make moderation decisions and issue suspensions on the sites they are assigned.
community-siteModeratorModal-cancel = Cancel
community-siteModeratorModal-assign = Assign
community-siteModeratorModal-remove = Remove
community-siteModeratorModal-selectSites = Select sites to moderate
community-siteModeratorModal-noSites = No sites

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

configure-general-staff-title = Staff member badge
configure-general-staff-explanation =
  Show a custom badge for staff members of your organization. This badge
  appears on the comment stream and in the admin interface.
configure-general-staff-label = Badge text
configure-general-staff-input =
  .placeholder = E.g. Staff
configure-general-staff-moderator-input =
  .placeholder = E.g. Moderator
configure-general-staff-admin-input =
  .placeholder = E.g. Admin
configure-general-staff-preview = Preview
configure-general-staff-moderator-preview = Preview
configure-general-staff-admin-preview = Preview
configure-general-staff-member-label = Staff member badge text
configure-general-staff-admin-label = Admin badge text
configure-general-staff-moderator-label = Moderator badge text

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
dashboard-today-rejections = Rejection rate
dashboard-alltime-rejections = All time average
dashboard-today-staff-comments = Staff comments
dashboard-alltime-staff-comments = All time total
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