### Localization for Embed Stream

## General

general-userBoxUnauthenticated-joinTheConversation = Participe da conversa
general-userBoxUnauthenticated-signIn = Entrar
general-userBoxUnauthenticated-register = Cadastre-se

general-userBoxAuthenticated-signedInAs =
  Logado como <username></username>.

general-userBoxAuthenticated-notYou =
  Não é você? <button>Sair</button>

general-tabBar-commentsTab = Comentários
general-tabBar-myProfileTab = Meu Perfil
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
comments-featuredCommentTooltip-how = Como um comentário é destacado?
comments-featuredCommentTooltip-handSelectedComments =
  Os comentários são selecionados por nossa equipe como merecedores de serem lidos.
comments-featuredCommentTooltip-toggleButton =
  .aria-label = Ative a dica de comentários

comments-bannedInfo-bannedFromCommenting = Sua conta foi banida de comentar.
comments-bannedInfo-violatedCommunityGuidelines =
  Alguém com acesso à sua conta violou nossas diretrizes da comunidade.
  Como resultado, sua conta foi banida. Você não poder comentar,
  respeitar ou denunciar comentários. Se você acha
  isso foi feito por engano, entre em contato com nossa equipe da comunidade.

comments-noCommentsAtAll = Não existem comentários nesta história.
comments-noCommentsYet = Ainda não há comentários. Seja o primeiro a comentar.

comments-streamQuery-storyNotFound = História não encontrada

comments-postCommentForm-submit = Enviar
comments-stream-loadMore = Carregar Mais
comments-replyList-showAll = Mostrar Tudo

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
comments-permalinkView-viewFullDiscussion = Ver discussão completa
comments-permalinkView-commentRemovedOrDoesNotExist = Este comentário foi removido ou não existe.

comments-rte-bold =
  .title = Negrito

comments-rte-italic =
  .title = Itálico

comments-rte-blockquote =
  .title = Citação

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
comments-moderationDropdown-goToModerate = Moderar
comments-moderationDropdown-caretButton =
  .aria-label = Moderado

comments-rejectedTombstone =
  Você rejeitou este comentário. <TextLink> Vá para Moderados para rever esta decisão. </TextLink>

comments-featuredTag = Destaques

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

qa-unansweredTab-doneAnswering = Feito

qa-expert-email = ({ $email })

qa-answeredTooltip-how = Como uma pergunta é respondida?
qa-answeredTooltip-answeredComments =
  Perguntas são respondidas por um especialista Perguntas & Respostas.
qa-answeredTooltip-toggleButton =
  .aria-label = Alternar dica de ferramenta das perguntas respondidas
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

### Featured Comments
comments-featured-gotoConversation = Ir para a conversa
comments-featured-replies = Respostas

## Profile Tab

profile-myCommentsTab = Meus comentários
profile-myCommentsTab-comments = Meus comentários
profile-accountTab = Conta
profile-preferencesTab = Preferências

accountSettings-manage-account = Gerencie a sua conta

### Account Deletion

profile-accountDeletion-deletionDesc =
  Sua conta está agendada para ser excluída em { $date }.
profile-accountDeletion-cancelDeletion =
  Cancelar solicitação de exclusão de conta

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

### Account
profile-account-ignoredCommenters = Usuários ignorados
profile-account-ignoredCommenters-description =
  Você pode ignorar outros usuários clicando no nome de usuário
   e selecionando Ignorar. Quando você ignora alguém, todos os comentários dele
   estarão ocultos para você. Os usuários que você ignora ainda poderão
   ver seus comentários.
profile-account-ignoredCommenters-empty = Você não está ignorando ninguém
profile-account-ignoredCommenters-stopIgnoring = Parar de ignorar
profile-account-ignoredCommenters-manage = Gerenciar
profile-account-ignoredCommenters-cancel = Cancelar

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
profile-account-download-comments-requested =
  Solicitação submetida. Você pode submeter outra solicitação em { framework-timeago-time }.
profile-account-download-comments-request-button = Solicitar

## Delete Account

profile-account-deleteAccount-title = Deletar minha conta
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
  .aria-label = Frase

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
profile-account-deleteAccount-pages-downloadCommentsDesc =
  Antes de sua conta ser excluída, recomendamos que você baixe seu comentário
  histórico para seus registros. Depois que sua conta for excluída, você será
  incapaz de solicitar seu histórico de comentários.
profile-account-deleteAccount-pages-downloadCommentsPath =
  Meu perfil > Baixar meu histórico de comentários

profile-account-deleteAccount-pages-confirmHeader = Confirmar exclusão da conta?
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
comments-submitStatus-submittedAndRejected =
  Este comentário foi rejeitado por violar nossos termos de uso.

# Configure
configure-configureQuery-errorLoadingProfile = Erro ao carregar o configure
configure-configureQuery-storyNotFound = História não encontrada

## Change username
profile-changeUsername-username = Usuário
profile-changeUsername-success = Seu nome de usuário foi atualizado com sucesso
profile-changeUsername-edit = Editar
profile-changeUsername-heading = Edite seu nome de usuário
profile-changeUsername-desc = Altere o nome de usuário que aparecerá em todos os seus comentários anteriores e futuros. <strong> Nomes de usuário podem ser alterados uma vez a cada { framework-timeago-time }. </strong>
profile-changeUsername-desc-text = Altere o nome de usuário que aparecerá em todos os seus comentários anteriores e futuros. Os nomes de usuário podem ser alterados uma vez a cada { framework-timeago-time }.
profile-changeUsername-current = Nome de usuário atual
profile-changeUsername-newUsername-label = Novo usuário
profile-changeUsername-confirmNewUsername-label = Confirme o novo nome de usuário
profile-changeUsername-cancel = Cancelar
profile-changeUsername-submit-button = Salvar
profile-changeUsername-recentChange = Seu nome de usuário foi alterado em { framework-timeago-time }. Você pode alterar seu nome de usuário novamente em { $nextUpdate }
profile-changeUsername-close = Fechar

## Comment Stream
configure-stream-title = Configurar este fluxo de comentários
configure-stream-title-configureThisStream =
  Configurar este Fluxo
configure-stream-apply = Aplicar

configure-premod-title = Ativar Pré-Moderação
configure-premod-description =
  Os moderadores devem aprovar qualquer comentário antes de ser publicado neste fluxo.

configure-premodLink-title = Comentários pré-moderados contendo links
configure-premodLink-description =
  Os moderadores devem aprovar qualquer comentário que contenha um link antes de ser publicado.

configure-liveUpdates-title = Ativar atualizações em tempo real para esta história
configure-liveUpdates-description =
  Quando ativado, os comentários serão atualizados instantaneamente
  assim como novos comentários e respostas, ao invés de exigir
  o recarregamento da página. Você pode desabilitar esta opção
  em certas situações, como um alto volume de acesso que pode fazer com que os comentários fiquem lentos.

configure-messageBox-title = Ativar caixa de mensagens para este fluxo
configure-messageBox-description =
  Adicione uma mensagem ao topo da caixa de comentários para seus leitores.
  Use isso para representar um tópico, faça uma pergunta ou faça anúncios
  relacionados a essa história.
configure-messageBox-preview = Visualizar
configure-messageBox-selectAnIcon = Selecione um ícone
configure-messageBox-iconConversation = Conversa
configure-messageBox-iconDate = Data
configure-messageBox-iconHelp = Ajuda
configure-messageBox-iconWarning = Aviso
configure-messageBox-iconChatBubble = Chat
configure-messageBox-noIcon = Sem ícone
configure-messageBox-writeAMessage = Escreve uma mensagem

configure-closeStream-title = Fechar fluxo de comentários
configure-closeStream-description =
  Este fluxo de comentários está aberto no momento. Ao fechar este fluxo de comentários,
  nenhum novo comentário pode ser enviado e todos os comentários enviados anteriormente
  ainda serão exibidos.
configure-closeStream-closeStream = Fechar Fluxo de Comentários

configure-openStream-title = Fluxo aberto
configure-openStream-description =
  Este fluxo de comentários está atualmente fechado. Abrindo este fluxo de comentários
  novos comentários podem ser enviados e exibidos.
configure-openStream-openStream = Abrir Fluxo

configure-moderateThisStream = Moderar esta história

configure-enableQA-title = Mudar para formato Perguntas & Respostas
configure-enableQA-description =
  O formato de Perguntas & Respostas permite aos membros da comunidade
  enviar perguntas para especialistas selecionados responderem.
configure-enableQA-enableQA = Mudar para Perguntas & Respostas

configure-disableQA-title = Configurar esta Perguntas & Respostas
configure-disableQA-description =
  O formato de Perguntas & Respostas permite membros da comunidade
  enviarem perguntas para especialistas responderem.
configure-disableQA-disableQA = Trocar para Comentários

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
configure-experts-assigned-title = Especialistas

comments-tombstone-ignore = Este comentário está oculto porque você ignorou {$username}
comments-tombstone-deleted =
  Este comentário não está mais disponível. O usuário excluiu sua conta.

suspendInfo-heading = Sua conta foi temporariamente suspensa de comentar.
suspendInfo-info =
  Em concordância com as regras da comunidade { $organization }, sua
  conta foi temporariamente suspensa. Enquanto suspenso, você não
  poderá comentar, respeitar ou denunciar comentários. Por favor, junte-se a conversa
  em { $until }.

profile-changeEmail-unverified = (Não verificado)
profile-changeEmail-edit = Editar
profile-changeEmail-please-verify = Verifique seu endereço de e-mail
profile-changeEmail-please-verify-details =
  Um email foi enviado para { $email } para verificar sua conta.
  Você deve verificar seu novo endereço de e-mail antes que ele possa ser usado
  para fazer login na sua conta ou receber notificações.
profile-changeEmail-resend = Reenviar notificação
profile-changeEmail-heading = Edite seu endereço de email
profile-changeEmail-desc = Altere o endereço de email usado para fazer login e receber comunicações sobre sua conta.
profile-changeEmail-current = Email atual
profile-changeEmail-newEmail-label = Novo Endereço de Email
profile-changeEmail-password = Senha
profile-changeEmail-password-input =
  .placeholder = Senha
profile-changeEmail-cancel = Cancelar
profile-changeEmail-submit = Salvar
profile-changeEmail-email = Email
