closeCommentingDefaultMessage = Kommentarsflödet är avstängt för den här artikeln.
disableCommentingDefaultMessage = Kommentarsflödet är avstängt för den här artikeln.

reaction-labelRespect = Gilla
reaction-labelActiveRespected = Gillad
reaction-sortLabelMostRespected = Mest gillad

comment-count =
  <span class="{ $textClass }">{ $number  ->
    [one] kommentar
    *[other] kommentarer
  }</span>

comment-counts-ratings-and-reviews =
  <span class="{ $textClass }">{ $number  ->
    [one] Omdöme
    *[other] Omdömen
  }</span>

staff-label = Redaktör

dsaReportCSV-timestamp = Tidsstämpel (UTC)
dsaReportCSV-user = Användare
dsaReportCSV-action = Åtgärd
dsaReportCSV-details = Detaljer
dsaReportCSV-reportSubmitted = Rapport inskickad
dsaReportCSV-referenceID = Referens-ID
dsaReportCSV-legalDetail = Juridiska detaljer
dsaReportCSV-additionalInfo = Ytterligare information
dsaReportCSV-commentAuthor = Kommentarens författare
dsaReportCSV-commentBody = Kommentarens innehåll
dsaReportCSV-commentID = Kommentar-ID
dsaReportCSV-commentMediaUrl = Kommentarens media-URL
dsaReportCSV-changedStatus = Ändrad status
dsaReportCSV-addedNote = Tillagd anteckning
dsaReportCSV-madeDecision = Beslut fattat
dsaReportCSV-downloadedReport = Rapport nerladdad
dsaReportCSV-legality-illegal = Legalitet: Olagligt
dsaReportCSV-legality-legal = Legalitet: Lagligt
dsaReportCSV-legalGrounds = Juridiska grunder
dsaReportCSV-explanation = Förklaring
dsaReportCSV-status-awaitingReview = Väntar på granskning
dsaReportCSV-status-inReview = Under granskning
dsaReportCSV-status-completed = Avslutad
dsaReportCSV-status-void = Ogiltig
dsaReportCSV-anonymousUser = Anonym användare
dsaReportCSV-usernameNotAvailable = Användarnamn inte tillgängligt

# Notifikationer

notifications-illegalContentReportReviewed-title =
  Din rapport om olagligt innehåll har granskats

notifications-illegalContentReportReviewed-decision-legal =
  verkar inte innehålla olagligt innehåll
notifications-illegalContentReportReviewed-decision-illegal =
  innehåller olagligt innehåll

notifications-illegalContentReportReviewed-description =
  Den { $date } rapporterade du en kommentar skriven av { $author } för
  att innehålla olagligt innehåll. Efter att ha granskat din rapport har vårt modereringsteam beslutat att denna kommentar { $decision }.

notifications-commentRejected-title =
  Din kommentar har avvisats och tagits bort från vår webbplats
notifications-commentRejected-description =
  Våra moderatorer har granskat din kommentar och bestämt att din kommentar innehåller innehåll som bryter mot våra communityriktlinjer eller användarvillkor.
  <br/>
  { $details }

notifications-commentRejected-details-illegalContent =
  <b>ORSAK TILL BORTTAGNING</b><br/>
  <descriptItem>{ $reason }</descriptItem><br/>
  <b>JURIDISKA GRUNDER</b><br/>
  { $grounds }<br/>
  <b>YTTERLIGARE FÖRKLARING</b><br/>
  { $explanation }

notifications-commentRejected-details-general =
  <b>ORSAK TILL BORTTAGNING</b><br/>
  { $reason }<br/>
  <b>YTTERLIGARE FÖRKLARING</b><br/>
  { $explanation }

notification-reasonForRemoval-offensive = Stötande
notification-reasonForRemoval-abusive = Kränkande
notification-reasonForRemoval-spam = Spam
notification-reasonForRemoval-bannedWord = Förbjudet ord
notification-reasonForRemoval-ad = Annons
notification-reasonForRemoval-other = Annat
notification-reasonForRemoval-illegal = Olagligt innehåll
notification-reasonForRemoval-unknown = Okänt

notifications-commentRejected-details-notFound =
  Detaljer för detta avslag kan inte hittas.

# Notifikationer (gamla)

notifications-commentWasFeatured-title = Kommentaren blev utvald
notifications-commentWasFeatured-body = Kommentaren { $commentID } blev utvald.
notifications-commentWasApproved-title = Kommentaren godkändes
notifications-commentWasApproved-body = Kommentaren { $commentID } godkändes.

notifications-commentWasRejected-title = Kommentaren avvisades
notifications-commentWasRejected-body = Kommentaren { $commentID } avvisades.

notifications-commentWasRejectedWithReason-code =
  <br/>
  { $code }
notifications-commentWasRejectedWithReason-grounds =
  <br/>
  { $grounds }
notifications-commentWasRejectedWithReason-explanation =
  <br/>
  { $explanation }
notifications-commentWasRejectedWithReason-body =
  Kommentaren { $commentID } avvisades.
  Anledningarna till detta var:
  { $code }
  { $grounds }
  { $explanation }

notifications-commentWasRejectedAndIllegal-title = Kommentaren bedömdes innehålla olagligt innehåll och avvisades
notifications-commentWasRejectedAndIllegal-body =
  Kommentaren { $commentID } avvisades för att den innehöll olagligt innehåll.
  Anledningen till detta var:
  <br/>
  { $reason }
notifications-dsaIllegalRejectedReason-information =
  Grunder:
  <br/>
  { $grounds }
  <br/>
  Förklaring:
  <br/>
  { $explanation }
notifications-dsaIllegalRejectedReason-informationNotFound = Anledningen till detta beslut kan inte hittas.

notifications-dsaReportDecisionMade-title = Ett beslut fattades om din DSA-rapport
notifications-dsaReportDecision-legal = Rapporten { $reportID } bedömdes vara laglig.
notifications-dsaReportDecision-illegal = Rapporten { $reportID } bedömdes vara olaglig.
notifications-dsaReportDecision-legalInformation =
  Grunder:
  <br/>
  { $grounds }
  <br/>
  Förklaring:
  <br/>
  { $explanation }
notifications-dsaReportDecisionMade-body-withoutInfo = { $decision }
notifications-dsaReportDecisionMade-body-withInfo =
  { $decision }
  <br/>
  { $information }

common-accountDeleted =
  Användarkontot raderades.
