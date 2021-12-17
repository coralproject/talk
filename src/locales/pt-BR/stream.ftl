### Localization for Embed Stream

## General

general-moderate = Moderar

general-userBoxUnauthenticated-joinTheConversation = Participe da conversa
general-userBoxUnauthenticated-signIn = Entrar
general-userBoxUnauthenticated-register = Cadastre-se

general-userBoxAuthenticated-signedIn =
  Logado como
general-userBoxAuthenticated-notYou =
  Não é você? <button>Sair</button>

general-userBox-youHaveBeenSuccessfullySignedOut =
  Você foi desconectado com sucesso

general-tabBar-commentsTab = Comentários
general-tabBar-myProfileTab = Meu Perfil
general-tabBar-discussionsTab = Discussões
general-tabBar-configure = Configurações

## Comment Count

comment-count-text =
  { $count  ->
    [one] Comentário
    *[other] Comentários
  }

## Comments Tab

comments-allCommentsTab = Todos os comentários
comments-featuredTab = Destaques
comments-counter-shortNum = { SHORT_NUMBER($count) }
comments-watchers = { SHORT_NUMBER($count) } online

comments-featuredCommentTooltip-how = Como um comentário é destacado?
comments-featuredCommentTooltip-handSelectedComments =
  Os comentários são selecionados por nossa equipe como merecedores de serem lidos.
comments-featuredCommentTooltip-toggleButton =
  .aria-label = Alternar sugestão de comentários em destaque
  .title = Alternar sugestão de comentários em destaque

comments-collapse-toggle =
  .aria-label = Recolher tópico de comentários
comments-bannedInfo-bannedFromCommenting = Sua conta foi banida de comentar.
comments-bannedInfo-violatedCommunityGuidelines =
  Alguém com acesso à sua conta violou nossas diretrizes da comunidade.
  Como resultado, sua conta foi banida. Você não poder comentar,
  respeitar ou denunciar comentários. Se você acha
  isso foi feito por engano, entre em contato com nossa equipe da comunidade.

comments-noCommentsAtAll = Não existem comentários nesta história.
comments-noCommentsYet = Ainda não há comentários. Seja o primeiro a comentar.

comments-streamQuery-storyNotFound = História não encontrada

comments-commentForm-cancel = Cancelar
comments-commentForm-saveChanges = Salvar alterações
comments-commentForm-submit = Enviar

comments-postCommentForm-submit = Enviar
comments-replyList-showAll = Mostrar Tudo
comments-replyList-showMoreReplies = Carregar Mais

comments-postCommentForm-gifSeach = Procurar por um GIF
comments-postComment-gifSearch-search =
  .aria-label = Pesquisar
comments-postComment-gifSearch-loading = Carregando...
comments-postComment-gifSearch-no-results = Nenhum resultado encontrado para {$query}
comments-postComment-gifSearch-powered-by-giphy =
  .alt = Desenvolvido por giphy

comments-postComment-pasteImage = Colar URL da imagem
comments-postComment-insertImage = Inserir

comments-postComment-confirmMedia-youtube = Adicionar este vídeo do YouTube ao final do seu comentário?
comments-postComment-confirmMedia-twitter = Adicionar este Tweet ao final do seu comentário?
comments-postComment-confirmMedia-cancel = Cancelar
comments-postComment-confirmMedia-add-tweet = Adicionar Tweet
comments-postComment-confirmMedia-add-video = Adicionar vídeo
comments-postComment-confirmMedia-remove = Remover
comments-commentForm-gifPreview-remove = Remover
comments-viewNew =
  { $count ->
    [1] Visualizar {$count} Novo Comentário
    *[other] Visualizar {$count} Novos Comentários
  }
comments-loadMore = Carregar Mais

comments-permalinkPopover =
  .description = Uma caixa de diálogo mostrando um link permanente para o comentário
comments-permalinkPopover-permalinkToComment =
  .aria-label = Link permanente para o comentário
comments-permalinkButton-share = Compartilhar
comments-permalinkButton =
  .aria-label = Compartilhar
comments-permalinkView-viewFullDiscussion = Ver discussão completa
comments-permalinkView-commentRemovedOrDoesNotExist = Este comentário foi removido ou não existe.

comments-rte-bold =
  .title = Negrito

comments-rte-italic =
  .title = Itálico

comments-rte-blockquote =
  .title = Citação

comments-rte-bulletedList =
  .title = Lista com marcadores

comments-rte-strikethrough =
  .title = Tachado

comments-rte-spoiler = Spoiler

comments-rte-sarcasm = Sarcasmo

comments-rte-externalImage =
  .title = Imagem externa

comments-remainingCharacters = { $remaining } caracteres restantes

comments-postCommentFormFake-signInAndJoin = Entre e Participe da Conversa

comments-postCommentForm-rteLabel = Participe da conversa

comments-postCommentForm-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentFormFake-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentForm-userScheduledForDeletion-warning =
  Os comentários ficam desativados quando sua conta está agendada para exclusão.

comments-replyButton-reply = Responder
comments-replyButton =
  .aria-label = Responder

comments-permalinkViewQuery-storyNotFound = { comments-streamQuery-storyNotFound }

comments-replyCommentForm-submit = Responder
comments-replyCommentForm-cancel = Cancelar
comments-replyCommentForm-rteLabel = Escrever uma resposta
comments-replyCommentForm-rte =
  .placeholder = { comments-replyCommentForm-rteLabel }

comments-commentContainer-editButton = Editar

comments-commentContainer-avatar =
  .alt = Avatar de { $username }

comments-editCommentForm-saveChanges = Salvar Mudanças
comments-editCommentForm-cancel = Cancelar
comments-editCommentForm-close = Fechar
comments-editCommentForm-rteLabel = Editar commentários
comments-editCommentForm-rte =
  .placeholder = { comments-editCommentForm-rteLabel }
comments-editCommentForm-editRemainingTime = Editar: <time></time> restantes
comments-editCommentForm-editTimeExpired = O tempo de edição expirou. Você não pode mais editar este comentário. Por que não postar outro?
comments-editedMarker-edited = Editado
comments-showConversationLink-readMore = Leia mais desta conversa >
comments-conversationThread-showMoreOfThisConversation =
  Mostrar mais desta conversa

comments-permalinkView-currentViewing =
comments-permalinkView-singleConversation =
comments-permalinkView-youAreCurrentlyViewing =
  Você está visualizando um
comments-inReplyTo = Em resposta a <username></username>
comments-replyingTo = Respondendo para <Username></Username>

comments-reportButton-report = Denunciar
comments-reportButton-reported = Denunciado
comments-reportButton-aria-report =
  .aria-label = Denunciar
comments-reportButton-aria-reported =
  .aria-label = Denunciado

comments-sortMenu-sortBy = Ordenar Por
comments-sortMenu-newest = Mais novos
comments-sortMenu-oldest = Mais antigos
comments-sortMenu-mostReplies = Mais respostas

comments-userPopover =
  .description = Um menu suspenso com mais informações do usuário
comments-userPopover-memberSince = Membro desde: { DATETIME($timestamp, year: "numeric", month: "long", day: "numeric") }
comments-userPopover-ignore = Ignorar

comments-userIgnorePopover-ignoreUser = Ignorar {$username}?
comments-userIgnorePopover-description =
  Quando você ignora um usuário, todos os comentários
  que ele escreveu no site será escondido de você. Você
  pode desfazer isso mais tarde em Meu perfil.
comments-userIgnorePopover-ignore = Ignorar
comments-userIgnorePopover-cancel = Cancelar

comments-userBanPopover-title = Banir {$username}?
comments-userBanPopover-description =
  Depois de banido, este usuário não poderá mais
  comentar, usar reações ou relatar comentários.
  Este comentário também será rejeitado.
comments-userBanPopover-cancel = Cancelar
comments-userBanPopover-ban = Banir

comments-moderationDropdown-popover =
  .description = Um menu popover para moderar o comentário
comments-moderationDropdown-feature = Destacar
comments-moderationDropdown-unfeature = Remover Destaque
comments-moderationDropdown-approve = Aprovar
comments-moderationDropdown-approved = Aprovado
comments-moderationDropdown-reject = Rejeitar
comments-moderationDropdown-rejected = Rejeitado
comments-moderationDropdown-ban = Banir Usuário
comments-moderationDropdown-banned = Banido
comments-moderationDropdown-goToModerate =
comments-moderationDropdown-moderationView = Visão de moderação
comments-moderationDropdown-moderateStory = Moderar história
comments-moderationDropdown-caretButton =
  .aria-label = Moderar

comments-moderationRejectedTombstone-title = Você rejeitou este comentário.
comments-moderationRejectedTombstone-moderateLink =
  Vá para moderação para revisar esta decisão

comments-featuredTag = Destaques

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

### Q&A

general-tabBar-qaTab = Q&A

qa-answeredTab = Respondidos
qa-unansweredTab = Não-Respondidos
qa-allCommentsTab = Todos

qa-noQuestionsAtAll =
  Não há perguntas nesta história.
qa-noQuestionsYet =
  Não há perguntas ainda. Por que você não pergunta uma?
qa-viewNew =
  { $count ->
    [1] Ver {$count} Nova Pergunta
    *[other] Ver {$count} Novas Perguntas
  }

qa-postQuestionForm-rteLabel = Postar uma pergunta
qa-postQuestionForm-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }
qa-postQuestionFormFake-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }

qa-sortMenu-mostVoted = Mais Votadas

qa-answered-tag = respondeu
qa-expert-tag = especialista

qa-reaction-vote = Votar
qa-reaction-voted = Votado

qa-reaction-aria-vote =
  .aria-label = {$count ->
    [0] Vote no comentário de {$username}
    *[other] Vote ({$count}) no comentário de {$username}
  }
qa-reaction-aria-voted =
  .aria-label = {$count ->
    [0] Votado no comentário de {$username}
    [one] Votado no comentário de {$username}
    *[other] Votado ({$count}) no comentário de {$username}
  }

qa-unansweredTab-doneAnswering = Feito

qa-expert-email = ({ $email })

qa-answeredTooltip-how = Como uma pergunta é respondida?
qa-answeredTooltip-answeredComments =
  Perguntas são respondidas por um especialista Perguntas & Respostas.
qa-answeredTooltip-toggleButton =
  .aria-label = Alternar dica de ferramenta das perguntas respondidas
  .title = Alternar dic de ferramenta das perguntas respondidas

### Account Deletion Stream

comments-stream-deleteAccount-callOut-title =
  Exclusão de conta solicitada
comments-stream-deleteAccount-callOut-receivedDesc =
  Uma solicitação para excluir sua conta foi recebida em { $date }.
comments-stream-deleteAccount-callOut-cancelDesc =
  Se você deseja continuar deixando comentários, respostas ou reações,
  você pode cancelar sua solicitação para excluir sua conta antes de { $date }.
comments-stream-deleteAccount-callOut-cancel =
  Cancelar solicitação de exclusão de conta
comments-stream-deleteAccount-callOut-cancelAccountDeletion =
  Cancelar exclusão de conta

### Embed Links

comments-embedLinks-showEmbeds = Mostrar conteúdo embutido
comments-embedLinks-hideEmbeds = Esconder conteúdo embutido

comments-embedLinks-show-giphy = Mostrar GIF
comments-embedLinks-hide-giphy = Esconder GIF

comments-embedLinks-show-youtube = Mostrar vídeo
comments-embedLinks-hide-youtube = ESconder vídeo

comments-embedLinks-show-twitter = Mostrar Tweet
comments-embedLinks-hide-twitter = Esconder Tweet

comments-embedLinks-show-external = Mostrar imagem
comments-embedLinks-hide-external = Esconder imagem


### Featured Comments
comments-featured-gotoConversation = Ir para a conversa
comments-featured-replies = Respostas

## Profile Tab

profile-myCommentsTab = Meus comentários
profile-myCommentsTab-comments = Meus comentários
profile-accountTab = Conta
profile-preferencesTab = Preferências

### Bio
profile-bio-title = Biografia
profile-bio-description =
  Escreva uma biografia para exibir publicamente em seu perfil. Deve conter
  no máximo 100 caracteres.
profile-bio-remove = Remover
profile-bio-update = Atualizar
profile-bio-success = Sua biografia foi atualizada com sucesso.
profile-bio-removed = Sua biografia foi removida.


### Account Deletion

profile-accountDeletion-deletionDesc =
  Sua conta está agendada para ser excluída em { $date }.
profile-accountDeletion-cancelDeletion =
  Cancelar solicitação de exclusão de conta
profile-accountDeletion-cancelAccountDeletion =
  Cancelar exclusão de conta

### Comment History
profile-historyComment-viewConversation = Ver conversa
profile-historyComment-replies = Respostas {$replyCount}
profile-historyComment-commentHistory = Histórico de Comentários
profile-historyComment-story = História: {$title}
profile-historyComment-comment-on = Comentado em:
profile-profileQuery-errorLoadingProfile = Erro ao carregar o perfil
profile-profileQuery-storyNotFound = História não encontrada
profile-commentHistory-loadMore = Carregar Mais
profile-commentHistory-empty = Você não escreveu nenhum comentário
profile-commentHistory-empty-subheading = Um histórico dos seus comentários aparecerá aqui

### Preferences

profile-preferences-mediaPreferences = Preferências de mídia
profile-preferences-mediaPreferences-alwaysShow = Sempre mostrar GIFs, Tweets, YouTube, etc.
profile-preferences-mediaPreferences-thisMayMake = Isso pode tornar o carregamento de comentários mais lento
profile-preferences-mediaPreferences-update = Atualizar
profile-preferences-mediaPreferences-preferencesUpdated =
  Suas preferências de mídia foram atualizadas

### Account
profile-account-ignoredCommenters = Usuários ignorados
profile-account-ignoredCommenters-description =
  Você pode ignorar outros usuários clicando no nome de usuário
   e selecionando Ignorar. Quando você ignora alguém, todos os comentários dele
   estarão ocultos para você. Os usuários que você ignora ainda poderão
   ver seus comentários.
profile-account-ignoredCommenters-empty = Você não está ignorando ninguém
profile-account-ignoredCommenters-stopIgnoring = Parar de ignorar
profile-account-ignoredCommenters-youAreNoLonger =
  Você não está mais ignorando
profile-account-ignoredCommenters-manage = Gerenciar
profile-account-ignoredCommenters-cancel = Cancelar
profile-account-ignoredCommenters-close = Fechar

profile-account-changePassword-cancel = Cancelar
profile-account-changePassword = Alterar a Senha
profile-account-changePassword-oldPassword = Senha Antiga
profile-account-changePassword-forgotPassword = Esqueceu a senha?
profile-account-changePassword-newPassword = Nova senha
profile-account-changePassword-button = Alterar a senha
profile-account-changePassword-updated =
  Sua senha foi atualizada
profile-account-changePassword-password = Senha

profile-account-download-comments-title = Baixe meu histórico de comentários
profile-account-download-comments-description =
  Você receberá um email com um link para baixar seu histórico de comentários.
   Você pode fazer <strong> uma solicitação de download a cada 14 dias. </strong>
profile-account-download-comments-request =
  Solicitar histórico de comentários
profile-account-download-comments-request-icon =
  .title = Solicitar histórico de comentários
profile-account-download-comments-recentRequest =
  Sua solicitação mais recente: { $timeStamp }
profile-account-download-comments-yourMostRecentRequest =
  Sua solicitação mais recente ocorreu nos últimos 14 dias. Você pode
  solicitar o download de seus comentários novamente em: { $timeStamp }
profile-account-download-comments-requested =
  Solicitação submetida. Você pode submeter outra solicitação em { framework-timeago-time }.
profile-account-download-comments-request-button = Solicitar
profile-account-download-comments-requestSubmitted =
  O seu pedido foi enviado com sucesso. Você pode solicitar o
  download do seu histórico de comentários novamente em { framework-timeago-time }.
profile-account-download-comments-error =
  Não foi possível concluir sua solicitação de download.

## Delete Account

profile-account-deleteAccount-title = Deletar minha conta
profile-account-deleteAccount-deleteMyAccount = Deletar minha conta
profile-account-deleteAccount-description =
  A exclusão de sua conta apagará permanentemente seu perfil e removerá
  todos os seus comentários deste site.
profile-account-deleteAccount-requestDelete = Solicitar exclusão da conta

profile-account-deleteAccount-cancelDelete-description =
  Você já enviou uma solicitação para excluir sua conta.
  Sua conta será excluída em { $date }.
  Você pode cancelar a solicitação até esse momento.
profile-account-deleteAccount-cancelDelete = Cancelar solicitação de exclusão de conta

profile-account-deleteAccount-request = Solicitar
profile-account-deleteAccount-cancel = Cancelar
profile-account-deleteAccount-pages-deleteButton = Deletar minha conta
profile-account-deleteAccount-pages-cancel = Cancelar
profile-account-deleteAccount-pages-proceed = Continuar
profile-account-deleteAccount-pages-done = Pronto
profile-account-deleteAccount-pages-phrase =
  .aria-label = Fase

profile-account-deleteAccount-pages-sharedHeader = Deletar minha conta

profile-account-deleteAccount-pages-descriptionHeader = Deletar minha conta?
profile-account-deleteAccount-pages-descriptionText =
  Você está tentando excluir sua conta. Isso significa:
profile-account-deleteAccount-pages-allCommentsRemoved =
  Todos os seus comentários são removidos deste site
profile-account-deleteAccount-pages-allCommentsDeleted =
  Todos os seus comentários são excluídos do nosso banco de dados
profile-account-deleteAccount-pages-emailRemoved =
  O seu endereço de email foi removido do nosso sistema

profile-account-deleteAccount-pages-whenHeader = Deletar minha conta: quando?
profile-account-deleteAccount-pages-whenSubHeader = Quando?
profile-account-deleteAccount-pages-whenSec1Header =
  Quando minha conta será excluída?
profile-account-deleteAccount-pages-whenSec1Content =
  Sua conta será excluída 24 horas após o envio da sua solicitação.
profile-account-deleteAccount-pages-whenSec2Header =
  Ainda posso escrever comentários até a minha conta ser excluída?
profile-account-deleteAccount-pages-whenSec2Content =
  Não. Depois de solicitar a exclusão da conta, você não poderá mais escrever comentários,
  responda a comentários ou selecione reações.

profile-account-deleteAccount-pages-downloadCommentHeader = Baixar meus comentários?
profile-account-deleteAccount-pages-downloadSubHeader = Baixar meus comentários
profile-account-deleteAccount-pages-downloadCommentsDesc =
  Antes de sua conta ser excluída, recomendamos que você baixe seu comentário
  histórico para seus registros. Depois que sua conta for excluída, você será
  incapaz de solicitar seu histórico de comentários.
profile-account-deleteAccount-pages-downloadCommentsPath =
  Meu perfil > Baixar meu histórico de comentários

profile-account-deleteAccount-pages-confirmHeader = Confirmar exclusão da conta?
profile-account-deleteAccount-pages-confirmSubHeader = Você tem certeza?
profile-account-deleteAccount-pages-confirmDescHeader =
  Tem certeza de que deseja excluir sua conta?
profile-account-deleteAccount-confirmDescContent =
  Para confirmar que você deseja excluir sua conta, digite o seguinte
  frase na caixa de texto abaixo:
profile-account-deleteAccount-pages-confirmPhraseLabel =
  Para confirmar, digite a frase abaixo:
profile-account-deleteAccount-pages-confirmPasswordLabel =
  Insira sua senha:

profile-account-deleteAccount-pages-completeHeader = Exclusão de conta solicitada
profile-account-deleteAccount-pages-completeSubHeader = Solicitação enviada
profile-account-deleteAccount-pages-completeDescript =
  Sua solicitação foi enviada e uma confirmação foi enviada para o e-mail
  endereço associado à sua conta.
profile-account-deleteAccount-pages-completeTimeHeader =
  Sua conta será excluída em: { $date }
profile-account-deleteAccount-pages-completeChangeYourMindHeader = Mudou de ideia?
profile-account-deleteAccount-pages-completeSignIntoYourAccount =
  Basta fazer login na sua conta novamente antes desse horário e selecionar
  <strong> Cancelar solicitação de exclusão de conta </strong>.
profile-account-deleteAccount-pages-completeTellUsWhy = Diga-nos o porquê.
profile-account-deleteAccount-pages-completeWhyDeleteAccount =
  Gostaríamos de saber por que você optou por excluir sua conta. Envie-nos um feedback sobre
  nosso sistema de comentários por e-mail { $email }.
profile-account-changePassword-edit = Editar
profile-account-changePassword-change = Alterar


## Notifications
profile-notificationsTab = Notificações
profile-account-notifications-emailNotifications = Notificações de e-mail
profile-account-notifications-emailNotifications = Notificações de e-mail
profile-account-notifications-receiveWhen = Receba notificações quando:
profile-account-notifications-onReply = Meu comentário for respondido
profile-account-notifications-onFeatured = Meu comentário for destacado
profile-account-notifications-onStaffReplies = Um membro da equipe responde ao meu comentário
profile-account-notifications-onModeration = Meu comentário pendente foi revisado
profile-account-notifications-sendNotifications = Enviar notificações:
profile-account-notifications-sendNotifications-immediately = Imediatamente
profile-account-notifications-sendNotifications-daily = Diariamente
profile-account-notifications-sendNotifications-hourly = A cada hora
profile-account-notifications-updated = Suas configurações de notificação foram atualizadas
profile-account-notifications-button = Atualizar configurações de notificação
profile-account-notifications-button-update = Atualizar

## Report Comment Popover
comments-reportPopover =
  .description = Uma caixa de diálogo para relatar comentários
comments-reportPopover-reportThisComment = Denunciar este comentário
comments-reportPopover-whyAreYouReporting = Por que você está denunciando este comentário?

comments-reportPopover-reasonOffensive = Este comentário é ofensivo
comments-reportPopover-reasonAbusive = Este é um comportamento abusivo
comments-reportPopover-reasonIDisagree = Eu não concordo com esse comentário
comments-reportPopover-reasonSpam = Isso parece um anúncio ou marketing
comments-reportPopover-reasonOther = Outros

comments-reportPopover-additionalInformation =
  Informação adicional <optional>Opcional</optional>
comments-reportPopover-pleaseLeaveAdditionalInformation =
  Por favor, deixe qualquer informação adicional que possa ser útil para nossos moderadores. (Opcional)

comments-reportPopover-maxCharacters = Máximo { $maxCharacters } Caracteres
comments-reportPopover-restrictToMaxCharacters = Restrinja seu relatório a { $maxCharacters } caracteres
comments-reportPopover-cancel = Cancelar
comments-reportPopover-submit = Denunciar

comments-reportPopover-thankYou = Obrigado!
comments-reportPopover-receivedMessage =
  Recebemos sua mensagem. Denuncias de membros como você mantêm a comunidade segura.

comments-reportPopover-dismiss = Dispensar

## Submit Status
comments-submitStatus-dismiss = Dispensar
comments-submitStatus-submittedAndWillBeReviewed =
  Seu comentário foi enviado e será revisado por um moderador
comments-submitStatus-submittedAndRejected =
  Este comentário foi rejeitado por violar nossos termos de uso.

# Configure
configure-configureQuery-errorLoadingProfile = Erro ao carregar o configure
configure-configureQuery-storyNotFound = História não encontrada

## Change username
profile-changeUsername-username = Usuário
profile-changeUsername-success = Seu nome de usuário foi atualizado com sucesso
profile-changeUsername-edit = Editar
profile-changeUsername-change = Alterar
profile-changeUsername-heading = Edite seu nome de usuário
profile-changeUsername-heading-changeYourUsername = Alterar seu nome de usuário
profile-changeUsername-desc = Altere o nome de usuário que aparecerá em todos os seus comentários anteriores e futuros. <strong> Nomes de usuário podem ser alterados uma vez a cada { framework-timeago-time }. </strong>
profile-changeUsername-desc-text = Altere o nome de usuário que aparecerá em todos os seus comentários anteriores e futuros. Os nomes de usuário podem ser alterados uma vez a cada { framework-timeago-time }.
profile-changeUsername-current = Nome de usuário atual
profile-changeUsername-newUsername-label = Novo usuário
profile-changeUsername-confirmNewUsername-label = Confirme o novo nome de usuário
profile-changeUsername-cancel = Cancelar
profile-changeUsername-save = Salvar
profile-changeUsername-saveChanges = Salvar alterações
profile-changeUsername-recentChange = Seu nome de usuário foi alterado em { framework-timeago-time }. Você pode alterar seu nome de usuário novamente em { $nextUpdate }
profile-changeUsername-youChangedYourUsernameWithin =
  Você alterou seu nome de usuário no(s) último(s) { framework-timeago-time }. Você pode alterar seu nome de usuário novamente em: { $nextUpdate }.
profile-changeUsername-close = Fechar

## Discussions tab

discussions-mostActiveDiscussions = Discussões mais ativas
discussions-mostActiveDiscussions-subhead = Classificado com o maior número de comentários recebidos nas últimas 24 horas em { $siteName }
discussions-mostActiveDiscussions-empty = Você não participou de nenhuma discussão
discussions-myOngoingDiscussions = Minhas discussões em andamento
discussions-myOngoingDiscussions-subhead = Onde você comentou via { $orgName }
discussions-viewFullHistory = Ver o histórico de comentários completo
discussions-discussionsQuery-errorLoadingProfile = Erro ao carregar perfil
discussions-discussionsQuery-storyNotFound = História não encontrada

## Comment Stream
configure-stream-title =
configure-stream-title-configureThisStream =
  Configurar este Fluxo
configure-stream-apply =
configure-stream-update = Atualizar
configure-stream-streamHasBeenUpdated =
  Este fluxo foi atualizado

configure-premod-title =
configure-premod-premoderateAllComments = Pré-moderar todos os comentários
configure-premod-description =
  Os moderadores devem aprovar qualquer comentário antes de ser publicado neste fluxo.

configure-premodLink-title =
configure-premodLink-commentsContainingLinks =
  Pré-moderar comentários que possuem links
configure-premodLink-description =
  Os moderadores devem aprovar qualquer comentário que contenha um link antes de ser publicado.

configure-messageBox-title =
configure-addMessage-title =
  Adicione uma mensagem ou pergunta
configure-messageBox-description =
configure-addMessage-description =
  Adicione uma mensagem ao topo da caixa de comentários para seus leitores.
  Use isso para representar um tópico, faça uma pergunta ou faça anúncios
  relacionados a essa história.
configure-addMessage-addMessage = Adicionar mensagem
configure-addMessage-removed = A mensagem foi removida
config-addMessage-messageHasBeenAdded =
  A mensagem foi adicionada à caixa de comentários
configure-addMessage-remove = Remover
configure-addMessage-submitUpdate = Atualizar
configure-addMessage-cancel = Cancelar
configure-addMessage-submitAdd = Adicionar mensagem

configure-messageBox-preview = Visualizar
configure-messageBox-selectAnIcon = Selecione um ícone
configure-messageBox-iconConversation = Conversa
configure-messageBox-iconDate = Data
configure-messageBox-iconHelp = Ajuda
configure-messageBox-iconWarning = Aviso
configure-messageBox-iconChatBubble = Chat
configure-messageBox-noIcon = Sem ícone
configure-messageBox-writeAMessage = Escreve uma mensagem

configure-closeStream-title =
configure-closeStream-closeCommentStream =
  Fechar fluxo de comentários
configure-closeStream-description =
  Este fluxo de comentários está aberto no momento. Ao fechar este fluxo de comentários,
  nenhum novo comentário pode ser enviado e todos os comentários enviados anteriormente
  ainda serão exibidos.
configure-closeStream-closeStream = Fechar Fluxo de Comentários
configure-closeStream-theStreamIsNowOpen = O flxuo agora está aberto

configure-openStream-title = Fluxo aberto
configure-openStream-description =
  Este fluxo de comentários está atualmente fechado. Abrindo este fluxo de comentários
  novos comentários podem ser enviados e exibidos.
configure-openStream-openStream = Abrir Fluxo
configure-openStream-theStreamIsNowClosed = O fluxo agora está fechado

configure-moderateThisStream =

qa-experimentalTag-tooltip-content =
  O formato de perguntas e respostas está atualmente em desenvolvimento ativo. Entre em
  contato conosco para qualquer feedback ou solicitação.

configure-enableQA-title =
configure-enableQA-switchToQA =
  Mudar para formato Perguntas & Respostas
configure-enableQA-description =
  O formato de Perguntas & Respostas permite aos membros da comunidade
  enviar perguntas para especialistas selecionados responderem.
configure-enableQA-enableQA = Mudar para Perguntas & Respostas
configure-enableQA-streamIsNowComments =
  Este fluxo está agora em formato de comentários

configure-disableQA-title = Configurar esta Perguntas & Respostas
configure-disableQA-description =
  O formato de Perguntas & Respostas permite membros da comunidade
  enviarem perguntas para especialistas responderem.
configure-disableQA-disableQA = Trocar para Comentários
configure-disableQA-streamIsNowQA =
  Este stream está agora em formato de perguntas e respostas

configure-experts-title = Adicionar um Especialista
configure-experts-filter-searchField =
  .placeholder = Buscar por email ou nome do usuário
  .aria-label = Buscar por email ou nome do usuário
configure-experts-filter-searchButton =
  .aria-label = Buscar
configure-experts-filter-description =
  Adiciona um crachá "Especialista" em comentários por usuários
  registrados, apenas nesta página. Novos usuários devem se registrar
  e abrir os comentários em uma página para criar sua conta.
configure-experts-search-none-found = Nenhum usuário foi encontrado com esse email ou Nome de Usuário
configure-experts-remove-button = Remover
configure-experts-load-more = Carregar Mais
configure-experts-none-yet = Não existem especialistas para estas Peguntas & Respostas no momento.
configure-experts-search-title = Procurar por um especialista
configure-experts-assigned-title = Especialistas
configure-experts-noLongerAnExpert = Não é mais um especialista
comments-tombstone-ignore = Este comentário está oculto porque você ignorou {$username}
comments-tombstone-showComment = Mostrar comentário
comments-tombstone-deleted =
  Este comentário não está mais disponível. O usuário excluiu sua conta.

suspendInfo-heading =
suspendInfo-heading-yourAccountHasBeen =
  Sua conta foi temporariamente suspensa de comentar.
suspendInfo-info =
suspendInfo-description-inAccordanceWith =
  Em concordância com as regras da comunidade { $organization }, sua
  conta foi temporariamente suspensa. Enquanto suspenso, você não
  poderá comentar, respeitar ou denunciar comentários. Por favor, junte-se a conversa
  em { $until }.
suspendInfo-until-pleaseRejoinThe =
  Volte a conversa em { $until }

warning-heading = Sua conta recebeu um aviso
warning-explanation =
  De acordo com as diretrizes da nossa comunidade, foi emitido um aviso para sua conta.
warning-instructions =
  Para continuar participando das discussões, pressione o botão "Reconhecer" abaixo.
warning-acknowledge = Reconhecer

warning-notice = Sua conta recebeu uma advertência. Para continuar comentando, <a>verifique a mensagem de aviso</a>.

profile-changeEmail-unverified = (Não verificado)
profile-changeEmail-edit = Editar
profile-changeEmail-change = Alterar
profile-changeEmail-please-verify = Verifique seu endereço de e-mail
profile-changeEmail-please-verify-details =
  Um email foi enviado para { $email } para verificar sua conta.
  Você deve verificar seu novo endereço de e-mail antes que ele possa ser usado
  para fazer login na sua conta ou receber notificações.
profile-changeEmail-resend = Reenviar notificação
profile-changeEmail-heading = Edite seu endereço de email
profile-changeEmail-changeYourEmailAddress =
  Alterar o seu endereço de email
profile-changeEmail-desc = Altere o endereço de email usado para fazer login e receber comunicações sobre sua conta.
profile-changeEmail-current = Email atual
profile-changeEmail-newEmail-label = Novo Endereço de Email
profile-changeEmail-password = Senha
profile-changeEmail-password-input =
  .placeholder = Senha
profile-changeEmail-cancel = Cancelar
profile-changeEmail-submit = Salvar
profile-changeEmail-saveChanges = Salvar alterações
profile-changeEmail-email = Email
profile-changeEmail-title = Endereço de email
profile-changeEmail-success = Seu e-mail foi atualizado com sucesso

## Ratings and Reviews

ratingsAndReviews-reviewsTab = Reviews
ratingsAndReviews-questionsTab = Perguntas
ratingsAndReviews-noReviewsAtAll = Não há reviews.
ratingsAndReviews-noQuestionsAtAll = Não há perguntas.
ratingsAndReviews-noReviewsYet = Ainda não há reviews. Por que você não escreve um?
ratingsAndReviews-noQuestionsYet = Não há perguntas ainda. Por que você não faz uma?
ratingsAndReviews-selectARating = Selecione uma Avaliação
ratingsAndReviews-youRatedThis = Você avaliou isto.
ratingsAndReviews-showReview = Exibir review
  .title = { ratingsAndReviews-showReview }
ratingsAndReviews-rateAndReview = Avaliar e escrever review
ratingsAndReviews-askAQuestion = Faça uma Pergunta
ratingsAndReviews-basedOnRatings = { $count ->
  [0] Sem avaliações ainda
  [1] Baseado em 1 avaliação
  *[other] Baseado em { SHORT_NUMBER($count) } avaliações
}

ratingsAndReviews-allReviewsFilter = Todos os reviews
ratingsAndReviews-starReviewsFilter = { $rating ->
  [1] 1 Estrela
  *[other] { $rating } Estrelas
}

comments-addAReviewForm-rteLabel = Adicione um review (opcional)

comments-addAReviewForm-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

comments-addAReviewFormFake-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

stream-footer-links-top-of-article = Topo do artigo
stream-footer-links-top-of-comments = Topo dos comentários
stream-footer-links-profile = Perfil & Respostas
stream-footer-links-discussions = Mais discussões
