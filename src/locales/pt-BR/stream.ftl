### Localization for Embed Stream

## General

general-userBoxUnauthenticated-joinTheConversation = Participe da conversa
general-userBoxUnauthenticated-signIn = Entrar
general-userBoxUnauthenticated-register = Cadastre-se

general-userBoxAuthenticated-signedInAs =
  Entrar como <username></username>.

general-userBoxAuthenticated-notYou =
  Não é você? <button>Sair</button>

general-tabBar-commentsTab = { $commentCount ->
        [-1] Comentário
        [1] { SHORT_NUMBER($commentCount) } Comentário
        *[other] { SHORT_NUMBER($commentCount) } Comentários
    }
general-tabBar-myProfileTab = Meu Perfil
general-tabBar-configure = Configurações

## Comments Tab

comments-streamQuery-storyNotFound = História não encontrada

comments-postCommentForm-submit = Comentar
comments-stream-loadMore = Carregar Mais
comments-replyList-showAll = Mostrar Tudo

comments-permalinkPopover =
  .description = Uma caixa de diálogo mostrando um link permanente para o comentário
comments-permalinkButton-share = Compartilhar
comments-permalinkView-viewFullDiscussion = Ver discussão completa
comments-permalinkView-commentNotFound = Comentário não encontrado

comments-rte-bold =
  .title = Negrito

comments-rte-italic =
  .title = Itálico

comments-rte-blockquote =
  .title = Citação

comments-poweredBy = Powered by <logo>{ -brand-name }</logo>

comments-remainingCharacters = { $remaining } caracteres restantes

comments-postCommentFormFake-signInAndJoin = Entre e Participe da Conversa

comments-postCommentForm-rteLabel = Postar um comentário

comments-postCommentForm-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentFormFake-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-replyButton-reply = Responder

comments-permalinkViewQuery-storyNotFound = { comments-streamQuery-storyNotFound }

comments-replyCommentForm-submit = Responder
comments-replyCommentForm-cancel = Cancelar
comments-replyCommentForm-rteLabel = Escrever uma resposta
comments-replyCommentForm-rte =
  .placeholder = { comments-replyCommentForm-rteLabel }

comments-commentContainer-editButton = Editar

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

comments-permalinkView-currentViewing = Você está visualizando um
comments-permalinkView-singleConversation = CONVERSAÇÃO ÚNICA
comments-inReplyTo = Em resposta a <username></username>
comments-replyTo = Respondendo a: <username></username>

comments-reportButton-report = Denunciar
comments-reportButton-reported = Denunciado

comments-sortMenu-sortBy = Ordenar Por
comments-sortMenu-newest = Mais novos
comments-sortMenu-oldest = Mais antigos
comments-sortMenu-mostReplies = Mais respostas

## Profile Tab
profile-historyComment-viewConversation = Ver conversa
profile-historyComment-replies = Respostas {$replyCount}
profile-historyComment-commentHistory = Histórico de Comentários
profile-historyComment-story = História: {$title}
profile-profileQuery-errorLoadingProfile = Erro ao carregar o perfil
profile-profileQuery-storyNotFound = História não encontrada
profile-commentHistory-loadMore = Carregar Mais

## Report Comment Popover
comments-reportPopover =
  .description = Uma caixa de diálogo para relatar comentários
comments-reportPopover-reportThisComment = Denunciar este comentário
comments-reportPopover-whyAreYouReporting = Por que você está denunciando este comentário?

comments-reportPopover-reasonOffensive = Este comentário é ofensivo
comments-reportPopover-reasonIDisagree = Eu não concordo com esse comentário
comments-reportPopover-reasonSpam = Isso parece um anúncio ou marketing
comments-reportPopover-reasonOther = Outros

comments-reportPopover-pleaseLeaveAdditionalInformation =
  Por favor, deixe qualquer informação adicional que possa ser útil para nossos moderadores. (Opcional)

comments-reportPopover-maxCharacters = Máximo { $maxCharacters } Caracteres
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

# Configure
configure-configureQuery-errorLoadingProfile = Erro ao carregar o configure
configure-configureQuery-storyNotFound = História não encontrada

## Comment Stream
configure-stream-title = Configurar este fluxo de comentários
configure-stream-apply = Aplicar

configure-premod-title = Ativar Pré-Moderação
configure-premod-description =
  Os moderadores devem aprovar qualquer comentário antes de ser publicado neste fluxo.

configure-premodLink-title = Comentários pré-moderados contendo links
configure-premodLink-description =
  Os moderadores devem aprovar qualquer comentário que contenha um link antes de ser publicado.

configure-messageBox-title = Ativar caixa de mensagens para este fluxo
configure-messageBox-description =
  Adicione uma mensagem ao topo da caixa de comentários para seus leitores. Use isso para representar um tópico,
  faça uma pergunta ou faça anúncios relacionados a essa história.
configure-messageBox-preview = Visualizar
configure-messageBox-selectAnIcon = Selecione um ícone
configure-messageBox-noIcon = Sem ícone
configure-messageBox-writeAMessage = Escreve uma mensagem

configure-closeStream-title = Fechar fluxo de comentários
configure-closeStream-description =
  Este fluxo de comentários está aberto no momento. Ao fechar este fluxo de comentários,
  Nenhum novo comentário pode ser enviado e todos os comentários enviados anteriormente
  ainda serão exibidos.
configure-closeStream-closeStream = Fechar Fluxo de Comentários

configure-openStream-title = Fluxo aberto
configure-openStream-description =
  Este fluxo de comentários está atualmente fechado. Abrindo este fluxo de comentários
  novos comentários podem ser enviados e exibidos.
configure-openStream-openStream = Abrir Fluxo
