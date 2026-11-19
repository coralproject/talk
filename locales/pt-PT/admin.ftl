### Localization for Admin

## General
general-notAvailable = Não disponível
general-none = Nenhum
general-noTextContent = Sem conteúdo de texto
general-archived = Arquivado

## Story Status
storyStatus-open = Aberto
storyStatus-closed = Fechado
storyStatus-archiving = A arquivar
storyStatus-archived = Arquivado
storyStatus-unarchiving = A desarquivar

## Roles
role-admin = Administrador
role-moderator = Moderador
role-siteModerator = Moderador do site
role-organizationModerator = Moderador da Organização
role-staff = Staff
role-member = Membro
role-commenter = Comentador

role-plural-admin = Administradores
role-plural-moderator = Moderadores
role-plural-staff = Staff
role-plural-member = Membros
role-plural-commenter = Comentadores

comments-react =
  .aria-label = {$count ->
    [0] {$reaction} comentário feito por {$username}
    *[other] {$reaction} ({$count}) comentário feito por {$username}
  }
comments-reacted =
  .aria-label = {$count ->
    [0] {$reaction} comentário feito por {$username}
    [one] {$reaction} comentário feito por {$username}
    *[other] {$reaction} ({$count}) comentário feito por {$username}
  }

## components
admin-paginatedSelect-filter =
  .aria-label = Filtrar Resultados

## User Statuses
userStatus-active = Ativo
userStatus-banned = Banido
userStatus-siteBanned = Banido do site
userStatus-banned-all = Banido (todos)
userStatus-banned-count = Banido ({$count})
userStatus-suspended = Suspenso
userStatus-premod = Sempre pré-moderado
userStatus-warned = Avisado

# Queue Sort
queue-sortMenu-newest = Mais recente
queue-sortMenu-oldest = Mais antigo

## Navigation
navigation-moderate = Moderação
navigation-community = Comunidade
navigation-stories = Histórias
navigation-configure = Configuração
navigation-dashboard = Dashboard
navigation-reports = Relatórios DSA

## User Menu
userMenu-signOut = Sair
userMenu-viewLatestRelease = Ver último lançamento
userMenu-reportBug = Reportar um erro ou dar feedback
userMenu-popover =
  .description = Uma caixa de diálogo do menu do utilizador com links e ações relacionadas

## Restricted
restricted-currentlySignedInTo = Sessão iniciada em
restricted-noPermissionInfo = Não tem permissão para aceder a esta página.
restricted-signedInAs = Tem sessão iniciada como: <strong>{ $username }</strong>
restricted-signInWithADifferentAccount = Entrar com uma conta diferente
restricted-contactAdmin = Se achar que isto é um erro, entre em contacto com o seu administrador para obter ajuda.

## Login

# Sign In
login-signInTo = Entrar
login-signIn-enterAccountDetailsBelow = Introduza os detalhes da sua conta abaixo

login-emailAddressLabel = Endereço de e-mail
login-emailAddressTextField =
  .placeholder = Endereço de e-mail

login-signIn-passwordLabel = Palavra-passe
login-signIn-passwordTextField =
  .placeholder = Palavra-passe

login-signIn-signInWithEmail = Entrar com o e-mail
login-orSeparator = Ou
login-signIn-forgot-password = Esqueceu a sua palavra-passe?

login-signInWithFacebook = Entrar com Facebook
login-signInWithGoogle = Entrar com Google
login-signInWithOIDC = Entrar com { $name }

# Create Username

createUsername-createUsernameHeader = Criar Nome de Utilizador
createUsername-whatItIs =
  O seu Nome de Utilizador é um identificador que aparecerá em todos os seus comentários.
createUsername-createUsernameButton = Criar Nome de Utilizador
createUsername-usernameLabel = Nome de Utilizador
createUsername-usernameDescription = Pode usar "_" e "." Espaços não são permitidos.
createUsername-usernameTextField =
  .placeholder = Nome de Utilizador

# Add Email Address
addEmailAddress-addEmailAddressHeader = Adicionar Endereço de E-mail

addEmailAddress-emailAddressLabel = Endereço de E-mail
addEmailAddress-emailAddressTextField =
  .placeholder = Endereço de E-mail

addEmailAddress-confirmEmailAddressLabel = Confirmar Endereço de E-mail
addEmailAddress-confirmEmailAddressTextField =
  .placeholder = Confirmar Endereço de E-mail

addEmailAddress-whatItIs =
  Para maior segurança, exigimos que os utilizadores adicionem um endereço de e-mail às suas contas.

addEmailAddress-addEmailAddressButton =
  Adicionar um Endereço de E-mail

# Create Password
createPassword-createPasswordHeader = Criar Palavra-passe
createPassword-whatItIs =
 Para proteger contra alterações não autorizadas na sua conta,
 exigimos que os utilizadores criem uma palavra-passe.
createPassword-createPasswordButton =
  Criar Palavra-passe

createPassword-passwordLabel = Palavra-passe
createPassword-passwordDescription = Deve ter pelo menos {$minLength} caracteres
createPassword-passwordTextField =
  .placeholder = Palavra-passe

# Forgot Password
forgotPassword-forgotPasswordHeader = Esqueceu a sua palavra-passe?
forgotPassword-checkEmailHeader = Verifique o seu e-mail
forgotPassword-gotBackToSignIn = Voltar ao início de sessão
forgotPassword-checkEmail-receiveEmail =
  Se existir uma conta associada a <strong>{ $email }</strong>,
  receberá um e-mail com um link para criar uma nova palavra-passe.
forgotPassword-enterEmailAndGetALink =
  Introduza o seu endereço de e-mail abaixo e enviaremos
  um link para redefinir a sua palavra-passe.
forgotPassword-emailAddressLabel = Endereço de e-mail
forgotPassword-emailAddressTextField =
  .placeholder = Endereço de e-mail
forgotPassword-sendEmailButton = Enviar e-mail

# Link Account
linkAccount-linkAccountHeader = Associar Conta
linkAccount-alreadyAssociated =
  O e-mail <strong>{ $email }</strong> já está
  associado a uma conta. Se pretender associá-los,
  introduza a sua palavra-passe.
linkAccount-passwordLabel = Palavra-passe
linkAccount-passwordTextField =
  .label = Palavra-passe
linkAccount-linkAccountButton = Associar Conta
linkAccount-useDifferentEmail = Usar um endereço de e-mail diferente

## Configure

configure-experimentalFeature = Funcionalidade Experimental

configure-unsavedInputWarning =
  Tem alterações não guardadas. Tem a certeza de que pretende sair desta página?

configure-sideBarNavigation-general = Geral
configure-sideBarNavigation-authentication = Autenticação
configure-sideBarNavigation-moderation = Moderação
configure-sideBarNavigation-moderation-comments = Comentários
configure-sideBarNavigation-moderation-users = Utilizadores
configure-sideBarNavigation-organization = Organização
configure-sideBarNavigation-moderationPhases = Fases de moderação
configure-sideBarNavigation-advanced = Avançado
configure-sideBarNavigation-email = E-mail
configure-sideBarNavigation-bannedAndSuspectWords = Palavras banidas e suspeitas
configure-sideBarNavigation-slack = Slack
configure-sideBarNavigation-webhooks = Webhooks

configure-sideBar-saveChanges = Guardar alterações
configure-configurationSubHeader = Configuração
configure-onOffField-on = Ligado
configure-onOffField-off = Desligado
configure-radioButton-allow = Permitir
configure-radioButton-dontAllow = Não permitir

### Moderation Phases

configure-moderationPhases-generatedAt = CHAVE GERADA EM:
  { DATETIME($date, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric") }
configure-moderationPhases-phaseNotFound = Fase de moderação externa não encontrada
configure-moderationPhases-experimentalFeature =
  O recurso de fases de moderação personalizadas está atualmente em desenvolvimento ativo.
  <ContactUsLink>Entre em contacto connosco para qualquer feedback ou solicitação</ContactUsLink>.
configure-moderationPhases-header-title = Fases de moderação
configure-moderationPhases-description =
  Configure uma fase de moderação externa para automatizar alguma ação de moderação.
  Os pedidos de moderação são enviados e assinados como JSON. Para
  saber mais sobre os pedidos de moderação, aceda à nossa <externalLink>documentação</externalLink>.
configure-moderationPhases-addExternalModerationPhaseButton =
  Adicionar fase de moderação externa
configure-moderationPhases-moderationPhases = Fases de moderação
configure-moderationPhases-name = Nome
configure-moderationPhases-status = Estado
configure-moderationPhases-noExternalModerationPhases =
  Não há fases de moderação externa configuradas, adicione uma acima.
configure-moderationPhases-enabledModerationPhase = Ativado
configure-moderationPhases-disableModerationPhase = Desativado
configure-moderationPhases-detailsButton = Detalhes <icon></icon>
configure-moderationPhases-addExternalModerationPhase = Adicionar fase de moderação externa
configure-moderationPhases-updateExternalModerationPhaseButton = Atualizar detalhes
configure-moderationPhases-cancelButton = Cancelar
configure-moderationPhases-format = Formato do corpo do comentário
configure-moderationPhases-endpointURL = URL de callback
configure-moderationPhases-timeout = Tempo limite
configure-moderationPhases-timeout-details =
  O tempo que o Coral aguardará pela sua resposta de moderação, em milissegundos.
configure-moderationPhases-format-details =
  O formato em que o Coral enviará o corpo do comentário. Por defeito, o Coral enviará
  o comentário no formato HTML original. Se "Texto Simples" for
  selecionado, a versão sem HTML será enviada.
configure-moderationPhases-format-html = HTML
configure-moderationPhases-format-plain = Texto Simples
configure-moderationPhases-endpointURL-details =
  O URL para o qual os pedidos de moderação do Coral serão enviados, via POST. O URL fornecido
  deve responder dentro do tempo limite definido ou a decisão da ação de moderação
  será ignorada.
configure-moderationPhases-configureExternalModerationPhase =
  Configurar fase de moderação externa
configure-moderationPhases-phaseDetails = Detalhes da fase
onfigure-moderationPhases-status = Estado
configure-moderationPhases-signingSecret = Segredo de assinatura
configure-moderationPhases-signingSecretDescription =
  O seguinte segredo de assinatura é utilizado para assinar o payload dos pedidos enviados
  para o URL. Para saber mais sobre a assinatura de webhook, aceda à nossa <externalLink>documentação</externalLink>.
configure-moderationPhases-phaseStatus = Estado da fase
configure-moderationPhases-status = Estado
configure-moderationPhases-signingSecret = Segredo de assinatura
configure-moderationPhases-signingSecretDescription =
  O seguinte segredo de assinatura é utilizado para assinar o payload dos pedidos enviados
  para o URL. Para saber mais sobre a assinatura de webhook, aceda à nossa <externalLink>documentação</externalLink>.
configure-moderationPhases-dangerZone = Zona de perigo
configure-moderationPhases-rotateSigningSecret = Rodar segredo de assinatura
configure-moderationPhases-rotateSigningSecretDescription =
  Rodar o segredo de assinatura permitirá substituir com segurança um
  segredo usado em produção com atraso.
configure-moderationPhases-rotateSigningSecretButton = Rodar segredo de assinatura

configure-moderationPhases-disableExternalModerationPhase =
  Desativar fase de moderação externa
configure-moderationPhases-disableExternalModerationPhaseDescription =
  Esta fase de moderação externa está atualmente ativada. Ao desativar, não serão enviados
  novos pedidos de moderação para o URL fornecido.
configure-moderationPhases-disableExternalModerationPhaseButton = Desativar fase
configure-moderationPhases-enableExternalModerationPhase =
  Ativar fase de moderação externa
configure-moderationPhases-enableExternalModerationPhaseDescription =
  Esta fase de moderação externa está atualmente desativada. Ao ativar, serão enviados
  novos pedidos de moderação para o URL fornecido.
configure-moderationPhases-enableExternalModerationPhaseButton = Ativar fase
configure-moderationPhases-deleteExternalModerationPhase =
  Eliminar fase de moderação externa
configure-moderationPhases-deleteExternalModerationPhaseDescription =
  A eliminação desta fase de moderação externa impedirá o envio de novos pedidos
  de moderação para este URL e removerá todas as configurações associadas.
configure-moderationPhases-deleteExternalModerationPhaseButton = Eliminar fase
configure-moderationPhases-rotateSigningSecret = Rodar segredo de assinatura
configure-moderationPhases-rotateSigningSecretHelper =
  Após expirar, as assinaturas deixarão de ser geradas com o segredo antigo.
configure-moderationPhases-expiresOldSecret =
  Expirar o segredo antigo
configure-moderationPhases-expiresOldSecretImmediately =
  Imediatamente
configure-moderationPhases-expiresOldSecretHoursFromNow =
  { $hours ->
    [1] 1 hora
    *[other] { $hours } horas
  } a partir de agora
configure-moderationPhases-rotateSigningSecretSuccessUseNewSecret =
  O segredo de assinatura da fase de moderação externa foi rodado. Certifique-se
  de atualizar as suas integrações para usar o novo segredo abaixo.
configure-moderationPhases-confirmDisable =
  Desativar esta fase de moderação externa impedirá o envio de novos pedidos
  de moderação para este URL. Tem a certeza que quer continuar?
configure-moderationPhases-confirmEnable =
  Ativar a fase de moderação externa fará com que os pedidos de moderação
  para este URL passem a ser enviados. Tem a certeza que quer continuar?
configure-moderationPhases-confirmDelete =
  A eliminação desta fase de moderação externa interromperá o envio de novos pedidos
  de moderação para este URL e também removerá todas as configurações associadas.
  Tem a certeza que quer continuar?

### Webhooks

configure-webhooks-generatedAt = CHAVE GERADA EM:
  { DATETIME($date, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric") }
configure-webhooks-experimentalFeature =
  A funcionalidade de Webhooks está atualmente em desenvolvimento ativo. Eventos podem
  ser adicionados ou removidos. Por favor <ContactUsLink>entre em contacto connosco com qualquer feedback ou pedido</ContactUsLink>.
configure-webhooks-webhookEndpointNotFound = Endpoint do Webhook não encontrado
configure-webhooks-header-title = Configurar endpoint do Webhook
configure-webhooks-description =
  Configure um endpoint para enviar eventos quando esses eventos ocorrem no Coral.
  Estes eventos serão codificados via JSON e assinados. Para saber mais sobre
  a assinatura de webhooks, visite o nosso <externalLink>Guia de Webhooks</externalLink>.
configure-webhooks-addEndpoint = Adicionar um endpoint do webhook
configure-webhooks-addEndpointButton = Adicionar um endpoint do webhook
configure-webhooks-endpoints = Endpoints
configure-webhooks-url = URL
configure-webhooks-status = Estado
configure-webhooks-noEndpoints = Não há endpoints de webhooks configurados, adicione um acima.
configure-webhooks-enabledWebhookEndpoint = Ativado
configure-webhooks-disabledWebhookEndpoint = Desativado
configure-webhooks-endpointURL = URL do Endpoint
configure-webhooks-cancelButton = Cancelar
configure-webhooks-updateWebhookEndpointButton = Atualizar endpoint do webhook
configure-webhooks-eventsToSend = Eventos a enviar
configure-webhooks-clearEventsToSend = Limpar
configure-webhooks-eventsToSendDescription =
  Estes são os eventos registados neste endpoint específico. Visite
  o nosso <externalLink>Guia de Webhooks</externalLink> para o esquema desses eventos.
  Qualquer evento correspondente aos seguintes será enviado para o endpoint se
  estiver ativado:
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
  Ativar este endpoint do webhook fará com que os eventos sejam enviados para este URL. Tem a certeza que pretende continuar?
configure-webhooks-confirmDisable =
  Desativar este endpoint do webhook fará com que qualquer novo evento deixe de ser enviado para este URL. Tem a certeza que pretende continuar?
configure-webhooks-confirmDelete =
  Eliminar este endpoint do webhook fará com que qualquer novo evento deixe de ser enviado para este URL, e removerá todas as configurações associadas a este endpoint do webhook. Tem a certeza que pretende continuar?
configure-webhooks-dangerZone = Zona de Perigo
configure-webhooks-rotateSigningSecret = Rodar segredo de assinatura
configure-webhooks-rotateSigningSecretDescription =
  Rodar o segredo de assinatura permite substituir com segurança
  o segredo de assinatura usado em produção com um atraso.
configure-webhooks-rotateSigningSecretButton = Rodar segredo de assinatura
configure-webhooks-rotateSigningSecretHelper =
  Após expirar, as assinaturas deixarão de ser geradas com o segredo anterior.
configure-webhooks-rotateSigningSecretSuccessUseNewSecret =
  O segredo de assinatura do endpoint do webhook foi rodado. Por favor garanta
  que atualizou as suas integrações para utilizar o novo segredo abaixo.
configure-webhooks-disableEndpoint = Desativar endpoint
configure-webhooks-disableEndpointDescription =
  O endpoint está atualmente ativado. Ao desativar este endpoint, não serão
  enviados novos eventos para o URL fornecido.
configure-webhooks-disableEndpointButton = Desativar endpoint
configure-webhooks-enableEndpoint = Ativar endpoint
configure-webhooks-enableEndpointDescription =
  O endpoint está atualmente desativado. Ao ativar este endpoint, serão
  enviados novos eventos para o URL fornecido.
configure-webhooks-enableEndpointButton = Ativar endpoint
configure-webhooks-deleteEndpoint = Eliminar endpoint
configure-webhooks-deleteEndpointDescription =
  Eliminar o endpoint impedirá que sejam enviados novos eventos para o URL
  fornecido.
configure-webhooks-deleteEndpointButton = Eliminar endpoint
configure-webhooks-endpointStatus = Estado do Endpoint
configure-webhooks-signingSecret = Segredo de assinatura
configure-webhooks-signingSecretDescription =
  O seguinte segredo de assinatura é utilizado para assinar o payload dos pedidos
  enviados para o URL. Para saber mais sobre a assinatura de webhooks, visite o nosso
  <externalLink>Guia de Webhooks</externalLink>.
configure-webhooks-expiresOldSecret = Expirar o segredo antigo
configure-webhooks-expiresOldSecretImmediately = Imediatamente
configure-webhooks-expiresOldSecretHoursFromNow =
  { $hours ->
    [1] 1 hora
    *[other] { $hours } horas
  }  a partir de agora
configure-webhooks-detailsButton = Detalhes <icon></icon>

### General
configure-general-guidelines-title = Resumo das Diretrizes da Comunidade
configure-general-guidelines-explanation =
  Escreva um resumo das diretrizes da sua comunidade que serão exibidas no topo de cada
  fluxo de comentários em todo o site. O seu resumo pode ser formatado usando a Sintaxe do
  Markdown. Mais informações sobre como usar Markdown podem ser encontradas aqui:
  <externalLink>https://www.markdownguide.org/cheat-sheet/</externalLink>
configure-general-guidelines-showCommunityGuidelines = Mostrar Resumo das Diretrizes da Comunidade

#### Biografia
configure-general-memberBio-title = Biografia dos utilizadores
configure-general-memberBio-explanation =
  Permita que os utilizadores adicionem uma biografia ao seu perfil. Nota: Isto pode aumentar a carga de trabalho do moderador, pois a biografia dos utilizadores pode ser denunciada.
configure-general-memberBio-label = Permitir biografia dos utilizadores

#### Locale
configure-general-locale-language = Idioma
configure-general-locale-chooseLanguage = Selecione o idioma para a sua comunidade Coral.
configure-general-locale-invalidLanguage =
  O idioma selecionado anteriormente <lang></lang> já não existe. Por favor, escolha um idioma diferente.

### Sitewide Commenting
configure-general-sitewideCommenting-title = Comentários em todo o site
configure-general-sitewideCommenting-explanation =
  Abra ou feche o fluxo de comentários para novos comentários em todo o site. Quando os novos comentários
  estão desativados em todo o site, não podem ser enviados novos comentários, mas
  os comentários podem continuar a receber reações de "Respeito", ser denunciados e
  partilhados.
configure-general-sitewideCommenting-enableNewCommentsSitewide =
  Ativar novos comentários em todo o site
configure-general-sitewideCommenting-onCommentStreamsOpened =
  Ligado - Fluxo de comentários aberto para novos comentários
configure-general-sitewideCommenting-offCommentStreamsClosed =
  Desligado - Fluxo de comentários fechado para novos comentários
configure-general-sitewideCommenting-message = Mensagem de Comentários Fechados em Todo o Site
configure-general-sitewideCommenting-messageExplanation =
  Escreva uma mensagem que será exibida quando o fluxo de comentários estiver fechado em todo o site

#### Embed Links
configure-general-embedLinks-title = Multimédia incorporada
configure-general-embedLinks-desc =
configure-general-embedLinks-description =
  Permitir que os comentadores adicionem um vídeo do YouTube, tweet ou GIF ao final do comentário
configure-general-embedLinks-description-addASinglePiece =
  Permitir que os comentadores adicionem um único conteúdo incorporado ao final do comentário
configure-general-embedLinks-enableTwitterEmbeds = Permitir incorporações do Twitter
configure-general-embedLinks-enableBlueskyEmbeds = Permitir incorporações do Bluesky
configure-general-embedLinks-enableYouTubeEmbeds = Permitir incorporações do YouTube
configure-general-embedLinks-enableGifs = Permitir GIFs
configure-general-embedLinks-enableExternalEmbeds = Ativar multimédia externa

configure-general-embedLinks-On = Sim
configure-general-embedLinks-Off = Não

configure-general-embedLinks-giphyMaxRating = Classificação de conteúdo GIF
configure-general-embedLinks-giphyMaxRating-desc = Selecione a classificação máxima de conteúdo para os GIFs que aparecerão nos resultados de pesquisa dos comentadores

configure-general-embedLinks-giphyMaxRating-g = G
configure-general-embedLinks-giphyMaxRating-g-desc = Conteúdo adequado para todas as idades
configure-general-embedLinks-giphyMaxRating-pg = PG
configure-general-embedLinks-giphyMaxRating-pg-desc = Conteúdo geralmente seguro para todos, mas orientação parental para crianças é recomendada.
configure-general-embedLinks-giphyMaxRating-pg13 = PG-13
configure-general-embedLinks-giphyMaxRating-pg13-desc = Insinuações sexuais moderadas, uso moderado de substâncias, linguagem obscena moderada ou imagens ameaçadoras. Pode incluir imagens de pessoas seminuas, mas NÃO mostra genitália humana real ou nudez.
configure-general-embedLinks-giphyMaxRating-r = R
configure-general-embedLinks-giphyMaxRating-r-desc = Linguagem forte, forte insinuação sexual, violência e uso de drogas ilegais; não é adequado para adolescentes ou mais jovens. Sem nudez.

configure-general-embedLinks-configuration = Configuração

configure-general-embedLinks-gifProvider = Fornecedor de GIF
configure-general-embedLinks-gifProvider-desc =
  Determina qual o fornecedor que os comentadores utilizam para pesquisar e mostrar GIFs.

configure-general-embedLinks-gifs-provider-Giphy = Giphy
configure-general-embedLinks-gifs-provider-Tenor = Tenor

configure-general-embedLinks-configuration-desc =
configure-general-embedLinks-configuration-giphy-desc =
  Para mais informações sobre a API do GIPHY, aceda a: <externalLink>https://developers.giphy.com/docs/api</externalLink>
configure-general-embedLinks-giphyAPIKey = Chave de API do GIPHY

configure-general-embedLinks-configuration-tenor-desc =
  Para mais informações sobre a API do TENOR, aceda a: <externalLink>https://developers.google.com/tenor/guides/endpoints</externalLink>
configure-general-embedLinks-tenorAPIKey = Chave de API do TENOR


### Configure Announcements

configure-general-announcements-title = Anúncio da comunidade
configure-general-announcements-description =
  Adicione um anúncio temporário que aparecerá no topo de todos os fluxos de comentários da sua organização por um período específico.
configure-general-announcements-delete = Remover anúncio
configure-general-announcements-add = Adicionar anúncio
configure-general-announcements-start = Iniciar anúncio
configure-general-announcements-cancel = Cancelar
configure-general-announcements-current-label = Anúncio atual
configure-general-announcements-current-duration =
  Este anúncio será encerrado automaticamente em: { $timestamp }
configure-general-announcements-duration = Mostrar este anúncio durante

### Closing Comment Streams
configure-general-closingCommentStreams-title = Fechar fluxos de comentários
configure-general-closingCommentStreams-explanation = Defina os fluxos de comentários para fechar após um período de tempo definido após a publicação de uma história
configure-general-closingCommentStreams-closeCommentsAutomatically = Fechar comentários automaticamente
configure-general-closingCommentStreams-closeCommentsAfter = Fechar comentários após

#### Comment Length
configure-general-commentLength-title = Tamanho do comentário
configure-general-commentLength-maxCommentLength = Tamanho máximo do comentário
configure-general-commentLength-setLimit =
  Definir um limite de tamanho máximo e mínimo de comentários.
  Os espaços em branco no início e no final dos comentários serão ignorados.
configure-general-commentLength-limitCommentLength = Tamanho limite do comentário
configure-general-commentLength-minCommentLength = Tamanho mínimo do comentário
configure-general-commentLength-characters = Caracteres
configure-general-commentLength-textField =
  .placeholder = Sem limite
configure-general-commentLength-validateLongerThanMin =
  Por favor introduza um número maior do que o comprimento mínimo

#### Comment Editing
configure-general-commentEditing-title = Edição de Comentários
configure-general-commentEditing-explanation =
  Defina um limite de tempo para os comentadores editarem os seus comentários em todo o site.
  Os comentários editados são marcados como (Editado) no fluxo de comentários e
  no painel de moderação.
configure-general-commentEditing-commentEditTimeFrame = Período de tempo de edição de comentários
configure-general-commentEditing-seconds = Segundos

#### Flatten replies
configure-general-flattenReplies-title = Nivelamento de respostas
configure-general-flattenReplies-enabled = Nivelamento de respostas ativado
configure-general-flattenReplies-explanation =
  Altera como os níveis de respostas são exibidos. Quando ativado, as respostas aos comentários podem ter até sete níveis de profundidade antes de deixarem de ser recuadas na página. Quando desativado, após uma profundidade de sete respostas, o restante da conversa é exibido numa vista dedicada, separada dos outros comentários.

#### Collapse Replies
configure-general-collapseReplies-title = Recolher respostas
configure-general-collapseReplies-enabled = Recolher respostas ativado
configure-general-collapseReplies-explanation =
  Quando ativado, as respostas de primeiro nível a comentários serão recolhidas por predefinição.

configure-general-featuredBy-title = Destaque
configure-general-featuredBy-enabled = Destaque ativado
configure-general-featuredBy-explanation = Adicionar nome do moderador à exibição de comentários em destaque

configure-general-topCommenter-title = Badge de principal comentador
configure-general-topCommenter-explanation = Adicione o badge de principal comentador aos comentadores com comentários em destaque nos últimos 10 dias
configure-general-topCommenter-enabled = Ativar badges de principal comentador

configure-general-flairBadge-header = Badges de estilos personalizados
configure-general-flairBadge-description =  Incentive o envolvimento e a participação do utilizador adicionando badges de estilos personalizados ao seu site. Os badges podem ser alocados como parte do seu <externalLink>JWT claim</externalLink>.
configure-general-flairBadge-enable-label = Ativar badges de estilos personalizados
configure-general-flairBadge-add = URL do badge
configure-general-flairBadge-add-helperText =
  Cole o endereço web para o seu badge de estilo personalizado. Tipos de ficheiro suportados: png, jpeg, jpg e gif
configure-general-flairBadge-url-error =
  O URL é inválido ou tem um tipo de ficheiro não suportado.
configure-general-flairBadge-add-name = Nome do badge
configure-general-flairBadge-add-name-helperText =
  Dê um nome ao badge com um identificador descritivo
configure-general-flairBadge-name-permittedCharacters =
  Apenas letras, números e os caracteres especiais - . são permitidos.
configure-general-flairBadge-add-button = Adicionar
configure-general-flairBadge-table-flairName = Nome
configure-general-flairBadge-table-flairURL = URL
configure-general-flairBadge-table-preview = Pré-visualizar
configure-general-flairBadge-table-deleteButton = <icon></icon> Eliminar
configure-general-flairBadge-table-empty = Nenhum badge de estilo adicionado para este site

#### In-page notifications
configure-general-inPageNotifications-title = Notificações na página
configure-general-inPageNotifications-explanation = Adicione notificações ao Coral. Quando ativado, os comentadores podem receber
  notificações quando recebem todas as respostas, apenas respostas de membros
  da sua equipa, quando um comentário Pendente é publicado. Os comentadores podem
  desativar os indicadores visuais de notificação nas suas preferências de Perfil. Isto removerá as notificações por e-mail.
configure-general-inPageNotifications-enabled = Notificações na página ativadas
configure-general-inPageNotifications-floatingBellIndicator = Indicador de sino flutuante

#### Closed Stream Message
configure-general-closedStreamMessage-title = Mensagem de fecho do fluxo de comentários
configure-general-closedStreamMessage-explanation = Escreva uma mensagem para aparecer depois de uma história ser fechada para comentários.

### Organization
configure-organization-name = Nome da organização
configure-organization-sites = Sites
configure-organization-nameExplanation =
  O nome da sua organização aparecerá nos e-mails enviados pelo Coral para a sua comunidade e membros da organização.
configure-organization-sites-explanation =
  Adicione um novo site à sua Organização ou edite os detalhes de um site existente.
configure-organization-sites-add-site = <icon></icon> Adicionar site
configure-organization-email = E-mail organizacional
configure-organization-emailExplanation =
  Este endereço de e-mail será utilizado nos e-mails
  da plataforma para os membros da comunidade entrarem em contacto com
  a organização com alguma dúvida sobre o
  estado das suas contas ou questões de moderação.
configure-organization-url = URL da organização
configure-organization-urlExplanation =
  O URL da sua organização aparecerá nos e-mails enviados pelo Coral para a sua comunidade e membros da organização.

### Sites
configure-sites-site-details = Detalhes <icon></icon>
configure-sites-add-new-site = Adicionar um novo site a { $site }
configure-sites-add-success = { $site } foi adicionado a { $org }
configure-sites-edit-success = As alterações a { $site } foram guardadas.
configure-sites-site-form-name = Nome do site
configure-sites-site-form-name-explanation = O nome do site aparecerá nos e-mails enviados pelo Coral para a sua comunidade e membros da Organização.
configure-sites-site-form-url = URL do Site
configure-sites-site-form-url-explanation = Este aparecerá nos e-mails enviados pelo Coral para os membros da sua comunidade.
configure-sites-site-form-email = Endereço de e-mail do site
configure-sites-site-form-url-explanation = Este endereço de e-mail serve para os membros da comunidade entrarem em contacto consigo com perguntas ou se precisarem de ajuda. Ex: comentarios@oseusite.com
configure-sites-site-form-domains = Domínios permitidos do site
configure-sites-site-form-domains-explanation = Domínios onde os fluxos de comentários são permitidos ser incorporados (ex. http://localhost:3000, https://staging.domain.com, https://domain.com).
configure-sites-site-form-submit = <icon></icon> Adicionar site
configure-sites-site-form-cancel = Cancelar
configure-sites-site-form-save = Guardar alterações
configure-sites-site-edit = Editar detalhes do { $site }
configure-sites-site-form-embed-code = Código incorporado
sites-emptyMessage = Não encontrámos nenhum site correspondente a esses critérios.
sites-selector-allSites = Todos os sites
site-filter-option-allSites = Todos os sites

site-selector-all-sites = Todos os sites
stories-filter-sites-allSites = Todos os sites
stories-filter-statuses = Estado
stories-column-site = Site
site-table-siteName = Nome do Site
stories-filter-sites = Site

site-search-searchButton =
  .aria-label = Pesquisar
site-search-textField =
  .aria-label = Pesquisar pelo nome do site
site-search-textField =
  .placeholder = Pesquisar pelo nome do site
site-search-none-found = Nenhum site foi encontrado com essa pesquisa
specificSitesSelect-validation = Deve selecionar pelo menos um site.

stories-column-actions = Ações
stories-column-rescrape = Re-recolher

stories-openInfoDrawer =
  .aria-label = Abrir mais informações
stories-actions-popover =
  .description = Uma lista para selecionar as ações da história
stories-actions-rescrape = Re-recolher
stories-actions-close = Fechar história
stories-actions-open = Abrir história
stories-actions-archive = Arquivar história
stories-actions-unarchive = Desarquivar história
stories-actions-isUnarchiving = A desarquivar

### Sections

moderate-section-selector-allSections = Todas as secções
moderate-section-selector-uncategorized = Sem categoria
moderate-section-uncategorized = Sem categoria

### Email

configure-email = Configuração de e-mail
configure-email-configBoxEnabled = Ativado
configure-email-fromNameLabel = Nome do remetente
configure-email-fromNameDescription =
  Nome como aparecerá nos e-mails enviados
configure-email-fromEmailLabel = Endereço de e-mail do remetente
configure-email-fromEmailDescription =
  Endereço de e-mail que será utilizado para enviar mensagens
configure-email-smtpHostLabel = Servidor SMTP
configure-email-smtpHostDescription = (ex. smtp.sendgrid.net)
configure-email-smtpPortLabel = Porta SMTP
configure-email-smtpPortDescription = (ex. 25)
configure-email-smtpTLSLabel = TLS
configure-email-smtpAuthenticationLabel = Autenticação SMTP
configure-email-smtpCredentialsHeader = Credenciais de e-mail
configure-email-smtpUsernameLabel = Nome de utilizador
configure-email-smtpPasswordLabel = Palavra-passe
configure-email-send-test = Enviar e-mail de teste

### Authentication

configure-auth-clientID = Client ID
configure-auth-clientSecret = Client Secret
configure-auth-configBoxEnabled = Ativado
configure-auth-targetFilterCoralAdmin = Coral Admin
configure-auth-targetFilterCommentStream = Fluxo de Comentários
configure-auth-redirectURI = URI de redirecionamento
configure-auth-registration = Registo
configure-auth-registrationDescription =
  Permitir que utilizadores que não se registaram antes com esta integração
  de autenticação se registem para uma nova conta.
configure-auth-registrationCheckBox = Permitir registo
configure-auth-pleaseEnableAuthForAdmin =
  Por favor, ative pelo menos uma integração de autenticação para o Coral Admin
configure-auth-confirmNoAuthForCommentStream =
  Nenhuma integração de autenticação foi ativada para o fluxo de comentários.
  Tem a certeza que pretende continuar?

configure-auth-facebook-loginWith = Entrar com Facebook
configure-auth-facebook-toEnableIntegration =
  Para ativar a integração com o Facebook Authentication,
  precisa criar e configurar uma aplicação web.
  Para mais detalhes, visite: <link></link>.
configure-auth-facebook-useLoginOn = Usar início de sessão com o Facebook ligado


configure-auth-google-loginWith = Entrar com Google
configure-auth-google-toEnableIntegration =
  Para ativar a integração com o Google Authentication precisa
  criar e configurar uma aplicação web. Para mais detalhes, visite:
  <link></link>.
configure-auth-google-useLoginOn = Usar início de sessão com o Google ligado

configure-auth-sso-loginWith = Entrar com Single Sign On
configure-auth-sso-useLoginOn = Usar início de sessão com Single Sign On ligado
configure-auth-sso-key = Chave
configure-auth-sso-regenerate = Regenerar
configure-auth-sso-regenerateAt = CHAVE GERADA EM:
  { DATETIME($date, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric") }
configure-auth-sso-regenerateHonoredWarning =
  Ao regenerar uma chave, os tokens assinados com a chave anterior serão respeitados durante 30 dias.

configure-auth-sso-description =
  Para ativar a integração com o seu sistema de autenticação existente,
  precisará criar um token JWT para se ligar. Pode saber
  mais sobre como criar um token JWT com <IntroLink>esta introdução</IntroLink>. Consulte a nossa
  <DocLink>documentação</DocLink> para obter informações adicionais sobre início de sessão único.

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

configure-auth-sso-rotate-status = Estado
configure-auth-sso-rotate-statusActive = Ativo
configure-auth-sso-rotate-statusExpiring = A expirar
configure-auth-sso-rotate-statusExpired = Expirado
configure-auth-sso-rotate-statusUnknown = Desconhecido

configure-auth-sso-rotate-expiringTooltip =
  Uma chave SSO está a expirar quando está agendada para rotação.
configure-auth-sso-rotate-expiringTooltip-toggleButton =
  .aria-label = Alternar visibilidade da dica de a expirar
configure-auth-sso-rotate-expiredTooltip =
  Uma chave SSO expira quando é rodada por falta de uso.
configure-auth-sso-rotate-expiredTooltip-toggleButton =
  Alternar visibilidade da dica de expirado

configure-auth-sso-rotate-rotate = Rodar
configure-auth-sso-rotate-deactivateNow = Desativar Agora
configure-auth-sso-rotate-delete = Eliminar

configure-auth-sso-rotate-now = Agora
configure-auth-sso-rotate-10seconds = 10 segundos a partir de agora
configure-auth-sso-rotate-1day = 1 dia a partir de agora
configure-auth-sso-rotate-1week = 1 semana a partir de agora
configure-auth-sso-rotate-30days = 30 dias a partir de agora
configure-auth-sso-rotate-dropdown-description =
  .description = Uma lista suspensa para rodar a chave SSO

configure-auth-local-loginWith = Entrar com autenticação via E-mail
configure-auth-local-useLoginOn = Usar início de sessão com autenticação via e-mail ligado
configure-auth-local-forceAdminLocalAuth =
  A autenticação local do administrador foi ativada permanentemente.
  Isto é para garantir que as equipas que utilizam o serviço do Coral possam aceder ao painel de administração.

configure-auth-oidc-loginWith = Iniciar sessão com OpenID Connect
configure-auth-oidc-toLearnMore = Saber mais: <link></link>
configure-auth-oidc-providerName = Nome do Fornecedor
configure-auth-oidc-providerNameDescription =
  O fornecedor da integração do OpenID Connect. Isto será utilizado quando o nome do fornecedor
  precisar de ser exibido, por exemplo "Iniciar sessão com &lt;Facebook&gt;".
configure-auth-oidc-issuer = Emissor
configure-auth-oidc-issuerDescription =
  Depois de introduzir as informações do emissor, clique no botão Descobrir para que o Coral mostre
  os campos restantes. Também pode introduzir as informações manualmente.
configure-auth-oidc-authorizationURL = URL de Autorização
configure-auth-oidc-tokenURL = Token URL
configure-auth-oidc-jwksURI = JWKS URI
configure-auth-oidc-useLoginOn = Usar início de sessão com OpenID Connect ligado

configure-auth-settings = Definições da sessão
configure-auth-settings-session-duration-label = Duração da sessão

### Moderation

### Recent Comment History

configure-moderation-recentCommentHistory-title = Histórico recente de comentários
configure-moderation-recentCommentHistory-timeFrame = Período recente do histórico de comentários
configure-moderation-recentCommentHistory-timeFrame-description =
  Período de tempo em que a taxa de rejeição de um comentador é calculada e os comentários enviados são contados.
configure-moderation-recentCommentHistory-enabled = Filtro de histórico recente de comentários
configure-moderation-recentCommentHistory-enabled-description =
  Impede os infratores de publicar repetidamente comentários sem aprovação.
  Após a taxa de rejeição de um comentador ultrapassar o limite definido
  abaixo, os comentários enviados seguintes são <strong>enviados para Pendente para
  aprovação do moderador.</strong> O filtro é removido quando a taxa de rejeição normaliza novamente.
configure-moderation-recentCommentHistory-triggerRejectionRate = Limite da taxa de rejeição
configure-moderation-recentCommentHistory-triggerRejectionRate-description =
  Calculado pela divisão do número de comentários rejeitados pela soma
  dos comentários rejeitados e publicados do comentador, dentro do período recente
  do histórico de comentários (não inclui comentários pendentes por toxicidade, spam ou pré-moderação.)

#### External links for moderators
configure-moderation-externalLinks-title = Links externos para moderadores
configure-moderation-externalLinks-profile-explanation = Quando um formato de URL é incluído
   abaixo, os links de perfil externos são adicionados à pasta do utilizador dentro da interface
   de moderação. Pode usar o formato $USER_NAME para inserir o nome de utilizador ou $USER_ID
   para inserir o número de identificação único do utilizador.
configure-moderation-externalLinks-profile-label = Padrão de URL do perfil externo
configure-moderation-externalLinks-profile-input =
  .placeholder = https://example.com/users/$USER_NAME

#### Pre-Moderation
configure-moderation-preModeration-title = Pré-moderação
configure-moderation-preModeration-explanation =
  Quando a pré-moderação está ativada, os comentários não serão publicados, a menos que sejam
  aprovados por um moderador.
configure-moderation-preModeration-moderation =
  Pré-moderar todos os comentários em todo o site
configure-moderation-preModeration-premodLinksEnable =
  Pré-moderar comentários que contenham links em todo o site

#### Moderation all/specific sites options
configure-moderation-specificSites = Sites específicos
configure-moderation-allSites = Todos os sites

configure-moderation-apiKey = API Key

configure-moderation-akismet-title = Filtro de Deteção de Spam Akismet
configure-moderation-akismet-explanation =
  O filtro da API Akismet avisa os utilizadores quando um comentário é determinado como sendo
  provável spam. Os comentários que a Akismet considera spam não serão publicados
  e são colocados na fila pendente para revisão por um moderador.
  Se aprovado por um moderador, o comentário será publicado.

configure-moderation-premModeration-premodSuspectWordsEnable =
  Pré-moderar comentários contendo Palavras Suspeitas
configure-moderation-premModeration-premodSuspectWordsDescription =
  Pode ver e editar a Lista de Palavras Suspeitas <wordListLink>aqui</wordListLink>

#### Akismet
configure-moderation-akismet-filter = Filtro de Deteção de Spam
configure-moderation-akismet-ipBased = Deteção de spam baseada em IP
configure-moderation-akismet-accountNote =
  Nota: Deve adicionar o(s) seu(s) domínio(s) ativo(s)
  na sua conta Akismet: <externalLink>https://akismet.com/account/</externalLink>
configure-moderation-akismet-siteURL = URL do site


#### Perspective
configure-moderation-perspective-title = Filtro de Comentários Tóxicos Perspective API
configure-moderation-perspective-explanation =
  Usando a Perspective API, o filtro de comentários tóxicos avisa os utilizadores
  quando os comentários excedem o limite de toxicidade predefinido.
  Os comentários com uma pontuação de toxicidade acima do limite
  <strong>não serão publicados</strong> e serão colocados na
  <strong>fila pendente para revisão por um moderador</strong>.
  Se aprovado por um moderador, o comentário será publicado.
configure-moderation-perspective-filter = Filtro de Comentários Tóxicos
configure-moderation-perspective-toxicityThreshold = Limite de toxicidade
configure-moderation-perspective-toxicityThresholdDescription =
  Este valor pode ser definido como uma percentagem entre 0 e 100. Este número representa a probabilidade de
  o comentário ser tóxico, de acordo com a API do Perspective. Por defeito, o limite é definido como { $default } (Disponível apenas para o idioma inglês).
configure-moderation-perspective-toxicityModel = Modelo de toxicidade
configure-moderation-perspective-toxicityModelDescription =
  Escolha o seu modelo de perspetiva. O padrão é { $default }.
  Pode encontrar mais informações sobre os modelos <externalLink>aqui</externalLink>.
configure-moderation-perspective-allowStoreCommentData = Permitir que o Google armazene dados de comentários
configure-moderation-perspective-allowStoreCommentDataDescription =
  Os comentários armazenados serão utilizados para futuras investigações e construção de modelos
  para melhorar a API ao longo do tempo
configure-moderation-perspective-allowSendFeedback =
  Permitir que o Coral envie ações moderadas ao Google
configure-moderation-perspective-allowSendFeedbackDescription =
  As ações moderadas enviadas serão utilizadas para futuras investigações e com propósito de criação de modelo
   comunitário para melhorar a API ao longo do tempo.
configure-moderation-perspective-customEndpoint = Personalizar Endpoint
configure-moderation-perspective-defaultEndpoint =
  Por defeito o endpoint está definido como { $default }. Pode substituí-lo aqui
configure-moderation-perspective-accountNote =
  Para obter informações adicionais sobre como configurar o filtro de comentários tóxicos da Perspective API, visite:
  <externalLink>https://github.com/conversationai/perspectiveapi#readme</externalLink>

configure-moderation-newCommenters-title = Aprovação de novos comentadores
configure-moderation-newCommenters-enable = Ativar aprovação de novos comentadores
configure-moderation-newCommenters-description =
  Quando isto estiver ativo, os comentários iniciais de um novo comentador
  serão enviados para Pendente para aprovação do moderador antes da publicação.
configure-moderation-newCommenters-enable-description = Ativar pré-moderação para novos comentadores
configure-moderation-newCommenters-approvedCommentsThreshold = Número de comentários a aprovar
configure-moderation-newCommenters-approvedCommentsThreshold-description =
  A quantidade de comentários aprovados para que os comentários sejam aprovados automaticamente sem necessidade de pré-moderação.
configure-moderation-newCommenters-comments = comentários

#### Unmoderated counts
configure-moderation-unmoderatedCounts-title = Contagem de comentários não moderados
configure-moderation-unmoderatedCounts-enabled = Mostrar o número de comentários não moderados na fila

#### Email domain

configure-moderation-emailDomains-header = Domínio de e-mail
configure-moderation-emailDomains-description = Crie regras para tomar ações em contas ou comentários com base no domínio do endereço de e-mail do titular da conta.
configure-moderation-emailDomains-add = Adicionar domínio de e-mail
configure-moderation-emailDomains-edit = Editar domínio de e-mail
configure-moderation-emailDomains-addDomain = <icon></icon> Adicionar domínio
configure-moderation-emailDomains-table-domain = Domínio
configure-moderation-emailDomains-table-action = Ação
configure-moderation-emailDomains-table-edit = <icon></icon> Editar
configure-moderation-emailDomains-table-delete = <icon></icon> Eliminar
configure-moderation-emailDomains-form-label-domain = Domínio
configure-moderation-emailDomains-form-label-moderationAction = Ação de moderação
configure-moderation-emailDomains-banAllUsers = Banir todas as novas contas de comentários
configure-moderation-emailDomains-alwaysPremod = Sempre pré-moderar comentários
configure-moderation-emailDomains-form-cancel = Cancelar
configure-moderation-emailDomains-form-addDomain = Adicionar domínio
configure-moderation-emailDomains-form-editDomain = Atualizar
configure-moderation-emailDomains-confirmDelete = A eliminação deste domínio de e-mail impedirá que novas contas criadas com ele sejam banidas ou sempre pré-moderadas. Tem a certeza de que pretende continuar?
configure-moderation-emailDomains-form-description-add = Adicione um domínio e selecione a ação a tomar em cada nova conta criada usando o domínio especificado.
configure-moderation-emailDomains-form-description-edit = Atualize o domínio ou ação a tomar em cada nova conta usando o domínio especificado.
configure-moderation-emailDomains-exceptions-header = Exceções
configure-moderation-emailDomains-exceptions-helperText = Estes domínios não podem ser banidos. Os domínios devem ser escritos sem www, por exemplo, "gmail.com". Separe os domínios com uma vírgula e um espaço.
configure-moderation-emailDomains-exceptions-ban-premod-helperText = Estes domínios não podem ser banidos nem pré-moderados. Os domínios devem ser escritos sem www, por exemplo, "gmail.com". Separe os domínios com uma vírgula e um espaço.

configure-moderation-emailDomains-showCurrent = Mostrar lista atual de domínios
configure-moderation-emailDomains-hideCurrent = Ocultar lista atual de domínios
configure-moderation-emailDomains-filterByStatus =
  .aria-label = Filtrar por estado do domínio de e-mail
configuration-moderation-emailDomains-empty = Não há domínios de e-mail configurados.

configure-moderation-emailDomains-allDomains = Todos os domínios
configure-moderation-emailDomains-preMod = Pré-mod
configure-moderation-emailDomains-banned = Banido

configure-moderation-emailDomains-disposableEmailDomains-enabled = Domínios de e-mail descartáveis
configure-moderation-emailDomains-disposableEmailDomains-helper-text = Se um novo utilizador se registar com um endereço de e-mail descartável, defina o seu estado para "sempre pré-moderar comentários". Contas com endereços de e-mail descartáveis podem ter uma alta correlação com spam/trolls.
configure-moderation-emailDomains-disposableEmailDomains-updating = A atualizar
configure-moderation-emailDomains-disposableEmailDomains-update-button = Atualizar domínios descartáveis
configure-moderation-emailDomains-disposableEmailDomains-list-linkText = disposable-email-domains
configure-moderation-emailDomains-disposableEmailDomains-update-button-helper-text = Os domínios de e-mail provêm da lista <link></link>, que é atualizada regularmente. Use o botão abaixo para importar a lista mais recente.


#### Pre-moderate  Email Address Configuration

configure-moderation-premoderateEmailAddress-title = Endereço de e-mail
configure-moderation-premoderateEmailAddress-enabled =
   Pré-moderação de e-mails com muitos pontos
configure-moderation-premoderateEmailAddress-enabled-description =
  Se um utilizador tiver três ou mais pontos na primeira parte do seu endereço
  de e-mail (antes do @), defina o seu estado para pré-moderação de comentários.
   E-mails com 3 ou mais pontos podem ter uma correlação muito alta com spam.
   Pode ser útil pré-moderá-los de forma proativa.
configure-moderation-premoderateEmailAliases-enabled =
  Pré-moderar aliases de e-mail
configure-moderation-premoderateEmailAliases-enabled-description =
configure-moderation-premoderateEmailAliases-enabled-description-ifThePreviousAccountWas =
  Se um utilizador criar uma nova conta com um endereço de e-mail que é
  um alias (usando o sinal +) de uma conta existente, defina o seu estado para
  pré-moderação de comentários. Se a conta anterior foi banida, a nova conta
  também será banida. Aliases de e-mail são frequentemente usados por spammers
  e trolls para contornar banimentos.


#### Banned Words Configuration
configure-wordList-banned-bannedWordsAndPhrases = Palavras e Frases Banidas
configure-wordList-banned-explanation =
  Os comentários que contenham uma palavra ou frase na lista de palavras banidas são <strong>rejeitados automaticamente e não são publicados</strong>.
configure-wordList-banned-wordList = Lista de palavras banidas
configure-wordList-banned-wordListDetailInstructions =
  Separe palavras e frases banidas com uma nova linha. Palavras/frases não são sensíveis a maiúsculas ou minúsculas.


### Advanced
configure-advanced-customCSS = CSS personalizado
configure-advanced-customCSS-override =
  URL de uma folha de estilos CSS que substituirá os estilos padrão do Embed Stream.
configure-advanced-customCSS-stylesheetURL = URL da folha de estilos CSS personalizada
configure-advanced-customCSS-fontsStylesheetURL = URL da folha de estilos CSS personalizada para Tipos de letra
configure-advanced-customCSS-containsFontFace =
  URL para uma folha de estilos CSS personalizada que contém todas as definições de @font-face necessárias
  pela folha de estilos acima.

configure-advanced-embeddedComments = Comentários incorporados
configure-advanced-embeddedComments-subheader =  Para sites que utilizam oEmbed
configure-advanced-embeddedCommentReplies-explanation = Quando ativado, um botão de resposta
  aparecerá com cada comentário incorporado para incentivar discussões adicionais sobre esse comentário
   ou história específica.
configure-advanced-embeddedCommentReplies-label = Permitir respostas a comentários incorporados

configure-advanced-oembedAllowedOrigins-header = Domínios permitidos pelo oEmbed
configure-advanced-oembedAllowedOrigins-description = Domínios com permissão para fazer chamadas à API oEmbed (ex. http://localhost:3000, https://staging.domain.com, https://domain.com).
configure-advanced-oembedAllowedOrigins-label = Domínios permitidos pelo oEmbed



#### Suspect Words Configuration
configure-wordList-suspect-bannedWordsAndPhrases = Palavras e Frases Suspeitas
configure-wordList-suspect-explanation =
  Os comentários que contenham uma palavra ou frase na Lista de Palavras Suspeitas
  são <strong>colocados na Fila de Denunciados para revisão de moderadores e são
  publicados (se os comentários não forem pré-moderados).</strong>
configure-wordList-suspect-explanationSuspectWordsList =
  Os comentários que contenham uma palavra ou frase na Lista de Palavras Suspeitas são
  <strong>enviados para a fila Pendente para revisão do moderador e não são
  publicados a menos que o moderador aprove.</strong>
configure-wordList-suspect-wordList = Lista de Palavras Suspeitas
configure-wordList-suspect-wordListDetailInstructions =
  Separe palavras e frases suspeitas com uma nova linha. Palavras/frases não são sensíveis a maiúsculas ou minúsculas.

### Advanced
configure-advanced-customCSS = CSS Personalizado
configure-advanced-customCSS-override =
  URL de uma folha de estilos CSS que substituirá o estilo padrão dos fluxos de comentários das páginas.

configure-advanced-permittedDomains = Domínios Permitidos
configure-advanced-permittedDomains-description =
  Domínios onde a sua instância de { -product-name } pode ser incorporada,
  incluindo o protocolo (ex. http://localhost:3000, https://staging.domain.com,
  https://domain.com).

configure-advanced-liveUpdates = Atualizações em tempo real do Fluxo de comentários
configure-advanced-liveUpdates-explanation =
  Quando ativado, permitirá o carregamento e atualização em tempo real dos comentários.
  Quando desativado, os utilizadores terão de atualizar a página para ver novos comentários.

configure-advanced-embedCode-title = Incorporar
configure-advanced-embedCode-explanation =
  Copie e cole o código abaixo no seu CMS para incorporar fluxos de comentários do Coral em
  cada uma das histórias do seu site.

configure-advanced-embedCode-comment =
  Descomente estas linhas e substitua pelo ID da
  história e o URL do seu CMS
  Substitua estas linhas pelo ID e URL da história do seu CMS para fornecer a maior integração.
  Consulte a nossa documentação em https://docs.coralproject.net para todas as
  opções de configuração.

configure-advanced-amp = Accelerated Mobile Pages
configure-advanced-amp-explanation =
  Ative o suporte para <LinkToAMP>(AMP)</LinkToAMP> no fluxo de comentários.
  Uma vez ativado, precisará de adicionar o código de incorporação AMP do Coral ao modelo da sua página.
  Consulte a nossa <LinkToDocs>documentação</LinkToDocs> para mais detalhes. Ativar Suporte.

configure-advanced-for-review-queue = Rever todos os relatórios de utilizadores
configure-advanced-for-review-queue-explanation =
  Depois de um comentário ser aprovado, não aparecerá novamente na fila de relatórios,
  mesmo que outros utilizadores o denunciem. Esta funcionalidade adiciona uma fila "Para revisão",
  permitindo que os moderadores vejam todos os relatórios de utilizadores no sistema e os marquem manualmente como "Revisto".
configure-advanced-for-review-queue-label = Mostrar fila "Para revisão"


## Decision History
decisionHistory-popover =
  .description = Uma caixa de diálogo que mostra o histórico de decisões
decisionHistory-youWillSeeAList =
  Verá uma lista das suas ações de moderação de publicações aqui.
decisionHistory-showMoreButton =
  Mostrar mais
decisionHistory-yourDecisionHistory = O Seu Histórico de Decisões
decisionHistory-rejectedCommentBy = Comentário Rejeitado por <username></username>
decisionHistory-approvedCommentBy = Comentário Aceite por <username></username>
decisionHistory-goToComment = Ir para o comentário

### Slack

configure-slack-header-title = Integração com o Slack
configure-slack-description =
  Envia automaticamente os comentários da fila de moderação do Coral para canais do Slack.
  Precisa de acesso admin do Slack para realizar esta configuração. Para os passos de
  como criar uma app no Slack, consulte a nossa <externalLink>documentação</externalLink>.
configure-slack-notRecommended =
  Não recomendado para sites com mais de 10 mil comentários por mês.
configure-slack-addChannel = Adicionar Canal

configure-slack-channel-defaultName = Novo canal
configure-slack-channel-enabled = Ativado
configure-slack-channel-remove = Remover Canal
configure-slack-channel-name-label = Nome
configure-slack-channel-name-description =
  Isto é apenas para sua informação, para identificar facilmente
  cada ligação Slack. O Slack não nos indica o nome
  dos canais a que se está a ligar ao Coral.
configure-slack-channel-hookURL-label = Webhook URL
configure-slack-channel-hookURL-description =
  O Slack fornece um URL específico do canal para ativar as ligações com o webhook.
  Para encontrar o URL de um dos seus canais do Slack,
  siga as instruções <externalLink>aqui</externalLink>.
configure-slack-channel-triggers-label =
  Receber notificações neste canal do Slack para
configure-slack-channel-triggers-reportedComments = Comentários Denunciados
configure-slack-channel-triggers-pendingComments = Comentários Pendentes
configure-slack-channel-triggers-featuredComments = Comentários Destacados
configure-slack-channel-triggers-allComments = Todos os Comentários
configure-slack-channel-triggers-staffComments = Comentários de Staff

## moderate
moderate-navigation-reported = denunciado
moderate-navigation-pending = Pendente
moderate-navigation-unmoderated = não moderado
moderate-navigation-approved = Aprovado
moderate-navigation-rejected = rejeitado
moderate-navigation-comment-count = { SHORT_NUMBER($count) }
moderate-navigation-forReview = para revisão

moderate-marker-preMod = Pré-Moderado
moderate-marker-link = Link
moderate-marker-bannedWord = Palavra Banida
moderate-marker-bio = Biografia
moderate-marker-illegal = Conteúdo possivelmente ilegal
moderate-marker-possibleBannedWord = Possível Palavra Banida
moderate-marker-suspectWord = Palavra Suspeita
moderate-marker-possibleSuspectWord = Possível Palavra Suspeita
moderate-marker-spam = Spam
moderate-marker-spamDetected = Spam detetado
moderate-marker-toxic = Tóxico
moderate-marker-recentHistory = Histórico recente
moderate-marker-bodyCount = Tamanho do conteúdo
moderate-marker-offensive = Ofensivo
moderate-marker-abusive = Abusivo
moderate-marker-newCommenter = Novo comentador
moderate-marker-repeatPost = Comentário repetido
moderate-marker-other = Outro
moderate-marker-preMod-userEmail = E-mail do utilizador

moderate-markers-details = Detalhes
moderate-flagDetails-latestReports = Últimas denúncias
moderate-flagDetails-offensive = Ofensivo
moderate-flagDetails-abusive = Abusivo
moderate-flagDetails-spam = Spam
moderate-flagDetails-bio = Biografia
moderate-flagDetails-other = Outro
moderate-flagDetails-illegalContent = Conteúdo possivelmente ilegal
moderate-flagDetails-viewDSAReport = Ver relatório DSA

moderate-card-flag-details-anonymousUser = Utilizador anónimo

moderate-flagDetails-toxicityScore = Pontuação de toxicidade
moderate-toxicityLabel-likely = Provável <score></score>
moderate-toxicityLabel-unlikely = Improvável <score></score>
moderate-toxicityLabel-maybe = Talvez <score></score>

moderate-linkDetails-label = Copiar o link deste comentário
moderate-in-stream-link-copy = No fluxo
moderate-in-moderation-link-copy = Na moderação

moderate-decisionDetails-decisionLabel = Decisão
moderate-decisionDetails-rejected = Rejeitado
moderate-decisionDetails-reasonLabel = Motivo
moderate-decisionDetails-lawBrokenLabel = Política violada
moderate-decisionDetails-customReasonLabel = Motivo personalizado
moderate-decisionDetails-detailedExplanationLabel = Explicação detalhada

moderate-emptyQueue-pending = Muito bem! Não há mais comentários pendentes para moderar.
moderate-emptyQueue-reported = Muito bem! Não há mais comentários denunciados para moderar.
moderate-emptyQueue-unmoderated = Muito bem! Todos os comentários foram moderados.
moderate-emptyQueue-rejected = Não há comentários rejeitados.
moderate-emptyQueue-approved = Não há comentários aprovados.

moderate-comment-edited = (editado)
moderate-comment-inReplyTo = Responder a <username><username>
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
moderate-comment-play-gif = Executar GIF
moderate-comment-load-video = Carregar vídeo

moderate-single-goToModerationQueues = Ir para a fila de moderação
moderate-single-singleCommentView = Vista individual de comentários

moderate-queue-viewNew =
  { $count ->
    [1] Ver {$count} novo comentário
    *[other] Ver {$count} novos comentários
  }

moderate-comment-deleted-body =
  Este comentário já não está disponível. O comentador eliminou a conta.

### Moderate Search Bar
moderate-searchBar-allStories = Todas as histórias
  .title = Todas as histórias
moderate-searchBar-noStories = Não encontrámos nenhuma história que corresponda à sua pesquisa.
moderate-searchBar-stories = Histórias:
moderate-searchBar-searchButton = Pesquisar
moderate-searchBar-titleNotAvailable =
  .title = Título não disponível
moderate-searchBar-comboBox =
  .aria-label = Pesquisar ou ir para a história
moderate-searchBar-searchForm =
  .aria-label = Histórias
moderate-searchBar-currentlyModerating =
  .title = A moderar atualmente
moderate-searchBar-searchResults = Resultados da pesquisa
moderate-searchBar-searchResultsMostRecentFirst = Resultados da pesquisa (Mais recentes primeiro)
moderate-searchBar-searchResultsMostRelevantFirst = Resultados da pesquisa (Mais relevantes primeiro)
moderate-searchBar-moderateAllStories = Moderar todas as histórias
moderate-searchBar-comboBoxTextField =
  .aria-label = Pesquisar ou ir para a história....
  .placeholder = Use aspas em torno de cada termo de pesquisa (por exemplo, "equipa", "St. Louis")
moderate-searchBar-goTo = Ir para
moderate-searchBar-seeAllResults = Ver todos os resultados

moderateCardDetails-tab-info = Informações
moderateCardDetails-tab-decision = Decisão
moderateCardDetails-tab-edits = Editar história
moderateCardDetails-tab-automatedActions = Ações automatizadas
moderateCardDetails-tab-reactions = Reações
moderateCardDetails-tab-reactions-loadMore = Carregar mais
moderateCardDetails-tab-noIssuesFound = Nenhum problema encontrado
moderateCardDetails-tab-missingPhase = Não foi executado

moderateCardDetails-tab-externalMod-status = Estado
moderateCardDetails-tab-externalMod-flags = Flags
moderateCardDetails-tab-externalMod-tags = Tags

moderateCardDetails-tab-externalMod-none = Nenhum
moderateCardDetails-tab-externalMod-approved = Aprovado
moderateCardDetails-tab-externalMod-rejected = Rejeitado
moderateCardDetails-tab-externalMod-premod = Pré-moderado
moderateCardDetails-tab-externalMod-systemWithheld = Sistema retido

### Moderate User History Drawer

moderate-user-drawer-email =
  .title = Endereço de e-mail
moderate-user-drawer-created-at =
  .title = Data de criação da conta
moderate-user-drawer-member-id =
  .title = ID do membro
moderate-user-drawer-external-profile-URL =
  .title = URL do perfil externo
moderate-user-drawer-external-profile-URL-link = URL do perfil externo
moderate-user-drawer-tab-all-comments = Todos os comentários
moderate-user-drawer-tab-rejected-comments = Rejeitados
moderate-user-drawer-tab-account-history = Histórico da Conta
moderate-user-drawer-tab-notes = Notas
moderate-user-drawer-load-more = Carregar mais
moderate-user-drawer-all-no-comments = {$username} não enviou comentários.
moderate-user-drawer-rejected-no-comments = {$username} não tem comentários rejeitados.
moderate-user-drawer-user-not-found = Utilizador não encontrado.
moderate-user-drawer-status-label = Estado:
moderate-user-drawer-bio-title = Biografia dos utilizadores
moderate-user-drawer-username-not-available = Nome de utilizador indisponível
moderate-user-drawer-username-not-available-tooltip-title = Nome de utilizador indisponível
moderate-user-drawer-username-not-available-tooltip-body = O utilizador não completou o processo de criação de conta

moderate-user-drawer-account-history-system = <icon></icon> Sistema
moderate-user-drawer-account-history-suspension-ended = Suspensão terminada
moderate-user-drawer-account-history-suspension-removed = Suspensão removida
moderate-user-drawer-account-history-banned = Banido
moderate-user-drawer-account-history-account-domain-banned = Domínio da conta banido
moderate-user-drawer-account-history-account-domain-or-alias-banned = Domínio ou alias da conta banido
moderate-user-drawer-account-history-ban-removed = Banimento removido
moderate-user-drawer-account-history-site-banned = Site banido
moderate-user-drawer-account-history-site-ban-removed = Banimento do site removido
moderate-user-drawer-account-history-no-history = Nenhuma ação foi realizada nesta conta
moderate-user-drawer-username-change = Nome de utilizador alterado
moderate-user-drawer-username-change-new = Novo:
moderate-user-drawer-username-change-old = Anterior:

moderate-user-drawer-account-history-premod-set = Sempre pré-moderado
moderate-user-drawer-account-history-premod-removed = Pré-moderação removida

moderate-user-drawer-account-history-modMessage-sent = Mensagem do utilizador
moderate-user-drawer-account-history-modMessage-acknowledged = Mensagem reconhecida a { $acknowledgedAt }

moderate-user-drawer-newCommenter = Novo comentador

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

moderate-user-drawer-deleteAccount-popover =
  .description = Um menu suspenso para eliminar a conta de um utilizador
moderate-user-drawer-deleteAccount-button =
  .aria-label = Eliminar conta
moderate-user-drawer-deleteAccount-popover-confirm = Digite "{ $text }" para confirmar
moderate-user-drawer-deleteAccount-popover-title = Eliminar conta
moderate-user-drawer-deleteAccount-popover-username = Nome de utilizador
moderate-user-drawer-deleteAccount-popover-header-description = Eliminar a conta irá
moderate-user-drawer-deleteAccount-popover-description-list-removeComments = Remover todos os comentários escritos por este utilizador da base de dados.
moderate-user-drawer-deleteAccount-popover-description-list-deleteAll = Eliminar todos os registos desta conta. O
  utilizador poderá então criar uma nova conta usando o mesmo endereço de e-mail. Se pretender banir este utilizador em vez disso e
  manter o seu histórico, prima "CANCELAR" e use o menu suspenso de estado abaixo do nome de utilizador.
moderate-user-drawer-deleteAccount-popover-callout = Isto remove todos os registos deste utilizador
moderate-user-drawer-deleteAccount-popover-timeframe =  Isto entrará em vigor em 24 horas.
moderate-user-drawer-deleteAccount-popover-cancelButton = Cancelar
moderate-user-drawer-deleteAccount-popover-deleteButton = Eliminar

moderate-user-drawer-deleteAccount-scheduled-callout = Eliminação de utilizador ativada
moderate-user-drawer-deleteAccount-scheduled-timeframe = Isto ocorrerá em { $deletionDate }.
moderate-user-drawer-deleteAccount-scheduled-cancelDeletion = Cancelar eliminação de utilizador

moderate-user-drawer-user-scheduled-deletion = Utilizador agendado para eliminação
moderate-user-drawer-user-deletion-canceled = Pedido de eliminação de utilizador cancelado

moderate-user-drawer-account-history-deletion-scheduled = Eliminação agendada para { $createdAt }
moderate-user-drawer-account-history-canceled-at = Cancelado em { $createdAt }
moderate-user-drawer-account-history-updated-at = Atualizado em { $createdAt }


moderate-user-drawer-recent-history-title = Histórico recente de comentários
moderate-user-drawer-recent-history-calculated =
  Calculado nos últimos  { framework-timeago-time }
moderate-user-drawer-recent-history-rejected = Rejeitado
moderate-user-drawer-recent-history-tooltip-title = Como é calculado?
moderate-user-drawer-recent-history-tooltip-body =
  Comentários rejeitados ÷ (comentários rejeitados + comentários publicados).
  O limite pode ser alterado por um administrador em Configurações -> Moderação.
moderate-user-drawer-recent-history-tooltip-button =
  .aria-label = Alternar dica do histórico de comentários recentes
moderate-user-drawer-recent-history-tooltip-submitted = Enviado

moderate-user-drawer-notes-field =
  .placeholder = Deixar uma nota...
moderate-user-drawer-notes-button = Adicionar nota
moderatorNote-left-by = Deixado por
moderatorNote-delete = Eliminar

moderate-user-drawer-all-comments-archiveThreshold-allOfThisUsers =
  Todos os comentários deste utilizador dos { $value } { $unit ->
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
  }.

# For Review Queue

moderate-forReview-reviewedButton =
  .aria-label = Revisto
moderate-forReview-markAsReviewedButton =
  .aria-label = Marcar como revisto
moderate-forReview-time = Tempo
moderate-forReview-comment = Comentário
moderate-forReview-reportedBy = Denunciado por
moderate-forReview-reason = Motivo
moderate-forReview-description = Descrição
moderate-forReview-reviewed = Revisto


moderate-forReview-detectedBannedWord = Palavra proibida
moderate-forReview-detectedLinks = Links
moderate-forReview-detectedNewCommenter = Novo comentador
moderate-forReview-detectedPreModUser = Utilizador pré-moderado
moderate-forReview-detectedRecentHistory = Histórico recente
moderate-forReview-detectedRepeatPost = Publicação repetida
moderate-forReview-detectedSpam = Spam
moderate-forReview-detectedSuspectWord = Palavra suspeita
moderate-forReview-detectedToxic = Linguagem tóxica
moderate-forReview-reportedAbusive = Abusivo
moderate-forReview-reportedBio = Biografia do utilizador
moderate-forReview-reportedOffensive = Ofensivo
moderate-forReview-reportedOther = Outro
moderate-forReview-reportedSpam = Spam


# Archive

moderate-archived-queue-title = Esta história foi arquivada
moderate-archived-queue-noModerationActions =
  Não é possível realizar ações de moderação nos comentários quando uma história está arquivada.
moderate-archived-queue-toPerformTheseActions =
  Para realizar estas ações, desarquive a história.


## Community
community-emptyMessage = Não encontrámos ninguém na sua comunidade que corresponda aos seus critérios.

community-filter-searchField =
  .placeholder = Pesquisar por nome de utilizador ou endereço de e-mail ...
  .aria-label = Pesquisar por nome de utilizador ou endereço de e-mail

community-filter-searchButton =
  .aria-label = Pesquisar

community-filter-roleSelectField =
  .aria-label = Pesquisar por Função

community-filter-statusSelectField =
.aria-label = Pesquisar por Estado

community-changeRoleButton =
  .aria-label = Mudar Função

community-assignMySitesToModerator = Atribuir os meus sites
community-removeMySitesFromModerator = Remover os meus sites
community-assignMySitesToMember = Atribuir membro aos meus sites
community-removeMySitesFromMember = Remover membro dos meus sites
community-stillHaveSiteModeratorPrivileges = Ainda terão privilégios de moderador do site para:
community-stillHaveMemberPrivileges = Ainda terão privilégios de membro para:
community-userNoLongerPermitted = O utilizador já não terá permissão para tomar decisões de moderação ou atribuir suspensões em:
community-memberNoLongerPermitted = O utilizador deixará de receber privilégios de Membro em:
community-assignThisUser = Atribuir este utilizador a
community-assignYourSitesTo = Atribuir os seus sites a <strong>{ $username }</strong>
community-siteModeratorsArePermitted = Os moderadores de sites têm permissão para tomar decisões de moderação e emitir suspensões nos sites que lhes são atribuídos.
community-membersArePermitted = Os membros têm permissão para receber um badge nos sites aos quais são atribuídos.
community-removeSiteModeratorPermissions = Remover permissões de moderador do site
community-removeMemberPermissions = Remover permissões de membro

community-filter-optGroupAudience =
  .label = Público
community-filter-optGroupOrganization =
  .label = Organização
community-filter-search = Pesquisar
community-filter-showMe = Mostrar-me
community-filter-allRoles = Todas as Funções
community-filter-allStatuses = Todos os Estados

community-column-username = Nome do Utilizador
community-column-username-not-available = Nome de Utilizador indisponível
community-column-email-not-available = E-mail indisponível
community-column-username-deleted = Eliminado
community-column-email = E-mail
community-column-memberSince = Membro desde
community-column-role = Função
community-column-status = Estado

community-role-popover =
  .description = Um menu suspenso para alterar a função do utilizador

community-siteRoleActions-popover =
  .description = Uma lista para promover/rebaixar um utilizador dos sites

community-userStatus-popover =
  .description = Um menu suspenso para alterar o estado do utilizador

community-userStatus-manageBan = Gerir banimento
community-userStatus-suspendUser = Suspender Utilizador
community-userStatus-suspend = Suspender
community-userStatus-suspendEverywhere = Suspender em todo o lado
community-userStatus-removeSuspension = Remover Suspensão
community-userStatus-removeUserSuspension = Remover Suspensão
community-userStatus-unknown = Desconhecido
community-userStatus-changeButton =
  .aria-label = Mudar estado do utilizador
community-userStatus-premodUser = Sempre pré-moderado
community-userStatus-removePremod = Remover pré-moderação

community-banModal-allSites-title = Tem a certeza de que pretende banir <username></username>?
community-banModal-banEmailDomain-title = Banir domínio de e-mail
community-banModal-banEmailDomain = Banir todas as contas de comentadores de { $domain }
community-banModal-banEmailDomain-callOut = Isto impedirá que qualquer comentador utilize este domínio de e-mail
community-banModal-banEmailDomain-confirmationText = Digite "{ $text }" para confirmar
community-banModal-specificSites-title = Tem a certeza de que pretende gerir o estado de banimento de <username></username>?
community-banModal-noSites-title = Tem a certeza de que pretende desbanir <username></username>?
community-banModal-allSites-consequence =
  Uma vez banido, este utilizador já não poderá comentar, usar
  reações ou denunciar comentários.
community-banModal-noSites-consequence =
  Uma vez desbanido, este utilizador poderá comentar, usar reações e denunciar comentários.
community-banModal-specificSites-consequence =
  Esta ação afetará em que sites o utilizador poderá comentar, usar reações e denunciar comentários.
community-banModal-cancel = Cancelar
community-banModal-updateBan = Guardar
community-banModal-ban = Banir
community-banModal-unban = Desbanir
community-banModal-customize = Personalizar mensagem de e-mail de banimento
community-banModal-reject-existing = Rejeitar todos os comentários feitos pelo utilizador
community-banModal-reject-existing-specificSites = Rejeitar todos os comentários nesses sites
community-banModal-reject-existing-singleSite = Rejeitar todos os comentários deste site

community-banModal-noSites = Nenhum site
community-banModal-banFrom = Banir a partir de
community-banModal-allSites = Todos os sites
community-banModal-specificSites = Sites específicos

community-suspendModal-areYouSure = Banir <strong>{ $username }</strong>?
community-suspendModal-consequence =
  Uma vez banido, este utilizador já não poderá comentar, reagir
  ou denunciar comentários
community-suspendModal-duration-3600 = 1 hora
community-suspendModal-duration-10800 = 3 horas
community-suspendModal-duration-86400 = 24 horas
community-suspendModal-duration-604800 = 7 dias
community-suspendModal-cancel = Cancelar
community-suspendModal-suspendUser = Suspender utilizador
community-suspendModal-emailTemplate =
  Olá { $username },

  De acordo com as orientações da comunidade da { $organizationName }, a sua conta foi temporariamente suspensa. Durante a suspensão, não poderá comentar, denunciar ou interagir com outros comentadores. Por favor tente comentar novamente em { framework-timeago-time }.

community-suspendModal-customize = Personalizar o e-mail de suspensão.

community-suspendModal-success =
  <strong>{ $username }</strong> foi suspenso por <strong>{ $duration }</strong>

community-suspendModal-success-close = Fechar
community-suspendModal-selectDuration = Selecione o período de suspensão.

community-premodModal-areYouSure =
  Tem a certeza que quer sempre pré-moderar <strong>{ $username }</strong>?
community-premodModal-consequence =
  Todos os seus comentários entrarão na fila de Pendente até que remova este estado.
community-premodModal-cancel = Cancelar
community-premodModal-premodUser = Sim, sempre pré-moderar

community-siteRoleModal-assignSites =
  Atribuir sites a <strong>{ $username }</strong>
community-siteRoleModal-assignSitesDescription-siteModerator =
  Os moderadores de sites têm permissão para tomar decisões de moderação e emitir suspensões nos sites que lhes são atribuídos.
community-siteRoleModal-cancel = Cancelar
community-siteRoleModal-update = Atualizar
community-siteRoleModal-selectSites-siteModerator = Selecionar sites para moderar
community-siteRoleModal-selectSites-member = Selecionar sites para este utilizador ser membro
community-siteRoleModal-noSites = Sem sites

community-invite-inviteMember = Convidar membros para a sua organização
community-invite-emailAddressLabel = Endereço de e-mail:
community-invite-inviteMore = Convidar mais
community-invite-inviteAsLabel = Convidar como:
community-invite-sendInvitations = Enviar convites
community-invite-role-staff =
  <strong>Função Staff:</strong> Recebe um badge "Staff", e
  os seus comentários são aprovados automaticamente. Não pode moderar
  nem alterar qualquer configuração do { -product-name }.
community-invite-role-moderator =
  <strong>Função Moderador:</strong> Recebe um badge "Staff", e
  os seus comentários são aprovados automaticamente. Tem privilégios
  totais de moderação (aprovar, rejeitar e destacar comentários).
  Pode configurar artigos individuais, mas não possui privilégios
  de configuração do site.
community-invite-role-admin =
  <strong>Função Admin:</strong> Recebe um badge "Staff", e
  os seus comentários são aprovados automaticamente. Tem privilégios
  totais de moderação (aprovar, rejeitar e destacar comentários).
  Pode configurar artigos individuais e tem privilégios de
  configuração do site.
community-invite-invitationsSent = Os seus convites foram enviados!
community-invite-close = Fechar
community-invite-invite = Convidar

community-warnModal-success =
  Um aviso foi enviado para <strong>{ $username }</strong>.
community-warnModal-success-close = Ok
community-warnModal-areYouSure = Avisar <strong>{ $username }</strong>?
community-warnModal-consequence = Um aviso pode melhorar a conduta de um comentador sem suspensão ou banimento. O utilizador deve reconhecer o aviso antes de continuar a comentar.
community-warnModal-message-label = Mensagem
community-warnModal-message-required = Obrigatório
community-warnModal-message-description = Explique a este utilizador como deve mudar o comportamento no seu site.
community-warnModal-cancel = Cancelar
community-warnModal-warnUser = Avisar utilizador
community-userStatus-warn = Avisar
community-userStatus-warnEverywhere = Avisar em todo o lado
community-userStatus-message = Mensagem

community-modMessageModal-success = Uma mensagem foi enviada para <strong>{ $username }</strong>.
community-modMessageModal-success-close = Ok
community-modMessageModal-areYouSure = Mensagem para <strong>{ $username }</strong>?
community-modMessageModal-consequence = Enviar uma mensagem a um comentador que é visível apenas para ele.
community-modMessageModal-message-label = Mensagem
community-modMessageModal-message-required = Obrigatório
community-modMessageModal-cancel = Cancelar
community-modMessageModal-messageUser = Mensagem ao utilizador

## Stories
stories-emptyMessage = Atualmente não existem histórias publicadas.
stories-noMatchMessage = Não foi possível encontrar nenhuma história que corresponda aos seus critérios.

stories-filter-searchField =
  .placeholder = Pesquisar por título ou autor da história ...
  .aria-label = Pesquisar por título ou autor da história
stories-filter-searchButton =
  .aria-label = Pesquisar

stories-filter-statusSelectField =
  .aria-label = Pesquisar por estado

stories-changeStatusButton =
  .aria-label = Mudar estado

stories-filter-search = Pesquisar
stories-filter-showMe = Mostrar-me
stories-filter-allStories = Todas as histórias
stories-filter-openStories = Histórias abertas
stories-filter-closedStories = Histórias fechadas

stories-column-title = Título
stories-column-author = Autor
stories-column-publishDate = Data de publicação
stories-column-status = Estado
stories-column-clickToModerate = Clique no título para moderar a história
stories-column-reportedCount = Denunciado
stories-column-pendingCount = Pendente
stories-column-publishedCount = Publicado

stories-status-popover =
  .description = Um menu suspenso para alterar o estado da história

storyInfoDrawer-rescrapeTriggered = Acionado
storyInfoDrawer-triggerRescrape = Re-digitalizar Metadados
storyInfoDrawer-title = Detalhes da História
storyInfoDrawer-titleNotAvailable = Título da história não disponível
storyInfoDrawer-authorNotAvailable = Autor não disponível
storyInfoDrawer-publishDateNotAvailable = Data de publicação não disponível
storyInfoDrawer-scrapedMetaData = Metadados digitalizados
storyInfoDrawer-configure = Configurar
storyInfoDrawer-storyStatus-open = Aberto
storyInfoDrawer-storyStatus-closed = Fechado
storyInfoDrawer-moderateStory = Moderar
storyInfoDrawerSettings-premodLinksEnable = Pré-moderar comentários contendo links
storyInfoDrawerSettings-premodCommentsEnable = Pré-moderar todos os comentários
storyInfoDrawerSettings-moderation = Moderação
storyInfoDrawerSettings-moderationMode-pre = Pré
storyInfoDrawerSettings-moderationMode-post = Pós
storyInfoDrawerSettings-update = Atualizar
storyInfoDrawer-storyStatus-archiving = A arquivar
storyInfoDrawer-storyStatus-archived = Arquivado
storyInfoDrawer-cacheStory-recache = Re-colocar história em cache
storyInfoDrawer-cacheStory-recaching = A re-colocar em cache
storyInfoDrawer-cacheStory-cached = Em cache
storyInfoDrawer-cacheStory-uncacheStory = Remover história da cache
storyInfoDrawer-cacheStory-uncaching = A remover da cache

## Invite

invite-youHaveBeenInvited = Foi convidado para se juntar a { $organizationName }
invite-finishSettingUpAccount = Conclua a configuração da conta para:
invite-createAccount = Criar Conta
invite-passwordLabel = Palavra-passe
invite-passwordDescription = Deve ter pelo menos { $minLength } caracteres
invite-passwordTextField =
  .placeholder = Palavra-passe
invite-usernameLabel = Utilizador
invite-usernameDescription = Pode usar "_" e "."
invite-usernameTextField =
  .placeholder = Utilizador
invite-oopsSorry = Oops, Desculpe!
invite-successful = A sua conta foi criada
invite-youMayNowSignIn = Pode iniciar sessão no { -product-name } usando:
invite-goToAdmin = Ir para a administração { -product-name }
invite-goToOrganization = Ir para { $organizationName }
invite-tokenNotFound =
  O link especificado é inválido, verifique se foi copiado corretamente.

userDetails-banned-on = <strong>Banido em </strong> { $timestamp }
userDetails-banned-by = <strong>por</strong> { $username }
userDetails-suspended-by = <strong>Suspenso por</strong> { $username }
userDetails-suspension-start = <strong>Início:</strong> { $timestamp }
userDetails-suspension-end = <strong>Fim:</strong> { $timestamp }

userDetails-warned-on = <strong>Avisado em</strong> { $timestamp }
userDetails-warned-by = <strong>por</strong> { $username }
userDetails-warned-explanation = O utilizador não reconheceu o aviso.

configure-general-reactions-title = Reações
configure-general-reactions-explanation =
  Permita a interação da sua comunidade através de reações expressas
  por meio de um clique. Por defeito, o Coral permite que os comentadores "Respeitem"
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

configure-general-newCommenter-title = Badge de novo comentador
configure-general-newCommenter-explanation = Adicione o badge <icon></icon> aos comentadores que criaram as suas contas nos últimos sete dias.
configure-general-newCommenter-enabled = Ativar badges de novo comentador
configure-general-badges-title = Badge de membros Staff
configure-general-badges-explanation =
  Mostra um badge personalizado para membros staff da sua organização. Este badge
  aparecerá no fluxo de comentários e na interface de administração.
configure-general-badges-label = Texto do badge
configure-general-badges-staff-member-input =
  .placeholder = Ex: Staff
configure-general-badges-preview = Pré-visualização
configure-general-badges-moderator-input =
  .placeholder = Ex: Moderador
configure-general-badges-admin-input =
  .placeholder = Ex: Admin
configure-general-badges-member-input =
  .placeholder = Ex: Membro
configure-general-badges-preview = Pré-visualizar
configure-general-badges-staff-member-label = Texto do badge de membros staff
configure-general-badges-admin-label = Texto do badge de administradores
configure-general-badges-moderator-label = Texto do badge de moderadores
configure-general-badges-member-label = Texto do badge de membro

configure-general-rte-title = Comentários em texto enriquecido
configure-general-rte-express = Dê à sua comunidade mais formas de se expressar além do texto simples com formatação de texto enriquecido.
configure-general-rte-richTextComments = Comentários em texto enriquecido
configure-general-rte-onBasicFeatures = Ativado - negrito, itálico, citações em bloco e listas com marcadores
configure-general-rte-additional = Opções de texto enriquecido adicionais
configure-general-rte-strikethrough = Tachado
configure-general-rte-spoiler = Spoiler
configure-general-rte-spoilerDesc =
  Palavras e frases formatadas como spoiler ficam ocultas atrás de
  um fundo escuro até que o leitor decida revelar o texto.

configure-general-dsaConfig-title = Conjunto de recursos da Lei de Serviços Digitais
configure-general-dsaConfig-description =
  A Lei de Serviços Digitais (DSA) da UE exige que os editores sediados na UE ou direcionados aos cidadãos da UE forneçam determinados recursos para os seus comentadores e moderadores.
  <br/>
  <br/>
  O conjunto de ferramentas DSA do Coral inclui:
  <br/>
  <ul style="padding-inline-start: var(--spacing-5);">
    <li>Um fluxo dedicado para comentários denunciados como ilegais</li>
    <li>Motivos de moderação obrigatórios para cada comentário rejeitado</li>
    <li>Notificações de comentadores para denúncias de comentários ilegais e comentários rejeitados</li>
    <li>Texto obrigatório explicando os métodos de recurso/apelo, se existirem</li>
  </ul>
configure-general-dsaConfig-reportingAndModerationExperience =
  Experiência de denúncia e moderação DSA
configure-general-dsaConfig-methodOfRedress =
  Selecione o seu método de recurso
configure-general-dsaConfig-methodOfRedress-explanation =
  Informe os utilizadores se e como podem recorrer de uma decisão de moderação
configure-general-dsaConfig-methodOfRedress-none = Nenhum
configure-general-dsaConfig-methodOfRedress-email = E-mail
configure-general-dsaConfig-methodOfRedress-email-placeholder = mailto:moderation@example.com
configure-general-dsaConfig-methodOfRedress-url = URL
configure-general-dsaConfig-methodOfRedress-url-placeholder = https://moderation.example.com


configure-account-features-title = Gestão de funcionalidades da conta de comentadores
configure-account-features-explanation =
  Pode ativar ou desativar certas funcionalidades para os seus comentadores
  utilizarem dentro das suas contas. Estas funcionalidades também ajudam na
  conformidade com o RGPD
configure-account-features-allow = Permitir aos utilizadores:
configure-account-features-change-usernames = Alterar os seus nomes de utilizador
configure-account-features-change-usernames-details = O nome de utilizador pode ser alterado uma vez a cada 14 dias.
configure-account-features-yes = Sim
configure-account-features-no = Não
configure-account-features-download-comments = Transferir os seus comentários
configure-account-features-download-comments-details = Os comentadores podem transferir um csv do histórico de comentador
configure-account-features-delete-account = Eliminar as suas contas.
configure-account-features-delete-account-details =
  Remover todos os dados de comentários, nome de utilizador e endereço de e-mail do site e da base de dados

configure-account-features-delete-account-fieldDescriptions =
  Remove todos os seus dados de comentários, nome de utilizador e endereço de e-mail
  do site e da base de dados.

configure-advanced-stories = Criação de histórias
configure-advanced-stories-explanation = Definições avançadas de como as histórias são criadas no Coral.
configure-advanced-stories-lazy = Criação Lazy
configure-advanced-stories-lazy-detail = Permita que as histórias sejam criadas automaticamente quando publicadas no seu CMS.
configure-advanced-stories-scraping = Scraper de histórias
configure-advanced-stories-scraping-detail = Permita que os metadados da história sejam obtidos automaticamente quando publicados a partir do seu CMS.
configure-advanced-stories-proxy = URL do proxy do Scraper
configure-advanced-stories-proxy-detail =
   Quando especificado, permite que os pedidos do scraper utilizem o
   proxy. Todos os pedidos serão passados através do proxy conforme analisado
  pelo pacote <externalLink>npm proxy-agent</externalLink>.
configure-advanced-stories-custom-user-agent = Header de User-Agent personalizado para o Scraper
configure-advanced-stories-custom-user-agent-detail =
  Quando especificado, substitui o header <code>User-Agent</code> enviado com cada
  pedido de scrape.

configure-advanced-stories-authentication = Autenticação
configure-advanced-stories-scrapingCredentialsHeader = Limpar credenciais
configure-advanced-stories-scraping-usernameLabel = Nome de Utilizador
configure-advanced-stories-scraping-passwordLabel = Palavra-passe

commentAuthor-status-banned = Banido
commentAuthor-status-premod = Pré-moderado
commentAuthor-status-suspended = Suspenso

hotkeysModal-title = Atalhos de teclado
hotkeysModal-navigation-shortcuts = Atalhos de navegação
hotkeysModal-shortcuts-next = Próximo comentário
hotkeysModal-shortcuts-prev = Comentário anterior
hotkeysModal-shortcuts-search = Abrir pesquisa
hotkeysModal-shortcuts-jump = Ir para a fila específica
hotkeysModal-shortcuts-switch = Alternar filas
hotkeysModal-shortcuts-toggle = Ativar/desativar ajuda dos atalhos
hotkeysModal-shortcuts-single-view = Vista de comentário individual
hotkeysModal-moderation-decisions = Decisões de moderação
hotkeysModal-shortcuts-approve = Aprovar
hotkeysModal-shortcuts-reject = Rejeitar
hotkeysModal-shortcuts-ban = Banir autor do comentário
hotkeysModal-shortcuts-zen = Alternar vista de comentário individual

authcheck-network-error = Ocorreu um erro de rede. Por favor, atualize a página.

dashboard-heading-last-updated = Última atualização:

dashboard-today-heading = Atividade de hoje
dashboard-today-new-comments = Novos comentários
dashboard-alltime-new-comments = Total de sempre

dashboard-alltime-new-comments-archiveEnabled = { $value } { $unit ->
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
  } total
dashboard-alltime-rejections-archiveEnabled = { $value } { $unit ->
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
  } média
dashboard-today-staffPlus-comments = Staff + comentários
dashboard-alltime-staff-comments-archiveEnabled = { $value } { $unit ->
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
  } total
dashboard-today-rejections = Taxa de rejeição
dashboard-alltime-rejections = Média de sempre
dashboard-alltime-staff-comments = Total de sempre
dashboard-today-signups = Novos membros da comunidade
dashboard-alltime-signups = Total de membros
dashboard-today-bans = Membros banidos
dashboard-alltime-bans = Total de membros banidos

dashboard-top-stories-today-heading = As histórias mais comentadas de hoje
dashboard-top-stories-table-header-story = História
dashboard-top-stories-table-header-comments = Comentários
dashboard-top-stories-no-comments = Sem comentários hoje

dashboard-commenters-activity-heading = Novos membros da comunidade esta semana

dashboard-comment-activity-heading = Atividade de comentários por hora
dashboard-comment-activity-tooltip-comments = Comentários
dashboard-comment-activity-legend = Média dos últimos 3 dias

conversation-modal-conversationOn = Conversa sobre:
conversation-modal-moderateStory = Moderar história
conversation-modal-showMoreParents = Mostrar mais desta conversa
conversation-modal-showReplies = Mostrar respostas
conversation-modal-commentNotFound = Comentário não encontrado.
conversation-modal-showMoreReplies = Mostrar mais respostas
conversation-modal-header-title = Conversa sobre:
conversation-modal-header-moderate-link = Moderar história
conversation-modal-rejectButton = <icon></icon>Rejeitar
  .aria-label = Rejeitar
conversation-modal-rejectButton-rejected = <icon></icon>Rejeitado
  .aria-label = Rejeitado

# DSA Reports tab

reportsTable-column-created = Criado
reportsTable-column-lastUpdated = Última atualização
reportsTable-column-reportedBy = Denunciado por
reportsTable-column-reference = Referência
reportsTable-column-lawBroken = Lei violada
reportsTable-column-commentAuthor = Autor do comentário
reportsTable-column-status = Estado
reportsTable-emptyReports = Não há relatórios DSA para exibir.
reports-sortMenu-newest = Mais recentes
reports-sortMenu-oldest = Mais antigos
reports-sortMenu-sortBy = Ordenar por
reports-table-showClosedReports = Mostrar relatórios fechados
reports-table-showOpenReports = Mostrar relatórios abertos
reports-singleReport-reportsLinkButton = <icon></icon> Todos os Relatórios DSA
reports-singleReport-reportID = ID do Relatório
reports-singleReport-shareButton = <icon></icon> CSV
reports-singleReport-reporter = Denunciante
reports-singleReport-reporterNameNotAvailable = Nome do denunciante não disponível
reports-singleReport-reportDate = Data da denúncia
reports-singleReport-lawBroken = Qual a lei que foi violada?
reports-singleReport-explanation = Explicação
reports-singleReport-comment = Comentário
reports-singleReport-comment-notAvailable = Este comentário não está disponível.
reports-singleReport-comment-deleted = Este comentário já não está disponível. O autor do comentário eliminou a sua conta.
reports-singleReport-comment-edited = (editado)
reports-singleReport-comment-viewCommentStream = Ver comentário no fluxo
reports-singleReport-comment-viewCommentModeration = Ver comentário na moderação
reports-singleReport-comment-rejected = Rejeitado
reports-singleReport-comment-unavailableInStream = Indisponível no fluxo
reports-singleReport-commentOn = Comentar sobre
reports-singleReport-history = Histórico
reports-singleReport-history-reportSubmitted = Denúncia de conteúdo ilegal enviada
reports-singleReport-history-addedNote = { $username } adicionou uma nota
reports-singleReport-history-deleteNoteButton = <icon></icon> Eliminar
reports-singleReport-history-madeDecision-illegal = { $username } tomou uma decisão de que esta denúncia contém conteúdo potencialmente ilegal
reports-singleReport-history-madeDecision-legal = { $username } tomou uma decisão de que esta denúncia não contém conteúdo potencialmente ilegal
reports-singleReport-history-legalGrounds = Fundamentos legais: { $legalGrounds }
reports-singleReport-history-explanation = Explicação: { $explanation }
reports-singleReport-history-changedStatus = { $username } alterou o estado para { $status }
reports-singleReport-reportVoid = O utilizador eliminou a sua conta. A denúncia é inválida.
reports-singleReport-history-sharedReport = { $username } transferiu esta denúncia
reports-singleReport-note-field =
  .placeholder = Adicione a sua nota...
reports-singleReport-addUpdateButton = <icon></icon> Adicionar atualização
reports-singleReport-decisionLabel = Decisão
reports-singleReport-decision-legalGrounds = Fundamentos legais
reports-singleReport-decision-explanation = Explicação detalhada
reports-singleReport-makeDecisionButton = <icon></icon> Decisão
reports-singleReport-decision-doesItContain = Este comentário contém potencialmente conteúdo ilegal?
reports-singleReport-decision-doesItContain-yes = Sim
reports-singleReport-decision-doesItContain-no = Não
reports-status-awaitingReview = A aguardar revisão
reports-status-inReview = Em revisão
reports-status-completed = Concluído
reports-status-void = Inválido
reports-status-unknown = Estado desconhecido
reports-changeStatusModal-prompt-addNote = Adicionou uma nota. Pretende atualizar o estado para Em revisão.
reports-changeStatusModal-prompt-downloadReport = Transferiu a denúncia. Pretende atualizar o estado para Em revisão.
reports-changeStatusModal-prompt-madeDecision = Tomou uma decisão. Pretende atualizar o estado para Concluído.
reports-changeStatusModal-updateButton = Sim, atualizar
reports-changeStatusModal-dontUpdateButton = Não
reports-changeStatusModal-header = Atualizar estado?
reports-decisionModal-header = Decisão da denúncia
reports-decisionModal-prompt = Este comentário parece conter conteúdo potencialmente ilegal?
reports-decisionModal-yes = Sim
reports-decisionModal-no = Não
reports-decisionModal-submit = Enviar
reports-decisionModal-lawBrokenLabel = Lei violada
reports-decisionModal-lawBrokenTextfield =
  .placeholder = Adicionar lei...
reports-decisionModal-detailedExplanationLabel = Explicação detalhada
reports-decisionModal-detailedExplanationTextarea =
  .placeholder = Adicionar explicação...
reports-relatedReports-label = Denúncias relacionadas
reports-relatedReports-reportIDLabel = ID da Denúncia
reports-anonymousUser = Utilizador anónimo
reports-username-not-available = Nome de utilizador não disponível


# Control panel

controlPanel-redis-redis = Redis
controlPanel-redis-flushRedis = Limpar Redis
controlPanel-redis-flush = Limpar
