closeCommentingDefaultMessage = Comentários foram fechados nessa história.
disableCommentingDefaultMessage = Comentários foram fechados nessa história.

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
dsaReportCSV-user = Usuário
dsaReportCSV-action = Ação
dsaReportCSV-details = Detalhes
dsaReportCSV-reportSubmitted = Relatório enviado
dsaReportCSV-referenceID = ID de referência
dsaReportCSV-legalDetail = Detalhe legal
dsaReportCSV-additionalInfo = Informações adicionais
dsaReportCSV-commentAuthor = Autor do comentário
dsaReportCSV-commentBody = Corpo do comentário
dsaReportCSV-commentID = ID do comentário
dsaReportCSV-commentMediaUrl = URL de mídia do comentário
dsaReportCSV-changedStatus = Status alterado
dsaReportCSV-addedNote = Nota adicionada
dsaReportCSV-madeDecision = Decisão tomada
dsaReportCSV-downloadedReport = Download do Relatório
dsaReportCSV-legality-illegal = Legalidade: Ilegal
dsaReportCSV-legality-legal = Legalidade: Legal
dsaReportCSV-legalGrounds = Fundamentos legais
dsaReportCSV-explanation = Explicação
dsaReportCSV-status-awaitingReview = Aguardando revisão
dsaReportCSV-status-inReview = Em revisão
dsaReportCSV-status-completed = Concluído
dsaReportCSV-status-void = Anulado
dsaReportCSV-anonymousUser = Usuário anônimo
dsaReportCSV-usernameNotAvailable = Nome de usuário não disponível

# Notifications

notifications-illegalContentReportReviewed-title =
  Seu relatório de conteúdo ilegal foi revisado

notifications-illegalContentReportReviewed-decision-legal =
  não parece conter conteúdo ilegal
notifications-illegalContentReportReviewed-decision-illegal =
  contém conteúdo ilegal

notifications-illegalContentReportReviewed-description =
  Em { $date }, você relatou um comentário escrito por { $author } por
  conter potencialmente conteúdo ilegal. Após revisar seu relatório, nossa equipe de moderação
  decidiu que este comentário { $decision }.

notifications-commentRejected-title =
  Seu comentário foi rejeitado e removido de nosso site
notifications-commentRejected-description =
  Nossos moderadores revisaram seu comentário e determinaram que ele contém conteúdo que viola nossas diretrizes da comunidade ou termos de serviço.
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
notification-reasonForRemoval-ad = Anúncio
notification-reasonForRemoval-other = Outro
notification-reasonForRemoval-illegal = Conteúdo potencialmente ilegal
notification-reasonForRemoval-unknown = Desconhecido

notifications-commentRejected-details-notFound =
  Detalhes para essa rejeição não podem ser encontrados.

# Notifications (old)

notifications-commentWasFeatured-title = Comentário foi destaque
notifications-commentWasFeatured-body = O comentário { $commentID } foi destaque.
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
notifications-dsaIllegalRejectedReason-informationNotFound = A razão para esta decisão não pode ser encontrada.

notifications-dsaReportDecisionMade-title = Uma decisão foi tomada sobre seu relatório de DSA
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
  A conta de usuário foi excluída.
