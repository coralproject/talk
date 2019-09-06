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

login-signInWithFacebook = Entrar com Facebook
login-signInWithGoogle = Entrar com Google
login-signInWithOIDC = Entrar com { $name }

## Configure

configure-unsavedInputWarning =
  Você tem entrada não salva.
  em certeza de que deseja sair desta página?

configure-sideBarNavigation-general = Geral
configure-sideBarNavigation-authentication = Autenticação
configure-sideBarNavigation-moderation = Moderação
configure-sideBarNavigation-organization = Organização
configure-sideBarNavigation-advanced = Avançado
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

### Sitewide Commenting
configure-general-sitewideCommenting-title = Comentários em todo o site
configure-general-sitewideCommenting-explanation =
  Abra ou feche fluxos de comentários para novos comentários em todo o site. Quando novos comentários
  estão desativados em todo o site, novos comentários não podem ser enviados, mas
  comentários podem continuar recebendo reações de “Respeito”, ser reportados e
  compartilhados.
configure-general-sitewideCommenting-enableNewCommentsSitewide =
  Habilitar comentários em todo o site
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
configure-general-closingCommentStreams-closeCommentsAutomatically = Fechar Comentários Automaticamente
configure-general-closingCommentStreams-closeCommentsAfter = Fechar Comentários Depois de

#### Comment Length
configure-general-commentLength-title = Tamanho do comentário
configure-general-commentLength-maxCommentLength = Tamanho máximo do comentário
configure-general-commentLength-setLimit = Definir um limite para a duração dos comentários em todo o site
configure-general-commentLength-limitCommentLength = Tamanho limite do comentário
configure-general-commentLength-minCommentLength = Tamanho Mínimo do comentário
configure-general-commentLength-characters = Caracteres
configure-general-commentLength-textField =
  .placeholder = Sem limites
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
configure-general-closedStreamMessage-title = Fechar fluxo de comentários
configure-general-closedStreamMessage-explanation = Escreva uma mensagem para aparecer depois que uma história for fechada para comentários.

### Organization
configure-organization-name = Nome da organização
configure-organization-nameExplanation =
  O nome da sua organização aparecerá nos e-mails enviados pelo Coral para sua comunidade e membros da organização.
configure-organization-email = E-mail organizacional
configure-organization-emailExplanation =
  Este endereço de e-mail será usado nos e-mails
  da plataforma para os membros da comunidade para entrarem em contato com
  a organização com alguma dúvida sobre o
  status de suas contas ou questões de moderação.

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
configure-auth-sso-regenerateWarning =
  Regenerar uma chave invalida todas as sessões de usuários existentes,
  e todos os usuários conectados serão desconectados.

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

### Moderation
#### Pre-Moderation
configure-moderation-preModeration-title = Pre-moderation
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

configure-moderation-perspective-title = Filtro de Comentários Tóxicos Perspective API
configure-moderation-perspective-explanation =
  Usando a Perspective API, o filtro de comentários tóxicos avisa os usuários quando os comentários excedem a toxicidade predefinida
  limite. Comentários com uma pontuação de toxicidade acima do limite <strong> não serão publicados </strong> e serão colocados na
  <strong> fila pendente para revisão por um moderador </strong>. Se aprovado por um moderador, o comentário será publicado.

#### Perspective
configure-moderation-perspective-filter = Filtro de Comentários Tóxicos
configure-moderation-perspective-toxicityThreshold = Limite de toxicidade
configure-moderation-perspective-toxicityThresholdDescription =
  Esse valor pode ser definido como uma porcentagem entre 0 e 100. Esse número representa a probabilidade de
  o comentário ser tóxico, de acordo com a API do Perspective. Por padrão, o limite é definido como { $default } (Disponível apenas para o idioma inglês).
configure-moderation-perspective-toxicityModel = Toxicity Model
configure-moderation-perspective-toxicityModelDescription =
  Choose your Perspective Model. The default is { $default }. You can find out more about model choices <externalLink>here</externalLink>.
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
configure-wordList-banned-wordListDetail =
  Separe palavras ou frases banidas com uma nova linha. Tentando copiar
  e cole uma lista separada por vírgula? <externalLink> Saiba como converter sua lista
  para uma nova lista separada por linha. </externalLink>

#### Suspect Words Configuration
configure-wordList-suspect-bannedWordsAndPhrases = Palavras e Frases Suspeitas
configure-wordList-suspect-explanation =
  Comentários contendo uma palavra ou frase na Lista de Palavras Suspeitas
  são <strong> colocados na Fila de Reportados para revisão de moderadores e são
  publicado (se os comentários não forem pré-moderados). </ strong>
configure-wordList-suspect-wordList = Lista de Palavras Suspeitas
configure-wordList-suspect-wordListDetail =
  Separe palavras suspeitas ou frases com uma nova linha. Tentando copiar
  e cole uma lista separada por vírgula? <externalLink> Saiba como converter sua lista
  para uma nova lista separada por linha. </externalLink>

### Advanced
configure-advanced-customCSS = CSS Customizado
configure-advanced-customCSS-explanation =
  URL de uma folha de estilo CSS que substituirá o estilo padrão dos fluxos de comentário das páginas. Pode ser interno ou externo.

configure-advanced-permittedDomains = Domínios Permitidos

configure-advanced-liveUpdates = Atualizações ao vivo do Stream de comentários
configure-advanced-liveUpdates-explanation =
  Quando ativado, habilitará o carregamento e atualização em tempo real dos comentários, à medida que novos comentários e respostas forem publicados.

configure-advanced-embedCode-title = Incorporar
configure-advanced-embedCode-explanation =
  Copie e cole o código abaixo no seu CMS para incorporar fluxos de comentários do Coral em
  cada uma das histórias do seu site.

## Decision History
decisionHistory-popover =
  .description = Uma caixa de diálogo mostrando o histórico de decisões
decisionHistory-youWillSeeAList =
  Você verá uma lista de suas ações de moderação de postagens aqui.
decisionHistory-showMoreButton =
  Show More
decisionHistory-yourDecisionHistory = Seu Histórico de Decisão
decisionHistory-rejectedCommentBy = Comentário Rejeitado por <username></username>
decisionHistory-acceptedCommentBy = Comentário Aceito por <username></username>
decisionHistory-goToComment = Ir para o comentário

## moderate
moderate-navigation-reported = reportado
moderate-navigation-pending = Pendente
moderate-navigation-unmoderated = não moderado
moderate-navigation-rejected = rejeitado

moderate-marker-preMod = Pre-Moderado
moderate-marker-link = Link
moderate-marker-bannedWord = Palavra Banida
moderate-marker-suspectWord = Palavra Suspeita
moderate-marker-spam = Spam
moderate-marker-toxic = Tóxico
moderate-marker-karma = Karma
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

### Moderate Search Bar
moderate-searchBar-allStories = Todas as histórias
  .title = Todas as histórias
moderate-searchBar-noResults = Sem resultados
moderate-searchBar-stories = Histórias:
moderate-searchBar-searchButton = Pesquisar
moderate-searchBar-titleNotAvailable =
  .title = Título não disponível
moderate-searchBar-comboBox =
  .aria-label = Pesquise ou pular para a história
moderate-searchBar-searchForm =
  .aria-label = Histórias
moderate-searchBar-currentlyModerating =
  .title = Atualmente moderando
moderate-searchBar-searchResultsMostRecentFirst = Pesquisar resultados (Mais recentes primeiro)
moderate-searchBar-moderateAllStories = Moderar todas as histórias
moderate-searchBar-comboBoxTextField =
  .aria-label = Pesquisar ou pular para a história....
  .placeholder = Use aspas em torno de cada termo de pesquisa (por exemplo, "equipe", "St. Louis")
moderate-searchBar-goTo = Ir para
moderate-searchBar-seeAllResults = Ver todos os resultados

### Moderate User History Drawer

moderate-user-drawer-tab-all-comments = Todos comentários
moderate-user-drawer-tab-rejected-comments = Rejeitados
moderate-user-drawer-load-more = Carregar mais
moderate-user-drawer-all-no-comments = {$username} não enviou comentários.
moderate-user-drawer-rejected-no-comments = {$username} não tem comentários rejeitados.
moderate-user-drawer-user-not-found = Usuário não encontrado.

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
community-column-email = E-mail
community-column-memberSince = Membro desde
community-column-role = Função
community-column-status = Status

community-role-popover =
  .description = Um menu suspenso para alterar o papel do usuário

community-userStatus-popover =
  .description = Um menu suspenso para alterar o status do usuário

community-userStatus-banUser = Banir Usário
community-userStatus-removeBan = Remover Banimento
community-userStatus-suspendUser = Suspender Userário
community-userStatus-removeSupsension = Remover Suspensão
community-userStatus-unknown = Desconhecido
community-userStatus-changeButton =
  .aria-label = Mudar status do usuário

community-banModal-areYouSure = Você tem certeza que quer banir  <strong>{ $username }</strong>?
community-banModal-consequence =
  Uma vez banido, este usuário não poderá mais comentar, usar
  reações ou relatar comentários.
community-banModal-cancel = Cancelar
community-banModal-banUser = Banir Usário

community-invite-inviteMember = Convidar membros para sua organização
community-invite-emailAddressLabel = Endereço de email:
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
