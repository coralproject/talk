### Localization for Admin

## General
general-notAvailable = Não disponível
geral-nenhum = Nenhum
general-noTextContent = Sem conteúdo de texto
geral-arquivado = arquivado

## Story Status
storyStatus-open = Abrir
storyStatus-closed = Fechado
storyStatus-archive = Arquivando
storyStatus-archived = Arquivado
storyStatus-unarchive = Desarquivando

## Roles
role-admin = Admin
role-moderator = Moderador
role-siteModerator = Moderador do site
role-organizationModerator = Moderador da Organização
role-staff = Equipe
role-member = Membro
role-commenter = Comentador

role-plural-admin = Administradores
role-plural-moderator = Moderadores
role-plural-staff = Funcionários
role-plural-member = Membros
role-plural-commenter = Comentaristas

comments-react =
  .aria-label = {$count ->
    [0] {$reaction} comentário de {$username}
     *[other] {$reaction} ({$count}) comentário de {$username}
  }
comments-reacted =
  .aria-label = {$count ->
    [0] {$reaction} comentário de {$username}
    [um] comentário {$reaction} de {$username}
    *[other] {$reaction} ({$count}) comentário de {$username}
  }

## User Statuses
userStatus-active = Ativo
userStatus-banned = Banido
userStatus-siteBanned = Site banido
userStatus-banned-all = Banido (todos)
userStatus-banned-count = Banido ({$count})
userStatus-suspended = Suspenso
userStatus-premod = Sempre pré-moderado
userStatus-warned = Avisado

# Queue Sort
queue-sortMenu-newest = Mais recente
queue-sortMenu-oldest = Mais antigo

## Navigation
navigation-moderada = Moderada
navigation-community = Comunidade
navigation-stories = Histórias
navigation-config = Configurar
navigation-dashboard = Painel

## User Menu
userMenu-signOut = Sair
userMenu-viewLatestRelease = Ver versão mais recente
userMenu-reportBug = Reportar um bug ou dar feedback
userMenu-popover =
  .description = Uma caixa de diálogo do menu do usuário com links e ações relacionados

## Restricted
restricted-currentlySignedInTo = Atualmente conectado a
restricted-noPermissionInfo = Você não tem permissão para acessar esta página.
restricted-signedInAs = Você está conectado como: <strong>{ $username }</strong>
restricted-signInWithADifferentAccount = Entrar com uma conta diferente
restricted-contactAdmin = Se você acha que isso é um erro, entre em contato com o administrador para obter assistência.

## Login

# Sign In
login-signInTo = Entrar para
login-signIn-enterAccountDetailsBelow = Insira os detalhes da sua conta abaixo

login-emailAddressLabel = Endereço de e-mail
login-emailAddressTextField =
  .placeholder = Endereço de e-mail

login-signIn-passwordLabel = Senha
login-signIn-passwordTextField =
  .placeholder = Senha

login-signIn-signInWithEmail = Entrar com e-mail
login-orSeparator = Ou
login-signIn-forgot-password = Esqueceu sua senha?

login-signInWithFacebook = Entrar com o Facebook
login-signInWithGoogle = Entrar com o Google
login-signInWithOIDC = Entre com { $name }

# Create Username

createUsername-createUsernameHeader = Criar nome de usuário
createUsername-whatItIs =
  Seu nome de usuário é um identificador que aparecerá em todos os seus comentários.
createUsername-createUsernameButton = Criar nome de usuário
createUsername-usernameLabel = Nome de usuário
createUsername-usernameDescription = Você pode usar “_” e “.” Espaços não permitidos.
createUsername-usernameTextField =
  .placeholder = Nome de usuário

# Add Email Address
addEmailAddress-addEmailAddressHeader = Adicionar endereço de e-mail

addEmailAddress-emailAddressLabel = Endereço de e-mail
addEmailAddress-emailAddressTextField =
  .placeholder = Endereço de e-mail

addEmailAddress-confirmEmailAddressLabel = Confirmar endereço de e-mail
addEmailAddress-confirmEmailAddressTextField =
  .placeholder = Confirmar endereço de e-mail

addEmailAddress-whatItIs =
  Para sua segurança adicional, exigimos que os usuários adicionem um endereço de e-mail às suas contas.

addEmailAddress-addEmailAddressButton =
  Adicionar endereço de e-mail

# Create Password
createPassword-createPasswordHeader = Criar Senha
createPassword-whatItIs =
  Para se proteger contra alterações não autorizadas em sua conta,
  exigimos que os usuários criem uma senha.
createPassword-createPasswordButton =
  Criar senha

createPassword-passwordLabel = Senha
createPassword-passwordDescription = Deve ter pelo menos {$minLength} caracteres
createPassword-passwordTextField =
  .placeholder = Senha

# Forgot Password
forgotPassword-forgotPasswordHeader = Esqueceu a senha?
forgotPassword-checkEmailHeader = Verifique seu e-mail
forgotPassword-gotBackToSignIn = Voltar para a página de login
forgotPassword-checkEmail-receiveEmail =
  Se houver uma conta associada a <strong>{ $email }</strong>,
  você receberá um e-mail com um link para criar uma nova senha.
forgotPassword-enterEmailAndGetALink =
  Digite seu endereço de e-mail abaixo e nós lhe enviaremos um link
  para redefinir sua senha.
forgotPassword-emailAddressLabel = Endereço de e-mail
forgotPassword-emailAddressTextField =
  .placeholder = Endereço de e-mail
forgotPassword-sendEmailButton = Enviar e-mail

# Link Account
linkAccount-linkAccountHeader = Vincular conta
linkAccount-alreadyAssociated =
  O e-mail <strong>{ $email }</strong> é
  já associado com uma conta. Se você gostaria de
  vinculá-los digite sua senha.
linkAccount-passwordLabel = Senha
linkAccount-passwordTextField =
  .label = Senha
linkAccount-linkAccountButton = Vincular conta
linkAccount-useDifferentEmail = Use um endereço de e-mail diferente

## Configure

configure-experimentalFeature = Recurso Experimental

configure-unsavedInputWarning =
  Você tem alterações não salvas. Você tem certeza que quer continuar?

configure-sideBarNavigation-general = Geral
configure-sideBarNavigation-authentication = Autenticação
configure-sideBarNavigation-moderation = Moderação
configure-sideBarNavigation-moderation-comments = Comentários
configure-sideBarNavigation-moderation-users = Usuários
configure-sideBarNavigation-organization = Organização
configure-sideBarNavigation-moderationPhases = Fases de moderação
configure-sideBarNavigation-advanced = Avançado
configure-sideBarNavigation-email = E-mail
configure-sideBarNavigation-bannedAndSuspectWords = Palavras banidas e suspeitas
configure-sideBarNavigation-slack = Slack
configure-sideBarNavigation-webhooks = Webhooks

configure-sideBar-saveChanges = Salvar alterações
configure-configurationSubHeader = Configuração
configure-onOffField-on = Ativado
configure-onOffField-off = Desligado
configure-radioButton-allow = Permitir
configure-radioButton-dontAllow = Não permitir

### Moderation Phases

configure-moderationPhases-generatedAt = CHAVE GERADA EM:
  { DATETIME($data, ano: "numérico", mês: "numérico", dia: "numérico", hora: "numérico", minuto: "numérico") }
configure-moderationPhases-phaseNotFound = Fase de moderação externa não encontrada
configure-moderationPhases-experimentalFeature =
  O recurso de fases de moderação personalizadas está atualmente em desenvolvimento ativo.
  Por favor, <ContactUsLink>entre em contato conosco com qualquer feedback ou solicitação</ContactUsLink>.
configure-moderationPhases-header-title = Fases de moderação
configure-moderationPhases-description =
  Configure uma fase de moderação externa para automatizar alguma moderação
  ações. As solicitações de moderação serão codificadas e assinadas em JSON. Para
  saiba mais sobre solicitações de moderação, visite nossos <externalLink>docs</externalLink>.
configure-moderationPhases-addExternalModerationPhaseButton =
  Adicionar fase de moderação externa
configure-moderationPhases-moderationPhases = Fases de moderação
configure-moderationPhases-name = Nome
configure-moderationPhases-status = Status
configure-moderationPhases-noExternalModerationPhases =
  Não há fases de moderação externas configuradas, adicione uma acima.
configure-moderationPhases-enabledModerationPhase = Ativado
configure-moderationPhases-disableModerationPhase = Desativado
configure-moderationPhases-detailsButton = Detalhes <icon>keyboard_arrow_right</icon>
configure-moderationPhases-addExternalModerationPhase = Adicionar fase de moderação externa
configure-moderationPhases-updateExternalModerationPhaseButton = Atualizar detalhes
configure-moderationPhases-cancelButton = Cancelar
configure-moderationPhases-format = Formato do corpo do comentário
configure-moderationPhases-endpointURL = URL de retorno
configure-moderationPhases-timeout = Tempo limite
configure-moderationPhases-timeout-details =
  O tempo que Coral aguardará sua resposta de moderação em milissegundos.
configure-moderationPhases-format-details =
  O formato no qual o Coral enviará o corpo do comentário. Por padrão, o Coral
  envie o comentário no formato codificado em HTML original. Se "Texto Simples" for
  selecionado, a versão HTML removida será enviada em seu lugar.
configure-moderationPhases-format-html = HTML
configure-moderationPhases-format-plain = Texto sem formatação
configure-moderationPhases-endpointURL-details =
  A URL que a moderação do Coral solicita será postada. O URL fornecido
  deve responder dentro do tempo limite designado ou a decisão da moderação
  ação será ignorada.
configure-moderationPhases-configureExternalModerationPhase =
  Configurar fase de moderação externa
configure-moderationPhases-phaseDetails = Detalhes da fase
onfigure-moderationPhases-status = Status
configure-moderationPhases-signingSecret = Segredo de assinatura
configure-moderationPhases-signingSecretDescription =
  O seguinte segredo de assinatura é usado para assinar payloads de solicitação enviados
  para o URL. Para saber mais sobre assinatura de webhook, visite nossos <externalLink>documentos</externalLink>.
configure-moderationPhases-phaseStatus = Status da fase
configure-moderationPhases-status = Status
configure-moderationPhases-signingSecret = Segredo de assinatura
configure-moderationPhases-signingSecretDescription =
  O seguinte segredo de assinatura é usado para assinar payloads de solicitação enviados para a URL.
  Para saber mais sobre assinatura de webhook, visite nossos <externalLink>documentos</externalLink>.
configure-moderationPhases-dangerZone = Zona de perigo
configure-moderationPhases-rotateSigningSecret = Rotacionar segredo de assinatura
configure-moderationPhases-rotateSigningSecretDescription =
  Girar o segredo de assinatura permitirá que você substitua com segurança uma assinatura
  segredo usado na produção com atraso.
configure-moderationPhases-rotateSigningSecretButton = Girar senha de assinatura

configure-moderationPhases-disableExternalModerationPhase =
  Desativar fase de moderação externa
configure-moderationPhases-disableExternalModerationPhaseDescription =
  Esta fase de moderação externa está atualmente habilitada. Ao desativar, nenhum novo
  consultas de moderação serão enviadas para o URL fornecido.
configure-moderationPhases-disableExternalModerationPhaseButton = Desativar fase
configure-moderationPhases-enableExternalModerationPhase =
  Habilitar fase de moderação externa
configure-moderationPhases-enableExternalModerationPhaseDescription =
  Esta fase de moderação externa está atualmente desativada. Ao habilitar, novos
  consultas de moderação serão enviadas para o URL fornecido.
configure-moderationPhases-enableExternalModerationPhaseButton = Ativar fase
configure-moderationPhases-deleteExternalModerationPhase =
  Excluir fase de moderação externa
configure-moderationPhases-deleteExternalModerationPhaseDescription =
  Excluir esta fase de moderação externa interromperá todas as novas consultas de moderação
  sejam enviados para este URL e removerão todas as configurações associadas.
configure-moderationPhases-deleteExternalModerationPhaseButton = Excluir fase
configure-moderationPhases-rotateSigningSecret = Rotacionar segredo de assinatura
configure-moderationPhases-rotateSigningSecretHelper =
  Depois que expirar, as assinaturas não serão mais geradas com o antigo segredo.
configure-moderationPhases-expiresOldSecret =
  Expire o velho segredo
configure-moderationPhases-expiresOldSecretImmediately =
  Imediatamente
configure-moderationPhases-expiresOldSecretHoursFromNow =
  { $hours ->
    [1] 1 hora
    *[other] { $hours } horas
  } a partir de agora
configure-moderationPhases-rotateSigningSecretSuccessUseNewSecret =
  O segredo de assinatura da fase de moderação externa foi alterado. Por favor, assegure-se de que você
  atualize suas integrações para usar o novo segredo abaixo.
configure-moderationPhases-confirmDisable =
  Desativar esta fase de moderação externa interromperá todas as novas consultas de moderação
  sejam enviados para este URL. Você tem certeza que quer continuar?
configure-moderationPhases-confirmEnable =
  A ativação da fase de moderação externa começará a enviar consultas de moderação
  a este URL. Você tem certeza que quer continuar?
configure-moderationPhases-confirmDelete =
  Excluir esta fase de moderação externa interromperá todas as novas consultas de moderação
  sejam enviados para este URL e removerão todas as configurações associadas. São
  tem certeza que deseja continuar?

### Webhooks

configure-webhooks-generatedAt = CHAVE GERADA EM:
  { DATETIME($data, ano: "numérico", mês: "numérico", dia: "numérico", hora: "numérico", minuto: "numérico") }
configure-webhooks-experimentalFeature =
  O recurso webhook está atualmente em desenvolvimento ativo. Os eventos podem ser
  adicionado ou removido. Por favor, <ContactUsLink>entre em contato conosco com qualquer feedback ou solicitação</ContactUsLink>.
configure-webhooks-webhookEndpointNotFound = Endpoint do Webhook não encontrado
configure-webhooks-header-title = Configurar endpoint do webhook
configure-webhooks-description =
  Configure um endpoint para enviar eventos quando os eventos ocorrerem dentro
  Coral. Esses eventos serão codificados e assinados em JSON. Aprender mais
  sobre assinatura de webhook, visite nosso <externalLink>Guia de Webhook</externalLink>.
configure-webhooks-addEndpoint = Adicionar terminal de webhook
configure-webhooks-addEndpointButton = Adicionar endpoint de webhook
configure-webhooks-endpoints = Terminais
configure-webhooks-url = URL
configure-webhooks-status = Status
configure-webhooks-noEndpoints = Não há terminais de webhook configurados, adicione um acima.
configure-webhooks-enabledWebhookEndpoint = Ativado
configure-webhooks-disabledWebhookEndpoint = Desativado
configure-webhooks-endpointURL = URL do terminal
configure-webhooks-cancelButton = Cancelar
configure-webhooks-updateWebhookEndpointButton = Atualizar endpoint do webhook
configure-webhooks-eventsToSend = Eventos para enviar
configure-webhooks-clearEventsToSend = Limpar
configure-webhooks-eventsToSendDescription =
  Esses são os eventos registrados nesse terminal específico. Visita
  nosso <externalLink>Guia do Webhook</externalLink> para o esquema desses eventos.
  Qualquer evento que corresponda ao seguinte será enviado para o endpoint se for
  habilitado:
configure-webhooks-allEvents =
  O endpoint receberá todos os eventos, incluindo qualquer adicionado no futuro.
configure-webhooks-selectedEvents =
  { $count } { $count ->
    [1] evento
    *[other] eventos
  } selecionado.
configure-webhooks-selectAnEvent =
  Selecione os eventos acima ou <button>receba todos os eventos</button>.
configure-webhooks-configureWebhookEndpoint = Configurar ponto de extremidade do webhook
configure-webhooks-confirmEnable =
  Habilitar o ponto de extremidade do webhook começará a enviar eventos para este URL. Você tem certeza que quer continuar?
configure-webhooks-confirmDisable =
  Desativar esse ponto de extremidade do webhook impedirá que novos eventos sejam enviados para esse URL. Você tem certeza que quer continuar?
configure-webhooks-confirmDelete =
  Excluir este ponto de extremidade do webhook impedirá que novos eventos sejam enviados para este URL e removerá todas as configurações associadas com seu ponto de extremidade do webhook. Você tem certeza que quer continuar?
configure-webhooks-dangerZone = Zona de perigo
configure-webhooks-rotateSigningSecret = Rotacionar segredo de assinatura
configure-webhooks-rotateSigningSecretDescription =
  Girar o segredo de assinatura permitirá que você substitua com segurança uma assinatura
  segredo usado na produção com atraso.
configure-webhooks-rotateSigningSecretButton = Girar segredo de assinatura
configure-webhooks-rotateSigningSecretHelper =
  Depois que expirar, as assinaturas não serão mais geradas com o antigo segredo.
configure-webhooks-rotateSigningSecretSuccessUseNewSecret =
  O segredo de assinatura do ponto de extremidade do webhook foi girado. Por favor, certifique-se
  você atualiza suas integrações para usar o novo segredo abaixo.
configure-webhooks-disableEndpoint = Desativar terminal
configure-webhooks-disableEndpointDescription =
  Este terminal está habilitado no momento. Ao desabilitar este ponto de extremidade, nenhum novo evento
  será enviado para o URL fornecido.
configure-webhooks-disableEndpointButton = Desativar terminal
configure-webhooks-enableEndpoint = Habilitar terminal
configure-webhooks-enableEndpointDescription =
  Este terminal está desativado no momento. Ao habilitar este endpoint, novos eventos serão
  ser enviado para o URL fornecido.
configure-webhooks-enableEndpointButton = Ativar terminal
configure-webhooks-deleteEndpoint = Excluir terminal
configure-webhooks-deleteEndpointDescription =
  Excluir o endpoint impedirá que novos eventos sejam enviados para a URL
  oferecido.
configure-webhooks-deleteEndpointButton = Excluir terminal
configure-webhooks-endpointStatus = Status do terminal
configure-webhooks-signingSecret = Segredo de assinatura
configure-webhooks-signingSecretDescription =
  O seguinte segredo de assinatura é usado para assinar payloads de solicitação enviados
  para o URL. Para saber mais sobre assinatura de webhook, visite nosso
  <externalLink>Guia do Webhook</externalLink>.
configure-webhooks-expiresOldSecret = Expire o segredo antigo
configure-webhooks-expiresOldSecretImmediately = Imediatamente
configure-webhooks-expiresOldSecretHoursFromNow =
  { $horas ->
    [1] 1 hora
    *[outro] { $horas } horas
  }  a partir de agora
configure-webhooks-detailsButton = Detalhes <icon>keyboard_arrow_right</icon>

### Em geral
configure-general-guidelines-title = Resumo das diretrizes da comunidade
configure-general-guidelines-explanation =
  Isso aparecerá acima dos comentários em todo o site.
  Você pode formatar o texto usando Markdown.
  Mais informações sobre como usar Markdown
  aqui: <externalLink>https://www.markdownguide.org/cheat-sheet/</externalLink>
configure-general-guidelines-showCommunityGuidelines = Mostrar resumo das diretrizes da comunidade

#### Biografia
configure-general-memberBio-title = Bios do comentarista
configure-general-memberBio-explanation =
  Permita que os comentadores adicionem uma biografia ao seu perfil. Observação: isso pode aumentar a carga de trabalho do moderador, pois as biografias dos comentadores podem ser relatadas.
configure-general-memberBio-label = Permitir biografias de comentaristas

#### Localidade
configure-general-locale-language = Idioma
configure-general-locale-chooseLanguage = Escolha o idioma para sua comunidade Coral.
configure-general-locale-invalidLanguage =
  O idioma selecionado anteriormente <lang></lang> não existe mais. Escolha um idioma diferente.

#### Comentários em todo o site
configure-general-sitewideCommenting-title = Comentários em todo o site
configure-general-sitewideCommenting-explanation =
  Abra ou feche fluxos de comentários para novos comentários em todo o site.
  Quando novos comentários são desativados, novos comentários não podem ser
  enviados, mas os comentários existentes podem continuar a receber
  reações, ser relatado e ser compartilhado.
configure-general-sitewideCommenting-enableNewCommentsSitewide =
  Ativar novos comentários em todo o site
configure-general-sitewideCommenting-onCommentStreamsOpened =
  Ativado - fluxos de comentários abertos para novos comentários
configure-general-sitewideCommenting-offCommentStreamsClosed =
  Desativado - Fluxos de comentários fechados para novos comentários
configure-general-sitewideCommenting-message = Mensagem de comentários fechados em todo o site
configure-general-sitewideCommenting-messageExplanation =
  Escreva uma mensagem que será exibida quando os fluxos de comentários forem fechados em todo o site

#### Incorporar links
configure-general-embedLinks-title = Mídia incorporada
configure-general-embedLinks-desc = Permitir que os comentadores adicionem um vídeo do YouTube, Tweet ou GIF da biblioteca do GIPHY ao final de seus comentários
configure-general-embedLinks-enableTwitterEmbeds = Permitir incorporações do Twitter
configure-general-embedLinks-enableYouTubeEmbeds = Permitir incorporações do YouTube
configure-general-embedLinks-enableGiphyEmbeds = Permitir GIFs do GIPHY
configure-general-embedLinks-enableExternalEmbeds = Ativar mídia externa

configure-general-embedLinks-On = Sim
configure-general-embedLinks-Off = Não

configure-general-embedLinks-giphyMaxRating = classificação de conteúdo GIF
configure-general-embedLinks-giphyMaxRating-desc = Selecione a classificação máxima de conteúdo para os GIFs que aparecerão nos resultados de pesquisa dos comentaristas

configure-general-embedLinks-giphyMaxRating-g = G
configure-general-embedLinks-giphyMaxRating-g-desc = Conteúdo apropriado para todas as idades
configure-general-embedLinks-giphyMaxRating-pg = PG
configure-general-embedLinks-giphyMaxRating-pg-desc = Conteúdo geralmente seguro para todos, mas aconselha-se orientação dos pais para crianças.
configure-general-embedLinks-giphyMaxRating-pg13 = PG-13
configure-general-embedLinks-giphyMaxRating-pg13-desc = Insinuações sexuais leves, uso leve de substâncias, palavrões leves ou imagens ameaçadoras. Pode incluir imagens de pessoas seminuas, mas NÃO mostra genitália humana real ou nudez.
configure-general-embedLinks-giphyMaxRating-r = R
configure-general-embedLinks-giphyMaxRating-r-desc = Linguagem forte, forte insinuação sexual, violência e uso de drogas ilegais; não é adequado para adolescentes ou mais jovens. Sem nudez.

configure-general-embedLinks-configuration = Configuração
configure-general-embedLinks-configuration-desc =
  Para obter informações adicionais sobre a API do GIPHY, visite: <externalLink>https://developers.giphy.com/docs/api</externalLink>
configure-general-embedLinks-giphyAPIKey = chave API GIPHY


#### Configurar anúncios

configure-general-announcements-title = Anúncio da comunidade
configure-general-announcements-description =
  Adicione um anúncio temporário que aparecerá na parte superior de todos os fluxos de comentários da sua organização por um período de tempo específico.
configure-general-announcements-delete = Remover anúncio
configure-general-announcements-add = Adicionar anúncio
configure-general-announcements-start = Iniciar anúncio
configure-general-announcements-cancel = Cancelar
configure-general-announcements-current-label = Anúncio atual
configure-general-announcements-current-duration =
  Este anúncio terminará automaticamente em: { $timestamp }
configure-general-announcements-duration = Mostrar este anúncio para

#### Fluxos de comentários de encerramento
configure-general-closingCommentStreams-title = Fechando fluxos de comentários
configure-general-closingCommentStreams-explanation = Definir fluxos de comentários para fechar após um período de tempo definido após a publicação de uma história
configure-general-closingCommentStreams-closeCommentsAutomatically = Fechar comentários automaticamente
configure-general-closingCommentStreams-closeCommentsAfter = Fechar comentários após

#### Tamanho do comentário
configure-general-commentLength-title = Comprimento do comentário
configure-general-commentLength-maxCommentLength = Comprimento máximo do comentário
configure-general-commentLength-setLimit =
  Defina requisitos mínimos e máximos de tamanho de comentário.
  Os espaços em branco no início e no final de um comentário serão cortados.
configure-general-commentLength-limitCommentLength = Limitar comprimento do comentário
configure-general-commentLength-minCommentLength = Comprimento mínimo do comentário
configure-general-commentLength-characters = Caracteres
configure-general-commentLength-textField =
  .placeholder = Sem limite
configure-general-commentLength-validateLongerThanMin =
  Insira um número maior que o comprimento mínimo

#### Edição de comentários
configure-general-commentEditing-title = Edição de comentários
configure-general-commentEditing-explanation =
  Defina um limite de quanto tempo os comentadores têm para editar seus comentários em todo o site.
  Os comentários editados são marcados como (Editado) no fluxo de comentários e o
  painel de moderação.
configure-general-commentEditing-commentEditTimeFrame = Período de edição do comentário
configure-general-commentEditing-seconds = Segundos

#### Achatar respostas
configure-general-flattenReplies-title = Achatar respostas
configure-general-flattenReplies-enabled = Achatar respostas habilitadas
configure-general-flattenReplies-explanation =
  Altere como os níveis de respostas são exibidos. Quando ativado, as respostas aos comentários podem ter até sete níveis de profundidade antes de não serem mais recuados na página. Quando desativado, após sete respostas, o restante da conversa é exibido em uma exibição dedicada, longe dos outros comentários.

#### Mensagem de fluxo fechado
configure-general-closedStreamMessage-title = Mensagem de fluxo de comentário fechado
configure-general-closedStreamMessage-explanation = Escreva uma mensagem para aparecer quando uma história for fechada para comentários.

### Organização
configure-organization-name = Nome da organização
configure-organization-sites = Sites
configure-organization-nameExplanation =
  O nome da sua organização aparecerá nos e-mails enviados por { -product-name } para sua comunidade e membros da organização.
configure-organization-sites-explanation =
  Adicione um novo site à sua organização ou edite os detalhes de um site existente.
configure-organization-sites-add-site = <icon>add</icon> Adicionar site
configure-organization-email = E-mail da organização
configure-organization-emailExplanation =
  Este endereço de e-mail será usado como em e-mails e em toda a plataforma
  para que os membros da comunidade entrem em contato com a organização
  eles têm alguma dúvida sobre o status de suas contas ou
  perguntas de moderação.
configure-organization-url = URL da organização
configure-organization-urlExplanation =
  O URL da sua organização aparecerá nos e-mails enviados por { -product-name } para sua comunidade e membros da organização.

### Locais
configure-sites-site-details = Detalhes <icon>keyboard_arrow_right</icon>
configure-sites-add-new-site = Adicionar um novo site a { $site }
configure-sites-add-success = { $site } foi adicionado a { $org }
configure-sites-edit-success = As alterações em { $site } foram salvas.
configure-sites-site-form-name = Nome do site
configure-sites-site-form-name-explanation = O nome do site aparecerá nos e-mails enviados pela Coral para sua comunidade e membros da organização.
configure-sites-site-form-url = URL do site
configure-sites-site-form-url-explanation = Esta url aparecerá nos e-mails enviados pela Coral aos membros da sua comunidade.
configure-sites-site-form-email = Endereço de e-mail do site
configure-sites-site-form-url-explanation = Este endereço de e-mail é para os membros da comunidade entrarem em contato com você em caso de dúvidas ou se precisarem de ajuda. por exemplo. comentários@seusite.com
configure-sites-site-form-domains = Domínios permitidos pelo site
configure-sites-site-form-domains-explanation = Domínios onde seus fluxos de comentários Coral podem ser incorporados (ex. http://localhost:3000, https://staging.domain.com, https://domain. com).
configure-sites-site-form-submit = <icon>adicionar</icon> Adicionar site
configure-sites-site-form-cancel = Cancelar
configure-sites-site-form-save = Salvar alterações
configure-sites-site-edit = Editar detalhes de { $site }
configure-sites-site-form-embed-code = Código de incorporação
sites-emptyMessage = Não encontramos nenhum site que corresponda aos seus critérios.
sites-selector-allSites = Todos os sites
site-filter-option-allSites = Todos os sites

site-selector-all-sites = Todos os sites
stories-filter-sites-allSites = Todos os sites
stories-filter-statuses = Status
stories-column-site= Site
site-table-siteName = Nome do site
stories-filter-sites = Site

site-search-searchButton =
  .aria-label = Pesquisar
site-search-textField =
  .aria-label = Pesquisar pelo nome do site
site-search-textField =
  .placeholder = Pesquisar pelo nome do site
site-search-none-found = Nenhum site foi encontrado com essa pesquisa
specificSitesSelect-validation = Você deve selecionar pelo menos um site.

stories-column-actions = Ações
stories-column-rescrape = Re-raspar

stories-openInfoDrawer =
  .aria-label = Abrir Gaveta de Informações
stories-actions-popove =
  .description = Um menu suspenso para selecionar as ações da história
stories-actions-rescrape = Re-scrape
stories-actions-close = Fechar história
stories-actions-open = Abrir story
stories-actions-archive = Arquivar história
stories-actions-unarchive = Desarquivar história
stories-actions-isUnarchiving = Desarquivando

### Seções

moderate-section-selector-allSections = Todas as seções
moderate-section-selector-uncategorized = Sem categoria
moderate-section-uncategorized = Sem categoria

### E-mail

configure-email = Configurações de e-mail
configure-email-configBoxEnabled = Ativado
configure-email-fromNameLabel = Do nome
configure-email-fromNameDescription =
  Nome como aparecerá em todos os e-mails enviados
configure-email-fromEmailLabel = Do endereço de e-mail
configure-email-fromEmailDescription =
  Endereço de e-mail que será usado para enviar mensagens
configure-email-smtpHostLabel = host SMTP
configure-email-smtpHostDescription = (ex. smtp.sendgrid.net)
configure-email-smtpPortLabel = porta SMTP
configure-email-smtpPortDescription = (ex. 25)
configure-email-smtpTLSLabel = TLS
configure-email-smtpAuthenticationLabel = Autenticação SMTP
configure-email-smtpCredentialsHeader = Credenciais de e-mail
configure-email-smtpUsernameLabel = Nome de usuário
configure-email-smtpPasswordLabel = Senha
configure-email-send-test = Enviar e-mail de teste

### Autenticação

configure-auth-clientID = ID do cliente
configure-auth-clientSecret = Segredo do cliente
configure-auth-configBoxEnabled = Ativado
configure-auth-targetFilterCoralAdmin = { -product-name } Administrador
configure-auth-targetFilterCommentStream = Fluxo de comentários
configure-auth-redirectURI = URI de redirecionamento
configure-auth-registration = Registro
configure-auth-registrationDescription =
  Permitir usuários que não se inscreveram antes com esta autenticação
  integração para registrar uma nova conta.
configure-auth-registrationCheckBox = Permitir registro
configure-auth-pleaseEnableAuthForAdmin =
  Ative pelo menos uma integração de autenticação para { -product-name } Admin
configure-auth-confirmNoAuthForCommentStream =
  Nenhuma integração de autenticação foi habilitada para o Comment Stream.
  Você realmente quer continuar?

configure-auth-facebook-loginWith = Entrar com o Facebook
configure-auth-facebook-toEnableIntegration =
  Para habilitar a integração com a Autenticação do Facebook,
  você precisa criar e configurar um aplicativo da web.
  Para obter mais informações, visite: <Link></Link>.
configure-auth-facebook-useLoginOn = Use o login do Facebook em

configure-auth-google-loginWith = Login com o Google
configure-auth-google-toEnableIntegration =
  Para habilitar a integração com o Google Authentication você precisa
  para criar e configurar um aplicativo da web. Para mais informações visite:
  <Link></Link>.
configure-auth-google-useLoginOn = Usar login do Google em

configure-auth-sso-loginWith = Login com logon único
configure-auth-sso-useLoginOn = Usar logon único no login
configure-auth-sso-key = Chave
configure-auth-sso-regenerate = Regenerar
configure-auth-sso-regenerateAt = CHAVE GERADA EM:
  { DATETIME($data, ano: "numérico", mês: "numérico", dia: "numérico", hora: "numérico", minuto: "numérico") }
configure-auth-sso-regenerateHonoredWarning =
  Ao regenerar uma chave, os tokens assinados com a chave anterior serão honrados por 30 dias.

configure-auth-sso-description =
  Para permitir a integração com seu sistema de autenticação existente,
  você precisará criar um token JWT para se conectar. Você pode aprender
  mais sobre como criar um token JWT com <IntroLink>esta introdução</IntroLink>. veja nosso
  <DocLink>documentação</DocLink> para obter informações adicionais sobre login único.

configure-auth-sso-rotate-keys = Chaves
configure-auth-sso-rotate-keyID = ID da chave
configure-auth-sso-rotate-secret = Segredo
configure-auth-sso-rotate-copySecret =
  .aria-label = Copiar Segredo

configure-auth-sso-rotate-date =
  { DATETIME($data, ano: "numérico", mês: "numérico", dia: "numérico", hora: "numérico", minuto: "numérico") }
configure-auth-sso-rotate-activeSince = Ativo desde
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
  .aria-label = Alternar a visibilidade da dica de ferramenta expirada
configure-auth-sso-rotate-expiredTooltip =
  Uma chave SSO expira quando é rotacionada para fora de uso.
configure-auth-sso-rotate-expiredTooltip-toggleButton =
  Alternar a visibilidade da dica de ferramenta expirada

configure-auth-sso-rotate-rotate = Girar
configure-auth-sso-rotate-deactivateNow = Desativar agora
configure-auth-sso-rotate-delete = Excluir

configure-auth-sso-rotate-now = Agora
configure-auth-sso-rotate-10seconds = daqui a 10 segundos
configure-auth-sso-rotate-1day = daqui a 1 dia
configure-auth-sso-rotate-1week = daqui a 1 semana
configure-auth-sso-rotate-30days = daqui a 30 dias
configure-auth-sso-rotate-dropdown-description =
  .description = Uma lista suspensa para girar a chave SSO

configure-auth-local-loginWith = Login com autenticação de e-mail
configure-auth-local-useLoginOn = Usar login de autenticação de e-mail em
configure-auth-local-forceAdminLocalAuth =
  A autenticação local do administrador foi ativada permanentemente.
  Isso é para garantir que as equipes de atendimento da Coral possam acessar o painel de administração.

configure-auth-oidc-loginWith = Login com OpenID Connect
configure-auth-oidc-toLearnMore = Para saber mais: <Link></Link>
configure-auth-oidc-providerName = Nome do provedor
configure-auth-oidc-providerNameDescription =
  O provedor da integração OpenID Connect. Isso será usado quando o nome do provedor
  precisa ser exibido, por ex. “Entrar com &lt;Facebook&gt;”.
configure-auth-oidc-issuer = Emissor
configure-auth-oidc-issuerDescription =
  Depois de inserir as informações do emissor, clique no botão Descobrir para concluir { -product-name }
  os campos restantes. Você também pode inserir as informações manualmente.
configure-auth-oidc-authorizationURL = URL de autorização
configure-auth-oidc-tokenURL = URL do token
configure-auth-oidc-jwksURI = JWKS URI
configure-auth-oidc-useLoginOn = Usar login do OpenID Connect

configure-auth-settings = Configurações da sessão
configure-auth-settings-session-duration-label = Duração da sessão

### Moderação

### Histórico de comentários recentes

configure-moderation-recentCommentHistory-title = Histórico recente
configure-moderation-recentCommentHistory-timeFrame = Período do histórico de comentários recentes
configure-moderation-recentCommentHistory-timeFrame-description =
  Quantidade de tempo para calcular a taxa de rejeição de um comentarista.
configure-moderation-recentCommentHistory-enabled = Filtro de histórico recente
configure-moderation-recentCommentHistory-enabled-description =
  Impede que reincidentes publiquem comentários sem aprovação.
  Quando a taxa de rejeição de um comentarista está acima do limite, seu
  os comentários são enviados para Pendente para aprovação do moderador. isso não
  aplicam-se aos comentários da equipe.
configure-moderation-recentCommentHistory-triggerRejectionRate = Limite da taxa de rejeição
configure-moderation-recentCommentHistory-triggerRejectionRate-description =
  Comentários rejeitados ÷ (comentários rejeitados + comentários publicados)
  ao longo do período acima, como uma porcentagem. não inclui
  comentários pendentes por toxicidade, spam ou pré-moderação.

#### Links externos para moderadores
configure-moderation-externalLinks-title = Links externos para moderadores
configure-moderation-externalLinks-profile-explanation = Quando um formato de URL é incluído
  abaixo, os links de perfil externo são adicionados à gaveta do usuário dentro da moderação
  interface. Você pode usar o formato $USER_NAME para inserir o nome de usuário ou $USER_ID
  para inserir o número de identificação exclusivo do usuário.
configure-moderation-externalLinks-profile-label = Padrão de URL de perfil externo
configure-moderation-externalLinks-profile-input =
  .placeholder = https://example.com/users/$USER_NAME

#### Pré-Moderação
configure-moderation-preModeration-title = Pré-moderação
configure-moderation-preModeration-explanation =
  Quando a pré-moderação estiver ativada, os comentários não serão publicados, a menos que
  aprovado por um moderador.
configure-moderation-preModeration-moderation =
  Pré-moderar todos os comentários
configure-moderation-preModeration-premodLinksEnable =
  Pré-moderar todos os comentários contendo links

#### Moderação todas/opções de sites específicos
configure-moderation-specificSites = Sites específicos
configure-moderation-allSites = Todos os sites

configure-moderation-apiKey = Chave de API

configure-moderation-akismet-title = Filtro de detecção de spam
configure-moderation-akismet-explanation =
  O filtro da API Akismet avisa os usuários quando um comentário é determinado como provável
  ser spam. Comentários que o Akismet considera spam não serão publicados
  e são colocados na Fila de Pendentes para revisão por um moderador.
  Se aprovado por um moderador, o comentário será publicado.

configure-moderation-premModeration-premodSuspectWordsEnable =
  Pré-moderar todos os comentários contendo palavras suspeitas
configure-moderation-premModeration-premodSuspectWordsDescription =
  Você pode visualizar e editar sua lista de palavras suspeitas <wordListLink>aqui</wordListLink>

#### Akismet
configure-moderation-akismet-filter = Filtro de detecção de spam
configure-moderation-akismet-ipBased = detecção de spam baseada em IP
configure-moderation-akismet-accountNote =
  Observação: você deve adicionar seu(s) domínio(s) ativo(s)
  na sua conta Akismet: <externalLink>https://akismet.com/account/</externalLink>
configure-moderation-akismet-siteURL = URL do site


#### Perspective
configure-moderation-perspective-title = Filtro de comentário tóxico
configure-moderation-perspective-explanation =
  Usando a API de perspectiva, o filtro de comentário tóxico avisa os usuários
  quando os comentários excedem o limite de toxicidade predefinido.
  Comentários com uma pontuação de toxicidade acima do limite
  <strong>não serão publicados</strong> e são colocados em
  a <strong>Fila pendente para revisão por um moderador</strong>.
  Se aprovado por um moderador, o comentário será publicado.
configure-moderation-perspective-filter = Filtro de comentário tóxico
configure-moderation-perspective-toxicityThreshold = Limite de toxicidade
configure-moderation-perspective-toxicityThresholdDescription =
  Esse valor pode ser definido como uma porcentagem entre 0 e 100. Esse número representa a probabilidade de um
  comentário é tóxico, de acordo com a API de perspectiva. Por padrão, o limite é definido como { $default }.
configure-moderation-perspective-toxicityModel = Modelo de toxicidade
configure-moderation-perspective-toxicityModelDescription =
  Escolha o seu modelo de perspectiva. O padrão é { $padrão }.
  Você pode saber mais sobre as opções de modelo <externalLink>aqui</externalLink>.
configure-moderation-perspective-allowStoreCommentData = Permitir que o Google armazene dados de comentários
configure-moderation-perspective-allowStoreCommentDataDescription =
  Os comentários armazenados serão usados para fins de pesquisa futura e construção de modelos comunitários para
  melhorar a API ao longo do tempo.
configure-moderation-perspective-allowSendFeedback =
  Permitir que Coral envie ações de moderação ao Google
configure-moderation-perspective-allowSendFeedbackDescription =
  As ações de moderação enviadas serão usadas para pesquisas futuras e
  propósitos de construção de modelo de comunidade para melhorar a API ao longo do tempo.
configure-moderation-perspective-customEndpoint = Endpoint personalizado
configure-moderation-perspective-defaultEndpoint =
  Por padrão, o endpoint é definido como { $default }. Você pode substituir isso aqui.
configure-moderation-perspective-accountNote =
  Para obter informações adicionais sobre como configurar o Filtro de comentário tóxico da perspectiva, visite:
  <externalLink>https://github.com/conversationai/perspectiveapi#readme</externalLink>

configure-moderation-newCommenters-title = Aprovação de novo comentarista
configure-moderation-newCommenters-enable = Ativar aprovação de novo comentarista
configure-moderation-newCommenters-description =
  Quando estiver ativo, os comentários iniciais de um novo comentarista serão enviados para Pendente
  para aprovação do moderador antes da publicação.
configure-moderation-newCommenters-enable-description = Ativar pré-moderação para novos comentaristas
configure-moderation-newCommenters-approvedCommentsThreshold = Número de comentários que devem ser aprovados
configure-moderation-newCommenters-approvedCommentsThreshold-description =
  O número de comentários que um usuário deve ter aprovado antes de fazer
  não precisa ser pré-moderado
configure-moderation-newCommenters-comments = comentários

#### Domínio de e-mail
configure-moderation-emailDomains-header = Domínio de e-mail
configure-moderation-emailDomains-description = Crie regras para agir em contas ou comentários com base no domínio do endereço de e-mail do titular da conta. A ação só se aplica a contas recém-criadas.
configure-moderation-emailDomains-add = Adicionar domínio de e-mail
configure-moderation-emailDomains-edit = Editar domínio de e-mail
configure-moderation-emailDomains-addDomain = <icon>adicionar</icon> Adicionar domínio
configure-moderation-emailDomains-table-domain = Domínio
configure-moderation-emailDomains-table-action = Ação
configure-moderation-emailDomains-table-edit = <icon>editar</icon> Editar
configure-moderation-emailDomains-table-delete = <icon>excluir</icon> Excluir
configure-moderation-emailDomains-form-label-domain = Domínio
configure-moderation-emailDomains-form-label-moderationAction = Ação de moderação
configure-moderation-emailDomains-banAllUsers = Banir todas as novas contas de comentaristas
configure-moderation-emailDomains-alwaysPremod = Sempre pré-moderar comentários
configure-moderation-emailDomains-form-cancel = Cancelar
configure-moderation-emailDomains-form-addDomain = Adicionar domínio
configure-moderation-emailDomains-form-editDomain = Atualizar
configure-moderation-emailDomains-confirmDelete = Excluir este domínio de e-mail impedirá que novas contas criadas com ele sejam banidas ou sempre pré-moderadas. Você tem certeza que quer continuar?
configure-moderation-emailDomains-form-description-add = Adicione um domínio e selecione a ação que deve ser executada a cada nova conta criada usando o domínio especificado.
configure-moderation-emailDomains-form-description-edit = Atualize o domínio ou a ação que deve ser executada a cada nova conta usando o domínio especificado.

#### Configuração de palavras proibidas
configure-wordList-banned-bannedWordsAndPhrases = Palavras e frases banidas
configure-wordList-banned-explanation =
  Comentários contendo uma palavra ou frase na lista de palavras proibidas são <strong>rejeitados automaticamente e não são publicados</strong>.
configure-wordList-banned-wordList = Lista de palavras proibidas
configure-wordList-banned-wordListDetailInstructions =
  Separe palavras ou frases proibidas com uma nova linha. Palavras/frases não diferenciam maiúsculas de minúsculas.

#### Configuração de Palavras Suspeitas
configure-wordList-suspect-bannedWordsAndPhrases = Palavras e frases suspeitas
configure-wordList-suspect-explanation =
  Comentários contendo uma palavra ou frase na lista de palavras suspeitas
  são <strong>colocados na fila de denúncias para análise do moderador e são
  publicado (se os comentários não forem pré-moderados).</strong>
configure-wordList-suspect-explanationSuspectWordsList =
  Comentários contendo uma palavra ou frase na Lista de Palavras Suspeitas são
  <strong>colocados na fila de espera para revisão do moderador e não são
  publicado a menos que aprovado por um moderador.</strong>
configure-wordList-suspect-wordList = Lista de palavras suspeitas
configure-wordList-suspect-wordListDetailInstructions =
  Separe palavras ou frases suspeitas com uma nova linha. Palavras/frases não diferenciam maiúsculas de minúsculas.

### Avançado
configure-advanced-customCSS = CSS personalizado
configure-advanced-customCSS-override =
  URL de uma folha de estilo CSS que substituirá os estilos padrão do Embed Stream.
configure-advanced-customCSS-stylesheetURL = URL da folha de estilo CSS personalizada
configure-advanced-customCSS-fontsStylesheetURL = URL da folha de estilo CSS personalizada para fontes
configure-advanced-customCSS-containsFontFace =
  URL para uma folha de estilo CSS personalizada que contém todos os @font-face
  definições necessárias para a folha de estilo acima.

configure-advanced-permittedDomains = Domínios permitidos
configure-advanced-permittedDomains-description =
  Domínios nos quais sua instância { -product-name } pode ser incorporada
  incluindo o esquema (ex. http://localhost:3000, https://staging.domain.com,
  https://domain.com).

configure-advanced-liveUpdates = Atualizações ao vivo da transmissão de comentários
configure-advanced-liveUpdates-explanation =
  Quando ativado, haverá carregamento e atualização de comentários em tempo real.
  Quando desativado, os usuários terão que atualizar a página para ver os novos comentários.

configure-advanced-embedCode-title = Código de incorporação
configure-advanced-embedCode-explanation =
  Copie e cole o código abaixo em seu CMS para incorporar os fluxos de comentários do Coral em
  cada uma das histórias do seu site.

configure-advanced-embedCode-comment =
  Descomente essas linhas e substitua pelo ID do
  ID da história e URL do seu CMS para fornecer o
  integração mais estreita. Consulte nossa documentação em
  https://docs.coralproject.net para toda a configuração
  opções.

configure-advanced-amp = Páginas móveis aceleradas
configure-advanced-amp-explanation =
  Ative o suporte para <LinkToAMP>AMP</LinkToAMP> no fluxo de comentários.
  Depois de ativado, você precisará adicionar o código de incorporação AMP da Coral à sua página
  modelo. Veja nossa <LinkToDocs>documentação</LinkToDocs> para mais
  detalhes. Habilite Habilitar Suporte.

configure-advanced-for-review-queue = Revise todos os relatórios do usuário
configure-advanced-for-review-queue-explanation =
  Depois que um comentário for aprovado, ele não aparecerá novamente na fila de denúncias
  mesmo que usuários adicionais relatem isso. Esse recurso adiciona uma fila "Para revisão",
  permitindo que os moderadores vejam todos os relatórios do usuário no sistema e manualmente
  marque-os como "Revisados".
configure-advanced-for-review-queue-label = Mostrar a fila "Para revisão"

## Histórico de decisões
decisionHistory-popover =
  .description = Uma caixa de diálogo mostrando o histórico de decisão
decisionHistory-youWillSeeAList =
  Você verá uma lista de suas ações de moderação de postagem aqui.
decisionHistory-showMoreButton =
  Mostre mais
decisionHistory-yourDecisionHistory = Seu Histórico de Decisões
decisionHistory-rejectedCommentBy = Comentário rejeitado por <Username></Username>
decisionHistory-approvedCommentBy = Comentário aprovado por <Username></Username>
decisionHistory-goToComment = Ir para o comentário

### Slack

configure-slack-header-title = Integrações do Slack
configure-slack-description =
  Envie comentários automaticamente das filas de moderação do Coral para o Slack
  canais. Você precisará de acesso de administrador do Slack para configurar isso. Para
  etapas sobre como criar um aplicativo Slack consulte nossa <externalLink>documentação</externalLink>.
configure-slack-notRecommended =
  Não recomendado para sites com mais de 10 mil comentários por mês.
configure-slack-addChannel = Adicionar canal

configure-slack-channel-defaultName = Novo canal
configure-slack-channel-enabled = Ativado
configure-slack-channel-remove = Remover canal
configure-slack-channel-name-label = Nome
configure-slack-channel-name-description =
  Isto é apenas para sua informação, para identificar facilmente
  cada conexão do Slack. Slack não nos diz o nome
  do(s) canal(is) que você está conectando ao Coral.
configure-slack-channel-hookURL-label = URL do Webhook
configure-slack-channel-hookURL-description =
  O Slack fornece um URL específico do canal para ativar o webhook
  conexões. Para encontrar o URL de um de seus canais do Slack,
  siga as instruções <externalLink>aqui</externalLink>.
configure-slack-channel-triggers-label =
  Receba notificações neste canal do Slack para
configure-slack-channel-triggers-reportedComments = Comentários relatados
configure-slack-channel-triggers-pendingComments = Comentários pendentes
configure-slack-channel-triggers-featuredComments = Comentários em destaque
configure-slack-channel-triggers-allComments = Todos os comentários
configure-slack-channel-triggers-staffComments = Comentários da equipe

## moderate
moderate-navigation-reported = relatada
moderate-navigation-pending = Pendente
moderate-navigation-unmoderated = não moderada
moderate-navigation-rejected = rejeitada
moderate-navigation-approved = aprovado
moderate-navigation-comment-count = { SHORT_NUMBER($count) }
moderate-navigation-forReview = para revisão

moderate-marker-preMod = Pré-mod
moderate-marker-link = Link
moderate-marker-bannedWord = Palavra banida
moderate-marker-bio = Bio
moderate-marker-possibleBannedWord = Possível palavra banida
moderate-marker-suspectWord = Palavra suspeita
moderate-marker-possibleSuspectWord = Possível palavra suspeita
moderate-marker-spam = Spam
moderate-marker-spamDetected = Spam detectado
moderate-marker-toxic = Tóxico
moderate-marker-recentHistory = Histórico recente
moderate-marker-bodyCount = Contagem de corpos
moderate-marker-offensive = Ofensivo
moderate-marker-abusive = Abusivo
moderate-marker-newCommenter = Novo comentarista
moderate-marker-repeatPost = Repetir comentário
moderate-marker-other = Outro

moderate-markers-details = Detalhes
moderate-flagDetails-latestReports = Relatórios mais recentes
moderate-flagDetails-offensive = Ofensivo
moderate-flagDetails-abusive = Abusivo
moderate-flagDetails-spam = Spam
moderate-flagDetails-bio = Bio
moderate-flagDetails-other = Outro

moderate-flagDetails-toxicityScoree = Pontuação de Toxicidade
moderate-toxicityLabel-likely = Provável <score></score>
moderate-toxicityLabel-unlikely = Improvável <score></score>
moderate-toxicityLabel-maybe = Talvez <score></score>

moderate-linkDetails-label = Copiar link para este comentário
moderate-in-stream-link-copy = In Stream
moderate-in-moderation-link-copy = Com moderação

moderate-emptyQueue-pending = Muito bem! Não há mais comentários pendentes para moderar.
moderate-emptyQueue-reported = Muito bem! Não há mais comentários relatados para moderar.
moderate-emptyQueue-unmoderated = Muito bem! Todos os comentários foram moderados.
moderate-emptyQueue-rejected = Não há comentários rejeitados.
moderate-emptyQueue-approved = Não há comentários aprovados.

moderate-comment-edited = (editado)
moderate-comment-inReplyTo = Responder a <Username></Username>
moderate-comment-viewContext = Exibir contexto
moderate-comment-viewConversation = Ver conversa
moderate-comment-rejectButton =
  .aria-label = Rejeitar
moderate-comment-approveButton =
  .aria-label = Aprovar
moderate-comment-decision = Decisão
moderate-comment-story = História
moderate-comment-storyLabel = Comentar
moderate-comment-moderateStory = Moderar história
moderate-comment-featureText = Recurso
moderate-comment-featuredText = Destaque
moderate-comment-moderatedBy = Moderado por
moderate-comment-moderatedBySystem = Sistema
moderate-comment-play-gif = Reproduzir GIF
moderate-comment-load-video = Carregar vídeo

moderate-single-goToModerationQueues = Ir para as filas de moderação
moderate-single-singleCommentView = Exibição de comentário único

moderate-queue-viewNew =
  { $count ->
    [1] Ver {$count} novo comentário
    *[other] Veja {$count} novos comentários
  }

moderate-comment-deleted-body =
  Este comentário não está mais disponível. O comentarista excluiu sua conta.

### Moderate Search Bar
moderate-searchBar-allStories = Todas as histórias
  .title = Todas as histórias
moderate-searchBar-noStories = Não foi possível encontrar nenhuma história que corresponda aos seus critérios
moderate-searchBar-stories = Histórias:
moderate-searchBar-searchButton = Pesquisar
moderate-searchBar-titleNotAvailable =
  .title = Título não disponível
moderate-searchBar-comboBox =
  .aria-label = Pesquise ou pule para a história
moderate-searchBar-searchForm =
  .aria-label = Histórias
moderate-searchBar-currentlyModerating =
  .title = Moderando atualmente
moderate-searchBar-searchResults = Resultados da pesquisa
moderate-searchBar-searchResultsMostRecentFirst = Resultados da pesquisa (mais recentes primeiro)
moderate-searchBar-searchResultsMostRelevantFirst = Resultados da pesquisa (mais relevantes primeiro)
moderate-searchBar-moderateAllStories = Moderar todas as histórias
moderate-searchBar-comboBoxTextField =
  .aria-label = Pesquise ou pule para a história...
  .placeholder = pesquisa por título da história, autor, url, id, etc.
moderate-searchBar-goTo = Ir para
moderate-searchBar-seeAllResults = Veja todos os resultados

moderateCardDetails-tab-info = Informações
moderateCardDetails-tab-edits = Editar histórico
moderateCardDetails-tab-automatedActions = Ações automatizadas
moderateCardDetails-tab-reactions = Reações
moderateCardDetails-tab-reactions-loadMore = Carregar mais
moderateCardDetails-tab-noIssuesFound = Nenhum problema encontrado
moderateCardDetails-tab-missingPhase = Não foi executado

moderateCardDetails-tab-externalMod-status = Status
moderateCardDetails-tab-externalMod-flags = Sinalizadores
moderateCardDetails-tab-externalMod-tags = Tags

moderateCardDetails-tab-externalMod-none = Nenhum
moderateCardDetails-tab-externalMod-approved = Aprovado
moderateCardDetails-tab-externalMod-rejected = Rejeitado
moderateCardDetails-tab-externalMod-premod = Pré-moderado
moderateCardDetails-tab-externalMod-systemWithheld = Sistema retido

### Moderate User History Drawer

moderate-user-drawer-email =
  .title = endereço de e-mail
moderate-user-drawer-created-at =
  .title = Data de criação da conta
moderate-user-drawer-member-id =
  .title = ID do membro
moderate-user-drawer-external-profile-URL =
  .title = URL do perfil externo
moderate-user-drawer-external-profile-URL-link = URL do perfil externo
moderate-user-drawer-tab-all-comments = Todos os comentários
moderate-user-drawer-tab-rejected-comments = Rejeitado
moderate-user-drawer-tab-account-history = Histórico da conta
moderate-user-drawer-tab-notes = Notas
moderate-user-drawer-load-more = Carregar mais
moderate-user-drawer-all-no-comments = {$username} não enviou nenhum comentário.
moderate-user-drawer-rejected-no-comments = {$username} não possui nenhum comentário rejeitado.
moderate-user-drawer-user-not-found = Usuário não encontrado.
moderate-user-drawer-status-label = Status:
moderate-user-drawer-bio-title = biografia do membro
moderate-user-drawer-username-not-available = Nome de usuário não disponível
moderate-user-drawer-username-not-available-tooltip-title = Nome de usuário não disponível
moderate-user-drawer-username-not-available-tooltip-body = O usuário não concluiu o processo de configuração da conta

moderate-user-drawer-account-history-system = <icon>computador</icon> Sistema
moderate-user-drawer-account-history-suspension-ended = Suspensão encerrada
moderate-user-drawer-account-history-suspension-removed = Suspensão removida
moderate-user-drawer-account-history-banned = Banido
moderate-user-drawer-account-history-ban-removed = Banimento removido
moderate-user-drawer-account-history-site-banned = Site banido
moderate-user-drawer-account-history-site-ban-removed = Banimento do site removido
moderate-user-drawer-account-history-no-history = Nenhuma ação foi realizada nesta conta
moderate-user-drawer-username-change = Mudança de nome de usuário
moderate-user-drawer-username-change-new = Novo:
moderate-user-drawer-username-change-old = Antigo:

moderate-user-drawer-account-history-premod-set = Sempre pré-moderado
moderate-user-drawer-account-history-premod-removed = Pré-moderado removido

moderate-user-drawer-account-history-modMessage-sent = Mensagem do usuário
moderate-user-drawer-account-history-modMessage-acknowledged = Mensagem confirmada em { $acknowledgedAt }

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


moderate-user-drawer-recent-history-title = Histórico de comentários recentes
moderate-user-drawer-recent-history-calculated =
  Calculado nos últimos {frame-timeago-time}
moderate-user-drawer-recent-history-rejected = Rejeitado
moderate-user-drawer-recent-history-tooltip-title = Como isso é calculado?
moderate-user-drawer-recent-history-tooltip-body =
  Comentários rejeitados ÷ (comentários rejeitados + comentários publicados).
  O limite pode ser alterado pelos administradores em Configurar > Moderação.
moderate-user-drawer-recent-history-tooltip-button =
  .aria-label = Alternar dica de ferramenta do histórico de comentários recentes
moderate-user-drawer-recent-history-tooltip-submitted = Enviado

moderate-user-drawer-notes-field =
  .placeholder = Deixe uma nota...
moderate-user-drawer-notes-button = Adicionar nota
moderatorNote-left-by = Deixado por
moderatorNote-delete = Excluir

moderate-user-drawer-all-comments-archiveThreshold-allOfThisUsers =
  Todos os comentários deste usuário do anterior { $value } { $unit ->
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
      [1] Dia
      *[other] Dias
    }
    [week] { $value ->
      [1] Semana
      *[other] Semanas
    }
    [month] { $value ->
      [1] mês
      *[other] meses
    }
    [year] { $value ->
      [1] Ano
      *[other] Anos
    }
    *[other] unidade desconhecida
  }.

# For Review Queue

moderate-forReview-reviewedButton =
  .aria-label = Revisado
moderate-forReview-markAsReviewedButton =
  .aria-label = Marcar como revisado
moderate-forReview-time = Tempo
moderate-forReview-comment = Comentário
moderate-forReview-reportedBy = Reportado por
moderate-forReview-reason = Motivo
moderate-forReview-description = Descrição
moderate-forReview-reviewed = Revisado

moderate-forReview-detectedBannedWord = Palavra banida
moderate-forReview-detectedLinks = Links
moderate-forReview-detectedNewCommenter = Novo comentarista
moderate-forReview-detectedPreModUser = Usuário pré-moderado
moderate-forReview-detectedRecentHistory = Histórico recente
moderate-forReview-detectedRepeatPost = Repetir postagem
moderate-for-Review-detectedSpam = Spam
moderate-forReview-detectedSuspectWord = Palavra suspeita
moderate-forReview-detectedToxic = Linguagem tóxica
moderate-forReview-reportedAbusive = abusivo
moderate-forReview-reportedBio = biografia do usuário
moderate-forReview-reportedOffensive = Ofensivo
moderate-forReview-reportedOther = Outro
moderate-forReview-reportedSpam = Spam

# Archive

moderate-archived-queue-title = Esta história foi arquivada
moderate-archived-queue-noModerationActions =
  Nenhuma ação de moderação pode ser feita nos comentários quando uma história é arquivada.
moderate-archived-queue-toPerformTheseActions =
  Para executar essas ações, desarquive a história.

## Community
community-emptyMessage = Não encontramos ninguém em sua comunidade que corresponda aos seus critérios.

community-filter-searchField =
  .placeholder = Pesquisar por nome de usuário ou endereço de e-mail...
  .aria-label = Pesquise por nome de usuário ou endereço de e-mail
community-filter-searchButton =
  .aria-label = Pesquisar

community-filter-roleSelectField =
  .aria-label = Pesquisar por função

community-filter-statusSelectField =
  .aria-label = Pesquisar por status do usuário

community-changeRoleButton =
  .aria-label = Alterar função

community-assignMySitesToModerator = Atribuir moderador aos meus sites
community-removeMySitesFromModerator = Remover moderador de meus sites
community-assignMySitesToMember = Atribuir membros aos meus sites
community-removeMySitesFromMember = Remover membro de meus sites
community-stillHaveSiteModeratorPrivileges = Eles ainda terão privilégios de moderador do site para:
community-stillHaveMemberPrivileges = Eles ainda terão privilégios de Membro para:
community-userNoLongerPermitted = O usuário não terá mais permissão para tomar decisões de moderação ou atribuir suspensões em:
community-memberNoLongerPermitted = O usuário não receberá mais privilégios de membro em:
community-assignThisUser = Atribuir este usuário a
community-assignYourSitesTo = Atribua seus sites a <strong>{ $username }</strong>
community-siteModeratorsArePermitted = Os moderadores do site têm permissão para tomar decisões de moderação e emitir suspensões nos sites que lhes foram atribuídos.
community-membersArePermitted = Os membros podem receber um distintivo nos sites aos quais foram atribuídos.
community-removeSiteModeratorPermissions = Remover permissões do moderador do site
community-removeMemberPermissions = Remover permissões de membro

community-filter-optGroupAudience =
  .label = Público
community-filter-optGroupOrganization =
  .label = Organização
community-filter-search = Pesquisar
community-filter-showMe = Mostre-me
community-filter-allRoles = Todas as Funções
community-filter-allStatuses = Todos os status

community-column-username = Nome de usuário
community-column-username-not-available = Nome de usuário não disponível
community-column-email-not-available = E-mail não disponível
community-column-username-deleted = Excluído
community-column-email = E-mail
community-column-memberSince = Membro desde
community-column-role = Papel
community-column-status = Status

community-role-popover =
  .description = Uma lista suspensa para alterar a função do usuário

community-siteRoleActions-popover =
  .description = Uma lista suspensa para promover/rebaixar um usuário para/de sites

community-userStatus-popover =
  .description = Uma lista suspensa para alterar o status do usuário

community-userStatus-manageBan = Gerenciar banimento
community-userStatus-suspendUser = Suspender usuário
community-userStatus-suspend = Suspender
community-userStatus-suspendEverywhere = Suspender em qualquer lugar
community-userStatus-removeSuspension = Remover Suspensão
community-userStatus-removeUserSuspension = Remover suspensão
community-userStatus-unknown = Desconhecido
community-userStatus-changeButton =
  .aria-label = Alterar status do usuário
community-userStatus-premodUser = Sempre pré-moderado
community-userStatus-removePremod = Remover pré-moderado

community-banModal-allSites-title = Tem certeza que deseja banir <username></username>?
community-banModal-banEmailDomain = Banir todas as novas contas em { $domain }
community-banModal-specificSites-title = Tem certeza de que deseja gerenciar o status de banimento de <username></username>?
community-banModal-noSites-title = Tem certeza que deseja desbanir <username></username>?
community-banModal-allSites-consequence =
  Uma vez banido, este usuário não poderá mais comentar, usar
  reações ou comentários de relatórios.
community-banModal-noSites-consequence =
  Depois de banido, esse usuário poderá comentar, usar reações e relatar comentários.
community-banModal-specificSites-consequence =
  Essa ação afetará os sites nos quais o usuário poderá comentar, usar reações e relatar comentários.
community-banModal-cancel = Cancelar
community-banModal-updateBan = Salvar
community-banModal-ban = Ban
community-banModal-unban = Desbanir
community-banModal-customize = Personalizar mensagem de e-mail de banimento
community-banModal-reject-existing = Rejeitar todos os comentários deste usuário
community-banModal-reject-existing-specificSites = Rejeitar todos os comentários nestes sites
community-banModal-reject-existing-singleSite = Rejeitar todos os comentários neste site

community-banModal-noSites = Sem sites
community-banModal-banFrom = Banir de
community-banModal-allSites = Todos os sites
community-banModal-specificSites = Sites específicos

community-suspendModal-areYouSure = Suspender <strong>{ $username }</strong>?
community-suspendModal-consequence =
  Uma vez suspenso, este usuário não poderá mais comentar, usar
  reações ou comentários de relatórios.
community-suspendModal-duration-3600 = 1 hora
community-suspendModal-duration-10800 = 3 horas
community-suspendModal-duration-86400 = 24 horas
community-suspendModal-duration-604800 = 7 dias
community-suspendModal-cancel = Cancelar
community-suspendModal-suspendUser = Suspender usuário
community-suspendModal-emailTemplate =
  Olá { $username },

  De acordo com as diretrizes da comunidade de { $organizationName }, sua conta foi temporariamente suspensa. Durante a suspensão, você não poderá comentar, sinalizar ou interagir com outros comentaristas. Por favor, retorne à conversa em {frame-timeago-time}.

community-suspendModal-customize = Personalizar mensagem de e-mail de suspensão

community-suspendModal-success =
  <strong>{ $username }</strong> foi suspenso por <strong>{ $duration }</strong>

community-suspendModal-success-close = Fechar
community-suspendModal-selectDuration = Selecione a duração da suspensão

community-premodModal-areYouSure =
  Tem certeza de que deseja sempre pré-moderar <strong>{ $username }</strong>?
community-premodModal-consequence =
  Todos os seus comentários irão para a fila Pendente até que você remova esse status.
community-premodModal-cancel = Cancelar
community-premodModal-premodUser = Sim, sempre pré-moderado

community-siteRoleModal-assignSites =
  Atribuir sites para <strong>{ $username }</strong>
community-siteRoleModal-assignSitesDescription-siteModerator =
  Os moderadores do site têm permissão para tomar decisões de moderação e emitir suspensões nos sites que lhes foram atribuídos.
community-siteRoleModal-cancel = Cancelar
community-siteRoleModal-update = Atualizar
community-siteRoleModal-selectSites-siteModerator = Selecione sites para moderar
community-siteRoleModal-selectSites-member = Selecione sites para este usuário ser um membro
community-siteRoleModal-noSites = Nenhum site

community-invite-inviteMember = Convidar membros para sua organização
community-invite-emailAddressLabel = Endereço de e-mail:
community-invite-inviteMore = Convidar mais
community-invite-inviteAsLabel = Convidar como:
community-invite-sendInvitations = Enviar convites
community-invite-role-staff =
  <strong>Função da equipe:</strong> recebe um distintivo de "Funcionário" e
  os comentários são aprovados automaticamente. não pode moderar
  ou altere qualquer configuração de { -product-name }.
community-invite-role-moderator =
  <strong>Função de moderador:</strong> Recebe um
  O selo “Staff” e os comentários são automaticamente
  aprovado. Tem privilégios totais de moderação (aprovar,
  rejeitar e apresentar comentários). Pode configurar individualmente
  artigos, mas sem privilégios de configuração em todo o site.
community-invite-role-admin =
  <strong>Função de administrador:</strong> recebe um distintivo de "Equipe" e
  os comentários são aprovados automaticamente. tem cheio
  privilégios de moderação (aprovar, rejeitar e apresentar
  comentários). Pode configurar artigos individuaise tem
  privilégios de configuração em todo o site.
community-invite-invitationsSent = Seus convites foram enviados!
community-invite-close = Fechar
community-invite-invite = Convidar

community-warnModal-success =
  Um aviso foi enviado para <strong>{ $username }</strong>.
community-warnModal-success-close = Ok
community-warnModal-areYouSure = Avisar <strong>{ $username }</strong>?
community-warnModal-consequence = Um aviso pode melhorar a conduta de um comentarista sem suspensão ou banimento. O usuário deve reconhecer o aviso antes de poder continuar comentando.
community-warnModal-message-label = Mensagem
community-warnModal-message-required = Obrigatório
community-warnModal-message-description = Explique a este usuário como ele deve mudar seu comportamento em seu site.
community-warnModal-cancel = Cancelar
community-warnModal-warnUser = Avisar o usuário
community-userStatus-warn = Avisar
community-userStatus-warnEverywhere = Avisar em todos os lugares
community-userStatus-message = Mensagem

community-modMessageModal-success = Uma mensagem foi enviada para <strong>{ $username }</strong>.
community-modMessageModal-success-close = Ok
community-modMessageModal-areYouSure = Mensagem <strong>{ $username }</strong>?
community-modMessageModal-consequence = Envie uma mensagem para um comentarista visível apenas para ele.
community-modMessageModal-message-label = Mensagem
community-modMessageModal-message-required = Obrigatório
community-modMessageModal-cancel = Cancelar
community-modMessageModal-messageUser = Usuário da mensagem

## Stories
stories-emptyMessage = Atualmente não há histórias publicadas.
stories-noMatchMessage = Não encontramos nenhuma história que corresponda aos seus critérios.

stories-filter-searchField =
  .placeholder = Pesquisar por título ou autor da história...
  .aria-label = Pesquise pelo título da história ou autor
stories-filter-searchButton =
  .aria-label = Pesquisar

stories-filter-statusSelectField =
  .aria-label = Pesquisar por status

stories-changeStatusButton =
  .aria-label = Mudar estado

stories-filter-search = Pesquisar
stories-filter-showMe = Mostre-me
stories-filter-allStories = Todas as Histórias
stories-filter-openStories = Histórias abertas
stories-filter-closedStories = Histórias fechadas

stories-column-title = Título
stories-column-author = Autor
stories-column-publishDate = Data de Publicação
stories-column-status = Status
stories-column-clickToModerate = Clique no título para moderar a história
stories-column-reportedCount = Reportado
stories-column-pendingCount = Pendente
stories-column-publishedCount = Publicado

stories-status-popover =
  .description = Uma lista suspensa para alterar o status da história

storyInfoDrawer-rescrapeTriggered = Acionado
storyInfoDrawer-triggerRescrape = Recuperar metadados
storyInfoDrawer-title = Detalhes da história
storyInfoDrawer-titleNotAvailable = Título da história não disponível
storyInfoDrawer-authorNotAvailable = Autor não disponível
storyInfoDrawer-publishDateNotAvailable = Data de publicação não disponível
storyInfoDrawer-scrapedMetaData = Metadados raspados
storyInfoDrawer-configure = Configurar
storyInfoDrawer-storyStatus-open = Abrir
storyInfoDrawer-storyStatus-closed = Fechado
storyInfoDrawer-moderateStory = Moderado
storyInfoDrawerSettings-premodLinksEnable = Pré-moderar comentários contendo links
storyInfoDrawerSettings-premodCommentsEnable = Pré-moderar todos os comentários
storyInfoDrawerSettings-moderation = Moderação
storyInfoDrawerSettings-moderationMode-pre = Pre
storyInfoDrawerSettings-moderationMode-post = Postar
storyInfoDrawerSettings-update = Atualizar
storyInfoDrawer-storyStatus-archiving = Arquivando
storyInfoDrawer-storyStatus-archived = Arquivado


## Invite

invite-youHaveBeenInvited = Você foi convidado para participar de { $organizationName }
invite-FinishSettingUpAccount = Conclua a configuração da conta para:
invite-createAccount = Criar conta
invite-passwordLabel = Senha
invite-passwordDescription = Deve ter pelo menos { $minLength } caracteres
invite-passwordTextFieldd =
  .placeholder = Senha
invite-usernameLabel = Nome de usuário
invite-usernameDescription = Você pode usar “_” e “.”
invite-usernameTextField =
  .placeholder = Nome de usuário
invite-oopsSorry = Ops, desculpe!
invite-successful = Sua conta foi criada
invite-youMayNowSignIn = Agora você pode entrar em { -product-name } usando:
invite-goToAdmin = Ir para { -product-name } Administrador
invite-goToOrganization = Ir para { $organizationName }
invite-tokenNotFound =
  O link especificado é inválido, verifique se foi copiado corretamente.

userDetails-banned-on = <strong>Banido em</strong> { $timestamp }
userDetails-banned-by = <strong>por</strong> { $username }
userDetails-suspended-by = <strong>Suspenso por</strong> { $username }
userDetails-suspension-start = <strong>Início:</strong> { $timestamp }
userDetails-suspension-end = <strong>Fim:</strong> { $timestamp }

userDetails-warned-on = <strong>Avisado em</strong> { $timestamp }
userDetails-warned-by = <strong>por</strong> { $username }
userDetails-warned-explanation = O usuário não reconheceu o aviso.

configure-general-reactions-title = Reações
configure-general-reactions-explanation =
  Permitir sua comunidade para se envolver uns com os outros e se expressar
  com reações de um clique. Por padrão, o Coral permite que os comentaristas "respeitem"
  comentários uns dos outros.
configure-general-reactions-label = Rótulo de reação
configure-general-reactions-input =
  .placeholder = Por exemplo Respeito
configure-general-reactions-active-label = Rótulo de reação ativa
configure-general-reactions-active-input =
  .placeholder = Por exemplo Respeitado
configure-general-reactions-sort-label = Etiqueta de classificação
configure-general-reactions-sort-input =
  .placeholder = Por exemplo Mais respeitado
configure-general-reactions-preview = Visualizar
configure-general-reaction-sortMenu-sortBy = Classificar por

configure-general-badges-title = Emblemas de membros
configure-general-badges-explanation =
  Mostre um selo personalizado para usuários com funções especificadas. Este selo aparece
  no fluxo de comentários e na interface administrativa.
configure-general-badges-label = Texto do crachá
configure-general-badges-staff-member-input =
  .placeholder = Por exemplo Funcionários
configure-general-badges-moderator-input =
  .placeholder = Por exemplo Moderador
configure-general-badges-admin-input =
  .placeholder = Por exemplo Administrador
configure-general-badges-member-input =
  .placeholder = Por exemplo Membro
configure-general-badges-preview = Visualizar
configure-general-badges-staff-member-label = Texto do crachá de membro da equipe
configure-general-badges-admin-label = Texto do crachá do administrador
configure-general-badges-moderator-label = Texto do emblema do moderador
configure-general-badges-member-label = Texto do crachá de membro

configure-general-rte-title = Comentários em rich text
configure-general-rte-express = Ofereça à sua comunidade mais maneiras de se expressar além do texto simples com a formatação rich-text.
configure-general-rte-richTextComments = Comentários em rich text
configure-general-rte-onBasicFeatures = Ativado - negrito, itálico, aspas e listas com marcadores
configure-general-rte-additional = Opções adicionais de rich text
configure-general-rte-strikethrough = Tachado
configure-general-rte-spoiler = Spoiler
configure-general-rte-spoilerDesc =
  Palavras e frases formatadas como Spoiler ficam escondidas atrás de um
  fundo escuro até que o leitor decida revelar o texto.

configure-account-features-title = Recursos de gerenciamento de contas de comentadores
explicação-de-recursos-de-conta-de-configuração =
  Você pode habilitar e desabilitar certos recursos para seus comentaristas usarem
  em seu Perfil. Esses recursos também auxiliam no GDPR
  conformidade.
configure-account-features-allow = Permitir que os usuários:
configure-account-features-change-usernames = Alterar seus nomes de usuário
configure-account-features-change-usernames-details = Os nomes de usuário podem ser alterados uma vez a cada 14 dias.
configure-account-features-yes = Sim
configure-account-features-no = Não
configure-account-features-download-comments = Baixar seus comentários
configure-account-features-download-comments-details = Os comentadores podem baixar um csv de seu histórico de comentários.
configure-account-features-delete-account = Excluir sua conta
configure-account-features-delete-account-details =
  Remove todos os dados de comentários, nome de usuário e endereço de e-mail do site e do banco de dados.

configure-account-features-delete-account-fieldDescriptions =
  Remove todos os dados de comentários, nome de usuário e e-mail
  endereço do site e do banco de dados.

configure-advanced-stories = Criação de história
configure-advanced-stories-explanation = Configurações avançadas de como as histórias são criadas no Coral.
configure-advanced-stories-lazy = Criação lenta de histórias
configure-advanced-stories-lazy-detail = Permita que as histórias sejam criadas automaticamente quando forem publicadas no seu CMS.
configure-advanced-stories-scraping = Raspagem de história
configure-advanced-stories-scraping-detail = Permita que os metadados da história sejam automaticamente copiados quando forem publicados a partir do seu CMS.
configure-advanced-stories-proxy = URL do proxy Scraper
configure-advanced-stories-proxy-detail =
  Quando especificado, permite que as solicitações de extração usem o fornecido
  proxy. Todas as solicitações serão então passadas através do apropriado
  proxy conforme analisado pelo pacote <externalLink>npm proxy-agent</externalLink>.
configure-advanced-stories-custom-user-agent = Cabeçalho do agente do usuário do Scraper personalizado
configure-advanced-stories-custom-user-agent-detail =
  Quando especificado, substitui o cabeçalho <code>User-Agent</code> enviado com cada
  pedido de rascunho.

configure-advanced-stories-authentication = Autenticação
configure-advanced-stories-scrapingCredentialsHeader = Extraindo credenciais
configure-advanced-stories-scraping-usernameLabel = Nome de usuário
configure-advanced-stories-scraping-passwordLabel = Senha

commentAuthor-status-banned = Banido
commentAuthor-status-premod = Pré-mod
commentAuthor-status-suspended = Suspenso

hotkeysModal-title = Atalhos de teclado
hotkeysModal-navigation-shortcuts = Atalhos de navegação
hotkeysModal-shortcuts-next = Próximo comentário
hotkeysModal-shortcuts-prev = Comentário anterior
hotkeysModal-shortcuts-search = Abrir pesquisa
hotkeysModal-shortcuts-jump = Ir para uma fila específica
hotkeysModal-shortcuts-switch = Alternar filas
hotkeysModal-shortcuts-toggle = Ajuda para alternar atalhos
hotkeysModal-shortcuts-single-view = Visualização de comentário único
hotkeysModal-moderation-decisions = Decisões de moderação
hotkeysModal-shortcuts-approve = Aprovar
hotkeysModal-shortcuts-reject = Rejeitar
hotkeysModal-shortcuts-ban = Banir o autor do comentário
hotkeysModal-shortcuts-zen = Alternar visualização de comentário único

authcheck-network-error = Ocorreu um erro de rede. Atualize a página.

dashboard-heading-last-updated = Última atualização:

dashboard-today-heading = Atividade de hoje
dashboard-today-new-comments = Novos comentários
dashboard-alltime-new-comments = Todo o tempo total
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
dashboard-today-rejections = Taxa de rejeição
dashboard-alltime-rejections = Média de todos os tempos
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
  } total
dashboard-today-staffPlus-comments = Funcionários+ comentários
dashboard-alltime-staff-comments = Todo o tempo total
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
dashboard-today-signups = Novos membros da comunidade
dashboard-alltime-signups = Total de membros
dashboard-today-bans = Membros banidos
dashboard-alltime-bans = Total de membros banidos

dashboard-top-stories-today-heading = As histórias mais comentadas de hoje
dashboard-top-stories-table-header-story = História
dashboard-top-stories-table-header-comments = Comentários
dashboard-top-stories-no-comments = Sem comentários hoje

dashboard-commenters-activity-heading = Novos membros da comunidade esta semana

dashboard-comment-activity-heading = Atividade de comentário por hora
dashboard-comment-activity-tooltip-comments = Comentários
dashboard-comment-activity-legend = Média dos últimos 3 dias

conversation-modal-conversationOn = Conversa em:
conversation-modal-moderateStory = História moderada
conversation-modal-showMoreParents = Mostrar mais desta conversa
conversation-modal-showReplies = Mostrar respostas
conversation-modal-commentNotFound = Comentário não encontrado.
conversation-modal-showMoreReplies = Mostrar mais respostas
conversation-modal-header-title = Conversa em:
conversation-modal-header-moderate-link = História moderada