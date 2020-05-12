### Localization for Admin

## General
general-notAvailable = Não disponível

## Story Status
storyStatus-open = Aberto
storyStatus-closed = Fechado

## Roles
role-admin = Administrador
role-moderator = Moderador
role-staff = Staff
role-commenter = Comentador

role-plural-admin = Administradores
role-plural-moderator = Moderadores
role-plural-staff = Staff
role-plural-commenter = Comentadores

## User Statuses
userStatus-active = Ativo
userStatus-banned = Banido
userStatus-suspended = Suspenso
userStatus-premod = Sempre pré-moderado

## Navigation
navigation-moderate = Moderação
navigation-community = Comunidade
navigation-stories = Histórias
navigation-configure = Configuração

## User Menu
userMenu-signOut = Sair
userMenu-viewLatestRelease = Ver último lançamento
userMenu-reportBug = Reportar um bug ou dar um feedback
userMenu-popover =
  .description = Uma caixa de diálogo do menu do usuário com links e ações relacionadas

## Restricted
restricted-currentlySignedInTo = Atualmente logado
restricted-noPermissionInfo = Você não tem permissão para acessar esta página.
restricted-signedInAs = Você está logado como: <username></username>
restricted-signInWithADifferentAccount = Entrar com uma conta diferente
restricted-contactAdmin = Se você acha que isso é um erro, entre em contato com seu administrador para obter ajuda.

## Login

# Sign In
login-signInTo = Entrar
login-signIn-enterAccountDetailsBelow = Insira os detalhes da sua conta abaixo

login-emailAddressLabel = Endereço de e-mail
login-emailAddressTextField =
  .placeholder = Endereço de e-mail

login-signIn-passwordLabel = Senha
login-signIn-passwordTextField =
  .placeholder = Senha

login-signIn-signInWithEmail = Entrar com o e-mail
login-orSeparator = Ou
login-signIn-forgot-password = Esqueceu sua senha?

login-signInWithFacebook = Entrar com Facebook
login-signInWithGoogle = Entrar com Google
login-signInWithOIDC = Entrar com { $name }

# Create Username

createUsername-createUsernameHeader = Criar Nome de Usuário
createUsername-whatItIs =
  Seu Nome de Usuário é um identificador que irá aparecerá em todos os seus comentários.
createUsername-createUsernameButton = Criar Nome de Usuário
createUsername-usernameLabel = Nome de Usuário
createUsername-usernameDescription = Você pode usar “_” e “.” Espaços não são permitidos.
createUsername-usernameTextField =
  .placeholder = Nome de Usuário

# Add Email Address
addEmailAddress-addEmailAddressHeader = Adicionar Endereço de Email

addEmailAddress-emailAddressLabel = Endereço de Email
addEmailAddress-emailAddressTextField =
  .placeholder = Endereço de Email

addEmailAddress-confirmEmailAddressLabel = Confirmar Endereço de Email
addEmailAddress-confirmEmailAddressTextField =
  .placeholder = Confirmar Endereço de Email

addEmailAddress-whatItIs =
  Para sua maior segurança, nós exigimos que usuários adicionem um endereço de email às suas contas.

addEmailAddress-addEmailAddressButton =
  Adicionar um Endereço de Email

# Create Password
createPassword-createPasswordHeader = Criar Senha
createPassword-whatItIs =
 Para proteger contra alterações não-autorizadas na sua conta,
 nós exigimos que usuários criem uma senha.
createPassword-createPasswordButton =
  Criar Senha

createPassword-passwordLabel = Senha
createPassword-passwordDescription = Precisa ter no mínimo {$minLength} caracteres
createPassword-passwordTextField =
  .placeholder = Senha

# Forgot Password
forgotPassword-forgotPasswordHeader = Esqueceu sua senha?
forgotPassword-checkEmailHeader = Veja seu email
forgotPassword-gotBackToSignIn = Voltar à tela de login
forgotPassword-checkEmail-receiveEmail =
  Se houver uma conta associada a <strong>{ $email }</strong>,
  você receberá um email com um link para criar uma nova senha.
forgotPassword-enterEmailAndGetALink =
  Digite seu endereço de email abaixo e nós irémos enviar para você
  um link para redefinir sua senha.
forgotPassword-emailAddressLabel = Endereço de email
forgotPassword-emailAddressTextField =
  .placeholder = Endereço de email
forgotPassword-sendEmailButton = Enviar email

# Link Account
linkAccount-linkAccountHeader = Associar Conta
linkAccount-alreadyAssociated =
  O email <strong>{ $email }</strong> já está
  associado a uma conta. Se você deseja associar estes,
  digite sua senha.
linkAccount-passwordLabel = Senha
linkAccount-passwordTextField =
  .label = Senha
linkAccount-linkAccountButton = Associar Conta
linkAccount-useDifferentEmail = Use um endereço de email diferente

## Configure

configure-experimentalFeature = Funcionalidade Experimental

configure-unsavedInputWarning =
  Você tem entrada não salva. Tem certeza de que deseja sair desta página?

configure-sideBarNavigation-general = Geral
configure-sideBarNavigation-authentication = Autenticação
configure-sideBarNavigation-moderation = Moderação
configure-sideBarNavigation-organization = Organização
configure-sideBarNavigation-advanced = Avançado
configure-sideBarNavigation-email = E-mail
configure-sideBarNavigation-bannedAndSuspectWords = Palavras banidas e suspeitas
configure-sideBarNavigation-slack = Slack
configure-sideBarNavigation-webhooks = Webhooks

configure-sideBar-saveChanges = Salvar mudanças
configure-configurationSubHeader = Configuração
configure-onOffField-on = Ligado
configure-onOffField-off = Desligado
configure-radioButton-allow = Permitir
configure-radioButton-dontAllow = Não permitir

### Webhooks
configure-webhooks-experimentalFeature =
  A funcionalidade de Webhooks atualmente está em desenvolvimento ativo. Eventos podem
  ser adicionados ou removidos. Por favor <ContactUsLink>entre em contato conosco com qualquer feedback ou pedido</ContactUsLink>.
configure-webhooks-webhookEndpointNotFound = Endpoint do Webhook não encontrado
configure-webhooks-header-title = Configurar endpoint do Webhook
configure-webhooks-description =
  Configura um endpoint para enviar eventos quando tais eventos ocorrem no Coral.
  Estes eventos serão encodados via JSON e assinados. Para saber mais sobre
  a assinatura de webhooks, visite nosso<externalLink>Guia de Webhooks</externalLink>.
configure-webhooks-addEndpoint = Adicionar um endpoint do webhook
configure-webhooks-addEndpointButton = Adicionar um endpoint do webhook
configure-webhooks-endpoints = Endpoints
configure-webhooks-url = URL
configure-webhooks-status = Status
configure-webhooks-noEndpoints = Não há endpoints de webhooks configurados, adicione um acima.
configure-webhooks-enabledWebhookEndpoint = Habilitado
configure-webhooks-disabledWebhookEndpoint = Desabilitado
configure-webhooks-endpointURL = URL do Endpoint
configure-webhooks-cancelButton = Cancelar
configure-webhooks-updateWebhookEndpointButton = Atualizar endpoint do webhook
configure-webhooks-eventsToSend = Eventos para enviar
configure-webhooks-clearEventsToSend = Limpar
configure-webhooks-eventsToSendDescription =
  Esses são os eventos que estão registrados neste endpoint específico. Visite
  nosso <externalLink>Guia de Webhooks</externalLink> para o schema desses eventos.
  Qualquer evento correspondendo aos seguintes será enviado para o endpoint se
  estiver habilitado:
configure-webhooks-allEvents =
  O endpoint receberá todos os eventos, incluindo qualquer um adicionado no futuro.
configure-webhooks-selectedEvents =
  { $count } { $count ->
    [1] evento
    *[other] eventos
  } selecionado(s).
configure-webhooks-selectAnEvent =
  Selecione eventos acima ou <button>receba todos os eventos</button>.
configure-webhooks-configureWebhookEndpoint = Configurar endpoint do webhook
configure-webhooks-confirmEnable =
  Habilitar este endpoint do webhook irá fazer com que eventos sejam enviados para esta URL. Você tem certeza que deseja continuar?
configure-webhooks-confirmDisable =
  Desabilitar este endpoint do webhook irá fazer com que qualquer novo evento pare de ser enviado para esta URL. Você tem certeza que deseja continuar?
configure-webhooks-confirmDelete =
  Deletar este endpoint do webhook irá fazer com que qualquer novo evento pare de ser enviado para esta URL, e irá remover todas as configurações associadas a esse endpoint do webhook. Você tem certeza que deseja continuar?
configure-webhooks-dangerZone = Zona de Perigo
configure-webhooks-rotateSigningSecret = Rotacionar segredo de assinatura (signing secret)
configure-webhooks-rotateSigningSecretDescription =
  Rotacionar o segredo de assinatura permite que você troque com segurança
  o segredo de assinatura usado em produção com um delay.
configure-webhooks-rotateSigningSecretButton = Rotacionar segredo de assinatura (signing secret)
configure-webhooks-rotateSigningSecretHelper =
  Após expirar, assinaturas não serão mais geradas com o secret anterior.
configure-webhooks-rotateSigningSecretSuccessUseNewSecret =
  O segredo de assinatura do endpoint do webhook foi rotacionado. Por favor garanta
  que você atualizou suas integrações para utilizar o novo segredo abaixo.
configure-webhooks-disableEndpoint = Desabilitar endpoint
configure-webhooks-disableEndpointDescription =
  O endpoint atualmente está habilitado. Ao desabilitar este endpoint, nenhum novo evento
  será enviado para a URL fornecida.
configure-webhooks-disableEndpointButton = Desabilitar endpoint
configure-webhooks-enableEndpoint = Habilitar endpoint
configure-webhooks-enableEndpointDescription =
  O endpoint atualmente está desabilitado. Ao habilitar este endpoint, novos eventos
  serão enviados para a URL fornecida.
configure-webhooks-enableEndpointButton = Habilitar endpoint
configure-webhooks-deleteEndpoint = Deletar endpoint
configure-webhooks-deleteEndpointDescription =
  Deletar o endpoint irá impedir que novos eventos sejam enviados para a URL
  fornecida.
configure-webhooks-deleteEndpointButton = Deletar endpoint
configure-webhooks-endpointStatus = Status do Endpoint
configure-webhooks-signingSecret = Segredo de assinatura (Signing secret)
configure-webhooks-signingSecretDescription =
  O seguinte segredo de assinatura é utilizado para assinar o payload dos requests
  enviados para a URL. Para saber mais sobre a assinatura de webhooks, visite nosso
  <externalLink>Guia de Webhooks</externalLink>.
configure-webhooks-expiresOldSecret = Expirar o segredo antigo
configure-webhooks-expiresOldSecretImmediately = Imediatamente
configure-webhooks-expiresOldSecretHoursFromNow =
  { $hours ->
    [1] 1 hora
    *[other] { $hours } horas
  }  a partir de agora
configure-webhooks-detailsButton = Detalhes <icon>keyboard_arrow_right</icon>

### General
configure-general-guidelines-title = Resumo das Diretrizes da Comunidade
configure-general-guidelines-explanation =
  Escreva um resumo das diretrizes da sua comunidade que serão exibidas no topo de cada
  fluxo de comentários em todo o site. Seu resumo pode ser formatado usando a Sintaxe do
  Markdown. Mais informações sobre como usar Markdown podem ser encontradas aqui:
  <externalLink>https://www.markdownguide.org/cheat-sheet/</externalLink>
configure-general-guidelines-showCommunityGuidelines = Mostrar Resumo das Diretrizes da Comunidade

#### Locale
configure-general-locale-language = Linguagem
configure-general-locale-chooseLanguage = Selecione a linguagem para o seu Coral community.

### Sitewide Commenting
configure-general-sitewideCommenting-title = Comentários em todo o site
configure-general-sitewideCommenting-explanation =
  Abra ou feche o fluxo de comentários para novos comentários em todo o site. Quando novos comentários
  estão desativados em todo o site, novos comentários não podem ser enviados, mas
  comentários podem continuar recebendo reações de “Respeito”, ser reportados e
  compartilhados.
configure-general-sitewideCommenting-enableNewCommentsSitewide =
  Habilitar novos comentários em todo o site
configure-general-sitewideCommenting-onCommentStreamsOpened =
  Ligado - Fluxo de comentário aberto para novos comentários
configure-general-sitewideCommenting-offCommentStreamsClosed =
  Desligado - Fluxo de comentário fechado para novos comentários
configure-general-sitewideCommenting-message = Mensagem de Comentários Fechados em Todo o Site
configure-general-sitewideCommenting-messageExplanation =
  Escreva uma mensagem que será exibida quando o fluxo de comentários estiver fechado em todo o site

configure-general-announcements-title = Anúncio da comunidade
configure-general-announcements-description =
  Adicione um anúncio temporário que aparecerá na parte superior de todos os fluxos de comentários da sua organização por um período específico.
configure-general-announcements-delete = Remover anúncio
configure-general-announcements-add = Adicionar anúncio
configure-general-announcements-start = Começar anúncio
configure-general-announcements-cancel = Cancelar
configure-general-announcements-current-label = Anúncio atual
configure-general-announcements-current-duration =
  Este anúncio irá ser encerrado automaticamente em: { $timestamp }
configure-general-announcements-duration = Mostrar este anúncio para

### Closing Comment Streams
configure-general-closingCommentStreams-title = Fechando fluxos de comentários
configure-general-closingCommentStreams-explanation = Defina fluxos de comentários para fechar após um período de tempo definido após a publicação de uma história
configure-general-closingCommentStreams-closeCommentsAutomatically = Fechar comentários automaticamente
configure-general-closingCommentStreams-closeCommentsAfter = Fechar comentários depois de

#### Comment Length
configure-general-commentLength-title = Tamanho do comentário
configure-general-commentLength-maxCommentLength = Tamanho máximo do comentário
configure-general-commentLength-setLimit =
  Definir um limite de tamanho máximo e minimo de comentários.
  Espaços em branco no inicío e no final dos comentários serão ignorados.
configure-general-commentLength-limitCommentLength = Tamanho limite do comentário
configure-general-commentLength-minCommentLength = Tamanho Mínimo do comentário
configure-general-commentLength-characters = Caracteres
configure-general-commentLength-textField =
  .placeholder = Sem limite
configure-general-commentLength-validateLongerThanMin =
  Por favor insira um número maior que o comprimento mínimo

#### Comment Editing
configure-general-commentEditing-title = Edição de Comentários
configure-general-commentEditing-explanation =
  Defina um limite de quanto tempo os comentadores precisam editar seus comentários em todo o site.
  Os comentários editados são marcados como (Editados) no fluxo de comentários e
  painel de moderação.
configure-general-commentEditing-commentEditTimeFrame = Período de tempo de edição de comentários
configure-general-commentEditing-seconds = Segundos

#### Closed Stream Message
configure-general-closedStreamMessage-title = Mensagem de fechamento do fluxo de comentários
configure-general-closedStreamMessage-explanation = Escreva uma mensagem para aparecer depois que uma história for fechada para comentários.

### Organization
configure-organization-name = Nome da organização
configure-organization-sites = Sites
configure-organization-nameExplanation =
  O nome da sua organização aparecerá nos e-mails enviados pelo Coral para sua comunidade e membros da organização.
configure-organization-sites-explanation =
  Adicione um novo site para sua Organização ou edite os detalhes de um site existente.
configure-organization-sites-add-site = <icon>add</icon> Adicionar site
configure-organization-email = E-mail organizacional
configure-organization-emailExplanation =
  Este endereço de e-mail será usado nos e-mails
  da plataforma para os membros da comunidade entrarem em contato com
  a organização com alguma dúvida sobre o
  status de suas contas ou questões de moderação.
configure-organization-url = URL da organização
configure-organization-urlExplanation =
  A url da sua organização aparecerá nos e-mails enviados pelo Coral para sua comunidade e membros da organização.

### Sites
configure-sites-site-details = Detalhes <icon>keyboard_arrow_right</icon>
configure-sites-add-new-site = Adicionar um novo site a { $site }
configure-sites-add-success = { $site } foi adicionado a { $org }
configure-sites-edit-success = Mudanças para { $site } foram salvas.
configure-sites-site-form-name = Nome do site
configure-sites-site-form-name-explanation = Nome do site irá aparecer nos emails enviados pelo Coral para a sua comunidade e membros da Organização.
configure-sites-site-form-url = URL do Site
configure-sites-site-form-url-explanation = Isto irá aparecer nos emails enviados pelo Coral para os membros da sua comunidade.
configure-sites-site-form-email = Endereço de email do site
configure-sites-site-form-url-explanation = Este endereço de email serve para os membros da comunidade entrarem em contato com você com perguntas ou se eles precisarem de ajuda. Ex: comentarios@seusite.com
configure-sites-site-form-domains = Domínios permitidos do site
configure-sites-site-form-domains-explanation = Domínios onde os fluxos de comentários são permitidos para serem embutidos ((ex. http://localhost:3000, https://staging.domain.com, https://domain.com).
configure-sites-site-form-submit = <icon>adicionar</icon> Adicionar site
configure-sites-site-form-cancel = Cancelar
configure-sites-site-form-save = Salvar mudanças
configure-sites-site-edit = Editar detalhes do { $site }
configure-sites-site-form-embed-code = Código embutido
sites-emptyMessage = Não encontramos nenhum site correspondendo a esses critérios.
sites-selector-allSites = Todos os sites
sites-filter-sites-allSites = Todos os sites

site-selector-all-sites = Todos os sites
stories-filter-sites-allSites = Todos os sites
stories-filter-statuses = Status
stories-column-site = Site
site-table-siteName = Nome do Site
stories-filter-sites = Site

### Email

configure-email = Configuração de email
configure-email-configBoxEnabled = Habilitado
configure-email-fromNameLabel = Do nome
configure-email-fromNameDescription =
  Nome como aparecerá nos e-mails enviados
configure-email-fromEmailLabel = Do endereço de e-mail
configure-email-fromEmailDescription =
  Endereço de email que será usado para enviar mensagens
configure-email-smtpHostLabel = hospedeiro de SMTP
configure-email-smtpHostDescription = (ex. smtp.sendgrid.com)
configure-email-smtpPortLabel = porta  SMTP
configure-email-smtpPortDescription = (ex. 25)
configure-email-smtpTLSLabel = TLS
configure-email-smtpAuthenticationLabel = Autenticação SMTP
configure-email-smtpCredentialsHeader = credencial de email
configure-email-smtpUsernameLabel = Nome de usuário
configure-email-smtpPasswordLabel = Senha
configure-email-send-test = Enviar email de teste

### Authentication

configure-auth-clientID = Client ID
configure-auth-clientSecret = Client Secret
configure-auth-configBoxEnabled = Habilitado
configure-auth-targetFilterCoralAdmin = Coral Admin
configure-auth-targetFilterCommentStream = Fluxo de Comentários
configure-auth-redirectURI = URI de redirecionamento
configure-auth-registration = Cadastro
configure-auth-registrationDescription =
  Permitir que usuários que não se inscreveram antes com essa autenticação
  integração para se inscrever para uma nova conta.
configure-auth-registrationCheckBox = Permitir cadastro
configure-auth-pleaseEnableAuthForAdmin =
  Por favor, ative pelo menos uma integração de autenticação para o Coral Admin
configure-auth-confirmNoAuthForCommentStream =
  Nenhuma integração de autenticação foi ativada para o fluxo de comentários.
  Você realmente quer continuar?

configure-auth-facebook-loginWith = Entrar com Facebook
configure-auth-facebook-toEnableIntegration =
  Para habilitar a integração com o Facebook Authentication,
  você precisa criar e configurar uma aplicação web.
  Para mais detalhes, visite: <link></link>.
configure-auth-facebook-useLoginOn = Usar login com o Facebook login ligado

configure-auth-google-loginWith = Entrar com Google
configure-auth-google-toEnableIntegration =
  Para habilitar a integração com o Google Authentication você precisa
  criar e configurar uma aplicação web. Para mais detalhes, visite:
  <link></link>.
configure-auth-google-useLoginOn = Usar login com o Google ligado

configure-auth-sso-loginWith = Entrar com Single Sign On
configure-auth-sso-useLoginOn = Usar login com Single Sign On ligado
configure-auth-sso-key = Chave
configure-auth-sso-regenerate = Regerar
configure-auth-sso-regenerateAt = CHAVE GERADA EM:
  { DATETIME($date, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric") }
configure-auth-sso-regenerateHonoredWarning =
  Ao regenerar uma chave, os tokens assinados com a chave anterior serão respeitados por 30 dias.

configure-auth-sso-description =
  Para habilitar a integração com seu sistema de autenticação existente,
  você precisará criar um token JWT para conectar-se. Você pode aprender
  mais sobre como criar um token JWT com <IntroLink>esta introdução</IntroLink>. Veja nossa
  <DocLink>documentação</DocLink> para obter informações adicionais sobre login único.

configure-auth-sso-rotate-keys = Chaves
configure-auth-sso-rotate-keyID = Identificação da chave
configure-auth-sso-rotate-secret = Chave privada
configure-auth-sso-rotate-copySecret =
  .aria-label = Copiar chave privada

configure-auth-sso-rotate-date =
  { DATETIME($date, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric") }
configure-auth-sso-rotate-activeSince = Sessões ativas
configure-auth-sso-rotate-inactiveAt = Inativo em
configure-auth-sso-rotate-inactiveSince = Inativo desde

configure-auth-sso-rotate-status = Status
configure-auth-sso-rotate-statusActive = Ativo
configure-auth-sso-rotate-statusExpiring = Expirando
configure-auth-sso-rotate-statusExpired = Expirado
configure-auth-sso-rotate-statusUnknown = Desconhecido

configure-auth-sso-rotate-expiringTooltip =
  Uma chave SSO está expirando quando está agendada para rotação.
configure-auth-sso-rotate-expiringTooltip-toggleButton =
  .aria-label = Alternar visibilidade da dica de expirando
configure-auth-sso-rotate-expiredTooltip =
  Uma chave SSO expira quando é rotacionada por falta de uso.
configure-auth-sso-rotate-expiredTooltip-toggleButton =
  Alternar visibilidade da dica de expirado

configure-auth-sso-rotate-rotate = Rotacionar
configure-auth-sso-rotate-deactivateNow = Desativar Agora
configure-auth-sso-rotate-delete = Deletar

configure-auth-sso-rotate-now = Agora
configure-auth-sso-rotate-10seconds = 10 segundos a partir de agora
configure-auth-sso-rotate-1day = 1 dia a partir de agora
configure-auth-sso-rotate-1week = 1 semana a partir de agora
configure-auth-sso-rotate-30days = 30 dias a partir de agora
configure-auth-sso-rotate-dropdown-description =
  .description = Uma lista suspensa para rotacionar a chave SSO

configure-auth-local-loginWith = Entrar com autenticação via E-mail
configure-auth-local-useLoginOn = Usar login com autenticação via e-mail ligado

configure-auth-oidc-loginWith = Login com OpenID Connect
configure-auth-oidc-toLearnMore = Saiba mais: <link></link>
configure-auth-oidc-providerName = Nome do Provedor
configure-auth-oidc-providerNameDescription =
  O provedor da integração do OpenID Connect. Isso será usado quando o nome do provedor
  precisa ser exibido, por exemplo “Login com &lt;Facebook&gt;”.
configure-auth-oidc-issuer = Emissor
configure-auth-oidc-issuerDescription =
  Depois de inserir as informações do emissor, clique no botão Descobrir para que o Coral mostre
  os campos restantes. Você também pode inserir as informações manualmente.
configure-auth-oidc-authorizationURL = URL de Autorização
configure-auth-oidc-tokenURL = Token URL
configure-auth-oidc-jwksURI = JWKS URI
configure-auth-oidc-useLoginOn = Usar login com OpenID Connect ligado

configure-auth-settings = Configurações da sessão
configure-auth-settings-session-duration-label = Duração da sessão

### Moderation

### Recent Comment History

configure-moderation-recentCommentHistory-title = Histórico recente de comentário
configure-moderation-recentCommentHistory-timeFrame = Período recente do histórico de comentários
configure-moderation-recentCommentHistory-timeFrame-description =
  Período de tempo em que a taxa de rejeição de um comentarista é calculada e os comentários enviados são contados.
configure-moderation-recentCommentHistory-enabled = Filtro de histórico recente de comentários
configure-moderation-recentCommentHistory-enabled-description =
  Impede os ofensores de publicar repetidos comentários sem aprovação.
  Após a taxa de rejeição de um comentarista estourar o limite definido
  abaixo, os próximos comentários enviados são <strong> enviados para Pendente para
  aprovação do moderador. </strong> O filtro é removido quando a taxa de rejeição normaliza novamente.
configure-moderation-recentCommentHistory-triggerRejectionRate = Limite da taxa de rejeição
configure-moderation-recentCommentHistory-triggerRejectionRate-description =
  Calculado pela divisão do número de comentários rejeitados pela soma
  dos comentaristas rejeitados e comentários publicados, dentro do período recente
  do histórico de comentários(não inclui comentários pendentes para toxicidade, spam ou pré-moderação.)

#### Pre-Moderation
configure-moderation-preModeration-title = Pré-moderação
configure-moderation-preModeration-explanation =
  Quando a pré-moderação está ativada, os comentários não serão publicados, a menos que sejam
  aprovados por um moderador.
configure-moderation-preModeration-moderation =
  Pré-moderar todos os comentários em todo o site
configure-moderation-preModeration-premodLinksEnable =
  Pré-moderar comentários contendo links em todo o site

configure-moderation-apiKey = API Key

configure-moderation-akismet-title = Filtro de Detecção de Spam Akismet
configure-moderation-akismet-explanation =
  O filtro da API Akismet avisa os usuários quando um comentário é determinado como provável
  ser spam. Comentários que a Akismet considera spam não serão publicados
  e são colocados na fila pendente para revisão por um moderador.
  Se aprovado por um moderador, o comentário será publicado.

#### Akismet
configure-moderation-akismet-filter = Filtro de Detecção de Spam
configure-moderation-akismet-accountNote =
  Nota: Você deve adicionar seu(s) domínio(s) ativo(s)
  na sua conta Akismet: <externalLink>https://akismet.com/account/</externalLink>
configure-moderation-akismet-siteURL = URL do site


#### Perspective
configure-moderation-perspective-title = Filtro de Comentários Tóxicos Perspective API
configure-moderation-perspective-explanation =
  Usando a Perspective API, o filtro de comentários tóxicos avisa os usuários
  quando os comentários excedem a toxicidade predefinida limite.
  Comentários com uma pontuação de toxicidade acima do limite
  <strong> não serão publicados </strong> e serão colocados na
  <strong> fila pendente para revisão por um moderador </strong>.
  Se aprovado por um moderador, o comentário será publicado.
configure-moderation-perspective-filter = Filtro de Comentários Tóxicos
configure-moderation-perspective-toxicityThreshold = Limite de toxicidade
configure-moderation-perspective-toxicityThresholdDescription =
  Esse valor pode ser definido como uma porcentagem entre 0 e 100. Esse número representa a probabilidade de
  o comentário ser tóxico, de acordo com a API do Perspective. Por padrão, o limite é definido como { $default } (Disponível apenas para o idioma inglês).
configure-moderation-perspective-toxicityModel = Modelo de toxicidade
configure-moderation-perspective-toxicityModelDescription =
  Escolha seu modelo de perspectiva. O padrão é { $default }.
  Você pode encontrar mais sobre os modelos <externalLink>aqui</externalLink>.
configure-moderation-perspective-allowStoreCommentData = Permitir que o Google armazene dados de comentários
configure-moderation-perspective-allowStoreCommentDataDescription =
  Comentários armazenados serão usados para futuras pesquisas e propósitos de construção de modelos
  melhorar a API ao longo do tempo
configure-moderation-perspective-allowSendFeedback =
  Permitir que o Coral envie ações moderadas para o Google
configure-moderation-perspective-allowSendFeedbackDescription =
  As ações moderadas enviadas serão usadas para futuras pesquisas e com propósito de criação de modelo
   comunitário para melhorar a API ao longo do tempo.
configure-moderation-perspective-customEndpoint = Customizar Endpoint
configure-moderation-perspective-defaultEndpoint =
  Por padrão o endpoint é setado como { $default }. Você pode sobrescreve-lo aqui
configure-moderation-perspective-accountNote =
  Para obter informações adicionais sobre como configurar o filtro de comentário tóxicos da Perspective API , visite:
  <externalLink>https://github.com/conversationai/perspectiveapi#readme</externalLink>

configure-moderation-newCommenters-title = Nova aprovação do comentarista
configure-moderation-newCommenters-enable = Habilitar nova aprovação do comentarista
configure-moderation-newCommenters-description =
  Quando isto estiver ativo, os comentários iniciais de um novo comentarista
  serão enviados para Pendente para aprovação do moderador antes da publicação.
configure-moderation-newCommenters-enable-description = Habilitar pré-moderação para novos comentaristas
configure-moderation-newCommenters-approvedCommentsThreshold = Número de comentários deve ser aprovado
configure-moderation-newCommenters-approvedCommentsThreshold-description =
  A quantidade de comentários aprovados para que os comentários sejam aprovados automaticamente sem precisar da pré-moderação.
configure-moderation-newCommenters-comments = comentários



#### Banned Words Configuration
configure-wordList-banned-bannedWordsAndPhrases = Palavras e Frases Banidas
configure-wordList-banned-explanation =
  Comentários contendo uma palavra ou frase na lista de palavras banidas são <strong> rejeitados automaticamente e não são publicados </strong>.
configure-wordList-banned-wordList = Lista de palavras banidas
configure-wordList-banned-wordListDetailInstructions =
  Separe palavras e frases banidas com uma nova linha. Palavras/frases não são sensíveis a caixa alta ou baixa.

#### Suspect Words Configuration
configure-wordList-suspect-bannedWordsAndPhrases = Palavras e Frases Suspeitas
configure-wordList-suspect-explanation =
  Comentários contendo uma palavra ou frase na Lista de Palavras Suspeitas
  são <strong> colocados na Fila de Reportados para revisão de moderadores e são
  publicado (se os comentários não forem pré-moderados). </ strong>
configure-wordList-suspect-wordList = Lista de Palavras Suspeitas
configure-wordList-suspect-wordListDetailInstructions =
  Separe palavras e frases suspeitas com uma nova linha. Palavras/frases não são sensíveis a caixa alta ou baixa.

### Advanced
configure-advanced-customCSS = CSS Customizado
configure-advanced-customCSS-override =
  URL de uma folha de estilo CSS que substituirá o estilo padrão dos fluxos de comentário das páginas.

configure-advanced-permittedDomains = Domínios Permitidos
configure-advanced-permittedDomains-description =
  Domínios onde sua instance de { -product-name } pode ser incorporada,
  incluindo o protocolo (ex. http://localhost:3000, https://staging.domain.com,
  https://domain.com).

configure-advanced-liveUpdates = Atualizações ao vivo do Stream de comentários
configure-advanced-liveUpdates-explanation =
  Quando ativado, habilitará o carregamento e atualização em tempo real dos comentários.
  Quando desabilitado, os usuários terão de atualizar a página para ver novos comentários.

configure-advanced-embedCode-title = Incorporar
configure-advanced-embedCode-explanation =
  Copie e cole o código abaixo no seu CMS para incorporar fluxos de comentários do Coral em
  cada uma das histórias do seu site.

configure-advanced-embedCode-comment =
  Descomente estas linhas e substitua com o ID da
  história e a URL do seu CMS
  Substitua essas linhas pelo ID do ID e URL da história do seu CMS para fornecer a maior integração.
  Consulte a nossa documentação em https://docs.coralproject.net para todas as
  opções de configuração.

## Decision History
decisionHistory-popover =
  .description = Uma caixa de diálogo mostrando o histórico de decisões
decisionHistory-youWillSeeAList =
  Você verá uma lista de suas ações de moderação de postagens aqui.
decisionHistory-showMoreButton =
  Mostrar mais
decisionHistory-yourDecisionHistory = Seu Histórico de Decisão
decisionHistory-rejectedCommentBy = Comentário Rejeitado por <username></username>
decisionHistory-approvedCommentBy = Comentário Aceito por <username></username>
decisionHistory-goToComment = Ir para o comentário

### Slack

configure-slack-header-title = Integração com o Slack
configure-slack-description =
  Encia automaticamente os comentários da fila de moderação do Coral para canais do Slack.
  Você precisa de acesso admin do slack para realizar esta configuração. Para as etapas de
  como criar uma app no Slack veja nossa <externalLink>documentação</externalLink>.
configure-slack-notRecommended =
  Não recomendado para sites com mais de 10 mil comentários por mês.
configure-slack-addChannel = Adicionar Canal

configure-slack-channel-defaultName = Novo canal
configure-slack-channel-enabled = Habilitado
configure-slack-channel-remove = Remover Canal
configure-slack-channel-name-label = Nome
configure-slack-channel-name-description =
  Isto é apenas para sua informação, para identificar facilmente
  cada conexão Slack. Slack não nos diz o nome
  dos canais que você está se conectando ao Coral.
configure-slack-channel-hookURL-label = Webhook URL
configure-slack-channel-hookURL-description =
  O Slack fornece uma URL específica do canal para ativar as conexões com o webhook.
  Para encontrar o URL de um dos seus canais do Slack,
  Siga as instruções<externalLink>aqui</externalLink>.
configure-slack-channel-triggers-label =
  Receba notificações neste canal do Slack para
configure-slack-channel-triggers-reportedComments = Commentários Reportados
configure-slack-channel-triggers-pendingComments = Comentários Pendentes
configure-slack-channel-triggers-featuredComments = Comentários Destacados
configure-slack-channel-triggers-allComments = Todos os Comentários
configure-slack-channel-triggers-staffComments = Staff Comments

## moderate
moderate-navigation-reported = reportado
moderate-navigation-pending = Pendente
moderate-navigation-unmoderated = não moderado
moderate-navigation-approved = Aprovado
moderate-navigation-rejected = rejeitado
moderate-navigation-comment-count = { SHORT_NUMBER($count) }

moderate-marker-preMod = Pré-Moderado
moderate-marker-link = Link
moderate-marker-bannedWord = Palavra Banida
moderate-marker-suspectWord = Palavra Suspeita
moderate-marker-spam = Spam
moderate-marker-spamDetected = Spam detectado
moderate-marker-toxic = Tóxico
moderate-marker-recentHistory = Histórico recente
moderate-marker-bodyCount = Tamanho do conteúdo
moderate-marker-offensive = Ofensivo
moderate-marker-newCommenter = Novo comentador
moderate-marker-repeatPost = Comentário repetido

moderate-markers-details = Detalhes
moderate-flagDetails-offensive = Ofensivo
moderate-flagDetails-spam = Spam

moderate-flagDetails-toxicityScore = Score de toxicidade
moderate-toxicityLabel-likely = Provável <score></score>
moderate-toxicityLabel-unlikely = Improvável <score></score>
moderate-toxicityLabel-maybe = Talvez <score></score>

moderate-linkDetails-label = Copiar o link deste comentário
moderate-in-stream-link-copy = No fluxo
moderate-in-moderation-link-copy = Na moderação

moderate-emptyQueue-pending = Muito bem! Não há mais comentários pendentes para moderar.
moderate-emptyQueue-reported = Muito bem! Não há mais comentários relatados para moderar.
moderate-emptyQueue-unmoderated = Muito bem! Todos os comentários foram moderados.
moderate-emptyQueue-rejected = Não há comentários rejeitados.
moderate-emptyQueue-approved = Não há comentários aprovados.

moderate-comment-edited = (editado)
moderate-comment-inReplyTo = Responder para <username><username>
moderate-comment-viewContext = Ver contexto
moderate-comment-viewConversation = Ver conversa
moderate-comment-rejectButton =
  .aria-label = Rejeitar
moderate-comment-approveButton =
  .aria-label = Aceitar
moderate-comment-decision = Decisão
moderate-comment-story = História
moderate-comment-storyLabel = Comentário em
moderate-comment-moderateStory = Moderar História
moderate-comment-featureText = Destaque
moderate-comment-featuredText = Destacado
moderate-comment-moderatedBy = Moderado por
moderate-comment-moderatedBySystem = Sistema

moderate-single-goToModerationQueues = Ir para a fila de moderação
moderate-single-singleCommentView = Visualização única de comentários

moderate-queue-viewNew =
  { $count ->
    [1] Ver {$count} novo comentário
    *[other] Ver {$count} novos comentários
  }

moderate-comment-deleted-body =
  Este comentário não está mais disponível. O comentarista deletou a conta.

### Moderate Search Bar
moderate-searchBar-allStories = Todas as histórias
  .title = Todas as histórias
moderate-searchBar-noStories = Não conseguimos achar nenhuma história que corresponda sua pesquisa.
moderate-searchBar-stories = Histórias:
moderate-searchBar-searchButton = Pesquisar
moderate-searchBar-titleNotAvailable =
  .title = Título não disponível
moderate-searchBar-comboBox =
  .aria-label = Pesquisar ou pular para a história
moderate-searchBar-searchForm =
  .aria-label = Histórias
moderate-searchBar-currentlyModerating =
  .title = Atualmente moderando
moderate-searchBar-searchResults = Pesquisar resultados
moderate-searchBar-searchResultsMostRecentFirst = Pesquisar resultados (Mais recentes primeiro)
moderate-searchBar-moderateAllStories = Moderar todas as histórias
moderate-searchBar-comboBoxTextField =
  .aria-label = Pesquisar ou pular para a história....
  .placeholder = Use aspas em torno de cada termo de pesquisa (por exemplo, "equipe", "St. Louis")
moderate-searchBar-goTo = Ir para
moderate-searchBar-seeAllResults = Ver todos os resultados

moderateCardDetails-tab-info = Informações
moderateCardDetails-tab-edits = Editar história
### Moderate User History Drawer

moderate-user-drawer-email =
  .title = Endereço de email
moderate-user-drawer-created-at =
  .title = Data de criação da conta
moderate-user-drawer-member-id =
  .title = ID do membro
moderate-user-drawer-tab-all-comments = Todos comentários
moderate-user-drawer-tab-rejected-comments = Rejeitados
moderate-user-drawer-tab-account-history = Histórico da Conta
moderate-user-drawer-tab-notes = Notas
moderate-user-drawer-load-more = Carregar mais
moderate-user-drawer-all-no-comments = {$username} não enviou comentários.
moderate-user-drawer-rejected-no-comments = {$username} não tem comentários rejeitados.
moderate-user-drawer-user-not-found = Usuário não encontrado.
moderate-user-drawer-status-label = Status:

moderate-user-drawer-account-history-system = <icon>computer</icon> Sistema
moderate-user-drawer-account-history-suspension-ended = Suspensão terminada
moderate-user-drawer-account-history-suspension-removed = Suspensão removida
moderate-user-drawer-account-history-banned = Banida
moderate-user-drawer-account-history-ban-removed = Banimento removido
moderate-user-drawer-account-history-no-history = Nenhuma ação foi realizada nesta conta
moderate-user-drawer-username-change = Nome de usuário alterado
moderate-user-drawer-username-change-new = Novo:
moderate-user-drawer-username-change-old = Antigo:

moderate-user-drawer-account-history-premod-set = Sempre pré-moderado
moderate-user-drawer-account-history-premod-removed = Removida pré-moderação

moderate-user-drawer-suspension =
  Suspensão, { $value } { $unit ->
    [second] { $value ->
      [1] segundo
      *[other] segundos
    }
    [minute] { $value ->
      [1] minuto
      *[other] minutos
    }
    [hour] { $value ->
      [1] hora
      *[other] horas
    }
    [day] { $value ->
      [1] dia
      *[other] dias
    }
    [week] { $value ->
      [1] semana
      *[other] semanas
    }
    [month] { $value ->
      [1] mês
      *[other] meses
    }
    [year] { $value ->
      [1] ano
      *[other] anos
    }
    *[other] unidade desconhecida
  }


moderate-user-drawer-recent-history-title = Histórico recente de comentários
moderate-user-drawer-recent-history-calculated =
  Calculado nos últimos  { framework-timeago-time }
moderate-user-drawer-recent-history-rejected = Rejeitado
moderate-user-drawer-recent-history-tooltip-title = Como isso é calculado?
moderate-user-drawer-recent-history-tooltip-body =
  Comentários rejeitados ÷ (comentearios rejeitados + comentários publicados).
  O limite pode ser alterado por um administrador em Configurações -> Moderação.
moderate-user-drawer-recent-history-tooltip-button =
  .aria-label = Alternar dica de ferramenta do histórico de comentários recentes
moderate-user-drawer-recent-history-tooltip-submitted = Enviado

moderate-user-drawer-notes-field =
  .placeholder = Deixar uma anotação...
moderate-user-drawer-notes-button = Adicionar notação
moderatorNote-left-by = Deixado por
moderatorNote-delete = Deletar

## Community
community-emptyMessage = Não conseguimos encontrar ninguém na sua comunidade que corresponda aos seus critérios.

community-filter-searchField =
  .placeholder = Pesquise por nome de usuário ou endereço de e-mail ...
  .aria-label = Pesquise por nome de usuário ou endereço de e-mail
community-filter-searchButton =
  .aria-label = Pesquisar

community-filter-roleSelectField =
  .aria-label = Pesquisar por Função

community-filter-statusSelectField =
.aria-label = Pesquisar por Status

community-changeRoleButton =
  .aria-label = Mudar Função

community-filter-optGroupAudience =
  .label = Público
community-filter-optGroupOrganization =
  .label = Organização
community-filter-search = Pesquisar
community-filter-showMe = Me mostre
community-filter-allRoles = Todas as Funções
community-filter-allStatuses = Todos os Status

community-column-username = Nome do Usuário
community-column-username-deleted = Deletado
community-column-email = E-mail
community-column-memberSince = Membro desde
community-column-role = Função
community-column-status = Status

community-role-popover =
  .description = Um menu suspenso para alterar o papel do usuário

community-userStatus-popover =
  .description = Um menu suspenso para alterar o status do usuário

community-userStatus-banUser = Banir Usuário
community-userStatus-ban = Banir
community-userStatus-removeBan = Remover Banimento
community-userStatus-removeUserBan = Remover banimento
community-userStatus-suspendUser = Suspender Usuário
community-userStatus-suspend = Suspender
community-userStatus-removeSuspension = Remover Suspensão
community-userStatus-removeUserSuspension = Remover Suspensão
community-userStatus-unknown = Desconhecido
community-userStatus-changeButton =
  .aria-label = Mudar status do usuário
community-userStatus-premodUser = Sempre pré-moderado
community-userStatus-removePremod = Remover pré-moderação

community-banModal-areYouSure = Você tem certeza que quer banir <username></username>?
community-banModal-consequence =
  Uma vez banido, este usuário não poderá mais comentar, usar
  reações ou relatar comentários.
community-banModal-cancel = Cancelar
community-banModal-banUser = Banir Usuário
community-banModal-customize = Customizar mensagem de e-mail de banimento
community-banModal-reject-existing = Rejeitar todos os comentários feitos por usuário

community-suspendModal-areYouSure = Banir <strong>{ $username }</strong>?
community-suspendModal-consequence =
  Uma vez banido, este usuário não poderá mais comentar, reagir
  ou reportar comentários
community-suspendModal-duration-3600 = 1 hora
community-suspendModal-duration-10800 = 3 horas
community-suspendModal-duration-86400 = 24 horas
community-suspendModal-duration-604800 = 7 dias
community-suspendModal-cancel = Cancelar
community-suspendModal-suspendUser = Suspender usuários
community-suspendModal-emailTemplate =
  Olá { $username },

  De acordo com as orientações da comunidade da { $organizationName }, sua conta foi banida temporariamente. Durante a suspensão, você não poderá comentar, denunciar ou interagir com os outros comentaristas. Por favor tente comentar novamente em { framework-timeago-time }.

community-suspendModal-customize = Customizar o email de suspensão.

community-suspendModal-success =
  <strong>{ $username }</strong> foi suspendido por <strong>{ $duration }</strong>

community-suspendModal-success-close = Fechar
community-suspendModal-selectDuration = Selecione o período de suspensão.

community-premodModal-areYouSure =
  Você tem certeza que quer sempre pré-moderar <strong>{ $username }</strong>?
community-premodModal-consequence =
  Todos os seus comentários entrarão na fila de Pendente até que você remova este status.
community-premodModal-cancel = Cancelar
community-premodModal-premodUser = Sim, sempre pré-moderar

community-invite-inviteMember = Convidar membros para sua organização
community-invite-emailAddressLabel = Endereço de e-mail:
community-invite-inviteMore = Convidar mais
community-invite-inviteAsLabel = Convidar como:
community-invite-sendInvitations = Enviar convites
community-invite-role-staff =
  <strong>Função Staff:</strong> Recebe um crachá “Staff”, e
  seus comentários são aprovados automaticamente. Não pode moderar
  ou mudar qualquer configuração { -product-name }.
community-invite-role-moderator =
  <strong>Função Moderador:</strong> Recebe um crachá “Staff”, e
  seus comentários são aprovados automaticamente. Tem privilégios
  totais de moderação (aprovar, rejeitar e destacar comentários).
  Pode configurar artigos individuais, mas não possui privilégios
  de configuração do site.
community-invite-role-admin =
  <strong>Função Admin:</strong> Recebe um crachá “Staff”, e
  seus comentários são aprovados automaticamente. Tem privilégios
  totais de moderação (aprovar, rejeitar e destacar comentários).
  Pode configurar artigos individuais e tem privilégios de
  configuração do site.
community-invite-invitationsSent = Seus convites foram enviados!
community-invite-close = Fechar
community-invite-invite = Convidar

## Stories
stories-emptyMessage = Atualmente não há histórias publicadas.
stories-noMatchMessage = Não foi possível encontrar nenhuma história que corresponda aos seus critérios.

stories-filter-searchField =
  .placeholder = Pesquise por título ou autor da história ...
  .aria-label = Pesquisar por título ou autor da história
stories-filter-searchButton =
  .aria-label = Pesquisar

stories-filter-statusSelectField =
  .aria-label = Pesquisar por status

stories-changeStatusButton =
  .aria-label = Mudar status

stories-filter-search = Pesquisar
stories-filter-showMe = Me mostre
stories-filter-allStories = Todas as histórias
stories-filter-openStories = Histórias abertas
stories-filter-closedStories = Histórias Fechadas

stories-column-title = Título
stories-column-author = Autor
stories-column-publishDate = Data de publicação
stories-column-status = Status
stories-column-clickToModerate = Clique no título para moderar a história
stories-column-reportedCount = Reportado
stories-column-pendingCount = Pendente
stories-column-publishedCount = Publicado

stories-status-popover =
  .description = Um menu suspenso para alterar o status da história

## Invite

invite-youHaveBeenInvited = Você foi convidado para entrar em { $organizationName }
invite-finishSettingUpAccount = Conclua a configuração da conta para:
invite-createAccount = Criar Conta
invite-passwordLabel = Senha
invite-passwordDescription = Deve ter ao menos { $minLength } caracteres
invite-passwordTextField =
  .placeholder = Senha
invite-usernameLabel = Usuário
invite-usernameDescription = Você pode usar “_” e “.”
invite-usernameTextField =
  .placeholder = Usuário
invite-oopsSorry = Oops Desculpe!
invite-successful = Sua conta foi criada
invite-youMayNowSignIn = Você pode entrar em { -product-name } usando:
invite-goToAdmin = Ir para a administração { -product-name }
invite-goToOrganization = Ir para { $organizationName }
invite-tokenNotFound =
  O link especificado é inválido, verifique se ele foi copiado corretamente.

userDetails-banned-on = <strong>Banido em </strong> { $timestamp }
userDetails-banned-by = <strong>por</strong> { $username }
userDetails-suspended-by = <strong>Suspendido por</strong> { $username }
userDetails-suspension-start = <strong>Início:</strong> { $timestamp }
userDetails-suspension-end = <strong>Fim:</strong> { $timestamp }

configure-general-reactions-title = Reações
configure-general-reactions-explanation =
  Permitir a interação da sua comunidade através de reações expressadas
  por meio de um click. Por padrão, o Coral permite que os comentaristas "Respeitem"
  uns aos outros.
configure-general-reactions-label = Legenda para a reação
configure-general-reactions-input =
  .placehodlder = Ex: Respeito
configure-general-reactions-active-label = Ativar a legenda para a reação
configure-general-reactions-active-input =
  .placehodlder = Ex: Respeitado
configure-general-reactions-sort-label = Legenda para o menu de ordenação
configure-general-reactions-sort-input =
  .placehodlder = Ex: Mais Respeitado
configure-general-reactions-preview = Pré-visualização
configure-general-reaction-sortMenu-sortBy = Ordenar por

configure-general-staff-title = Crachá de membros Staff
configure-general-staff-explanation =
  Mostra um crachá customizado para membros staff da sua organização. Este crachá
  aparecerá no fluxo de comentários e na interface de administração.
configure-general-staff-label = Texto do crachá
configure-general-staff-input =
  .placeholder = Ex: Staff
configure-general-staff-preview = Pré-visualização

configure-account-features-title = Gerenciamento de recursos da conta de comentaristas
configure-account-features-explanation =
  Você pode habilitar ou desabilitar certos recursos para seus comentaristas para
  usar dentro de suas contas. Esses recursos também ajudam na
  conformidade com o GDPR
configure-account-features-allow = Permitir usuários a:
configure-account-features-change-usernames = Mudar seus nomes de usuário
configure-account-features-change-usernames-details = O nome de usuário pode ser alterado uma vez a cada 14 dias.
configure-account-features-yes = Sim
configure-account-features-no = Não
configure-account-features-download-comments = Fazer o download de seus comentários
configure-account-features-download-comments-details = Comentaristas podem fazer download de um csv do histórico de comentarista
configure-account-features-delete-account = Excluir suas contas.
configure-account-features-delete-account-details =
  Remover todos os dados de comentários, nome de usuário e endereço de email do site e do banco de dados

configure-account-features-delete-account-fieldDescriptions =
  Remove todos os seus dados dos comentários, nome de usuário e endereço de email
  do site e do banco de dados.

configure-advanced-stories = Criação de histórias
configure-advanced-stories-explanation = Configurações avançadas de como as histórias são criadas no Coral.
configure-advanced-stories-lazy = Criação Lazy
configure-advanced-stories-lazy-detail = Permita que as histórias sejam criadas automaticamente quando publicadas no seu CMS.
configure-advanced-stories-scraping = Scraper de histórias
configure-advanced-stories-scraping-detail = Permita que os metadados da história sejam resgatados automaticamente quando publicados a partir do seu CMS.
configure-advanced-stories-proxy = Url do proxy do Scraper
configure-advanced-stories-proxy-detail =
   Quando especificado, permite que requisições do scraper utilizem o
   proxy. Todos os pedidos serão passados através do proxy conforme analisado
  pelo pacote <externalLink>npm proxy-agent</externalLink>.
configure-advanced-stories-custom-user-agent = Header de User-Agent customizado para o Scraper
configure-advanced-stories-custom-user-agent-detail =
  Quando especificado, sobreescreve o header <code>User-Agent</code> enviado com cada
  request de scrape.

commentAuthor-status-banned = Banido
commentAuthor-status-premod = Pré-moderado
commentAuthor-status-suspended = Suspenso

hotkeysModal-title = Atalhos do teclado
hotkeysModal-navigation-shortcuts = Atalhos de navegação
hotkeysModal-shortcuts-next = Próximo comentário
hotkeysModal-shortcuts-prev = Comentário anterior
hotkeysModal-shortcuts-search = Abrir pesquisa
hotkeysModal-shortcuts-jump = Ir para a fila específica
hotkeysModal-shortcuts-switch = Alternar filas
hotkeysModal-shortcuts-toggle = Ativar/desativar ajuda dos atalhos
hotkeysModal-shortcuts-single-view = Visualização de comentário único
hotkeysModal-moderation-decisions = Decisões de moderação
hotkeysModal-shortcuts-approve = Aprovar
hotkeysModal-shortcuts-reject = Rejeitar
hotkeysModal-shortcuts-ban = Banir autor do comentário
hotkeysModal-shortcuts-zen = Alternar visualização de comentário único

authcheck-network-error = Ocorreu um erro de rede. Por favor, atualize a página.
