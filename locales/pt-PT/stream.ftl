### Localization for Embed Stream

## General

general-commentsEmbedSection =
  .aria-label = Comentários incorporados
general-moderate = Moderar
general-archived = Arquivado

general-userBoxUnauthenticated-joinTheConversation = Participe na conversa
general-userBoxUnauthenticated-signIn = Entrar
general-userBoxUnauthenticated-register = Registar-se

general-authenticationSection =
  .aria-label = Autenticação

general-userBoxAuthenticated-signedIn =
  Sessão iniciada como
general-userBoxAuthenticated-notYou =
  Não é si? <button>Sair</button>

general-userBox-youHaveBeenSuccessfullySignedOut =
  A sua sessão foi terminada com sucesso

general-tabBar-commentsTab = Comentários
general-tabBar-myProfileTab = O Meu Perfil
general-tabBar-discussionsTab = Discussões
general-tabBar-reviewsTab = Revisões
general-tabBar-configure = Configurações
general-tabBar-notifications = Notificações
general-tabBar-notifications-hasNew = Notificações (novas)

general-mainTablist =
  .aria-label = Lista de separadores principal

general-secondaryTablist =
  .aria-label = Lista de separadores secundária

## Comment Count

comment-count-text =
  { $count  ->
    [one] Comentário
    *[other] Comentários
  }

comment-count-text-ratings =
  { $count  ->
    [one] Avaliação
    *[other] Avaliações
  }

## Comments Tab

addACommentButton =
  .aria-label = Adicionar um comentário. Este botão moverá o foco para a parte inferior dos comentários.

comments-allCommentsTab = Todos os comentários
comments-featuredTab = Destaques
comments-counter-shortNum = { SHORT_NUMBER($count) }
comments-watchers = { SHORT_NUMBER($count) } online

comments-announcement-section =
  .aria-label = Anúncio
comments-announcement-closeButton =
  .aria-label = Fechar anúncio

comments-accountStatus-section =
  .aria-label = Estado da conta


comments-featuredCommentTooltip-how = Como é que um comentário é destacado?
comments-featuredCommentTooltip-handSelectedComments =
  Os comentários são selecionados pela nossa equipa como merecedores de leitura.
comments-featuredCommentTooltip-toggleButton =
  .aria-label = Alternar sugestão de comentários em destaque
  .title = Alternar sugestão de comentários em destaque

comment-top-commenter-tooltip-header = <icon></icon> Principais comentaristas
comment-top-commenter-tooltip-details = Um dos seus comentários foi destaque nos últimos 10 dias
comment-new-commenter-tooltip-details = Novo comentarista, diga olá
comments-collapse-toggle-with-username =
  .aria-label = Ocultar comentário de { $username } e as suas respostas
comments-collapse-toggle-without-username =
  .aria-label = Ocultar comentário e as suas respostas
comments-expand-toggle-with-username =
  .aria-label = Mostrar comentário de { $username } e as suas respostas
comments-expand-toggle-without-username =
  .aria-label = Mostrar comentário e as suas respostas


comments-bannedInfo-bannedFromCommenting = A sua conta foi banida de comentar.
comments-bannedInfo-violatedCommunityGuidelines =
  Alguém com acesso à sua conta violou as nossas diretrizes da comunidade.
  Como resultado, a sua conta foi banida. Não pode comentar,
  reagir ou denunciar comentários. Se achar
  que isto foi feito por engano, entre em contacto com a nossa equipa da comunidade.

comments-noCommentsAtAll = Não existem comentários nesta história.
comments-noCommentsYet = Ainda não há comentários. Seja o primeiro a comentar.

comments-streamQuery-storyNotFound = História não encontrada

comments-communityGuidelines-section =
  .aria-label = Diretrizes da Comunidade

comments-commentForm-cancel = Cancelar
comments-commentForm-saveChanges = Guardar alterações
comments-commentForm-submit = Enviar

comments-postCommentForm-section =
  .aria-label = Publicar um comentário

comments-postCommentForm-submit = Enviar
comments-replyList-showAll = Mostrar Tudo
comments-replyList-showMoreReplies = Carregar Mais

comments-postComment-gifSearch = Pesquisar um GIF
comments-postComment-gifSearch-search =
  .aria-label = Pesquisar
comments-postComment-gifSearch-loading = A carregar...
comments-postComment-gifSearch-no-results = Nenhum resultado encontrado para {$query}
comments-postComment-gifSearch-search-loadMore = Carregar mais
comments-postComment-gifSearch-powered-by-giphy =
  .alt = Desenvolvido por Giphy
comments-postComment-gifSearch-powered-by-tenor =
  .alt = Desenvolvido por Tenor

comments-postComment-pasteImage = Colar URL da imagem
comments-postComment-insertImage = Inserir

comments-postComment-confirmMedia-youtube = Adicionar este vídeo do YouTube ao final do seu comentário?
comments-postComment-confirmMedia-twitter = Adicionar este Tweet ao final do seu comentário?
comments-postComment-confirmMedia-bluesky = Adicionar esta publicação ao final do seu comentário?
comments-postComment-confirmMedia-cancel = Cancelar
comments-postComment-confirmMedia-add-tweet = Adicionar Tweet
comments-postComment-confirmMedia-add-bluesky = Adicionar publicação
comments-postComment-confirmMedia-add-video = Adicionar vídeo
comments-postComment-confirmMedia-remove = Remover
comments-commentForm-gifPreview-remove = Remover
comments-viewNew-loading = A carregar...
comments-viewNew =
  { $count ->
    [1] Ver {$count} Novo Comentário
    *[other] Ver {$count} Novos Comentários
  }
comments-loadMore = Carregar Mais
comments-loadAll = Carregar Todos os Comentários
comments-loadAll-loading = A carregar...

comments-permalinkPopover =
  .description = Uma caixa de diálogo que mostra um link permanente para o comentário
comments-permalinkPopover-permalinkToComment =
  .aria-label = Link permanente para o comentário
comments-permalinkButton-share = Partilhar
comments-permalinkButton =
  .aria-label = Partilhar
comments-permalinkButton-copyReportLink = Link do Relatório
comments-permalinkView-section =
  .aria-label = Conversa individual
comments-permalinkView-viewFullDiscussion = Ver discussão completa
comments-permalinkView-commentRemovedOrDoesNotExist = Este comentário foi removido ou não existe.

comments-permalinkView-reportIllegalContent-title = Denunciar conteúdo potencialmente ilegal
comments-permalinkView-reportIllegalContent-description = Preencha este formulário da melhor forma possível para que a nossa equipa de moderação possa tomar uma decisão e, se necessário, consultar o departamento jurídico do nosso site.
comments-permalinkView-reportIllegalContent-reportingComment = Está a denunciar este comentário
comments-permalinkView-reportIllegalContent-lawBrokenDescription-inputLabel = Qual a lei que acredita ter sido violada? (obrigatório)
comments-permalinkView-reportIllegalContent-additionalInformation-inputLabel = Por favor, inclua informações adicionais sobre o porquê deste comentário ser ilegal (obrigatório)
comments-permalinkView-reportIllegalContent-additionalInformation-helperText = Qualquer detalhe que incluir ajudar-nos-á a investigar mais a fundo
comments-permalinkView-reportIllegalContent-additionalComments-inputLabel = Pretende denunciar outros comentários por conterem conteúdo potencialmente ilegal?
comments-permalinkView-reportIllegalContent-bonafideBelief-checkbox = Acredito que as informações incluídas neste relatório são precisas e completas
comments-permalinkView-reportIllegalContent-additionalComments-addCommentURLButton = <Button></Button>Adicionar
comments-permalinkView-reportIllegalContent-additionalComment-commentURLButton = URL do comentário
comments-permalinkView-reportIllegalContent-additionalComments-deleteButton = <icon></icon> Eliminar
comments-permalinkView-reportIllegalContent-submit = Enviar relatório
comments-permalinkView-reportIllegalContent-additionalComments-commentNotFoundError = Comentário não encontrado. Por favor, introduza um URL de comentário válido
comments-permalinkView-reportIllegalContent-additionalComments-validCommentURLError = Este URL não é válido. Por favor, introduza um URL de comentário válido
comments-permalinkView-reportIllegalContent-additionalComments-uniqueCommentURLError = Já adicionou este comentário a este relatório. Por favor, adicione um URL de comentário único
comments-permalinkView-reportIllegalContent-additionalComments-validCommentURLLengthError = O comprimento do URL do comentário adicional excede o máximo.
comments-permalinkView-reportIllegalContent-additionalComments-previouslyReportedCommentError = Já denunciou anteriormente este comentário por conter conteúdo potencialmente ilegal. Só pode denunciar um comentário por este motivo uma vez.
comments-permalinkView-reportIllegalContent-confirmation-successHeader = Recebemos a sua denúncia de conteúdo ilegal
comments-permalinkView-reportIllegalContent-confirmation-description = A sua denúncia será revista pela nossa equipa de moderação. Receberá uma notificação assim que uma decisão for tomada. Se o conteúdo for
  considerado potencialmente ilegal, será removido do site e poderão ser tomadas medidas adicionais contra o comentarista.
comments-permalinkView-reportIllegalContent-confirmation-errorHeader = Obrigado por enviar esta denúncia
comments-permalinkView-reportIllegalContent-confirmation-errorDescription = Não conseguimos enviar a sua denúncia pelos seguintes motivos:
comments-permalinkView-reportIllegalContent-confirmation-returnToComments = Pode agora fechar este separador para voltar aos comentários

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

comments-postCommentFormFake-signInAndJoin = Entre e Participe na Conversa

comments-postCommentForm-rteLabel = Participe na conversa

comments-postCommentForm-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentFormFake-rte =
  .placeholder = { comments-postCommentForm-rteLabel }


comments-replyButton-reply = Responder
comments-replyButton =
  .aria-label = Responder

comments-permalinkViewQuery-storyNotFound = { comments-streamQuery-storyNotFound }

comments-replyCommentForm-submit = Responder
comments-replyCommentForm-cancel = Cancelar
comments-replyCommentForm-rteLabel = Escrever uma resposta
comments-replyCommentForm-rte =
  .placeholder = { comments-replyCommentForm-rteLabel }

comments-commentContainer-threadLevelLabel = Nível do Tópico { $level }:
comments-commentContainer-highlightedLabel = Destaque:
comments-commentContainer-ancestorLabel = Antecessor:
comments-commentContainer-replyLabel =
  Resposta de { $username } <RelativeTime></RelativeTime>
comments-commentContainer-questionLabel =
  Pergunta de { $username } <RelativeTime></RelativeTime>
comments-commentContainer-commentLabel =
  Comentário de { $username } <RelativeTime></RelativeTime>

comments-commentContainer-editButton = Editar

comments-commentContainer-avatar =
  .alt = Avatar de { $username }

comments-editCommentForm-saveChanges = Guardar Alterações
comments-editCommentForm-cancel = Cancelar
comments-editCommentForm-close = Fechar
comments-editCommentForm-rteLabel = Editar comentários
comments-editCommentForm-rte =
  .placeholder = { comments-editCommentForm-rteLabel }
comments-editCommentForm-editRemainingTime = Editar: <time></time> restantes
comments-editCommentForm-editTimeExpired = O tempo de edição expirou. Já não pode editar este comentário. Porque não publica outro?
comments-editedMarker-edited = Editado
comments-showConversationLink-readMore = Ler mais desta conversa >
comments-conversationThread-showMoreOfThisConversation =
  Mostrar mais desta conversa

comments-permalinkView-currentViewing =
comments-permalinkView-singleConversation =
comments-permalinkView-youAreCurrentlyViewing =
  Está atualmente a ver uma
comments-inReplyTo = Em resposta a <username></username>
comments-replyingTo = A responder a <Username></Username>

comments-reportButton-report = Denunciar
comments-reportButton-reported = Denunciado
comments-reportButton-aria-report =
  .aria-label = Denunciar
comments-reportButton-aria-reported =
  .aria-label = Denunciado

comments-sortMenu-sortBy = Ordenar Por
comments-sortMenu-newest = Mais recentes
comments-sortMenu-oldest = Mais antigos
comments-sortMenu-mostReplies = Mais respostas

comments-userPopover =
  .description = Um menu suspenso com mais informações do utilizador
comments-userPopover-memberSince = Membro desde: { DATETIME($timestamp, year: "numeric", month: "long", day: "numeric") }
comments-userPopover-ignore = Ignorar

comments-userIgnorePopover-ignoreUser = Ignorar {$username}?
comments-userIgnorePopover-description =
  Quando ignorar um utilizador, todos os comentários
  que escreveu no site ficarão ocultos para si. Pode
  desfazer isto mais tarde em O Meu Perfil.
comments-userIgnorePopover-ignore = Ignorar
comments-userIgnorePopover-cancel = Cancelar

comments-userSpamBanPopover-title = Banimento por Spam
comments-userSpamBanPopover-header-username = Nome de utilizador
comments-userSpamBanPopover-header-description = O banimento por Spam irá
comments-userSpamBanPopover-callout = Apenas para uso em contas de spam óbvias
comments-userSpamBanPopover-description-list-banFromComments = Banir esta conta dos comentários
comments-userSpamBanPopover-description-list-rejectAllComments = Rejeitar todos os comentários escritos por esta conta
comments-userSpamBanPopover-confirmation = Digite "{$text}" para confirmar

comments-userBanPopover-title = Banir {$username}?
comments-userSiteBanPopover-title = Banir {$username} deste site?
comments-userBanPopover-description =
  Depois de banido, este utilizador já não poderá
  comentar, usar reações ou denunciar comentários.
  Este comentário também será rejeitado.
comments-userBanPopover-cancel = Cancelar
comments-userBanPopover-ban = Banir

comments-userBanPopover-moderator-ban-error = Não é possível banir contas com privilégios de moderador
comments-userBanPopover-moreContext = Para mais contexto, aceda a
comments-userBanPopover-moderationView = Vista de Moderação

comments-userSiteBanPopover-confirm-title = {$username} está agora banido
comments-userSiteBanPopover-confirm-spam-banned = Esta conta já não pode comentar, usar reações ou denunciar comentários
comments-userSiteBanPopover-confirm-comments-rejected = Todos os comentários feitos por esta conta foram rejeitados
comments-userSiteBanPopover-confirm-closeButton = Fechar
comments-userSiteBanPopover-confirm-reviewAccountHistory = Ainda é possível rever o histórico desta conta pesquisando na secção de Comunidade do Coral
comments-userSiteBanPopover-confirm-communitySection = Secção da Comunidade

comments-moderationDropdown-popover =
  .description = Um menu popover para moderar o comentário
comments-moderationDropdown-feature = Destacar
comments-moderationDropdown-unfeature = Remover Destaque
comments-moderationDropdown-approve = Aprovar
comments-moderationDropdown-approved = Aprovado
comments-moderationDropdown-reject = Rejeitar
comments-moderationDropdown-rejected = Rejeitado
comments-moderationDropdown-spam-ban = Banir Spam
comments-moderationDropdown-ban = Banir Utilizador
comments-moderationDropdown-siteBan = Banir Site
comments-moderationDropdown-banned = Banido
comments-moderationDropdown-goToModerate =
comments-moderationDropdown-moderationView = Vista de moderação
comments-moderationDropdown-moderateStory = Moderar história
comments-moderationDropdown-caretButton =
  .aria-label = Moderar

comments-moderationDropdown-embedCode = Incorporar código
comments-moderationDropdown-embedCodeCopied = Código Copiado

comments-moderationRejectedTombstone-title = Rejeitou este comentário.
comments-moderationRejectedTombstone-moderateLink =
  Aceda à moderação para rever esta decisão

comments-featuredTag = Destaques
comments-featuredBy = Destaques por <strong>{$username}</strong>

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

comments-jumpToComment-title = A sua resposta foi publicada abaixo
comments-jumpToComment-GoToReply = Ir para a resposta
comments-mobileToolbar-unmarkAll = Marcar todos como lidos
comments-mobileToolbar-nextUnread = Próximo não lido
comments-refreshComments-closeButton = Fechar <icon></icon>
  .aria-label = Fechar
comments-refreshComments-refreshButton = <icon></icon> Atualizar comentários
  .aria-label = Atualizar comentários
comments-refreshQuestions-refreshButton = <icon></icon> Atualizar perguntas
  .aria-label = Atualizar perguntas
comments-refreshReviews-refreshButton = <icon></icon> Atualizar revisões
  .aria-label = Atualizar revisões
comments-replyChangedWarning-theCommentHasJust =
  Este comentário acabou de ser editado. A versão mais recente está a ser exibida acima.
comments-mobileToolbar-notifications-closeButton =
  .aria-label = Fechar notificações

### Q&A

general-tabBar-qaTab = P&R

qa-postCommentForm-section =
  .aria-label = Publicar uma Pergunta

qa-answeredTab = Respondidas
qa-unansweredTab = Não Respondidas
qa-allCommentsTab = Todas

qa-answered-answerLabel =
  Resposta de {$username} <RelativeTime></RelativeTime>
qa-answered-gotoConversation = Ir para a conversa
qa-answered-replies = Respostas


qa-noQuestionsAtAll =
  Não há perguntas nesta história.
qa-noQuestionsYet =
  Ainda não há perguntas. Porque não faz uma?
qa-viewNew-loading = A carregar...
qa-viewNew =
  { $count ->
    [1] Ver {$count} Nova Pergunta
    *[other] Ver {$count} Novas Perguntas
  }

qa-postQuestionForm-rteLabel = Publicar uma pergunta
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
    [0] Votar no comentário de {$username}
    *[other] Votar ({$count}) no comentário de {$username}
  }
qa-reaction-aria-voted =
  .aria-label = {$count ->
    [0] Votado no comentário de {$username}
    [one] Votado no comentário de {$username}
    *[other] Votado ({$count}) no comentário de {$username}
  }

qa-unansweredTab-doneAnswering = Concluído

qa-expert-email = ({ $email })

qa-answeredTooltip-how = Como é que uma pergunta é respondida?
qa-answeredTooltip-answeredComments =
  As perguntas são respondidas por um especialista de Perguntas & Respostas.
qa-answeredTooltip-toggleButton =
  .aria-label = Alternar sugestão das perguntas respondidas
  .title = Alternar sugestão das perguntas respondidas

### Account Deletion Stream

comments-stream-deleteAccount-callOut-title =
  Eliminação de conta solicitada
comments-stream-deleteAccount-callOut-receivedDesc =
  Foi recebido um pedido para eliminar a sua conta em { $date }.
comments-stream-deleteAccount-callOut-cancelDesc =
  Se pretender continuar a deixar comentários, respostas ou reações,
  pode cancelar o seu pedido de eliminação de conta antes de { $date }.
comments-stream-deleteAccount-callOut-cancel =
  Cancelar pedido de eliminação de conta
comments-stream-deleteAccount-callOut-cancelAccountDeletion =
  Cancelar eliminação de conta

comments-permalink-copyLink = Copiar Link
comments-permalink-linkCopied = Link copiado


### Embed Links

comments-embedLinks-showEmbeds = Mostrar conteúdo incorporado
comments-embedLinks-hideEmbeds = Ocultar conteúdo incorporado

comments-embedLinks-show-gif = Mostrar GIF
comments-embedLinks-hide-gif = Ocultar GIF

comments-embedLinks-show-youtube = Mostrar vídeo
comments-embedLinks-hide-youtube = Ocultar vídeo

comments-embedLinks-show-twitter = Mostrar Tweet
comments-embedLinks-hide-twitter = Ocultar Tweet

comments-embedLinks-show-bluesky = Mostrar publicação
comments-embedLinks-hide-bluesky = Ocultar publicação

comments-embedLinks-show-external = Mostrar imagem
comments-embedLinks-hide-external = Ocultar imagem

comments-embedLinks-expand = Expandir

### Featured Comments
comments-featured-label =
  Comentário destacado por {$username} <RelativeTime></RelativeTime>
comments-featured-gotoConversation = Ir para a conversa
comments-featured-replies = Respostas

comments-featured-gotoConversation-label-with-username =
  .aria-label = Ir para a conversa deste comentário em destaque pelo utilizador { $username } no fluxo principal de comentários
comments-featured-gotoConversation-label-without-username =
  .aria-label = Ir para a conversa deste comentário em destaque no fluxo principal de comentários
comments-featured-replies = Respostas


## Profile Tab

profile-myCommentsTab = Os meus comentários
profile-myCommentsTab-comments = Os meus comentários
profile-accountTab = Conta
profile-preferencesTab = Preferências

### Bio
profile-bio-title = Biografia
profile-bio-description =
  Escreva uma biografia para exibir publicamente no seu perfil. Deve conter
  no máximo 100 caracteres.
profile-bio-remove = Remover
profile-bio-update = Atualizar
profile-bio-success = A sua biografia foi atualizada com sucesso.
profile-bio-removed = A sua biografia foi removida.


### Account Deletion

profile-accountDeletion-deletionDesc =
  A sua conta está agendada para ser eliminada em { $date }.
profile-accountDeletion-cancelDeletion =
  Cancelar pedido de eliminação de conta
profile-accountDeletion-cancelAccountDeletion =
  Cancelar eliminação de conta

### Comment History
profile-commentHistory-section =
  .aria-label = Histórico de Comentários
profile-historyComment-commentLabel =
  Comentário <RelativeTime></RelativeTime> em { $storyTitle }
profile-historyComment-viewConversation = Ver conversa
profile-historyComment-replies = Respostas {$replyCount}
profile-historyComment-commentHistory = Histórico de Comentários
profile-historyComment-story = História: {$title}
profile-historyComment-comment-on = Comentado em:
profile-profileQuery-errorLoadingProfile = Erro ao carregar o perfil
profile-profileQuery-storyNotFound = História não encontrada
profile-commentHistory-loadMore = Carregar Mais
profile-commentHistory-empty = Não escreveu nenhum comentário
profile-commentHistory-empty-subheading = Um histórico dos seus comentários aparecerá aqui

profile-commentHistory-archived-thisIsAllYourComments =
  Estes são todos os seus comentários anteriores dos últimos { $value } { $unit ->
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
  }. Para ver o restante dos seus comentários, entre em contacto connosco.

### Preferences

profile-preferences-mediaPreferences = Preferências de multimédia
profile-preferences-mediaPreferences-alwaysShow = Mostrar sempre GIFs, Tweets, YouTube, etc.
profile-preferences-mediaPreferences-thisMayMake = Isto pode tornar o carregamento de comentários mais lento
profile-preferences-mediaPreferences-update = Atualizar
profile-preferences-mediaPreferences-preferencesUpdated =
  As suas preferências de multimédia foram atualizadas

### Account
profile-account-ignoredCommenters = Utilizadores ignorados
profile-account-ignoredCommenters-description =
  Pode ignorar outros utilizadores clicando no nome de utilizador
   e selecionando Ignorar. Quando ignorar alguém, todos os comentários
   dessa pessoa ficarão ocultos para si. Os utilizadores que ignorar ainda poderão
   ver os seus comentários.
profile-account-ignoredCommenters-empty = Não está a ignorar ninguém
profile-account-ignoredCommenters-stopIgnoring = Parar de ignorar
profile-account-ignoredCommenters-youAreNoLonger =
  Já não está a ignorar
profile-account-ignoredCommenters-manage = Gerir
profile-account-ignoredCommenters-cancel = Cancelar
profile-account-ignoredCommenters-close = Fechar

profile-account-changePassword-cancel = Cancelar
profile-account-changePassword = Alterar a Palavra-passe
profile-account-changePassword-oldPassword = Palavra-passe Antiga
profile-account-changePassword-forgotPassword = Esqueceu a palavra-passe?
profile-account-changePassword-newPassword = Nova palavra-passe
profile-account-changePassword-button = Alterar a palavra-passe
profile-account-changePassword-updated =
  A sua palavra-passe foi atualizada
profile-account-changePassword-password = Palavra-passe

profile-account-download-comments-title = Transferir o meu histórico de comentários
profile-account-download-comments-description =
  Receberá um e-mail com um link para transferir o seu histórico de comentários.
   Pode fazer <strong>um pedido de transferência a cada 14 dias.</strong>
profile-account-download-comments-request =
  Solicitar histórico de comentários
profile-account-download-comments-request-icon =
  .title = Solicitar histórico de comentários
profile-account-download-comments-recentRequest =
  O seu pedido mais recente: { $timeStamp }
profile-account-download-comments-yourMostRecentRequest =
  O seu pedido mais recente ocorreu nos últimos 14 dias. Pode
  solicitar a transferência dos seus comentários novamente em: { $timeStamp }
profile-account-download-comments-requested =
  Pedido submetido. Pode submeter outro pedido em { framework-timeago-time }.
profile-account-download-comments-request-button = Solicitar
profile-account-download-comments-requestSubmitted =
  O seu pedido foi enviado com sucesso. Pode solicitar a
  transferência do seu histórico de comentários novamente em { framework-timeago-time }.
profile-account-download-comments-error =
  Não foi possível concluir o seu pedido de transferência.

## Delete Account

profile-account-deleteAccount-title = Eliminar a minha conta
profile-account-deleteAccount-deleteMyAccount = Eliminar a minha conta
profile-account-deleteAccount-description =
  A eliminação da sua conta apagará permanentemente o seu perfil e removerá
  todos os seus comentários deste site.
profile-account-deleteAccount-requestDelete = Solicitar eliminação da conta

profile-account-deleteAccount-cancelDelete-description =
  Já enviou um pedido para eliminar a sua conta.
  A sua conta será eliminada em { $date }.
  Pode cancelar o pedido até essa data.
profile-account-deleteAccount-cancelDelete = Cancelar pedido de eliminação de conta

profile-account-deleteAccount-request = Solicitar
profile-account-deleteAccount-cancel = Cancelar
profile-account-deleteAccount-pages-deleteButton = Eliminar a minha conta
profile-account-deleteAccount-pages-cancel = Cancelar
profile-account-deleteAccount-pages-proceed = Continuar
profile-account-deleteAccount-pages-done = Concluído
profile-account-deleteAccount-pages-phrase =
  .aria-label = Frase

profile-account-deleteAccount-pages-sharedHeader = Eliminar a minha conta

profile-account-deleteAccount-pages-descriptionHeader = Eliminar a minha conta?
profile-account-deleteAccount-pages-descriptionText =
  Está a tentar eliminar a sua conta. Isto significa:
profile-account-deleteAccount-pages-allCommentsRemoved =
  Todos os seus comentários são removidos deste site
profile-account-deleteAccount-pages-allCommentsDeleted =
  Todos os seus comentários são eliminados da nossa base de dados
profile-account-deleteAccount-pages-emailRemoved =
  O seu endereço de e-mail foi removido do nosso sistema

profile-account-deleteAccount-pages-whenHeader = Eliminar a minha conta: quando?
profile-account-deleteAccount-pages-whenSubHeader = Quando?
profile-account-deleteAccount-pages-whenSec1Header =
  Quando será eliminada a minha conta?
profile-account-deleteAccount-pages-whenSec1Content =
  A sua conta será eliminada 24 horas após o envio do seu pedido.
profile-account-deleteAccount-pages-whenSec2Header =
  Ainda posso escrever comentários até a minha conta ser eliminada?
profile-account-deleteAccount-pages-whenSec2Content =
  Não. Depois de solicitar a eliminação da conta, já não poderá escrever comentários,
  responder a comentários ou selecionar reações.

profile-account-deleteAccount-pages-downloadCommentHeader = Transferir os meus comentários?
profile-account-deleteAccount-pages-downloadSubHeader = Transferir os meus comentários
profile-account-deleteAccount-pages-downloadCommentsDesc =
  Antes de a sua conta ser eliminada, recomendamos que transfira o seu histórico de comentários
  para os seus registos. Depois de a sua conta ser eliminada, não poderá
  solicitar o seu histórico de comentários.
profile-account-deleteAccount-pages-downloadCommentsPath =
  O Meu Perfil > Transferir o meu histórico de comentários

profile-account-deleteAccount-pages-confirmHeader = Confirmar eliminação da conta?
profile-account-deleteAccount-pages-confirmSubHeader = Tem a certeza?
profile-account-deleteAccount-pages-confirmDescHeader =
  Tem a certeza de que pretende eliminar a sua conta?
profile-account-deleteAccount-confirmDescContent =
  Para confirmar que pretende eliminar a sua conta, escreva a seguinte
  frase na caixa de texto abaixo:
profile-account-deleteAccount-pages-confirmPhraseLabel =
  Para confirmar, escreva a frase abaixo:
profile-account-deleteAccount-pages-confirmPasswordLabel =
  Introduza a sua palavra-passe:

profile-account-deleteAccount-pages-completeHeader = Eliminação de conta solicitada
profile-account-deleteAccount-pages-completeSubHeader = Pedido enviado
profile-account-deleteAccount-pages-completeDescript =
  O seu pedido foi enviado e uma confirmação foi enviada para o endereço de e-mail
  associado à sua conta.
profile-account-deleteAccount-pages-completeTimeHeader =
  A sua conta será eliminada em: { $date }
profile-account-deleteAccount-pages-completeChangeYourMindHeader = Mudou de ideias?
profile-account-deleteAccount-pages-completeSignIntoYourAccount =
  Basta iniciar sessão na sua conta novamente antes dessa hora e selecionar
  <strong>Cancelar pedido de eliminação de conta</strong>.
profile-account-deleteAccount-pages-completeTellUsWhy = Diga-nos o porquê.
profile-account-deleteAccount-pages-completeWhyDeleteAccount =
  Gostaríamos de saber por que razão optou por eliminar a sua conta. Envie-nos o seu feedback sobre
  o nosso sistema de comentários por e-mail { $email }.
profile-account-changePassword-edit = Editar
profile-account-changePassword-change = Alterar

stream-footer-navigation =
  .aria-label = Rodapé de Comentários

## Notifications
notifications-title = Notificações
notifications-loadMore = Carregar Mais
notifications-loadNew = Carregar Novas
notifications-adjustPreferences = Ajustar definições de notificação em O Meu Perfil &gt;<button>Preferências.</button>
notification-comment-toggle-default-open = - Comentário
notification-comment-toggle-default-closed = + Comentário
notifications-comment-showRemovedComment = + Mostrar comentário removido
notifications-comment-hideRemovedComment = - Ocultar comentário removido
notification-comment-description-featured = o seu comentário em "{ $title }" foi destacado por um membro da nossa equipa.
notification-comment-description-default = em "{ $title }"
notification-comment-media-image = Imagem
notification-comment-media-embed = Incorporação
notification-comment-media-gif = GIF
notifications-yourIllegalContentReportHasBeenReviewed =
  A sua denúncia de conteúdo ilegal foi revista
notifications-yourCommentHasBeenRejected =
  O seu comentário foi rejeitado
notifications-yourCommentHasBeenApproved =
  O seu comentário foi aprovado
notifications-yourPreviouslyRejectedCommentHasBeenApproved =
  O seu comentário foi anteriormente rejeitado. Foi agora aprovado.
notifications-yourCommentHasBeenFeatured =
  O seu comentário foi destacado
notifications-yourCommentHasReceivedAReply =
  Nova resposta de { $author }
notifications-defaultTitle = Notificação
notifications-rejectedComment-body =
  O conteúdo do seu comentário violou as nossas diretrizes da comunidade. O comentário foi removido.
notifications-rejectedComment-wasPending-body =
  O conteúdo do seu comentário violou as nossas diretrizes da comunidade.
notifications-reasonForRemoval = Motivo da remoção
notifications-legalGrounds = Fundamentos legais
notifications-additionalExplanation = Explicação adicional
notifications-repliedComment-hideReply = - Ocultar a resposta
notifications-repliedComment-showReply = + Mostrar a resposta
notifications-repliedComment-hideOriginalComment = - Ocultar o meu comentário original
notifications-repliedComment-showOriginalComment = + Mostrar o meu comentário original
notifications-dsaReportLegality-legal = Conteúdo legal
notifications-dsaReportLegality-illegal = Conteúdo potencialmente ilegal
notifications-dsaReportLegality-unknown = Desconhecido
notifications-rejectionReason-offensive = Este comentário contém linguagem ofensiva
notifications-rejectionReason-abusive = Este comentário contém linguagem abusiva
notifications-rejectionReason-spam = Este comentário é spam
notifications-rejectionReason-bannedWord = Palavra banida
notifications-rejectionReason-ad = Este comentário é um anúncio
notifications-rejectionReason-illegalContent = Este comentário contém conteúdo potencialmente ilegal
notifications-rejectionReason-harassmentBullying = Este comentário contém linguagem de assédio ou bullying
notifications-rejectionReason-misinformation = Este comentário contém desinformação
notifications-rejectionReason-hateSpeech = Este comentário contém discurso de ódio
notifications-rejectionReason-irrelevant = Este comentário é irrelevante para a discussão
notifications-rejectionReason-other = Outro
notifications-rejectionReason-other-customReason = Outro - { $customReason }
notifications-rejectionReason-unknown = Desconhecido
notifications-reportDecisionMade-legal =
  Em <strong>{ $date }</strong> denunciou um comentário escrito por <strong>{ $author }</strong> por conter conteúdo potencialmente ilegal. Após rever a sua denúncia, a nossa equipa de moderação decidiu que este comentário <strong>não parece conter conteúdo ilegal.</strong> Obrigado por ajudar a manter a nossa comunidade segura.
notifications-reportDecisionMade-illegal =
  Em <strong>{ $date }</strong> denunciou um comentário escrito por <strong>{ $author }</strong> por conter conteúdo potencialmente ilegal. Após rever a sua denúncia, a nossa equipa de moderação decidiu que este comentário <strong>contém conteúdo ilegal</strong> e foi removido. Poderão ser tomadas medidas adicionais contra o autor do comentário, no entanto, não será notificado de quaisquer passos adicionais. Obrigado por ajudar a manter a nossa comunidade segura.
notifications-methodOfRedress-none =
  Todas as decisões de moderação são finais e não podem ser contestadas
notifications-methodOfRedress-email =
  Para contestar uma decisão que aparece aqui, entre em contacto com <a>{ $email }</a>
notifications-methodOfRedress-url =
  Para contestar uma decisão que aparece aqui, visite <a>{ $url }</a>
notifications-youDoNotCurrentlyHaveAny = Não tem notificações atualmente
notifications-floatingIcon-close = fechar

## Notifications
profile-notificationsTab = Notificações
profile-account-notifications-emailNotifications = Notificações de e-mail
profile-account-notifications-emailNotifications = Notificações de e-mail
profile-account-notifications-receiveWhen = Receber notificações quando:
profile-account-notifications-onReply = O meu comentário for respondido
profile-account-notifications-onFeatured = O meu comentário for destacado
profile-account-notifications-onStaffReplies = Um membro da equipa responde ao meu comentário
profile-account-notifications-onModeration = O meu comentário pendente foi revisto
profile-account-notifications-sendNotifications = Enviar notificações:
profile-account-notifications-sendNotifications-immediately = Imediatamente
profile-account-notifications-sendNotifications-daily = Diariamente
profile-account-notifications-sendNotifications-hourly = A cada hora
profile-account-notifications-updated = As suas definições de notificação foram atualizadas
profile-account-notifications-button = Atualizar definições de notificação
profile-account-notifications-button-update = Atualizar

profile-account-notifications-inPageNotifications = Notificações
profile-account-notifications-includeInPageWhen = Avisar-me quando

profile-account-notifications-inPageNotifications-on = Badges ligadas
profile-account-notifications-inPageNotifications-off = Badges desligadas

profile-account-notifications-showReplies-fromAnyone = de qualquer pessoa
profile-account-notifications-showReplies-fromStaff = de um membro da equipa
profile-account-notifications-showReplies =
  .aria-label = Mostrar respostas de

## Report Comment Popover
comments-reportPopover =
  .description = Uma caixa de diálogo para denunciar comentários
comments-reportPopover-reportThisComment = Denunciar este comentário
comments-reportPopover-whyAreYouReporting = Por que razão está a denunciar este comentário?

comments-reportPopover-reasonOffensive = Este comentário é ofensivo
comments-reportPopover-reasonAbusive = Este é um comportamento abusivo
comments-reportPopover-reasonIDisagree = Não concordo com este comentário
comments-reportPopover-reasonSpam = Isto parece um anúncio ou marketing
comments-reportPopover-reasonOther = Outros

comments-reportPopover-additionalInformation =
  Informação adicional <optional>Opcional</optional>
comments-reportPopover-pleaseLeaveAdditionalInformation =
  Por favor, deixe qualquer informação adicional que possa ser útil para os nossos moderadores. (Opcional)

comments-reportPopover-maxCharacters = Máximo { $maxCharacters } Caracteres
comments-reportPopover-restrictToMaxCharacters = Restrinja a sua denúncia a { $maxCharacters } caracteres
comments-reportPopover-cancel = Cancelar
comments-reportPopover-submit = Denunciar

comments-reportPopover-thankYou = Obrigado!
comments-reportPopover-receivedMessage =
  Recebemos a sua mensagem. Denúncias de membros como si mantêm a comunidade segura.

comments-reportPopover-dismiss = Dispensar
comments-reportForm-reportIllegalContent-button = Este comentário contém potencialmente conteúdo ilegal
comments-reportForm-signInToReport = Precisa de iniciar sessão para denunciar um comentário que viola as nossas diretrizes

## Archived Report Comment Popover

comments-archivedReportPopover-reportThisComment = Denunciar Este Comentário
comments-archivedReportPopover-doesThisComment =
  Este comentário viola as nossas diretrizes da comunidade? É ofensivo ou spam?
  Envie um e-mail para a nossa equipa de moderação em <a>{ $orgName }</a> com um link para
  este comentário e uma breve explicação.
comments-archivedReportPopover-needALink =
  Precisa de um link para este comentário?
comments-archivedReportPopover-copyLink = Copiar link
comments-archivedReportPopover-emailSubject = Denunciar comentário
comments-archivedReportPopover-emailBody =
  Gostaria de denunciar o seguinte comentário:
  %0A
  { $permalinkURL }
  %0A
  %0A
  Pelos motivos declarados abaixo:

## Submit Status
comments-submitStatus-dismiss = Dispensar
comments-submitStatus-submittedAndWillBeReviewed =
  O seu comentário foi enviado e será revisto por um moderador
comments-submitStatus-submittedAndRejected =
  Este comentário foi rejeitado por violar os nossos termos de utilização.

# Configure
configure-configureQuery-errorLoadingProfile = Erro ao carregar a configuração
configure-configureQuery-storyNotFound = História não encontrada

## Archive
configure-archived-title = Este fluxo de comentários foi arquivado
configure-archived-onArchivedStream =
  Nos fluxos arquivados, não podem ser enviados novos comentários, reações ou denúncias.
  Além disso, os comentários não podem ser moderados.
configure-archived-toAllowTheseActions =
  Para permitir estas ações, desarquive o fluxo.
configure-archived-unarchiveStream = Desarquivar fluxo

## Change username
profile-changeUsername-username = Utilizador
profile-changeUsername-success = O seu nome de utilizador foi atualizado com sucesso
profile-changeUsername-edit = Editar
profile-changeUsername-change = Alterar
profile-changeUsername-heading = Editar o seu nome de utilizador
profile-changeUsername-heading-changeYourUsername = Alterar o seu nome de utilizador
profile-changeUsername-desc = Altere o nome de utilizador que aparecerá em todos os seus comentários anteriores e futuros. <strong>Os nomes de utilizador podem ser alterados uma vez a cada { framework-timeago-time }.</strong>
profile-changeUsername-desc-text = Altere o nome de utilizador que aparecerá em todos os seus comentários anteriores e futuros. Os nomes de utilizador podem ser alterados uma vez a cada { framework-timeago-time }.
profile-changeUsername-current = Nome de utilizador atual
profile-changeUsername-newUsername-label = Novo utilizador
profile-changeUsername-confirmNewUsername-label = Confirme o novo nome de utilizador
profile-changeUsername-cancel = Cancelar
profile-changeUsername-save = Guardar
profile-changeUsername-saveChanges = Guardar alterações
profile-changeUsername-recentChange = O seu nome de utilizador foi alterado há { framework-timeago-time }. Pode alterar o seu nome de utilizador novamente em { $nextUpdate }
profile-changeUsername-youChangedYourUsernameWithin =
  Alterou o seu nome de utilizador nos últimos { framework-timeago-time }. Pode alterar o seu nome de utilizador novamente em: { $nextUpdate }.
profile-changeUsername-close = Fechar

## Discussions tab

discussions-mostActiveDiscussions = Discussões mais ativas
discussions-mostActiveDiscussions-subhead = Ordenadas pelo maior número de comentários recebidos nas últimas 24 horas em { $siteName }
discussions-mostActiveDiscussions-empty = Não participou em nenhuma discussão
discussions-myOngoingDiscussions = As minhas discussões em curso
discussions-myOngoingDiscussions-subhead = Onde comentou via { $orgName }
discussions-viewFullHistory = Ver o histórico completo de comentários
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
  Pré-moderar comentários que contenham links
configure-premodLink-description =
  Os moderadores devem aprovar qualquer comentário que contenha um link antes de ser publicado.

configure-messageBox-title =
configure-addMessage-title =
  Adicionar uma mensagem ou pergunta
configure-messageBox-description =
configure-addMessage-description =
  Adicione uma mensagem ao topo da caixa de comentários para os seus leitores.
  Use isto para introduzir um tópico, fazer uma pergunta ou fazer anúncios
  relacionados com esta história.
configure-addMessage-addMessage = Adicionar mensagem
configure-addMessage-removed = A mensagem foi removida
config-addMessage-messageHasBeenAdded =
  A mensagem foi adicionada à caixa de comentários
configure-addMessage-remove = Remover
configure-addMessage-submitUpdate = Atualizar
configure-addMessage-cancel = Cancelar
configure-addMessage-submitAdd = Adicionar mensagem

configure-messageBox-preview = Pré-visualizar
configure-messageBox-selectAnIcon = Selecionar um ícone
configure-messageBox-iconConversation = Conversa
configure-messageBox-iconDate = Data
configure-messageBox-iconHelp = Ajuda
configure-messageBox-iconWarning = Aviso
configure-messageBox-iconChatBubble = Chat
configure-messageBox-noIcon = Sem ícone
configure-messageBox-writeAMessage = Escrever uma mensagem

configure-closeStream-title =
configure-closeStream-closeCommentStream =
  Fechar fluxo de comentários
configure-closeStream-description =
  Este fluxo de comentários está aberto de momento. Ao fechar este fluxo de comentários,
  não podem ser enviados novos comentários e todos os comentários enviados anteriormente
  continuarão a ser exibidos.
configure-closeStream-closeStream = Fechar Fluxo de Comentários
configure-closeStream-theStreamIsNowOpen = O fluxo está agora aberto

configure-openStream-title = Fluxo aberto
configure-openStream-description =
  Este fluxo de comentários está atualmente fechado. Ao abrir este fluxo de comentários,
  podem ser enviados e exibidos novos comentários.
configure-openStream-openStream = Abrir Fluxo
configure-openStream-theStreamIsNowClosed = O fluxo está agora fechado

configure-moderateThisStream =

qa-experimentalTag-tooltip-content =
  O formato de perguntas e respostas está atualmente em desenvolvimento ativo. Entre em
  contacto connosco para qualquer feedback ou solicitação.

configure-enableQA-title =
configure-enableQA-switchToQA =
  Mudar para formato Perguntas & Respostas
configure-enableQA-description =
  O formato de Perguntas & Respostas permite aos membros da comunidade
  enviar perguntas para especialistas selecionados responderem.
configure-enableQA-enableQA = Mudar para Perguntas & Respostas
configure-enableQA-streamIsNowComments =
  Este fluxo está agora em formato de comentários

configure-disableQA-title = Configurar estas Perguntas & Respostas
configure-disableQA-description =
  O formato de Perguntas & Respostas permite aos membros da comunidade
  enviarem perguntas para especialistas responderem.
configure-disableQA-disableQA = Mudar para Comentários
configure-disableQA-streamIsNowQA =
  Este fluxo está agora em formato de perguntas e respostas

configure-experts-title = Adicionar um Especialista
configure-experts-filter-searchField =
  .placeholder = Pesquisar por e-mail ou nome de utilizador
  .aria-label = Pesquisar por e-mail ou nome de utilizador
configure-experts-filter-searchButton =
  .aria-label = Pesquisar
configure-experts-filter-description =
  Adiciona um crachá "Especialista" em comentários de utilizadores
  registados, apenas nesta página. Novos utilizadores devem registar-se
  e abrir os comentários numa página para criar a sua conta.
configure-experts-search-none-found = Nenhum utilizador foi encontrado com esse e-mail ou Nome de Utilizador
configure-experts-
configure-experts-remove-button = Remover
configure-experts-load-more = Carregar Mais
configure-experts-none-yet = Não existem especialistas para estas Perguntas & Respostas de momento.
configure-experts-search-title = Procurar um especialista
configure-experts-assigned-title = Especialistas
configure-experts-noLongerAnExpert = Já não é um especialista
comments-tombstone-ignore-user = Este comentário está oculto porque ignorou este utilizador.
comments-tombstone-showComment = Mostrar comentário
comments-tombstone-deleted =
  Este comentário já não está disponível. O utilizador eliminou a sua conta.
comments-tombstone-rejected =
  Este comentário foi removido por um moderador por violar as nossas diretrizes da comunidade.

suspendInfo-heading =
suspendInfo-heading-yourAccountHasBeen =
  A sua conta foi temporariamente suspensa de comentar.
suspendInfo-info =
suspendInfo-description-inAccordanceWith =
  De acordo com as regras da comunidade { $organization }, a sua
  conta foi temporariamente suspensa. Enquanto suspenso, não
  poderá comentar, reagir ou denunciar comentários. Por favor, junte-se à conversa
  em { $until }.
suspendInfo-until-pleaseRejoinThe =
  Volte à conversa em { $until }

warning-heading = A sua conta recebeu um aviso
warning-explanation =
  De acordo com as diretrizes da nossa comunidade, foi emitido um aviso para a sua conta.
warning-instructions =
  Para continuar a participar nas discussões, prima o botão "Reconhecer" abaixo.
warning-acknowledge = Reconhecer

warning-notice = A sua conta recebeu um aviso. Para continuar a comentar, <a>verifique a mensagem de aviso</a>.

modMessage-heading = A sua conta recebeu uma mensagem de um moderador
modMessage-acknowledge = Reconhecer

profile-changeEmail-unverified = (Não verificado)
profile-changeEmail-edit = Editar
profile-changeEmail-change = Alterar
profile-changeEmail-please-verify = Verifique o seu endereço de e-mail
profile-changeEmail-please-verify-details =
  Foi enviado um e-mail para { $email } para verificar a sua conta.
  Deve verificar o seu novo endereço de e-mail antes de poder ser utilizado
  para iniciar sessão na sua conta ou receber notificações.
profile-changeEmail-resend = Reenviar notificação
profile-changeEmail-heading = Editar o seu endereço de e-mail
profile-changeEmail-changeYourEmailAddress =
  Alterar o seu endereço de e-mail
profile-changeEmail-desc = Altere o endereço de e-mail utilizado para iniciar sessão e receber comunicações sobre a sua conta.
profile-changeEmail-current = E-mail atual
profile-changeEmail-newEmail-label = Novo Endereço de E-mail
profile-changeEmail-password = Palavra-passe
profile-changeEmail-password-input =
  .placeholder = Palavra-passe
profile-changeEmail-cancel = Cancelar
profile-changeEmail-submit = Guardar
profile-changeEmail-saveChanges = Guardar alterações
profile-changeEmail-email = E-mail
profile-changeEmail-title = Endereço de e-mail
profile-changeEmail-success = O seu e-mail foi atualizado com sucesso

## Ratings and Reviews

ratingsAndReviews-postCommentForm-section =
  .aria-label = Enviar uma Avaliação ou fazer uma Pergunta

ratingsAndReviews-reviewsTab = Avaliações
ratingsAndReviews-questionsTab = Perguntas
ratingsAndReviews-noReviewsAtAll = Não há avaliações.
ratingsAndReviews-noQuestionsAtAll = Não há perguntas.
ratingsAndReviews-noReviewsYet = Ainda não há avaliações. Porque não escreve uma?
ratingsAndReviews-noQuestionsYet = Não há perguntas ainda. Porque não faz uma?
ratingsAndReviews-selectARating = Selecionar uma Avaliação
ratingsAndReviews-youRatedThis = Avaliou isto.
ratingsAndReviews-showReview = Exibir avaliação
  .title = { ratingsAndReviews-showReview }
ratingsAndReviews-rateAndReview = Avaliar e escrever avaliação
ratingsAndReviews-askAQuestion = Fazer uma Pergunta
ratingsAndReviews-basedOnRatings = { $count ->
  [0] Sem avaliações ainda
  [1] Baseado em 1 avaliação
  *[other] Baseado em { SHORT_NUMBER($count) } avaliações
}

ratingsAndReviews-allReviewsFilter = Todas as avaliações
ratingsAndReviews-starReviewsFilter = { $rating ->
  [1] 1 Estrela
  *[other] { $rating } Estrelas
}

comments-addAReviewForm-rteLabel = Adicionar uma avaliação (opcional)

comments-addAReviewForm-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

comments-addAReviewFormFake-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

stream-footer-links-top-of-article = Topo do artigo
stream-footer-links-top-of-comments = Topo dos comentários
stream-footer-links-profile = Perfil & Respostas
stream-footer-links-discussions = Mais discussões
