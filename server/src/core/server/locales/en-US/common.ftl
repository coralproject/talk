closeCommentingDefaultMessage = Comments are closed on this story.
disableCommentingDefaultMessage = Comments are closed on this story.

reaction-labelRespect = Respect
reaction-labelActiveRespected = Respected
reaction-sortLabelMostRespected = Most Respected

comment-count =
  <span class="{ $textClass }">{ $number  ->
    [one] Comment
    *[other] Comments
  }</span>

comment-counts-ratings-and-reviews =
  <span class="{ $textClass }">{ $number  ->
    [one] Rating
    *[other] Ratings
  }</span>

staff-label = Staff

dsaReportCSV-timestamp = Timestamp
dsaReportCSV-user = User
dsaReportCSV-action = Action
dsaReportCSV-details = Details
dsaReportCSV-reportSubmitted = Report submitted
dsaReportCSV-referenceID = Reference ID
dsaReportCSV-legalDetail = Legal detail
dsaReportCSV-additionalInfo = Additional info
dsaReportCSV-commentAuthor = Comment author
dsaReportCSV-commentBody = Comment body
dsaReportCSV-commentID = Comment ID
dsaReportCSV-changedStatus = Changed status
dsaReportCSV-addedNote = Added note
dsaReportCSV-madeDecision = Made decision
dsaReportCSV-downloadedReport = Downloaded report
dsaReportCSV-legality-illegal = Legality: Illegal
dsaReportCSV-legality-legal = Legality: Legal
dsaReportCSV-legalGrounds = Legal grounds
dsaReportCSV-explanation = Explanation

# Notifications

notifications-illegalContentReportReviewed-title =
  Your illegal content report has been reviewed

notifications-illegalContentReportReviewed-decision-legal =
  does not appear to contain illegal content
notifications-illegalContentReportReviewed-decision-illegal =
  does contain illegal content

notifications-illegalContentReportReviewed-description =
  On { $date } you reported a comment written by { $author } for
  containing illegal content. After reviewing your report, our moderation
  team has decided this comment { $decision }.

notifications-commentRejected-title =
  Your comment has been rejected and removed from our site
notifications-commentRejected-description =
  Our moderators have reviewed your comment and determined your comment contains content that violates our community guidelines or terms of service.
  <br/>
  <br/>
  { $details }

notifications-commentRejected-details-general =
  <b>REASON FOR REMOVAL</b><br/>
  { $reason }<br/>
  <b>ADDITIONAL EXPLANATION</b><br/>
  { $explanation }

notifications-commentRejected-details-illegalContent =
  <b>REASON FOR REMOVAL</b><br/>
  <descriptItem>{ $reason }</descriptItem><br/>
  <b>LEGAL GROUNDS</b><br/>
  { $grounds }<br/>
  <b>ADDITIONAL EXPLANATION</b><br/>
  { $explanation }

notification-reasonForRemoval-illegal = Illegal content

notifications-commentRejected-details-notFound =
  Details for this rejection cannot be found.

# Notifications (old)

notifications-commentWasFeatured-title = Comment was featured
notifications-commentWasFeatured-body = The comment { $commentID } was featured.
notifications-commentWasApproved-title = Comment was approved
notifications-commentWasApproved-body = The comment { $commentID } was approved.

notifications-commentWasRejected-title = Comment was rejected
notifications-commentWasRejected-body = The comment { $commentID } was rejected.

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
  The comment { $commentID } was rejected.
  The reasons of which were:
  { $code }
  { $grounds }
  { $explanation }

notifications-commentWasRejectedAndIllegal-title = Comment was deemed to contain illegal content and was rejected
notifications-commentWasRejectedAndIllegal-body =
  The comment { $commentID } was rejected for containing illegal content.
  The reason of which was:
  <br/>
  { $reason }
notifications-dsaIllegalRejectedReason-information =
  Grounds:
  <br/>
  { $grounds }
  <br/>
  Explanation:
  <br/>
  { $explanation }
notifications-dsaIllegalRejectedReason-informationNotFound = The reasoning for this decision cannot be found.

notifications-dsaReportDecisionMade-title = A decision was made on your DSA report
notifications-dsaReportDecision-legal = The report { $reportID } was determined to be legal.
notifications-dsaReportDecision-illegal = The report { $reportID } was determined to be illegal.
notifications-dsaReportDecision-legalInformation =
  Grounds:
  <br/>
  { $grounds }
  <br/>
  Explanation:
  <br/>
  { $explanation }
notifications-dsaReportDecisionMade-body-withoutInfo = { $decision }
notifications-dsaReportDecisionMade-body-withInfo =
  { $decision }
  <br/>
  { $information }
