error-commentingDisabled = Comentários foram desativados no lado do tenant.
error-storyClosed = A história está fechada para comentários.
error-commentBodyTooShort = O comentário deve ter pelo menos {$min} caracteres.
error-parentCommentRejected = Um comentário anterior nesta conversa foi removido. Não é possível enviar respostas adicionais.
error-ancestorRejected =  Um comentário anterior nesta conversa foi removido. Não é possível enviar respostas adicionais.
error-commentBodyExceedsMaxLength =
  O corpo do comentário excede o comprimento máximo de {$max} caracteres.
error-storyURLNotPermitted =
  A URL da história especificada não existe na lista de domínios permitidos.
error-duplicateStoryURL =  A URL da história especificada já existe.
error-duplicateFlairBadge = A URL da história especificado já existe.
error-tenantNotFound = Hostname do tenant ({$hostname}) não encontrado.
error-userNotFound = Usuário ({$userID}) não encontrado.
error-notFound = URL da requisição desconhecida ({$method} {$path}).
error-tokenInvalid = Token de API inválido.
error-tokenNotFound = O token especificado não existe.
error-emailAlreadySet = O endereço de e-mail já foi definido.
error-emailNotSet = O endereço de email ainda não foi definido.
error-emailDomainProtected = O domínio de e-mail não pode ser banido.
error-cannotBanAccountWithModPrivileges = Não é possível banir contas com privilégios de moderador.
error-duplicateUser =
  Usuário especificado já existe com um método de login diferente.
error-duplicateEmail = O endereço de e-mail especificado já está em uso.
error-duplicateEmailDomain = O domínio de e-mail especificado já está configurado.
error-duplicateDSAReport = O usuário já relatou este comentário por conteúdo potencialmente ilegal.
error-localProfileAlreadySet =
  Conta especificada já tem uma senha definida.
error-localProfileNotSet =
  A conta especificada não possui uma senha definida.
error-SSOProfileNotSet = O usuário especificado não possui um perfil SSO.
error-usernameAlreadySet = A conta especificada já tem seu nome de usuário definido.
error-usernameContainsInvalidCharacters =
  O nome de usuário fornecido contém caracteres inválidos.
error-usernameExceedsMaxLength =
  O nome de usuário excede o comprimento máximo de {$max} caracteres.
error-usernameTooShort =
  O nome de usuário deve ter pelo menos {$min} caracteres.
error-passwordTooShort =
  A senha deve ter pelo menos {$min} caracteres.
error-emailInvalidFormat =
  O endereço de e-mail fornecido não parece ser um e-mail válido.
error-emailExceedsMaxLength =
  O endereço de e-mail excede o tamanho máximo de {$max} caracteres.
error-scrapeFailed = Não foi possível fazer scrape da URL { $url }.
error-internalError = Erro interno
error-tenantInstalledAlready = Tenant já instalado.
error-userNotEntitled = Você não está autorizado a acessar esse recurso.
error-storyNotFound = História ({$storyID}) não encontrada.
error-commentNotFound = Comentário ({$commentID}) não encontrado.
error-commentRevisionNotFound = Comentário ({ $commentID }) com revisão ({ $commentRevisionID }) não encontrado.
error-invalidCredentials = Combinação de email e/ou senha incorreta.
error-toxicComment = Você tem certeza? A linguagem deste comentário pode violar nossas diretrizes da comunidade. Você pode editar o comentário ou enviá-lo para revisão do moderador.
error-spamComment = A linguagem neste comentário parece ser um spam. Você pode editar o comentário ou enviá-lo de qualquer maneira para a revisão do moderador.
error-userAlreadySuspended = O usuário já tem uma suspensão ativa até {$until}.
error-userAlreadyBanned = O usuário já está banido.
error-userBanned = Sua conta está banida.
error-userSiteBanned = Sua conta está atualmente banida em { $siteName }.
error-moderatorCannotBeBannedOnSite =  Você não pode banir um moderador do site de seu próprio site. Você pode cancelar esta ação ou alterar sua função antes de tentar novamente.
error-userSuspended = Sua conta está suspensa no momento até {$until}.
error-userWarned = Sua conta recebeu uma advertência, para continuar comentando verifique a mensagem de aviso acima.
error-integrationDisabled = A integração especificada está desativada.
error-passwordResetTokenExpired = Link de redefinição de senha expirado.
error-emailConfirmTokenExpired = Link de confirmação de email expirado.
error-rateLimitExceeded = Você está tentando fazer isso muitas vezes. Aguarde e tente novamente.
error-inviteTokenExpired = O link do convite expirou.
error-inviteRequiresEmailAddresses = Adicione um endereço de e-mail para enviar convites.
error-passwordIncorrect = Senha incorreta. Por favor, tente novamente.
error-usernameAlreadyUpdated = Você só pode alterar seu nome de usuário uma vez a cada { framework-timeago-time }.
error-persistedQueryNotFound = A consulta persistente com o ID { $id } não foi encontrada.
error-rawQueryNotAuthorized = Você não está autorizado a executar esta consulta.
error-inviteIncludesExistingUser = Já existe um usuário com o email { $email }.
error-repeatPost = Você tem certeza? Este comentário é muito parecido com o anterior.
error-installationForbidden = { -product-name } já foi instalado. Para instalar outro Tenant no domínio ({ $domain }) você precisa gerar um token de instalação.
error-duplicateSiteOrigin = Domínios permitidos só podem ser associados a um único site.
error-validation = Ocorreu um erro de validação.
error-userBioTooLong = Sua bio excedeu o limite de caracteres.
error-commentEditWindowExpired = O tempo de edição expirou. Você não pode mais editar este comentário. Por que não posta um novo?
error-authorAlreadyHasRatedStory = Você já submeteu uma avaliação nesta página.
error-cannotCreateCommentOnArchivedStory = Não é possível criar um comentário em uma história arquivada sem desarquivá-la.
error-cannotOpenAnArchivedStory = Não é possível abrir uma história arquivada. A história deve ser desarquivada primeiro.
error-cannotMergeAnArchivedStory = Não é possível mergear uma história arquivada. A história deve ser desarquivada primeiro.
error-usernameAlreadyExists = Este nome de usuário já existe. Por favor, escolha outro.
error-unableToUpdateStoryURL = Não é possível atualizar a URL da história.
error-dataCachingNotAvailable = O armazenamento de dados não está disponível no momento.
error-invalidFlairBadgeName = Apenas letras, números e os caracteres especiais - . são permitidos nos nomes de badges de destaque.
error-dsaReportLawBrokenTooLong = A lei que você acredita que foi violada para o relatório de DSA excede o comprimento máximo.
error-dsaReportAdditionalInfoTooLong = As informações adicionais para o relatório da DSA excedem o comprimento máximo.
error-unableToPrimeCachedCommentsForStory = Não foi possível gerar o cache de comentários para a história.
