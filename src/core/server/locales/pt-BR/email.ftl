# Account Notifications

email-footer-accountNotification =
  Enviado por <a data-l10n-name="organizationLink">{ $organizationName }</a>

email-subject-accountNotificationForgotPassword = Pedido de Redefinição de Senha
email-template-accountNotificationForgotPassword =
  Olá { $username },<br/><br/>
  Recebemos uma solicitação para redefinir sua senha em <a data-l10n-name="organizationName">{ $organizationName }</a>.<br/><br/>
  Por favor, use este link redefinir sua senha: <a data-l10n-name="resetYourPassword">Clique aqui para redefinir sua senha</a><br/><br/>
  <i>Se você não solicitou isso, ignore este e-mail.</i><br/>

email-subject-accountNotificationBan = Sua conta foi banida
email-template-accountNotificationBan =
  Olá { $username },<br/><br/>
  Alguém com acesso à sua conta violou nossas diretrizes da comunidade.
  Como resultado, sua conta foi banida. Você não será mais capaz de
  comentar, reagir ou reportar comentários. se você acha que isso foi feito por engano,
  entre em contato com nossa equipe em <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationPasswordChange = Sua senha foi alterada
email-template-accountNotificationPasswordChange =
  Olá { $username },<br/><br/>
  A senha da sua conta foi alterada.<br/><br/>
  Se você não solicitou essa alteração,
  entre em contato com nossa equipe em <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationUpdateUsername = Seu nome de usuário foi alterado
email-template-accountNotificationUpdateUsername =
  Olá { $username },<br/><br/>
  Obrigado por atualizar as informações de sua conta em { $organizationName }.As suas alterações serão atualizadas imediatamente.<br /><br />
  Se você não fez esta alteração, favor entrar em contato com o nosso time em <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationSuspend = A sua conta foi suspensa
email-template-accountNotificationSuspend =
  { $customMessage }<br/><br/>
  Se você acha que isso foi feito por engano, entre em contato com nossa equipe em
  <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationConfirmEmail = Confirmar e-mail
email-template-accountNotificationConfirmEmail =
  Olá { $username },<br/><br/>
  Para confirmar seu endereço de e-mail e usá-lo em sua conta nos comentários em { $organizationName }
  <a data-l10n-name="confirmYourEmail">Clique aqui</a><br/><br/>
  Se você não criou recentemente uma conta na platforma de comentários em { $organizationName }, você pode ignorar este email.

email-subject-accountNotificationInvite = Convite do time Coral
email-template-accountNotificationInvite =
  Você foi convidado para participar do time { $organizationName }
  no Coral. Finalize o seu cadastro <a data-l10n-name="invite">aqui</a>.

email-subject-accountNotificationDownloadComments = Seus comentários estão prontos para download
email-template-accountNotificationDownloadComments =
  Estão disponíveis para download os comentários de { $organizationName } a partir de { $date }.<br /><br />
  <a data-l10n-name="downloadUrl">Fazer o download do meu histórico de comentários</a>

email-subject-accountNotificationDeleteRequestConfirmation =
  A exclusão de sua conta de comentarista foi agendada.
email-template-accountNotificationDeleteRequestConfirmation =
  Foi recebido um pedido para deletar a sua conta.
  A exclusão de sua conta foi agendada para { $requestDate }.<br /><br />
  Depois desta data, todos os seus comentários serão removidos do site, do nosso
  banco de dados e seu nome de usuário e email serão removidos do nosso sistema.<br /><br />
  Você pode também cancelar o pedido pelo site antes da data agendada.

email-subject-accountNotificationDeleteRequestCancel =
  Seu pedido de exclusão da conta foi cancelado.
email-template-accountNotificationDeleteRequestCancel =
  Você cancelou o pedido de exclusão da conta de { $organizationName }.
  Sua conta foi reativada.

email-subject-accountNotificationDeleteRequestCompleted =
  Sua conta foi deletada com sucesso.
email-template-accountNotificationDeleteRequestCompleted =
  Sua conta de comentarista para { $organizationName } foi deletada.
  Nós sentimos muito por você ir embora! <br /><br />
  Se você desejar se juntar às discussões novamente, você pode criar uma nova conta.<br /><br />
  Fique a vontade para nos dar um feedback explicando o motivo de sua saída,
  assim poderemos fazer a sua experiência ainda melhor.
  Por favor, mande um email para: { $organizationContactEmail }.
# Notification

email-footer-notification =
Enviado por <a data-l10n-name="organizationLink">{ $organizationName }</a> - <a data-l10n-name="unsubscribeLink">Cancelar a assinatura das notificações</a>

## On Reply

email-subject-notificationOnReply = Alguém respondeu o seu comenteário na { $organizationName }
email-template-notificationOnReply =
  { $organizationName } - <a data-l10n-name="storyLink">{ $storyTitle }</a><br /><br />
  { $authorUsername } respondeu o seu comentário: <a data-l10n-name="commentPermalink">Ver comentário</a>

## On Featured

email-subject-notificationOnFeatured = Um dos seus comentários foi destacado em { $organizationName }
email-template-notificationOnFeatured =
  { $organizationName } - <a data-l10n-name="storyLink">{ $storyTitle }</a><br /><br />
  Um membro do seu time destacou este comentário para os outros leitores:  <a data-l10n-name="commentPermalink">Ver comentário</a>

## On Staff Reply

email-subject-notificationOnStaffReply = Alguém da { $organizationName } respondeu o seu comentário
email-template-notificationOnStaffReply =
  { $organizationName } - <a data-l10n-name="storyLink">{ $storyTitle }</a><br /><br/>
  { $authorUsername } trabalha para { $organizationName } e respondeu ao seu comentário: <a data-l10n-name="commentPermalink">Ver comentário</a>

## On Comment Approved

email-subject-notificationOnCommentApproved = Seu comentário em { $organizationName } foi publicado
email-template-notificationOnCommentApproved =
  { $organizationName }<br /><br/>
  Seu comentário foi publicado. Obrigado por comentar: <a data-l10n-name="commentPermalink">Ver comentário</a>

## On Comment Rejected

email-subject-notificationOnCommentRejected = Seu comentário em { $organizationName } não foi publicado
email-template-notificationOnCommentRejected =
  { $organizationName }<br /><br/>
  A linguagem utilizada em seu comentário não foi de acordo com as regras da comunidade, e por isso seu comentário foi removido.

# Notification Digest

email-subject-notificationDigest = Sua última atividade em  { $organizationName }
