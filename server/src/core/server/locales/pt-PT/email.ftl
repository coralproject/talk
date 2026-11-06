# Account Notifications

email-footer-accountNotification =
  Enviado por <a data-l10n-name="organizationLink">{ $organizationName }</a>

email-subject-accountNotificationForgotPassword = Pedido de Redefinição de Palavra-passe
email-template-accountNotificationForgotPassword =
  Olá { $username },<br/><br/>
  Recebemos um pedido para redefinir a sua palavra-passe em <a data-l10n-name="organizationName">{ $organizationName }</a>.<br/><br/>
  Por favor, utilize este link para redefinir a sua palavra-passe: <a data-l10n-name="resetYourPassword">Clique aqui para redefinir a sua palavra-passe</a><br/><br/>
  <i>Se não solicitou isto, ignore este e-mail.</i><br/>

email-subject-accountNotificationBan = A sua conta foi banida
email-template-accountNotificationBan =
  { $customMessage }<br /><br />
  Se acha que ocorreu algum erro, entre em contacto com a comunidade em
  <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationPasswordChange = A sua palavra-passe foi alterada
email-template-accountNotificationPasswordChange =
  Olá { $username },<br/><br/>
  A palavra-passe da sua conta foi alterada.<br/><br/>
  Se não solicitou esta alteração,
  entre em contacto com a nossa equipa em <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationUpdateUsername = O seu nome de utilizador foi alterado
email-template-accountNotificationUpdateUsername =
  Olá { $username },<br/><br/>
  Obrigado por atualizar as informações da sua conta em { $organizationName }. As suas alterações serão aplicadas imediatamente.<br /><br />
  Se não fez esta alteração, por favor entre em contacto com a nossa equipa em <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationSuspend = A sua conta foi suspensa
email-template-accountNotificationSuspend =
  { $customMessage }<br/><br/>
  Se acha que isto foi feito por engano, entre em contacto com a nossa equipa em
  <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationConfirmEmail = Confirmar e-mail
email-template-accountNotificationConfirmEmail =
  Olá { $username },<br/><br/>
  Para confirmar o seu endereço de e-mail e utilizá-lo na sua conta de comentários em { $organizationName }
  <a data-l10n-name="confirmYourEmail">Clique aqui</a><br/><br/>
  Se não criou recentemente uma conta na plataforma de comentários em { $organizationName }, pode ignorar este e-mail.

email-subject-accountNotificationInvite = Convite da equipa Coral

email-template-accountNotificationInvite =
  Foi convidado para participar na equipa { $organizationName }
  no Coral. Conclua o seu registo <a data-l10n-name="invite">aqui</a>.

email-subject-accountNotificationDownloadComments = Os seus comentários estão prontos para download
email-template-accountNotificationDownloadComments =
  Estão disponíveis para download os comentários de { $organizationName } a partir de { $date }.<br /><br />
  <a data-l10n-name="downloadUrl">Fazer download do meu histórico de comentários</a>

email-subject-accountNotificationDeleteRequestConfirmation =
  A eliminação da sua conta de comentarista foi agendada.
email-template-accountNotificationDeleteRequestConfirmation =
  Foi recebido um pedido para eliminar a sua conta.
  A eliminação da sua conta foi agendada para { $requestDate }.<br /><br />
  Após esta data, todos os seus comentários serão removidos do site, da nossa
  base de dados e o seu nome de utilizador e e-mail serão removidos do nosso sistema.<br /><br />
  Se mudar de ideias, pode iniciar sessão na sua conta e cancelar o pedido
  antes do período agendado para a eliminação da sua conta.


email-subject-accountNotificationDeleteRequestCancel =
  O seu pedido de eliminação de conta foi cancelado.
email-template-accountNotificationDeleteRequestCancel =
  Cancelou o pedido de eliminação de conta de { $organizationName }.
  A sua conta foi reativada.

email-subject-accountNotificationDeleteRequestCompleted =
  A sua conta foi eliminada com sucesso.
email-template-accountNotificationDeleteRequestCompleted =
  A sua conta de comentarista em { $organizationName } foi eliminada.
  Lamentamos a sua saída! <br /><br />
  Se desejar voltar a participar nas discussões, pode criar uma nova conta.<br /><br />
  Sinta-se à vontade para nos deixar feedback explicando o motivo da sua saída,
  para que possamos melhorar a sua experiência.
  Por favor, envie um e-mail para: { $organizationContactEmail }.


# Notification

email-footer-notification =
  Enviado por <a data-l10n-name="organizationLink">{ $organizationName }</a> - <a data-l10n-name="unsubscribeLink">Cancelar subscrição de notificações</a>

## On Reply

email-subject-notificationOnReply = Alguém respondeu ao seu comentário em { $organizationName }
email-template-notificationOnReply =
  { $authorUsername } respondeu ao seu <a data-l10n-name="commentPermalink">comentário</a> em <a data-l10n-name="storyLink">{ $storyTitle }</a>

## On Featured

email-subject-notificationOnFeatured = Um dos seus comentários foi destacado em { $organizationName }
email-template-notificationOnFeatured =
  Um membro da sua equipa destacou <a data-l10n-name="commentPermalink">o comentário</a> que publicou em <a data-l10n-name="storyLink">{ $storyTitle }</a>

## On Staff Reply

email-subject-notificationOnStaffReply = Alguém de { $organizationName } respondeu ao seu comentário
email-template-notificationOnStaffReply =
  { $authorUsername } de { $organizationName } respondeu ao seu <a data-l10n-name="commentPermalink">comentário</a> publicado em <a data-l10n-name="storyLink">{ $storyTitle }</a>

## On Comment Approved

email-subject-notificationOnCommentApproved = O seu comentário em { $organizationName } foi publicado
email-template-notificationOnCommentApproved =
  { $organizationName }<br /><br/>
  O seu comentário foi publicado. Obrigado por comentar: <a data-l10n-name="commentPermalink">Ver comentário</a>

## On Comment Rejected

email-subject-notificationOnCommentRejected = O seu comentário em { $organizationName } não foi publicado
email-template-notificationOnCommentRejected =
  { $organizationName }<br /><br/>
  A linguagem utilizada no seu comentário não está de acordo com as regras da comunidade, pelo que o seu comentário foi removido.

# Notification Digest

email-subject-notificationDigest = A sua atividade recente em { $organizationName }

email-subject-testSmtpTest = E-mail de teste do Coral
email-template-testSmtpTest = Este é um e-mail de teste enviado para { $email }
