### Localization for Embed Stream

## General

general-commentsEmbedSection =
  .aria-label = Commenti Incorporati

general-moderate = Moderato
general-archived = Archiviato

general-userBoxUnauthenticated-joinTheConversation = Unisciti alla conversazione
general-userBoxUnauthenticated-signIn = Accedi
general-userBoxUnauthenticated-register = Registrati

general-authenticationSection =
  .aria-label = Autenticazione

general-userBoxAuthenticated-signedIn =
  Accesso effettuato come
general-userBoxAuthenticated-notYou =
  Non sei tu? <button>Sign Out</button>

general-userBox-youHaveBeenSuccessfullySignedOut =
  Sei uscito con successo

general-tabBar-commentsTab = Commenti
general-tabBar-myProfileTab = Il mio profilo
general-tabBar-discussionsTab = Discussioni
general-tabBar-reviewsTab = Reviews
general-tabBar-configure = Configura

general-mainTablist =
  .aria-label = Lista delle schede principali

general-secondaryTablist =
  .aria-label = Lista delle schede secondarie

## Comment Count

comment-count-text =
  { $count  ->
    [one] Commento
    *[other] Commenti
  }

## Comments Tab

comments-allCommentsTab = Tutti i commenti
comments-featuredTab = In primo piano
comments-counter-shortNum = { SHORT_NUMBER($count) }
comments-watchers =
  { $count  ->
    [one] 1 persona sta guardando questa discussione
    *[other] { SHORT_NUMBER($count) } persone stanno guardando questa discussione
  }

comments-announcement-section =
  .aria-label = Annuncio
comments-announcement-closeButton =
  .aria-label = Chiudi annuncio

comments-accountStatus-section =
  .aria-label = Status account

comments-featuredCommentTooltip-how = Come si presenta un commento?
comments-featuredCommentTooltip-handSelectedComments =
  I commenti sono scelti dal nostro team come degni di essere letti.
comments-featuredCommentTooltip-toggleButton =
  .aria-label = Alterna il tooltip dei commenti in primo piano
  .title = Alterna il tooltip dei commenti in primo piano

comments-collapse-toggle =
  .aria-label = Riduci il thread dei commenti
comments-expand-toggle =
  .aria-label = Espandi il thread dei commenti
comments-bannedInfo-bannedFromCommenting = Il tuo account è stato bandito dai commenti.
comments-bannedInfo-violatedCommunityGuidelines =
  Qualcuno che ha accesso al tuo account ha violato le nostre
  linee guida. Di conseguenza, il tuo account è stato bannato. Non potrai più
  più essere in grado di commentare, usare reazioni o segnalare commenti. Se pensi che
  che questo sia stato fatto per errore, per favore contatta il nostro team della comunità.

comments-noCommentsAtAll = Non ci sono commenti su questa storia.
comments-noCommentsYet = Non ci sono ancora commenti. Perché non ne scrivi uno?

comments-streamQuery-storyNotFound = Storia non trovata

comments-communityGuidelines-section =
  .aria-label = Linee guida della Community

comments-commentForm-cancel = Cancella
comments-commentForm-saveChanges = Salva modifiche
comments-commentForm-submit = Invia

comments-postCommentForm-section =
  .aria-label = Posta un commento
comments-postCommentForm-submit = Invia
comments-replyList-showAll = Mostra tutto
comments-replyList-showMoreReplies = Mostra più risposte

comments-postComment-gifSearch = Cerca una GIF
comments-postComment-gifSearch-search =
  .aria-label = Cerca
comments-postComment-gifSearch-loading = Loading...
comments-postComment-gifSearch-no-results = Nessun risultato trovato per {$query}
comments-postComment-gifSearch-powered-by-giphy =
  .alt = Powered by giphy

comments-postComment-pasteImage = Copia immagine URL
comments-postComment-insertImage = Inserisci

comments-postComment-confirmMedia-youtube = Aggiungere questo video di YouTube alla fine del tuo commento?
comments-postComment-confirmMedia-twitter = Aggiungere questo Tweet alla fine del tuo commento?
comments-postComment-confirmMedia-cancel = Cancella
comments-postComment-confirmMedia-add-tweet = Aggiungi Tweet
comments-postComment-confirmMedia-add-video = Aggiungi video
comments-postComment-confirmMedia-remove = Rimuovi
comments-commentForm-gifPreview-remove = Rimuovi
comments-viewNew =
  { $count ->
    [1] View {$count} Nuovo commento
    *[other] View {$count} Nuovi commenti
  }
comments-loadMore = Carica di più

comments-permalinkPopover =
  .description = Una finestra di dialogo che mostra un permalink al commento
comments-permalinkPopover-permalinkToComment =
  .aria-label = Permalink al commento
comments-permalinkButton-share = Condividi
comments-permalinkButton =
  .aria-label = Share comment by {$username}
comments-permalinkView-section =
  .aria-label = Conversazione singola
comments-permalinkView-viewFullDiscussion = Guarda la discussione completa
comments-permalinkView-commentRemovedOrDoesNotExist = Questo commento è stato rimosso o non esiste.

comments-rte-bold =
  .title = Grassetto

comments-rte-italic =
  .title = Corsivo

comments-rte-blockquote =
  .title = Blockquote

comments-rte-bulletedList =
  .title = Elenco puntato

comments-rte-strikethrough =
  .title = Barrato

comments-rte-spoiler = Spoiler

comments-rte-sarcasm = Sarcasmo

comments-rte-externalImage =
  .title = Immagine esterna

comments-remainingCharacters = { $remaining } caratteri rimanenti

comments-postCommentFormFake-signInAndJoin = Accedi e unisciti alla conversazione

comments-postCommentForm-rteLabel = Posta un commento

comments-postCommentForm-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentFormFake-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-replyButton-reply = Rispondi
comments-replyButton =
  .aria-label = Rispondi al commento di {$username}

comments-permalinkViewQuery-storyNotFound = { comments-streamQuery-storyNotFound }

comments-replyCommentForm-submit = Invia
comments-replyCommentForm-cancel = Cancella
comments-replyCommentForm-rteLabel = Scrivi una risposta
comments-replyCommentForm-rte =
  .placeholder = { comments-replyCommentForm-rteLabel }

comments-commentContainer-threadLevelLabel = Livello del filo { $level }:
comments-commentContainer-highlightedLabel = Evidenziato:
comments-commentContainer-ancestorLabel = Ancestor:
comments-commentContainer-replyLabel =
  Rispondi da { $username } <RelativeTime></RelativeTime>
comments-commentContainer-questionLabel =
  Domanda da { $username } <RelativeTime></RelativeTime>
comments-commentContainer-commentLabel =
  Commento da { $username } <RelativeTime></RelativeTime>
comments-commentContainer-editButton = Modifica

comments-commentContainer-avatar =
  .alt = Avatar per { $username }

comments-editCommentForm-saveChanges = Salva modifiche
comments-editCommentForm-cancel = Cancella
comments-editCommentForm-close = Chiudi
comments-editCommentForm-rteLabel = Modifica commento
comments-editCommentForm-rte =
  .placeholder = { comments-editCommentForm-rteLabel }
comments-editCommentForm-editRemainingTime = Modifica: <time></time> remaining
comments-editCommentForm-editTimeExpired = Il tempo di modifica è scaduto. Non puoi più modificare questo commento. Perché non ne posti un altro?
comments-editedMarker-edited = Modificato
comments-showConversationLink-readMore = Read More of this Conversation >
comments-conversationThread-showMoreOfThisConversation =
  Mostra di più di questa conversazione

comments-permalinkView-youAreCurrentlyViewing =
  Stai visualizzando una singola conversazione
comments-inReplyTo = In risposta a <Username></Username>
comments-replyingTo = Stai rispondendo a <Username></Username>

comments-reportButton-report = Segnala
comments-reportButton-reported = Segnalato
comments-reportButton-aria-report =
  .aria-label = Segnala comment di {$username}
comments-reportButton-aria-reported =
  .aria-label = Segnalato

comments-sortMenu-sortBy = Ordina per
comments-sortMenu-newest = Più recente
comments-sortMenu-oldest = Più vecchio
comments-sortMenu-mostReplies = Risposte principali

comments-userPopover =
  .description = Un popover con più informazioni sull'utente
comments-userPopover-memberSince = Member since: { DATETIME($timestamp, year: "numeric", month: "long", day: "numeric") }
comments-userPopover-ignore = Ignora

comments-userIgnorePopover-ignoreUser = Ignorare {$username}?
comments-userIgnorePopover-description =
  Quando ignori un commentatore, tutti i commenti che
  scritti sul sito saranno nascosti da te. È possibile
  annullare questo più tardi da Il mio profilo.
comments-userIgnorePopover-ignore = Ignora
comments-userIgnorePopover-cancel = Cancella

comments-userBanPopover-title = Bannare {$username}?
comments-userBanPopover-description =
  Una volta bannato, questo utente non sarà più in grado di
  commentare, usare reazioni o segnalare commenti.
  Questo commento sarà anche rifiutato.
comments-userBanPopover-cancel = Cancella
comments-userBanPopover-ban = Banna

comments-moderationDropdown-popover =
  .description = Un menu popover per moderare il commento
comments-moderationDropdown-feature = Seleziona
comments-moderationDropdown-unfeature = Deselezionare
comments-moderationDropdown-approve = Approva
comments-moderationDropdown-approved = Approvato
comments-moderationDropdown-reject = Rifiuta
comments-moderationDropdown-rejected = Rifiutato
comments-moderationDropdown-ban = Banna utente
comments-moderationDropdown-banned = Bannato
comments-moderationDropdown-moderationView = Vista moderazione
comments-moderationDropdown-moderateStory = Modera storia
comments-moderationDropdown-caretButton =
  .aria-label = Modera

comments-moderationRejectedTombstone-title = Hai rifiutato questo commento.
comments-moderationRejectedTombstone-moderateLink =
  Vai a moderare per rivedere questa decisione

comments-featuredTag = Caratteristica

# $reaction could be "Respect" as an example. Be careful when translating to other languages with different grammar cases.
comments-react =
  .aria-label = {$count ->
    [0] {$reaction} commenti da {$username}
    *[other] {$reaction} commenti da {$username} (Total: {$count})
  }

# $reaction could be "Respected" as an example. Be careful when translating to other languages with different grammar cases.
comments-reacted =
  .aria-label = {$count ->
    [0] {$reaction} commenti da {$username}
    [one] {$reaction} commenti da {$username}
    *[other] {$reaction} commenti da {$username} (Total: {$count})
  }

comments-jumpToComment-title = La tua risposta è stata pubblicata qui sotto
comments-jumpToComment-GoToReply = Vai alla risposta

comments-mobileToolbar-closeButton =
  .aria-label = Chiudi
comments-mobileToolbar-unmarkAll = Deseleziona tutti
comments-mobileToolbar-nextUnread = Prossimo non letto

comments-replyChangedWarning-theCommentHasJust =
  Questo commento è stato appena modificato. L'ultima versione è visualizzata sopra.

### Q&A

general-tabBar-qaTab = Q&A

qa-postCommentForm-section =
  .aria-label = Posta una domanda

qa-answeredTab = Risposta
qa-unansweredTab = Non risposta
qa-allCommentsTab = Tutto

qa-answered-answerLabel =
  Rispondi da {$username} <RelativeTime></RelativeTime>
qa-answered-gotoConversation = Vai alla conversazione
qa-answered-replies = Risposte

qa-noQuestionsAtAll =
  Non ci sono domande su questa storia.
qa-noQuestionsYet =
  Non ci sono ancora domande. Perché non ne fa una?
qa-viewNew =
  { $count ->
    [1] View {$count} Nuova domanda
    *[other] View {$count} Nuove domande
  }

qa-postQuestionForm-rteLabel = Posta una domanda
qa-postQuestionForm-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }
qa-postQuestionFormFake-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }

qa-sortMenu-mostVoted = Più votate

qa-answered-tag = risposte
qa-expert-tag = exsperto

qa-reaction-vote = Vota
qa-reaction-voted = Votato

qa-reaction-aria-vote =
  .aria-label = {$count ->
    [0] Voti per il commento di {$username}
    *[other] Voti ({$count}) per il commento di {$username}
  }
qa-reaction-aria-voted =
  .aria-label = {$count ->
    [0] Voti per il commento di {$username}
    [one] Voto per il commento di {$username}
    *[other] Voti ({$count}) per il comment di {$username}
  }

qa-unansweredTab-doneAnswering = Fatto

qa-expert-email = ({ $email })

qa-answeredTooltip-how = Come si risponde a una domanda?
qa-answeredTooltip-answeredComments =
  Le domande ricevono risposta da un esperto di Q&A.
qa-answeredTooltip-toggleButton =
  .aria-label = Alterna le domande con risposta al tooltip
  .title = Alterna le domande con risposta al tooltip

### Account Deletion Stream

comments-stream-deleteAccount-callOut-title =
  Richiesta di cancellazione dell'account
comments-stream-deleteAccount-callOut-receivedDesc =
  Una richiesta di cancellazione del tuo account è stata ricevuta il { $date }.
comments-stream-deleteAccount-callOut-cancelDesc =
  Se vuoi continuare a lasciare commenti, risposte o reazioni,
  puoi annullare la richiesta di cancellazione del tuo account prima di { $date }.
comments-stream-deleteAccount-callOut-cancel =
  Annullare la richiesta di cancellazione dell'account
comments-stream-deleteAccount-callOut-cancelAccountDeletion =
  Annullare la cancellazione dell'account

comments-permalink-copyLink = Copia link
comments-permalink-linkCopied = Link copiato

### Embed Links

comments-embedLinks-showEmbeds = Mostra gli embed
comments-embedLinks-hideEmbeds = Nascondi gli embeds

comments-embedLinks-show-giphy = Mostra GIF
comments-embedLinks-hide-giphy = Nascondi GIF

comments-embedLinks-show-youtube = Mostra video
comments-embedLinks-hide-youtube = Nascondi video

comments-embedLinks-show-twitter = Mostra Tweet
comments-embedLinks-hide-twitter = Nascondi Tweet

comments-embedLinks-show-external = Mostra immagine
comments-embedLinks-hide-external = Nascondi immagine


### Featured Comments
comments-featured-label =
  Commento in primo piano da {$username} <RelativeTime></RelativeTime>
comments-featured-gotoConversation = Vai alla conversazione
comments-featured-replies = Risposte

## Profile Tab

profile-myCommentsTab = I miei commenti
profile-myCommentsTab-comments = I miei commenti
profile-accountTab = Account
profile-preferencesTab = Preferenze

### Bio
profile-bio-title = Bio
profile-bio-description =
  Scrivi una biografia da mostrare pubblicamente sul tuo profilo di commento. Deve essere
  meno di 100 caratteri.
profile-bio-remove = Rimuovi
profile-bio-update = Aggiorna
profile-bio-success = La tua bio è stata aggiornata con successo.
profile-bio-removed = La tua bio è stata rimossa.


### Account Deletion

profile-accountDeletion-deletionDesc =
  La cancellazione del tuo account è prevista per il giorno { $date }.
profile-accountDeletion-cancelDeletion =
  Annullare la richiesta di cancellazione dell'account
profile-accountDeletion-cancelAccountDeletion =
  Annullare la cancellazione dell'account

### Comment History
profile-commentHistory-section =
  .aria-label = Cronologia commenti
profile-historyComment-commentLabel =
  Commento <RelativeTime></RelativeTime> in { $storyTitle }
profile-historyComment-viewConversation = Visualizza conversazione
profile-historyComment-replies = Risposte {$replyCount}
profile-historyComment-commentHistory = Cronologia commenti
profile-historyComment-story = Storia: {$title}
profile-historyComment-comment-on = Commenta su:
profile-profileQuery-errorLoadingProfile = Errore nel caricamento del profilo
profile-profileQuery-storyNotFound = Storia non trovata
profile-commentHistory-loadMore = Caricare di più
profile-commentHistory-empty = Non hai scritto nessun commento
profile-commentHistory-empty-subheading = Una cronologia dei tuoi commenti apparirà qui
### Preferences

profile-preferences-mediaPreferences = Preferenze dei media
profile-preferences-mediaPreferences-alwaysShow = Mostra sempre GIF, Tweets, YouTube, ecc.
profile-preferences-mediaPreferences-thisMayMake = Questo può rendere i commenti più lenti da caricare
profile-preferences-mediaPreferences-update = Aggiorna
profile-preferences-mediaPreferences-preferencesUpdated =
  Le tue preferenze multimediali sono state aggiornate

### Account
profile-account-ignoredCommenters = Commentatori ignorati
profile-account-ignoredCommenters-description =
  Puoi ignorare gli altri commentatori cliccando sul loro nome utente
  e selezionando Ignora. Quando ignori qualcuno, tutti i suoi
  commenti sono nascosti da te. I commentatori che ignori saranno ancora
  essere in grado di vedere i tuoi commenti.
profile-account-ignoredCommenters-empty = Attualmente non stai ignorando nessuno
profile-account-ignoredCommenters-stopIgnoring = Smetti di ignorare
profile-account-ignoredCommenters-youAreNoLonger =
  Non stai più ignorando
profile-account-ignoredCommenters-manage = Gestisci
profile-account-ignoredCommenters-cancel = Cancella
profile-account-ignoredCommenters-close = Chiudi

profile-account-changePassword-cancel = Cancella
profile-account-changePassword = Modifica Password
profile-account-changePassword-oldPassword = Vecchia Password
profile-account-changePassword-forgotPassword = Password dimenticata?
profile-account-changePassword-newPassword = Nuova Password
profile-account-changePassword-button = Modifica Password
profile-account-changePassword-updated =
  La tua password è stata aggiornata
profile-account-changePassword-password = Password

profile-account-download-comments-title = Scarica la mia cronologia dei commenti
profile-account-download-comments-description =
  Riceverai un'email con un link per scaricare la tua cronologia dei commenti.
  Puoi fare <strong>una richiesta di download ogni 14 giorni.</strong>
profile-account-download-comments-request =
  Richiesta di cronologia dei commenti
profile-account-download-comments-request-icon =
  .title = Richiesta di cronologia dei commenti
profile-account-download-comments-recentRequest =
  La tua richiesta più recente: { $timeStamp }
profile-account-download-comments-yourMostRecentRequest =
  La sua richiesta più recente risale agli ultimi 14 giorni. Puoi
  richiedere di scaricare nuovamente i suoi commenti su: { $timeStamp }
profile-account-download-comments-requested =
  Richiesta presentata. Puoi inviare un'altra richiesta in { framework-timeago-time }.
profile-account-download-comments-requestSubmitted =
  La tua richiesta è stata inoltrata con successo. Puoi richiedere di
  scaricare nuovamente la cronologia dei tuoi commenti in { framework-timeago-time }.
profile-account-download-comments-error =
  Non siamo riusciti a completare la tua richiesta di download.
profile-account-download-comments-request-button = Richiesta

## Delete Account

profile-account-deleteAccount-title = Cancella il mio account
profile-account-deleteAccount-deleteMyAccount = Cancella il mio account
profile-account-deleteAccount-description =
  La cancellazione del tuo account cancellerà permanentemente il tuo profilo e rimuoverà
  tutti i tuoi commenti da questo sito.
profile-account-deleteAccount-requestDelete = Richiesta di cancellazione dell'account

profile-account-deleteAccount-cancelDelete-description =
  Hai già inviato una richiesta di cancellazione del tuo account.
  Il tuo account sarà cancellato il { $date }.
  Può cancellare la richiesta fino a quel momento.
profile-account-deleteAccount-cancelDelete = Annullare la richiesta di cancellazione dell'account

profile-account-deleteAccount-request = Richiesta
profile-account-deleteAccount-cancel = Cancella
profile-account-deleteAccount-pages-deleteButton = Cancella il mio account
profile-account-deleteAccount-pages-cancel = Cancella
profile-account-deleteAccount-pages-proceed = Procedi
profile-account-deleteAccount-pages-done = Fatto
profile-account-deleteAccount-pages-phrase =
  .aria-label = Frase

profile-account-deleteAccount-pages-sharedHeader = Cancella il mio account

profile-account-deleteAccount-pages-descriptionHeader = Cancellare il mio account?
profile-account-deleteAccount-pages-descriptionText =
  Stai tentando di cancellare il tuo account. Questo significa:
profile-account-deleteAccount-pages-allCommentsRemoved =
  Tutti i tuoi commenti sono stati rimossi da questo sito
profile-account-deleteAccount-pages-allCommentsDeleted =
  Tutti i tuoi commenti vengono cancellati dal nostro database
profile-account-deleteAccount-pages-emailRemoved =
  Il tuo indirizzo e-mail viene rimosso dal nostro sistema

profile-account-deleteAccount-pages-whenHeader = Cancellare il mio account: Quando?
profile-account-deleteAccount-pages-whenSubHeader = Quando?
profile-account-deleteAccount-pages-whenSec1Header =
  Quando sarà cancellato il mio account?
profile-account-deleteAccount-pages-whenSec1Content =
  Il tuo account sarà cancellato 24 ore dopo che la tua richiesta è stata presentata.
profile-account-deleteAccount-pages-whenSec2Header =
  Posso ancora scrivere commenti finché il mio account non viene cancellato?
profile-account-deleteAccount-pages-whenSec2Content =
  No. Una volta che hai richiesto la cancellazione dell'account, non puoi più scrivere commenti,
  rispondere ai commenti, o selezionare reazioni.

profile-account-deleteAccount-pages-downloadCommentHeader = Scaricare i miei commenti?
profile-account-deleteAccount-pages-downloadSubHeader = Scaricare i miei commenti
profile-account-deleteAccount-pages-downloadCommentsDesc =
  Prima che il tuo account venga cancellato, ti consigliamo di scaricare la tua cronologia dei commenti
  per il tuo archivio. Dopo che il tuo account è stato cancellato, sarai
  in grado di richiedere la tua cronologia dei commenti.
profile-account-deleteAccount-pages-downloadCommentsPath =
  Il mio profilo > Scarica la cronologia dei commenti

profile-account-deleteAccount-pages-confirmHeader = Confermare la cancellazione dell'account?
profile-account-deleteAccount-pages-confirmSubHeader = Sei sicuro?
profile-account-deleteAccount-pages-confirmDescHeader =
  Sei sicuro di voler cancellare il tuo account?
profile-account-deleteAccount-confirmDescContent =
  Per confermare che vuoi cancellare il tuo account, digita la seguente
  frase nella casella di testo sottostante:
profile-account-deleteAccount-pages-confirmPhraseLabel =
  Per confermare, scrivi la frase qui sotto:
profile-account-deleteAccount-pages-confirmPasswordLabel =
  Inserisci la tua password:

profile-account-deleteAccount-pages-completeHeader = Richiesta di cancellazione dell'account
profile-account-deleteAccount-pages-completeSubHeader = Richiesta presentata
profile-account-deleteAccount-pages-completeDescript =
  La tua richiesta è stata presentata e una conferma è stata inviata all'indirizzo e-mail
  associato al tuo account.
profile-account-deleteAccount-pages-completeTimeHeader =
  Il tuo account sarà cancellato il: { $date }
profile-account-deleteAccount-pages-completeChangeYourMindHeader = Hai cambiato idea?
profile-account-deleteAccount-pages-completeSignIntoYourAccount =
  Semplicemente accedi di nuovo al tuo account prima di questo tempo e seleziona
  <strong>Cancel Account Deletion Request</strong>.
profile-account-deleteAccount-pages-completeTellUsWhy = Dicci perché.
profile-account-deleteAccount-pages-completeWhyDeleteAccount =
  Vorremmo sapere perché hai scelto di cancellare il tuo account. Inviaci un feedback sul
  il nostro sistema di commenti inviando un'e-mail a { $email }.
profile-account-changePassword-edit = Modifica
profile-account-changePassword-change = Cambia


## Notifications
profile-notificationsTab = Notifiche
profile-account-notifications-emailNotifications = Notifiche e-Mail
profile-account-notifications-receiveWhen = Ricevi motifiche e-mail quando:
profile-account-notifications-onReply = Il mio commento riceve una risposta
profile-account-notifications-onFeatured = Il mio commento è presente
profile-account-notifications-onStaffReplies = Un membro dello staff risponde al mio commento
profile-account-notifications-onModeration = Il mio commento in sospeso è stato rivisto
profile-account-notifications-sendNotifications = Inviare notifiche:
profile-account-notifications-sendNotifications-immediately = Immediatamente
profile-account-notifications-sendNotifications-daily = Quotidianamente
profile-account-notifications-sendNotifications-hourly = Ogni ora
profile-account-notifications-updated = Le tue impostazioni di notifica sono state aggiornate
profile-account-notifications-button = Aggiorna le impostazioni di notifica
profile-account-notifications-button-update = Aggiorna

## Report Comment Popover
comments-reportPopover =
  .description = Una finestra di dialogo per segnalare i commenti
comments-reportPopover-reportThisComment = Segnala questo commento
comments-reportPopover-whyAreYouReporting = Perché stai segnalando questo commento?

comments-reportPopover-reasonOffensive = Questo commento è offensivo
comments-reportPopover-reasonAbusive = Questo commentatore è abusive
comments-reportPopover-reasonIDisagree = Non sono d'accordo con questo commento
comments-reportPopover-reasonSpam = Questo sembra un annuncio o marketing
comments-reportPopover-reasonOther = Altro

comments-reportPopover-additionalInformation =
  Additional information <optional>Optional</optional>
comments-reportPopover-pleaseLeaveAdditionalInformation =
  Si prega di lasciare qualsiasi informazione aggiuntiva che possa essere utile ai nostri moderatori.

comments-reportPopover-maxCharacters = Max. { $maxCharacters } Caratteri
comments-reportPopover-restrictToMaxCharacters = Per favore, limita la tua segnalazione a { $maxCharacters } caratteri
comments-reportPopover-cancel = Cancella
comments-reportPopover-submit = Inoltra

comments-reportPopover-thankYou = Grazie!
comments-reportPopover-receivedMessage =
 Abbiamo ricevuto il tuo messaggio. Le segnalazioni dei membri come te mantengono la comunità al sicuro.

comments-reportPopover-dismiss = Rimuovi

## Archived Report Comment Popover

comments-archivedReportPopover-reportThisComment = Segnala questo comment
comments-archivedReportPopover-doesThisComment =
  Questo commento viola le linee guida della nostra comunità? È offensivo o spam?
  Invia un'e-mail al nostro team di moderazione all'indirizzo<a>{ $orgName }</a> con un link a
  this comment and a brief explanation.
comments-archivedReportPopover-needALink =
  Hai bisogno di un link per questo commento?
comments-archivedReportPopover-copyLink = Copy link

comments-archivedReportPopover-emailSubject = Segnala un commento
comments-archivedReportPopover-emailBody =
  Vorrei segnalare il seguente commento:
  %0A
  { $permalinkURL }
  %0A
  %0A
  Per le ragioni indicate qui di seguito:

## Submit Status
comments-submitStatus-dismiss = Rimuovi
comments-submitStatus-submittedAndWillBeReviewed =
  Il tuo commento è stato inviato e sarà esaminato da un moderatore
comments-submitStatus-submittedAndRejected =
  Questo commento è stato rifiutato per aver violato le nostre linee guida

# Configure
configure-configureQuery-errorLoadingProfile = Errore nel caricamento della configurazione
configure-configureQuery-storyNotFound = Storia non trovata

## Archive
configure-archived-title = Questo flusso di commenti è stato archiviato
configure-archived-onArchivedStream =
  Sui flussi archiviati, nessun nuovo commento, reazione o rapporto può essere
  inviati. Inoltre, i commenti non possono essere moderati.
configure-archived-toAllowTheseActions =
  Per permettere queste azioni, disarchivia il flusso.
configure-archived-unarchiveStream = Disarchivia il flusso

## Change username
profile-changeUsername-username = Username
profile-changeUsername-success = Il tuo nome utente è stato aggiornato con successo
profile-changeUsername-edit = Modifica
profile-changeUsername-change = Cambia
profile-changeUsername-heading = Modifica il tuo nome utente
profile-changeUsername-heading-changeYourUsername = Cambia il tuo username
profile-changeUsername-desc = Cambia il nome utente che apparirà su tutti i tuoi commenti passati e futuri. <strong> I nomi utente possono essere cambiati una volta ogni { framework-timeago-time }.</strong>
profile-changeUsername-desc-text = Cambia il nome utente che apparirà su tutti i tuoi commenti passati e futuri. I nomi utente possono essere cambiati una volta ogni { framework-timeago-time }.
profile-changeUsername-current = Username attuale
profile-changeUsername-newUsername-label = Nuovo username
profile-changeUsername-confirmNewUsername-label = Conferma nuovo username
profile-changeUsername-cancel = Cancella
profile-changeUsername-save = Salva
profile-changeUsername-saveChanges = Salva modifiche
profile-changeUsername-recentChange = Il tuo nome utente è stato cambiato nell'ultimo . Puoi cambiare di nuovo il tuo nome utente su { $nextUpdate }.
profile-changeUsername-youChangedYourUsernameWithin =
  Hai cambiato il tuo nome utente nell'ultimo { framework-timeago-time Puoi cambiare di nuovo il tuo nome utente su: { $nextUpdate }.
profile-changeUsername-close = Chiudi

## Discussions tab

discussions-mostActiveDiscussions = Discussioni più attive
discussions-mostActiveDiscussions-subhead = Classificati in base al maggior numero di commenti ricevuti nelle ultime 24 ore su { $siteName }
discussions-mostActiveDiscussions-empty = Non hai partecipato a nessuna discussione
discussions-myOngoingDiscussions = Le mie discussioni in corso
discussions-myOngoingDiscussions-subhead = Dove hai commentato su { $orgName }
discussions-viewFullHistory = Visualizza la cronologia completa dei commenti
discussions-discussionsQuery-errorLoadingProfile = Errore nel caricamento del profilo
discussions-discussionsQuery-storyNotFound = Storia non trovata

## Comment Stream
configure-stream-title-configureThisStream =
  Configurare questo flusso
configure-stream-update = Aggiorna
configure-stream-streamHasBeenUpdated =
  Questo flusso è stato aggiornato

configure-premod-premoderateAllComments = Pre-moderare tutti i commenti
configure-premod-description =
  I moderatori devono approvare qualsiasi commento prima che sia pubblicato su questa storia.

configure-premodLink-commentsContainingLinks =
  Commenti pre-moderati contenenti link
configure-premodLink-description =
  I moderatori devono approvare ogni commento che contiene un link prima che sia pubblicato su questa storia.

configure-addMessage-title =
  Aggiungi un messaggio o una domanda
configure-addMessage-description =
  Aggiungi un messaggio in cima alla casella dei commenti per i tuoi lettori. Usa questo
  per porre un argomento, fare una domanda o fare annunci relativi a questa
  storia.
configure-addMessage-addMessage = Aggiungere un messaggio
configure-addMessage-removed = Il messaggio è stato rimosso
config-addMessage-messageHasBeenAdded =
  Il messaggio è stato aggiunto alla casella dei commenti
configure-addMessage-remove = Rimuovi
configure-addMessage-submitUpdate = Aggiorna
configure-addMessage-cancel = Cancella
configure-addMessage-submitAdd = Aggiungi messaggio

configure-messageBox-preview = Preview
configure-messageBox-selectAnIcon = Seleziona un'icona
configure-messageBox-iconConversation = Conversazione
configure-messageBox-iconDate = Data
configure-messageBox-iconHelp = Aiuto
configure-messageBox-iconWarning = Warning
configure-messageBox-iconChatBubble = Chat bubble
configure-messageBox-noIcon = Nessuna icona
configure-messageBox-writeAMessage = Scrivi un messaggio

configure-closeStream-closeCommentStream =
  Chiudi il flusso dei commenti
configure-closeStream-description =
  Questo flusso di commenti è attualmente aperto. Chiudendo questo flusso di commenti,
  nessun nuovo commento può essere inviato e tutti i commenti precedentemente inviati
  saranno ancora visualizzati.
configure-closeStream-closeStream = Chiudere il flusso
configure-closeStream-theStreamIsNowOpen = Il flusso è ora aperto

configure-openStream-title = Flusso aperto
configure-openStream-description =
  Questo flusso di commenti è attualmente chiuso. Aprendo questo flusso di commenti
  nuovi commenti possono essere inviati e visualizzati.
configure-openStream-openStream = Flusso aperto
configure-openStream-theStreamIsNowClosed = Il flusso è ora chiuso

qa-experimentalTag-tooltip-content =
  Il formato Q&A è attualmente in fase di sviluppo attivo. Per favore contattate
  con qualsiasi feedback o richiesta.

configure-enableQA-switchToQA =
  Passa al formato Q&A
configure-enableQA-description =
  Il formato Q&A permette ai membri della comunità di presentare domande a cui gli esperti scelti
  esperti a cui rispondere.
configure-enableQA-enableQA = Passa al Q&A
configure-enableQA-streamIsNowComments =
  Questo flusso è ora in formato commenti

configure-disableQA-title = Configura questo Q&A
configure-disableQA-description =
  Il formato Q&A permette ai membri della comunità di presentare domande a cui gli esperti scelti
  esperti a cui rispondere.
configure-disableQA-disableQA = Passa ai commenti
configure-disableQA-streamIsNowQA =
  Questo flusso è ora in formato Q&A

configure-experts-title = Aggiungi un esperto
configure-experts-filter-searchField =
  .placeholder = Cerca per e-mail o username
  .aria-label = Cerca per e-mail o username
configure-experts-filter-searchButton =
  .aria-label = Cerca
configure-experts-filter-description =
  Aggiunge un badge di esperto ai commenti degli utenti registrati, solo su questa
  pagina. I nuovi utenti devono prima registrarsi e aprire i commenti su una pagina
  per creare il loro account.
configure-experts-search-none-found = Nessun utente è stato trovato con quell'email o nome utenteconfigure-experts-
configure-experts-remove-button = Rimuovi
configure-experts-load-more = Carica di più
configure-experts-none-yet = Attualmente non ci sono esperti per questo Q&A.
configure-experts-search-title = Cerca un esperto
configure-experts-assigned-title = Experti
configure-experts-noLongerAnExpert = non è più un esperto
comments-tombstone-ignore = Questo commento è nascosto perché hai ignorato {$username}
comments-tombstone-showComment = Mostra commento
comments-tombstone-deleted =
  Questo commento non è più disponibile. Il commentatore ha cancellato il suo account.
comments-tombstone-rejected =
  Questo commentatore è stato rimosso da un moderatore per aver violato le linee guida della nostra community.

suspendInfo-heading-yourAccountHasBeen =
  Il tuo account è stato temporaneamente sospeso dai commenti
suspendInfo-description-inAccordanceWith =
  In conformità con le linee guida della comunità di { $organization } il tuo
  account è stato temporaneamente sospeso. Mentre sei sospeso non potrai
  essere in grado di commentare, usare reazioni o segnalare commenti.
suspendInfo-until-pleaseRejoinThe =
  Si prega di unirsi alla conversazione su { $until }

warning-heading = Il tuo account ha ricevuto un avvertimento
warning-explanation =
  In conformità con le linee guida della nostra comunità, il tuo account è stato emesso un avvertimento.
warning-instructions =
  Per continuare a partecipare alle discussioni, premi il pulsante "Conferma" qui sotto.
warning-acknowledge = Acknowledge

warning-notice = Il tuo account ha ricevuto un avvertimento. Per continuare a partecipare per favore  <a>review the warning message</a>.

modMessage-heading = Il tuo account ha ricevuto un messaggio da un moderatore
modMessage-acknowledge = Acknowledge

profile-changeEmail-unverified = (Non verificato)
profile-changeEmail-current = (attuale)
profile-changeEmail-edit = Modifica
profile-changeEmail-change = Cambia
profile-changeEmail-please-verify = Verifica il tuo indirizzo e-mail
profile-changeEmail-please-verify-details =
  Un'email è stata inviata a { $email } per verificare il tuo account.
  Devi verificare il tuo nuovo indirizzo email prima che possa essere usato
  per accedere al tuo account o per ricevere notifiche.
profile-changeEmail-resend = Invia di nuovo la verifica
profile-changeEmail-heading = Modifica il tuo indirizzo e-mail
profile-changeEmail-changeYourEmailAddress =
  Cambia il tuo indirizzo e-mail
profile-changeEmail-desc = Cambiare l'indirizzo e-mail utilizzato per l'accesso e per ricevere comunicazioni sul suo account.
profile-changeEmail-newEmail-label = Nuovo indirizzo e-mail
profile-changeEmail-password = Password
profile-changeEmail-password-input =
  .placeholder = Password
profile-changeEmail-cancel = Cancella
profile-changeEmail-submit = Salva
profile-changeEmail-saveChanges = Salva modifiche
profile-changeEmail-email = E-mail
profile-changeEmail-title = Indirizzo e-mail
profile-changeEmail-success = La tua e-mail è stata aggiornata con successo

## Ratings and Reviews

ratingsAndReviews-postCommentForm-section =
  .aria-label = Invia un commento o fai una domanda

ratingsAndReviews-reviewsTab = Recensioni
ratingsAndReviews-questionsTab = Domande
ratingsAndReviews-noReviewsAtAll = Non ci sono recensioni.
ratingsAndReviews-noQuestionsAtAll = Non ci sono domande.
ratingsAndReviews-noReviewsYet = Non ci sono ancora recensioni. Perché non ne scrivi una?
ratingsAndReviews-noQuestionsYet = Non ci sono ancora domande. Perché non ne fa una?
ratingsAndReviews-selectARating = Seleziona una valutazione
ratingsAndReviews-youRatedThis = Hai valutato questo
ratingsAndReviews-showReview = Mostra recensione
  .title = { ratingsAndReviews-showReview }
ratingsAndReviews-rateAndReview = Valutazioni e recensioni
ratingsAndReviews-askAQuestion = Fai una domanda
ratingsAndReviews-basedOnRatings = { $count ->
  [0] Ancora nessuna valutazione
  [1] Basato su 1 valutazione
  *[other] Basato su { SHORT_NUMBER($count) } valutazioni
}

ratingsAndReviews-allReviewsFilter = Tutte le recensioni
ratingsAndReviews-starReviewsFilter = { $rating ->
  [1] 1 Stella
  *[other] { $rating } Stelle
}

comments-addAReviewForm-rteLabel = Aggiungi una recensione (opzionale)

comments-addAReviewForm-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

comments-addAReviewFormFake-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

stream-footer-links-top-of-article = Inizio dell'articolo
  .title = Vai all'inizio dell'articolo
stream-footer-links-top-of-comments = Top of comments
  .title = Vai all'inizio dei commenti
stream-footer-links-profile = Profile & Replies
  .title = Vai al profilo e alle risposte
stream-footer-links-discussions = Altre discussioni
  .title = Vai ad altre discussioni
stream-footer-navigation =
  .aria-label = Commenti Piè di pagina
