### Localization for Embed Stream

## General

general-userBoxUnauthenticated-joinTheConversation = Alaturâ-te conversației
general-userBoxUnauthenticated-signIn = Intră în cont
general-userBoxUnauthenticated-register = Înregistrează-te

general-userBoxAuthenticated-signedIn =
  Înregistrat ca

general-userBoxAuthenticated-notYou =
  Nu ești tu? <button>Ieși din cont</button>;

general-tabBar-commentsTab = Comentarii
general-tabBar-myProfileTab = Profilul meu
general-tabBar-configure = Configurează

## Comment Count

comment-count-text =
{ $count ->
  [one] Comentariu
  *[other] Comentarii
}

## Comments Tab

comments-allCommentsTab = Toate comentariile
comments-featuredTab = Recomandate
comments-featuredCommentTooltip-how = Cum devine un comentariu recomandat?
comments-featuredCommentTooltip-handSelectedComments =
  Comentariile sunt selecționate și recomandate de către echipa noastră.
comments-featuredCommentTooltip-toggleButton =
  .aria-label = Comutator pictogramă comentarii recomandate

comments-bannedInfo-bannedFromCommenting = Contului tău i-a fost interzisă
funcția de adăugare comentarii.
comments-bannedInfo-violatedCommunityGuidelines =
  Cineva care are acces la contul tău a încălcat regulile comunității
  noastre. În consecință, contul tău a fost blocat. Nu vei mai putea
  adăuga comentarii, reacționa la comentariile altor utilizatori sau
  raporta alte comentarii. Dacă vei considera că este o eroare, te
  rugăm să contactezi echipa noastră.

comments-noCommentsYet = Nu a fost adăugat niciun comentariu. De ce să nu
adaugi tu unul? 

comments-streamQuery-storyNotFound = Subiectul nu a fost găsit

comments-commentForm-cancel = Anulează
comments-commentForm-saveChanges = Salvează modificările
comments-commentForm-submit = Trimite

comments-postCommentForm-submit = Trimite
comments-replyList-showAll = Arată lista completă
comments-replyList-showMoreReplies = Arată mai multe răspunsuri

comments-viewNew =
{ $count -&gt;
  [1] Vezi {$count} Comentariu nou
  *[other] Vezi {$count} Comentarii noi
}
comments-loadMore = Încarcă mai multe

comments-permalinkPopover =
  .description = O fereastra arătând un permalink către comentariu
  .aria-label = Permalink către comentariu
comments-permalinkButton-share = Partajează
comments-permalinkView-viewFullDiscussion = Vizualizează toată conversația
comments-permalinkView-commentRemovedOrDoesNotExist = Acest comentariu a
fost eliminat sau nu există.

comments-rte-bold =
  .title = Bold

comments-rte-italic =
  .title = Italic

comments-rte-blockquote =
  .title = Blockquote

comments-remainingCharacters = { $remaining } caractere disponibile

comments-postCommentFormFake-signInAndJoin = Intră în cont și alătură-te
conversației

comments-postCommentForm-rteLabel = Adaugă un comentariu

comments-postCommentForm-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentFormFake-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentForm-userScheduledForDeletion-warning =
  Adăugarea comentariilor este dezactivata pe perioada în care contul tău este programat pentru ștergere.

comments-replyButton-reply = Răspunde

comments-permalinkViewQuery-storyNotFound = { comments-streamQuery-
storyNotFound }

comments-replyCommentForm-submit = Trimite
comments-replyCommentForm-cancel = Anulează
comments-replyCommentForm-rteLabel = Scrie un răspuns
comments-replyCommentForm-rte =
.placeholder = { comments-replyCommentForm-rteLabel }

comments-commentContainer-editButton = Editează

comments-editCommentForm-saveChanges = Salvează modificările
comments-editCommentForm-cancel = Anulează
comments-editCommentForm-close = Închide
comments-editCommentForm-rteLabel = Editează comentariu
comments-editCommentForm-rte =
  .placeholder = { comments-editCommentForm-rteLabel }
comments-editCommentForm-editRemainingTime = Editează: <time></time> disponibil
comments-editCommentForm-editTimeExpired = Timpul disponibil pentru editare
a expirat. Nu mai poți edita acest comentariu. De ce să nu adaugi altul? 
comments-editedMarker-edited = Editat
comments-showConversationLink-readMore = Citește mai mult din această
conversație >
comments-conversationThread-showMoreOfThisConversation =
  Arată mai mult din această conversație

comments-permalinkView-currentViewing = Acum vizualizezi
comments-permalinkView-singleConversation = Conversație singulară
comments-inReplyTo = Răspuns la <Username></Username>;
comments-replyingTo = Răspunde la: <Username></Username>;

comments-reportButton-report = Raportează
comments-reportButton-reported = Raportat

comments-sortMenu-sortBy = Sortează după
comments-sortMenu-newest = Cele mai noi
comments-sortMenu-oldest = Cele mai vechi
comments-sortMenu-mostReplies = Cele mai multe răspunsuri

comments-userPopover =
  .description = O fereastră cu mai multe informații
comments-userPopover-memberSince = Membru din: { DATETIME($timestamp, year: "numeric", month: "long", day: "numeric") }
comments-userPopover-ignore = Ignoră

comments-userIgnorePopover-ignoreUser = Ignoră {$username}?
comments-userIgnorePopover-description = Atunci când alegi să ignori un
utilizator, toate comentariile acestuia vor fi ascunse. Poți să revii la
starea inițială accesând Profilul meu. 
comments-userIgnorePopover-ignore = Ignoră
comments-userIgnorePopover-cancel = Anulează

comments-userBanPopover-title = Blochează {$username}?
comments-userBanPopover-description =
  Odată blocat, acest utilizator nu va mai putea să adauge comentarii, să
  reacționeze la alte comentarii sau să raporteze alte comentarii. Acest
  comentariu va fi respins.
comments-userBanPopover-cancel = Anulează
comments-userBanPopover-ban = Blochează

comments-moderationDropdown-popover =
  .description = Meniu pentru moderarea comentariului
comments-moderationDropdown-feature = Recomandă
comments-moderationDropdown-unfeature = Elimină recomandare
comments-moderationDropdown-approve = Aprobă
comments-moderationDropdown-approved = Aprobat
comments-moderationDropdown-reject = Respinge
comments-moderationDropdown-rejected = Respins
comments-moderationDropdown-ban = Blochează utilizator
comments-moderationDropdown-banned = Blocat
comments-moderationDropdown-goToModerate = Du-te la Moderare
comments-moderationDropdown-caretButton =
  .aria-label = Moderează

comments-rejectedTombstone =
Ai respins acest comentariu. <TextLink>Du-te la Moderare pentru a revizui
această decizie.</TextLink>

comments-featuredTag = Recomandat

### Account Deletion Stream

comments-stream-deleteAccount-callOut-title =
  Cerere ștergere cont
comments-stream-deleteAccount-callOut-receivedDesc =
  O cerere pentru a șterge contul tău a fost primită pe data de { $date }.
comments-stream-deleteAccount-callOut-cancelDesc =
  Dacă vrei să adaugi în continuarea comentarii, răspunsuri sau reacții la
  comentarii, poți anula cererea de ștergere a contului până la dată de { $date }.
comments-stream-deleteAccount-callOut-cancel =
Anulează cerearea de ștergere cont

### Featured Comments
comments-featured-gotoConversation = Du-te la conversație
comments-featured-replies = Răspunsuri

## Profile Tab

profile-myCommentsTab = Comentariile mele
profile-myCommentsTab-comments = Comentariile mele
profile-accountTab = Cont

accountSettings-manage-account = Administrează-ți contul

### Account Deletion

profile-accountDeletion-deletionDesc =
  Contul tău este programat pentru a fi șters pe dată de { $date }.
profile-accountDeletion-cancelDeletion =
  Anulează cererea de ștergere cont

### Comment History
profile-historyComment-viewConversation = Vizualizează Conversație
profile-historyComment-replies = Răspunsuri {$replyCount}
profile-historyComment-commentHistory = Istoric comentarii
profile-historyComment-story = Subiect: {$title}
profile-historyComment-comment-on = Comentează la:
profile-profileQuery-errorLoadingProfile = Eroare încărcare profil
profile-profileQuery-storyNotFound = Subiectul nu a fost găsit
profile-commentHistory-loadMore = Încarcă mai multe
profile-commentHistory-empty = Nu ai scris niciun comentariu
profile-commentHistory-empty-subheading = Un istoric al comentariilor tale
va fi afișat aici 

### Account
profile-account-ignoredCommenters = Utilizatori ignorați
profile-account-ignoredCommenters-description =
  Poți ignora și alți utilizatori dând clic pe numele lor de
  utilizator și selectând opțiunea Ignoră. Atunci când ignori pe cineva,
  toate comentariile lor sunt ascunse. Acești utilizatori pot vizualiza 
  în continuare comentariile tale. 
profile-account-ignoredCommenters-empty = În acest moment nu ignori comentariile niciunui utilizator.
profile-account-ignoredCommenters-stopIgnoring = Nu mai ignora
profile-account-ignoredCommenters-manage = Administrează
profile-account-ignoredCommenters-cancel = Anulează

profile-account-changePassword-cancel = Anulează
profile-account-changePassword = Schimbă parola
profile-account-changePassword-oldPassword = Parola veche
profile-account-changePassword-forgotPassword = Ai uitat parola?
profile-account-changePassword-newPassword = Parola nouă
profile-account-changePassword-button = Schimbă parola
profile-account-changePassword-updated =
  Parola ta a fost modificată
profile-account-changePassword-password = Parolă

profile-account-download-comments-title = Descarcă istoricul meu de comentarii
profile-account-download-comments-description =
  Vei primi un email cu un link pentru descărcarea istoricului tău de
  comentarii. Poți să efectuezi <strong>o cerere de descărcare
  o dată la 14 zile.</strong>
profile-account-download-comments-request = Solicită istoric comentarii
profile-account-download-comments-request-icon =
  .title = Solicită istoric comentarii
profile-account-download-comments-recentRequest =
  Ultima ta solicitare: { $timeStamp }
profile-account-download-comments-requested =
  Solicitare trimisă. Poți trimite o nouă solicitare in {framework-timeago-
time }.
profile-account-download-comments-request-button = Solicitare

## Delete Account

profile-account-deleteAccount-title = Șterge contul meu
profile-account-deleteAccount-description =
  Ștergerea contului tău va elimina permanent profilul tău și va șterge
  toate comentariile de pe acest site.
profile-account-deleteAccount-requestDelete = Solicitare ștergere cont

profile-account-deleteAccount-cancelDelete-description =
  Ai trimis deja o solicitare pentru ștergerea contului tău.
  Contul tău va fi șters pe dată de { $date }.
  Poți anula solicitarea până atunci.

profile-account-deleteAccount-cancelDelete = Anulează solicitarea de
ștergere cont

profile-account-deleteAccount-request = Solicită
profile-account-deleteAccount-cancel = Anulează
profile-account-deleteAccount-pages-deleteButton = Șterge contul meu
profile-account-deleteAccount-pages-cancel = Anulează
profile-account-deleteAccount-pages-proceed = Continuă
profile-account-deleteAccount-pages-done = Efectuat

profile-account-deleteAccount-pages-descriptionHeader = Șterge contul meu?
profile-account-deleteAccount-pages-descriptionText =
  Încerci să îți ștergi contul. Această înseamnă:

profile-account-deleteAccount-pages-allCommentsRemoved =
  Toate comentariile tale vor fi șterse de pe acest site
profile-account-deleteAccount-pages-allCommentsDeleted =
  Toate comentariile tale vor fi șterse din baza noastră de date
profile-account-deleteAccount-pages-emailRemoved =
  Adresa de email va fi eliminată din sistem

profile-account-deleteAccount-pages-whenHeader = Șterge contul meu: Când?
profile-account-deleteAccount-pages-whenSec1Header = Când va fi șters contul meu?
profile-account-deleteAccount-pages-whenSec1Content =
  Contul tău va fi șters după 24 de ore de la trimiterea solicitării. 
profile-account-deleteAccount-pages-whenSec2Header =
  Pot scrie comentarii până când contul meu va fi șters?
profile-account-deleteAccount-pages-whenSec2Content =
  Nu. O dată ce trimiți solicitare pentru ștergerea contului nu mai
  poți adaugă comentarii, răspunde sau reacționa la comentariile altor utilizatori.  

profile-account-deleteAccount-pages-downloadCommentHeader = Descărcarea
comentariilor mele?
profile-account-deleteAccount-pages-downloadCommentsDesc =
  Înainte de ștergerea contului, îți recomandăm să descarci tot istoricul
  tău de comentarii pentru propria evidență. După ștergerea contului, nu
  vei mai putea solicită istoricul de comentarii.

profile-account-deleteAccount-pages-downloadCommentsPath =
  Profilul meu > Descarcă istoricul de comentarii
profile-account-deleteAccount-pages-confirmHeader = Confirmă ștergerea
contului?
profile-account-deleteAccount-pages-confirmDescHeader =
 Ești sigur că vrei ștergerea contului?
profile-account-deleteAccount-confirmDescContent =
  Pentru a confirmă solicitarea de ștergere a contului de rugăm să
  tastezi următoarea frază în spațiul de mai jos:
profile-account-deleteAccount-pages-confirmPhraseLabel =
  Pentru a confirmă, tastează frază de mai jos:
profile-account-deleteAccount-pages-confirmPasswordLabel = Introdu parola:

profile-account-deleteAccount-pages-completeHeader = Ștergerea contului
solicitată
profile-account-deleteAccount-pages-completeDescript =
  Solicitarea ta a fost trimisă și o confirmare va fi trimisă pe adresa de
  email asociată contului tău de utilizator. 
profile-account-deleteAccount-pages-completeTimeHeader =
Contul tău va fi șters la: { $date }
profile-account-deleteAccount-pages-completeChangeYourMindHeader = Te-ai
răzgândit?
profile-account-deleteAccount-pages-completeSignIntoYourAccount =
 Intră în contul tău din nou până la acest moment și selectează
<strong>Anulează Solicitarea Ștergere Cont</strong>.
profile-account-deleteAccount-pages-completeTellUsWhy = Spune-ne de ce.
profile-account-deleteAccount-pages-completeWhyDeleteAccount =
  Ne-ar plăcea să știm de ce ai ales să îți ștergi contul. Trimite-ne părerea ta despre sistemul nostrum de comentarii pe adresa de
  email { $email }.

profile-account-changePassword-edit = Editează

## Notifications
profile-notificationsTab = Notificări
profile-account-notifications-emailNotifications = Notificări E-Mail
profile-account-notifications-emailNotifications = Notificări Email
profile-account-notifications-receiveWhen = Primește notificări când:
profile-account-notifications-onReply = Cineva a răspuns la comentariul meu
profile-account-notifications-onFeatured = Comentariul meu este recomandat
profile-account-notifications-onStaffReplies =
  Un membru al echipei răspunde la comentariul meu
profile-account-notifications-onModeration = Comentariul meu în așteptare a
fost evaluat
profile-account-notifications-sendNotifications = Trimite notificări:
profile-account-notifications-sendNotifications-immediately = Imediat
profile-account-notifications-sendNotifications-daily = Zilnic
profile-account-notifications-sendNotifications-hourly = Pe oră
profile-account-notifications-updated = Setările tale pentru notificări au
fost actualizate
profile-account-notifications-button = Actualizează setările pentru notificări
profile-account-notifications-button-update = Actualizează

## Report Comment Popover
comments-reportPopover =
  .description = Fereastră pentru raportarea comentariilor
comments-reportPopover-reportThisComment = Raportează acest comentariu
comments-reportPopover-whyAreYouReporting = De ce raportezi acest comentariu?
comments-reportPopover-reasonOffensive = Acest comentariu este ofensator
comments-reportPopover-reasonIDisagree = Nu sunt de acord cu acest comentariu
comments-reportPopover-reasonSpam = Seamănă ca o reclama sau promovare
comments-reportPopover-reasonOther = Alt motiv
comments-reportPopover-pleaseLeaveAdditionalInformation =
  Te rugăm să adaugi orice altă informație care ar putea ajută moderatorii
  în evaluarea comentariului. (Optional)

comments-reportPopover-maxCharacters = Max. { $maxCharacters } Caractere
comments-reportPopover-cancel = Anulează
comments-reportPopover-submit = Trimite

comments-reportPopover-thankYou = Mulțumim!
comments-reportPopover-receivedMessage =
  Am primit mesajul tău. Raportările de la membrii că tine ne ajută să
  menținem această comunitate sigură.  

comments-reportPopover-dismiss = Respinge

## Submit Status
comments-submitStatus-dismiss = Respins
comments-submitStatus-submittedAndWillBeReviewed =
  Comentariul tău a fost trimis și va fi evaluat de către un moderator 

# Configure
configure-configureQuery-errorLoadingProfile = Eroare încărcare configurare
configure-configureQuery-storyNotFound = Subiectul nu a fost găsit

## Change username
profile-changeUsername-username = Nume utilizator
profile-changeUsername-success = Numele tău de utilizator a fost actualizat
cu success
profile-changeUsername-edit = Editează
profile-changeUsername-heading = Editează numele tău de utilizator
profile-changeUsername-desc =
  Modifică numele de utilizator care va fi afișat la toate comentariile
  tale trecute și viitoare. <strong>Numele de utilizator poate fi
  modificat o dată la { framework-timeago-time }.</strong>
profile-changeUsername-desc-text =
  Modifică numele de utilizator care va fi afișat la toate comentariile
  tale trecute și viitoare. Numele de utilizator poate fi modificat o
  dată la {framework-timeago-time }.
profile-changeUsername-current = Nume utilizator actual
profile-changeUsername-newUsername-label = Nume utilizator nou
profile-changeUsername-confirmNewUsername-label = Confirmă nume utilizator
nou
profile-changeUsername-cancel = Anulează

profile-changeUsername-save = Salvează
profile-changeUsername-recentChange =
  Numele de utilizator a fost modificat ultima dată
  { framework-timeago-time }. Vei putea modifica din nou numele de
  utilizator pe { $nextUpdate }
profile-changeUsername-close = Închide

## Comment Stream
configure-stream-title = Configurează acest flux de comentarii
configure-stream-apply = Aplică

configure-premod-title = Activează Pre-moderarea
configure-premod-description =
  Moderatorul trebuie să aprobe orice comentariu pentru acest subiect
  înainte de a fi publicat.

configure-premodLink-title = Pre-Moderare comentarii ce conțin Link-uri.
configure-premodLink-description =
  Moderatorul trebuie să aprobe orice comentariu care conține un link,
  înainte de a fi publicat, pentru acest subiect

configure-messageBox-title = Activează cutia de mesaje pentru acest subiect
configure-messageBox-description =
  Adaugă un mesaj la începutul boxului de comentarii, pentru cititorii tăi.
  Folosește această opțiune pentru a sugera un subiect de discuții, adaugă o
  întrebare sau adaugă un anunț referitor la comentariile acestui subiect.
configure-messageBox-preview = Previzualizează
configure-messageBox-selectAnIcon = Selectează un simbol
configure-messageBox-noIcon = Niciun symbol
configure-messageBox-writeAMessage = Scrie un mesaj

configure-closeStream-title = Închide fluxul de comentarii
configure-closeStream-description =
  Acest flux de comentarii este momentan deschis. Prin închderea acestui
  flux de comentarii niciun comentariu nou nu va putea fi adăugat și toate
  comentariile anterioare vor fi afișate în continuare.
configure-closeStream-closeStream = Închide fluxul

configure-openStream-title = Deschide fluxul
configure-openStream-description =
  Acest flux de comentarii este momentan închis. Prin deschiderea acestui
  flux, comentarii noi pot fi trimise sau afișate.
configure-openStream-openStream = Deschide fluxul

comments-tombstone-ignore = Acest comentariu este ascuns pentru că ai ales
să ignori utilizatorul {$username}
comments-tombstone-deleted =
  Acest comentariu nu mai este valabil. Utilizatorul și-a dezactivat contul

suspendInfo-heading = Contul tău a fost suspendat temporar de la comentarii
suspendInfo-info =
  În concordanță cu regulile comunității{ $organization }, contul tău a
  fost temporar suspendat. Pe perioada suspendării, nu vei putea comenta,
  răspunde sau reacționa la comentarii. Te rugăm să revii la { $until }

profile-changeEmail-unverified = (Neverificat)
profile-changeEmail-edit = Editează
profile-changeEmail-please-verify = Verifică-ți adresa de email
profile-changeEmail-please-verify-details =
  Un email a fost trimis la { $email } pentru verificarea contului tău.
  Trebuie să îți verifici nouă adresa de email înainte de a utiliza pentru
  a intră în contul tău sau pentru a primi notificări.
profile-changeEmail-resend = Retrimite verificarea
profile-changeEmail-heading = Editează adresa de email
profile-changeEmail-desc =
  Schimbă adresa de email utilizată pentru a intră în cont și pentru a primi informații despre contul tău..
profile-changeEmail-current = Adresa de email actuală

profile-changeEmail-newEmail-label = Noua adresă de email
profile-changeEmail-password = Parola
profile-changeEmail-password-input =
.placeholder = Parola
profile-changeEmail-cancel = Anulează
profile-changeEmail-submit = Salvează
profile-changeEmail-email = Email
