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
login-signIn-orSeparator = Ou
login-signIn-forgot-password = Esqueceu sua senha?

login-signInWithFacebook = Entrar com Facebook
login-signInWithGoogle = Entrar com Google
login-signInWithOIDC = Entrar com { $name }

## Configure

configure-unsavedInputWarning =
  Você tem entrada não salva. Tem certeza de que deseja sair desta página?

configure-sideBarNavigation-general = Geral
configure-sideBarNavigation-authentication = Autenticação
configure-sideBarNavigation-moderation = Moderação
configure-sideBarNavigation-organization = Organização
configure-sideBarNavigation-advanced = Avançado
configure-sideBarNavigation-email = E-mail
configure-sideBarNavigation-bannedAndSuspectWords = Palavras banidas e suspeitas

configure-sideBar-saveChanges = Salvar mudanças
configure-configurationSubHeader = Configuração
configure-onOffField-on = Ligado
configure-onOffField-off = Desligado
configure-permissionField-allow = Permitir
configure-permissionField-dontAllow = Não permitir

### General
configure-general-guidelines-title = Resumo das Diretrizes da Comunidade
configure-general-guidelines-explanation =
  Escreva um resumo das diretrizes da sua comunidade que serão exibidas
  no topo de cada fluxo de comentários em todo o site. Seu resumo pode ser
  formatado usando a Sintaxe do Markdown. Mais informações sobre como usar
  Markdown podem ser encontradas <externalLink>aqui</externalLink>.
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
configure-organization-nameExplanation =
  O nome da sua organização aparecerá nos e-mails enviados pelo Coral para sua comunidade e membros da organização.
configure-organization-email = E-mail organizacional
configure-organization-emailExplanation =
  Este endereço de e-mail será usado nos e-mails
  da plataforma para os membros da comunidade entrarem em contato com
  a organização com alguma dúvida sobre o
  status de suas contas ou questões de moderação.
configure-organization-url = URL da organização
configure-organization-urlExplanation =
  A url da sua organização aparecerá nos e-mails enviados pelo Coral para sua comunidade e membros da organização.

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
  Os comentários enviados são transmitidos para a API do Akismet para detecção de spam.
  Se um comentário for determinado como spam, ele mostrará ao usuário,
  indicando que o comentário pode ser considerado spam.
  Se o usuário continuar após esse ponto com o comentário ainda como spam,
  o comentário será marcado como contendo spam, <strong> não será publicado </strong> e
  são colocados na <strong> Fila pendente para revisão por um moderador </strong>. Se aprovado por um moderador,
  o comentário será publicado.

#### Akismet
configure-moderation-akismet-filter = Filtro de Detecção de Spam
configure-moderation-akismet-accountNote =
  Nota: Você deve adicionar seu(s) domínio(s) ativo(s)
  na sua conta Akismet: <externalLink>https://akismet.com/account/</externalLink>
configure-moderation-akismet-siteURL = URL do site


#### Perspective
configure-moderation-perspective-filter = Filtro de Comentários Tóxicos
configure-moderation-perspective-toxicityThreshold = Limite de toxicidade

configure-moderation-perspective-title = Filtro de Comentários Tóxicos Perspective API
configure-moderation-perspective-explanation =
  Usando a Perspective API, o filtro de comentários tóxicos avisa os usuários quando
  os comentários excedem a toxicidade predefinida limite. Comentários com uma pontuação
  de toxicidade acima do limite <strong> não serão publicados </strong> e serão colocados na
  <strong> fila pendente para revisão por um moderador </strong>. Se aprovado por um moderador,
 o comentário será publicado.
configure-moderation-perspective-toxicityThresholdDescription =
  Esse valor pode ser definido como uma porcentagem entre 0 e 100. Esse número representa a probabilidade de
  o comentário ser tóxico, de acordo com a API do Perspective. Por padrão, o limite é definido como { $default } (Disponível apenas para o idioma inglês).
configure-moderation-perspective-toxicityModel = Modelo de toxicidade
configure-moderation-perspective-toxicityModelDescription =
  Escolha seu modelo de perspectiva. O padrão é { $default }. Você pode encontrar mais sobre os modelos <externalLink>aqui</externalLink>.
configure-moderation-perspective-allowStoreCommentData = Permitir que o Google armazene dados de comentários
configure-moderation-perspective-allowStoreCommentDataDescription =
  Comentários armazenados serão usados para futuras pesquisas e propósitos de construção de modelos
  melhorar a API ao longo do tempo
configure-moderation-perspective-customEndpoint = Customizar Endpoint
configure-moderation-perspective-defaultEndpoint =
  Por padrão o endpoint é setado como { $default }. Você pode sobrescreve-lo aqui
configure-moderation-perspective-accountNote =
  Para obter informações adicionais sobre como configurar o filtro de comentário tóxicos da Perspective API , visite:
  <externalLink>https://github.com/conversationai/perspectiveapi/blob/master/quickstart.md</externalLink>

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
configure-advanced-customCSS-explanation =
  URL de uma folha de estilo CSS que substituirá o estilo padrão dos fluxos de comentário das páginas. Pode ser interno ou externo.

configure-advanced-permittedDomains = Domínios Permitidos
configure-advanced-permittedDomains-description =
Domínios onde sua instance de { -product-name } pode ser incorporada, incluindo o protocolo
(ex. http://localhost:3000, https://staging.domain.com, https://domain.com).

configure-advanced-liveUpdates = Atualizações ao vivo do Stream de comentários
configure-advanced-liveUpdates-explanation =
  Quando ativado, habilitará o carregamento e atualização em tempo real dos comentários, à medida que novos comentários e respostas forem publicados.

configure-advanced-embedCode-title = Incorporar
configure-advanced-embedCode-explanation =
  Copie e cole o código abaixo no seu CMS para incorporar fluxos de comentários do Coral em
  cada uma das histórias do seu site.
configure-advanced-embedCode-comment =
  Substitua essas linhas pelo ID do ID e URL da história do seu CMS para fornecer a maior integração.
  Consulte a nossa documentação em https://docs.coralproject.net para todas as opções de configuração.

## Decision History
decisionHistory-popover =
  .description = Uma caixa de diálogo mostrando o histórico de decisões
decisionHistory-youWillSeeAList =
  Você verá uma lista de suas ações de moderação de postagens aqui.
decisionHistory-showMoreButton = Mostrar mais
decisionHistory-yourDecisionHistory = Seu Histórico de Decisão
decisionHistory-rejectedCommentBy = Comentário Rejeitado por <username></username>
decisionHistory-acceptedCommentBy = Comentário Aceito por <username></username>
decisionHistory-goToComment = Ir para o comentário

## moderate
moderate-navigation-reported = reportado
moderate-navigation-pending = Pendente
moderate-navigation-unmoderated = não moderado
moderate-navigation-rejected = rejeitado

moderate-marker-preMod = Pré-Moderado
moderate-marker-link = Link
moderate-marker-bannedWord = Palavra Banida
moderate-marker-suspectWord = Palavra Suspeita
moderate-marker-spam = Spam
moderate-marker-spamDetected = Spam detectado
moderate-marker-toxic = Tóxico
moderate-marker-karma = Karma
moderate-marker-recentHistory = Histórico recente
moderate-marker-bodyCount = Tamanho do conteúdo
moderate-marker-offensive = Ofensivo

moderate-markers-details = Detalhes
moderate-flagDetails-offensive = Ofensivo
moderate-flagDetails-spam = Spam

moderate-flagDetails-toxicityScore = Score de toxicidade
moderate-toxicityLabel-likely = Provável <score></score>
moderate-toxicityLabel-unlikely = Improvável <score></score>
moderate-toxicityLabel-maybe = Talvez <score></score>

moderate-emptyQueue-pending = Muito bem! Não há mais comentários pendentes para moderar.
moderate-emptyQueue-reported = Muito bem! Não há mais comentários relatados para moderar.
moderate-emptyQueue-unmoderated = Muito bem! Todos os comentários foram moderados.
moderate-emptyQueue-rejected = Não há comentários rejeitados.

moderate-comment-edited = (editado)
moderate-comment-inReplyTo = Responder para <username><username>
moderate-comment-viewContext = Ver contexto
moderate-comment-rejectButton =
  .aria-label = Rejeitar
moderate-comment-acceptButton =
  .aria-label = Aceitar
moderate-comment-decision = Decisão
moderate-comment-story = História
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
moderate-searchBar-noResults = Sem resultados
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

moderateCardDetails-tab-details = Detalhes
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
moderate-user-drawer-tab-notes = Notas
moderate-user-drawer-load-more = Carregar mais
moderate-user-drawer-all-no-comments = {$username} não enviou comentários.
moderate-user-drawer-rejected-no-comments = {$username} não tem comentários rejeitados.
moderate-user-drawer-user-not-found = Usuário não encontrado.
moderate-user-drawer-tab-account-history = Histórico da conta
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
  Comentários rejeitados divididos pela soma dos
  comentários publicados e rejeitados, durante o histórico recente de comentários
  prazo.
moderate-user-drawer-recent-history-tooltip-button =
  .aria-label = Alternar dica de ferramenta do histórico de comentários recentes
moderate-user-drawer-recent-history-tooltip-submitted = Enviado

moderate-user-drawer-notes-field =
  .placeholder = Deixar uma anotação...
moderate-user-drawer-notes-button = Adicionar notação
moderatorNote-left-by = Deixado por
moderatorNote-delete = Deletar

## Create Username

createUsername-createUsernameHeader = Criar nome do usuário
createUsername-whatItIs =
  Seu nome de usuário é um identificador que aparecerá em todos os seus comentários.
createUsername-createUsernameButton = Criar nome do usuário
createUsername-usernameLabel = Nome do Usuário
createUsername-usernameDescription = Você pode usar "_" e "." Espaços não permitidos.
createUsername-usernameTextField =
  .placeholder = Nome do Usuário

## Add Email Address
addEmailAddress-addEmailAddressHeader = Adicionar Endereço de E-mail

addEmailAddress-emailAddressLabel = Endereço de E-mail
addEmailAddress-emailAddressTextField =
  .placeholder = Endereço de E-mail

addEmailAddress-confirmEmailAddressLabel = Confirmar Endereço de E-mail
addEmailAddress-confirmEmailAddressTextField =
  .placeholder = Confirmar Endereço de E-mail

addEmailAddress-whatItIs =
  Para sua segurança adicional, exigimos que os usuários adicionem um endereço de e-mail às contas deles.

addEmailAddress-addEmailAddressButton =
  Adicionar Endereço de E-mail

## Create Password
createPassword-createPasswordHeader = Criar Senha
createPassword-whatItIs =
  Para proteger contra alterações não autorizadas na sua conta,
  Nós exigimos que os usuários criem uma senha.
createPassword-createPasswordButton =
  Criar Senha

createPassword-passwordLabel = Senha
createPassword-passwordDescription = Deve ter pelo menos {$minLength} caracteres
createPassword-passwordTextField =
  .placeholder = Senha

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
community-userStatus-removeBan = Remover Banimento
community-userStatus-removeUserBan = Remover banimento
community-userStatus-suspendUser = Suspender Usuário
community-userStatus-suspend = Suspender
community-userStatus-removeSupsension = Remover Suspensão
community-userStatus-removeUserSuspension = Remover Suspensão
community-userStatus-unknown = Desconhecido
community-userStatus-changeButton =
  .aria-label = Mudar status do usuário
community-userStatus-premodUser = Sempre pré-moderado
community-userStatus-removePremod = Remover pré-moderação

community-banModal-areYouSure = Você tem certeza que quer banir  <strong>{ $username }</strong>?
community-banModal-consequence =
  Uma vez banido, este usuário não poderá mais comentar, usar
  reações ou relatar comentários.
community-banModal-cancel = Cancelar
community-banModal-banUser = Banir Usuário
community-banModal-customize = Customizar mensagem de e-mail de banimento

community-suspendModal-areYouSure = Banir <strong>{ $username }</strong>?
community-suspendModal-consequence = Uma vez banido, este usuário não poderá mais comentar, reagir ou reportar comentários
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

community-suspendModal-success-close = Fechado
community-suspendModal-selectDuration = Selecione o período de suspensão.

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
  Permitir que sua comunidade interaja com as outras e que se expressem
  com as reações de um clique. Por padrão, o Coral permite que os comentaristas "Respeitem"
  uns aos outros, mas você pode customizar os textos de reações de acordo com a necessidade
  da sua comunidade.
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
configure-account-features-delete-account-details = Remover todos os dados de comentários, nome de usuário e endereço de email do site e do banco de dados


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

forgotPassword-forgotPasswordHeader = Esqueceu a senha?
forgotPassword-checkEmailHeader = Verifique seu email
forgotPassword-gotBackToSignIn = Volte para a página de login
forgotPassword-checkEmail-receiveEmail =
  Se houver uma conta associada a <strong>{ $email }</strong>,
  você receberá um email com um link para criar uma nova senha.
forgotPassword-enterEmailAndGetALink =
  Digite seu endereço de email abaixo e nós lhe enviaremos um link
  para que você possa redefinir sua senha.
forgotPassword-emailAddressLabel = Endereço de email
forgotPassword-emailAddressTextField =
  .placeholder = Endereço de Email
forgotPassword-sendEmailButton = Enviar email

commentAuthor-status-banned = Banido

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
