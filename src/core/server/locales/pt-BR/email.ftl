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
  entre em contato com nossa equipe da comunidade em <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationPasswordChange = Sua senha foi alterada
email-template-accountNotificationPasswordChange =
  Olá { $username },<br/><br/>
  A senha da sua conta foi alterada.<br/><br/>
  Se você não solicitou essa alteração,
  entre em contato com nossa equipe da comunidade em <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationSuspend = A sua conta foi suspensa
email-template-accountNotificationSuspend =
  Olá { $username },<br/><br/>
  Em concordância com as diretrizes da comunidade { $organizationName }, sua
  conta foi temporariamente suspensa. Durante a suspensão, você será
  incapaz de comentar, interagir ou se envolver com outros comentários. Por favor, junte-se a
  nós em { $until }.<br/><br/>
  Se você acha que isso foi feito por engano, entre em contato com nossa equipe em
  <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationConfirmEmail = Confirmar e-mail
email-template-accountNotificationConfirmEmail =
  Olá { $username },<br/><br/>
  Para confirmar seu endereço de e-mail para usar sua conta nos comentários em { $organizationName }
  <a data-l10n-name="confirmYourEmail">Clique aqui</a><br/><br/>
  Se você não criou recentemente uma conta de comentários em
  { $organizationName }, você pode ignorar este email.

