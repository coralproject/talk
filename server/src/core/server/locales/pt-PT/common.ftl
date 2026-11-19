closeCommentingDefaultMessage = Os comentários foram encerrados nesta história.
disableCommentingDefaultMessage = Os comentários foram encerrados nesta história.

reaction-labelRespect = Respeitar
reaction-labelActiveRespected = Respeitado
reaction-sortLabelMostRespected = Mais Respeitados

comment-count =
  <span class="{ $textClass }">{ $number  ->
    [one] Comentário
    *[other] Comentários
  }</span>

comment-counts-ratings-and-reviews =
  <span class="{ $textClass }">{ $number  ->
    [one] Avaliação
    *[other] Avaliações
  }</span>

staff-label = Staff

dsaReportCSV-timestamp = Timestamp (UTC)
dsaReportCSV-user = Utilizador
dsaReportCSV-action = Ação
dsaReportCSV-details = Detalhes
dsaReportCSV-reportSubmitted = Relatório enviado
dsaReportCSV-referenceID = ID de referência
dsaReportCSV-legalDetail = Detalhe legal
dsaReportCSV-additionalInfo = Informações adicionais
dsaReportCSV-commentAuthor = Autor do comentário
dsaReportCSV-commentBody = Corpo do comentário
dsaReportCSV-commentID = ID do comentário
dsaReportCSV-commentMediaUrl = URL de multimédia do comentário
dsaReportCSV-changedStatus = Estado alterado
dsaReportCSV-addedNote = Nota adicionada
dsaReportCSV-madeDecision = Decisão tomada
dsaReportCSV-downloadedReport = Download do Relatório
dsaReportCSV-legality-illegal = Legalidade: Ilegal
dsaReportCSV-legality-legal = Legalidade: Legal
dsaReportCSV-legalGrounds = Fundamentos legais
dsaReportCSV-explanation = Explicação
dsaReportCSV-status-awaitingReview = A aguardar revisão
dsaReportCSV-status-inReview = Em revisão
dsaReportCSV-status-completed = Concluído
dsaReportCSV-status-void = Anulado
dsaReportCSV-anonymousUser = Utilizador anónimo
dsaReportCSV-usernameNotAvailable = Nome de utilizador não disponível

# Notifications

notifications-illegalContentReportReviewed-title =
  O seu relatório de conteúdo ilegal foi revisto

notifications-illegalContentReportReviewed-decision-legal =
  não parece conter conteúdo ilegal
notifications-illegalContentReportReviewed-decision-illegal =
  contém conteúdo ilegal

notifications-illegalContentReportReviewed-description =
  Em { $date }, reportou um comentário escrito por { $author } por
  conter potencialmente conteúdo ilegal. Após rever o seu relatório, a nossa equipa de moderação
  decidiu que este comentário { $decision }.

notifications-commentRejected-title =
  O seu comentário foi rejeitado e removido do nosso site
notifications-commentRejected-description =
  Os nossos moderadores analisaram o seu comentário e determinaram que contém conteúdo que viola as nossas diretrizes da comunidade ou termos de serviço.
  <br/>
  { $details }

notifications-commentRejected-details-illegalContent =
  <b>MOTIVO DA REMOÇÃO</b><br/>
  <descriptItem>{ $reason }</descriptItem><br/>
  <b>FUNDAMENTOS LEGAIS</b><br/>
  { $grounds }<br/>
  <b>EXPLICAÇÃO ADICIONAL</b><br/>
  { $explanation }

notifications-commentRejected-details-general =
  <b>MOTIVO DA REMOÇÃO</b><br/>
  { $reason }<br/>
  <b>EXPLICAÇÃO ADICIONAL</b><br/>
  { $explanation }

notification-reasonForRemoval-offensive = Ofensivo
notification-reasonForRemoval-abusive = Abusivo
notification-reasonForRemoval-spam = Spam
notification-reasonForRemoval-bannedWord = Palavra proibida
notification-reasonForRemoval-ad = Publicidade
notification-reasonForRemoval-other = Outro
notification-reasonForRemoval-illegal = Conteúdo potencialmente ilegal
notification-reasonForRemoval-unknown = Desconhecido

notifications-commentRejected-details-notFound =
  Não foi possível encontrar os detalhes desta rejeição.

# Notifications (old)

notifications-commentWasFeatured-title = Comentário foi destacado
notifications-commentWasFeatured-body = O comentário { $commentID } foi destacado.
notifications-commentWasApproved-title = Comentário foi aprovado
notifications-commentWasApproved-body = O comentário { $commentID } foi aprovado.

notifications-commentWasRejected-title = Comentário foi rejeitado
notifications-commentWasRejected-body = O comentário { $commentID } foi rejeitado.

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
  O comentário { $commentID } foi rejeitado.
  Os motivos foram:
  { $code }
  { $grounds }
  { $explanation }

notifications-commentWasRejectedAndIllegal-title = Comentário foi considerado conter conteúdo ilegal e foi rejeitado
notifications-commentWasRejectedAndIllegal-body =
  O comentário { $commentID } foi rejeitado por conter conteúdo ilegal.
  O motivo foi:
  <br/>
  { $reason }
notifications-dsaIllegalRejectedReason-information =
  Motivos:
  <br/>
  { $grounds }
  <br/>
  Explicação:
  <br/>
  { $explanation }
notifications-dsaIllegalRejectedReason-informationNotFound = Não foi possível encontrar o motivo desta decisão.

notifications-dsaReportDecisionMade-title = Foi tomada uma decisão sobre o seu relatório DSA
notifications-dsaReportDecision-legal = O relatório { $reportID } foi considerado legal.
notifications-dsaReportDecision-illegal = O relatório { $reportID } foi considerado ilegal.
notifications-dsaReportDecision-legalInformation =
  Motivos:
  <br/>
  { $grounds }
  <br/>
  Explicação:
  <br/>
  { $explanation }
notifications-dsaReportDecisionMade-body-withoutInfo = { $decision }
notifications-dsaReportDecisionMade-body-withInfo =
  { $decision }
  <br/>
  { $information }

common-accountDeleted =
  A conta do utilizador foi eliminada.
