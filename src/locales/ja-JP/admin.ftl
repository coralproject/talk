### Localization for Admin

## General
general-notAvailable = 使用できません
general-none = ありません
general-noTextContent = 文章がありません

## Story Status
storyStatus-open = 開く
storyStatus-closed = 閉じる
storyStatus-archiving = アーカイブしています
storyStatus-archived = アーカイブしました

## Roles
role-admin = 管理者
role-moderator = モデレーター
role-siteModerator = サイトのモデレーター
role-organizationModerator = 組織のモデレーター
role-staff = スタッフ
role-commenter = コメンテーター

role-plural-admin = 管理者
role-plural-moderator = モデレーター
role-plural-staff = スタッフ
role-plural-commenter = コメンテーター

comments-react =
  .aria-label = {$count ->
    [0] {$reaction} 投稿者 {$username}
    *[other] {$reaction} ({$count}) 投稿者 {$username}
  }
comments-reacted =
  .aria-label = {$count ->
    [0] {$reaction} 投稿者 {$username}
    [one] {$reaction} 投稿者 {$username}
    *[other] {$reaction} ({$count}) 投稿者 {$username}
  }

## User Statuses
userStatus-active = アクティブ
userStatus-banned = 禁止
userStatus-siteBanned = サイトでは禁止されています
userStatus-banned-all = 禁止（全て）
userStatus-banned-count = 禁止しました ({$count})
userStatus-suspended = 中断しました
userStatus-premod = 常に公開前に確認する
userStatus-warned = 注意

# Queue Sort
queue-sortMenu-newest = 最新
queue-sortMenu-oldest = 最古

## Navigation
navigation-moderate = 管理者
navigation-community = コミュニティ
navigation-stories = ストーリー
navigation-configure = 設定
navigation-dashboard = ダッシュボード

## User Menu
userMenu-signOut = サインアウト
userMenu-viewLatestRelease = 最新のリリースを確認
userMenu-reportBug = バグやフィードバックを送る
userMenu-popover =
  .description = 関連するリンクとアクションを含むユーザーメニューのダイアログ

## Restricted
restricted-currentlySignedInTo = すでにサインインしています
restricted-noPermissionInfo = このページにアクセスする権限がありません。
restricted-signedInAs =すでに <strong>{ $username }</strong>としてサインインしています
restricted-signInWithADifferentAccount = 別のアカウントでサインインする
restricted-contactAdmin = エラーが起きていると思われる場合は、管理者にお問い合わせください。

## Login

# Sign In
login-signInTo = サインインする
login-signIn-enterAccountDetailsBelow = アカウントの詳細を下記に入力してください

login-emailAddressLabel = Eメールアドレス
login-emailAddressTextField =
  .placeholder = Eメールアドレス

login-signIn-passwordLabel = パスワード
login-signIn-passwordTextField =
  .placeholder = パスワード
login-signIn-signInWithEmail = Eメールを使ってサインイン
login-orSeparator = もしくは
login-signIn-forgot-password = パスワードをお忘れですか？

login-signInWithFacebook = Facebookでサインインする
login-signInWithGoogle = Googleでサインインする
login-signInWithOIDC = { $name }でサインインする

# Create Username

createUsername-createUsernameHeader = ユーザー名を作る
createUsername-whatItIs =
  このユーザー名は、投稿した全てのコメントに表示されます
createUsername-createUsernameButton = ユーザー名を作る
createUsername-usernameLabel = ユーザー名
createUsername-usernameDescription = “_”や“.”は使用できますが、スペースは使用できません。
createUsername-usernameTextField =
  .placeholder = ユーザー名

# Add Email Address
addEmailAddress-addEmailAddressHeader = Eメールアドレスを追加する

addEmailAddress-emailAddressLabel = Eメールアドレス
addEmailAddress-emailAddressTextField =
  .placeholder = Eメールアドレス

addEmailAddress-confirmEmailAddressLabel = Eメールアドレスを確認する
addEmailAddress-confirmEmailAddressTextField =
  .placeholder = Eメールアドレスを確認する

addEmailAddress-whatItIs =
 セキュリティを強化するために、アカウントにEメールアドレスを追加してください。

addEmailAddress-addEmailAddressButton =
  Eメールアドレスを追加する

# Create Password
createPassword-createPasswordHeader = パスワードを作成
createPassword-whatItIs =
 アカウントの乗っ取りを防ぐために
  パスワードを作成することをおすすめします
createPassword-createPasswordButton =
  パスワードを作成する

createPassword-passwordLabel = パスワード
createPassword-passwordDescription = 最小でも{$minLength} 文字以上にしてください
createPassword-passwordTextField =
  .placeholder = パスワード

# Forgot Password
forgotPassword-forgotPasswordHeader = パスワードをお忘れですか？
forgotPassword-checkEmailHeader = メールを確認してください
forgotPassword-gotBackToSignIn = サインインページに戻る
forgotPassword-checkEmail-receiveEmail =
  このメールアドレス（ <strong>{ $email }</strong>）に紐付けられているアカウントがある場合,
  新しいパスワードを設定するためのリンクが貼られたメールをお届けします。
forgotPassword-enterEmailAndGetALink =
  Eメールアドレスを入力してください。パスワードをリセットするための
 リンクをメールでお届けします.
forgotPassword-emailAddressLabel = Eメールアドレス
forgotPassword-emailAddressTextField =
  .placeholder = Eメールアドレス
forgotPassword-sendEmailButton = Eメールを送信

# Link Account
linkAccount-linkAccountHeader = アカウントをリンクする
linkAccount-alreadyAssociated =
  このメールアドレス（ <strong>{ $email }</strong> ）は
  すでの他のアカウントに紐付けられています。
 追加して紐づける場合には、パスワードを入力してください。
linkAccount-passwordLabel = パスワード
linkAccount-passwordTextField =
  .label = パスワード
linkAccount-linkAccountButton = アカウントをリンク
linkAccount-useDifferentEmail = 他のEメールアドレスを追加する

## Configure

configure-experimentalFeature = 試験的な機能

configure-unsavedInputWarning =
  保存されていない変更箇所があります。継続してよろしいでしょうか？

configure-sideBarNavigation-general = 全般
configure-sideBarNavigation-authentication = 認証
configure-sideBarNavigation-moderation = コンテンツのチェク機能
configure-sideBarNavigation-moderation-comments = コメント
configure-sideBarNavigation-moderation-users = ユーザー
configure-sideBarNavigation-organization = 統合
configure-sideBarNavigation-moderationPhases = チェックダウンかい
configure-sideBarNavigation-advanced = 前に進める
configure-sideBarNavigation-email = Eメール
configure-sideBarNavigation-bannedAndSuspectWords = 禁止及び疑わしい言葉
configure-sideBarNavigation-slack = Slack
configure-sideBarNavigation-webhooks = Webhooks

configure-sideBar-saveChanges = 変更を保存する
configure-configurationSubHeader = 設計
configure-onOffField-on = On
configure-onOffField-off = Off
configure-radioButton-allow = 許可
configure-radioButton-dontAllow = 許可しない

### Moderation Phases

configure-moderationPhases-generatedAt =
  { DATETIME($date, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric") } で作成されたキー
configure-moderationPhases-phaseNotFound = 外部モデレーションフェイスが見つかりません
configure-moderationPhases-experimentalFeature =
  カスタムモデレートフェイズは、現在鋭意開発中です。
  <ContactUsLink>からフィードバックもしくはリクエストをお送りください。</ContactUsLink>.
configure-moderationPhases-header-title = モデレーションフェイズ
configure-moderationPhases-description =
  一部のモデレートアクションを自動化するために、外部モデレーションフェイズを構築します。
 　モデレーションのリクエストはJSONでエンコードされ、署名されます。
 　モデレーションのリクエストの詳細については、<externalLink>をご参照ください</externalLink>。
configure-moderationPhases-addExternalModerationPhaseButton =
  外部モデレーションフェイズを追加する
configure-moderationPhases-moderationPhases = モデレーションフェイズ
configure-moderationPhases-name = 名前
configure-moderationPhases-status = 状態
configure-moderationPhases-noExternalModerationPhases =
  外部モデレーションフェイズは、構成されていません。上に追加してください。
configure-moderationPhases-enabledModerationPhase = 有効
configure-moderationPhases-disableModerationPhase = 無効
configure-moderationPhases-detailsButton = 詳細を確認するには <icon>キーボードの右矢印を押してください。</icon>
configure-moderationPhases-addExternalModerationPhase = 外部モデレーションフェイズを追加する
configure-moderationPhases-updateExternalModerationPhaseButton = アップデートの詳細
configure-moderationPhases-cancelButton = キャンセル
configure-moderationPhases-format = コメント欄のフォーマット
configure-moderationPhases-endpointURL = コールバックURL
configure-moderationPhases-timeout = タイムアウト
configure-moderationPhases-timeout-details =
  Coralがモデレーションの応答を待機する時間（ミリ秒単位）
configure-moderationPhases-format-details =
  Coralがコメント本体を送信する形式。
 デフォルトでは、CoralはオリジナルのHTML形式でコメントを送信します。
 「プレーンテキスト」を選択すると、HTMLのテキスト版が送信されます。
configure-moderationPhases-format-html = HTML
configure-moderationPhases-format-plain = プレーンテキスト
configure-moderationPhases-endpointURL-details =
  Coralモデレーションが要求するURLがポストされます。
 送信されたURLは、指定されたタイムアウト時間前に応答する必要があります。
 応答しない場合、モデレーションアクションの決定はスキップされます
configure-moderationPhases-configureExternalModerationPhase =
  外部モデレーションフェイズを構築する。
configure-moderationPhases-phaseDetails = フェーズの詳細
onfigure-moderationPhases-status = 状態
configure-moderationPhases-signingSecret = 秘密の署名
configure-moderationPhases-signingSecretDescription =
 次の署名シークレットは、URLに送信される要求ペイロードに署名するために使用されます。
 Webhook署名の詳細については、次のWebサイトにアクセスしてください。
 <externalLink>docs</externalLink>.
configure-moderationPhases-phaseStatus = フェーズの状態
configure-moderationPhases-status = 状態
configure-moderationPhases-signingSecret = 署名シークレット
configure-moderationPhases-signingSecretDescription =
  次の署名シークレットは、URLに送信される要求ペイロードに署名するために使用されます。
   Webhook署名の詳細については、<externalLink>ドキュメント</ externalLink>にアクセスしてください。
configure-moderationPhases-dangerZone = 危険ゾーン
configure-moderationPhases-rotateSigningSecret = 署名シークレットをローテーションする
configure-moderationPhases-rotateSigningSecretDescription =
  署名シークレットをローテーションすると、本番環境で使用されている署名シークレットを遅れて安全に置き換えることができます。
configure-moderationPhases-rotateSigningSecretButton = 署名シークレットをローテーション

configure-moderationPhases-disableExternalModerationPhase =
  外部モデレーションフェイズを無効にする
configure-moderationPhases-disableExternalModerationPhaseDescription =
  この外部モデレーションフェーズは現在有効です。 無効にすると、指定されたURLに新しいモデレートクエリが送信されなくなります。
configure-moderationPhases-disableExternalModerationPhaseButton = フェーズを無効にする
configure-moderationPhases-enableExternalModerationPhase =
  外部モデレーションフェーズを有効にする
configure-moderationPhases-enableExternalModerationPhaseDescription =
  この外部モデレートフェーズは現在無効になっています。
 有効にすると、新しいモデレートクエリが指定されたURLに送信されます。
configure-moderationPhases-enableExternalModerationPhaseButton = フェーズを有効にする
configure-moderationPhases-deleteExternalModerationPhase =
  外部モデレーションフェーズを削除する。
configure-moderationPhases-deleteExternalModerationPhaseDescription =
  この外部モデレートフェーズを削除すると、新しいモデレートクエリがこのURLに送信されなくなり、関連するすべての設定が削除されます。
configure-moderationPhases-deleteExternalModerationPhaseButton = フェーズを削除する
configure-moderationPhases-rotateSigningSecret = 署名シークレットをローテーション
configure-moderationPhases-rotateSigningSecretHelper =
 有効期限が切れると、古いシークレットで署名が生成されなくなります。
configure-moderationPhases-expiresOldSecret =
  古いシークレットを期限切れにする
configure-moderationPhases-expiresOldSecretImmediately =
  すぐに
configure-moderationPhases-expiresOldSecretHoursFromNow =
  { $hours ->
    [1] 1時間後
    *[other] { $hours } 時間後
  }
configure-moderationPhases-rotateSigningSecretSuccessUseNewSecret =
  外部モデレーションフェーズ署名シークレットがローテーションされました。 以下の新しいシークレットを使用するように統合を更新してください。
configure-moderationPhases-confirmDisable =
  この外部モデレーションフェーズを無効にすると、新しいモデレーションクエリがこのURLに送信されなくなります。
 続行してもよろしいですか？
configure-moderationPhases-confirmEnable =
  外部モデレートフェーズを有効にすると、このURLへのモデレーションクエリの送信が開始されます。
 続行してもよろしいですか？
configure-moderationPhases-confirmDelete =
  この外部モデレートフェーズを削除すると、新しいモデレートクエリがこのURLに送信されなくなり、関連するすべての設定が削除されます。
 続行してもよろしいですか？

### Webhooks

configure-webhooks-generatedAt = 生成されたキーは：
  { DATETIME($date, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric") }
configure-webhooks-experimentalFeature =
  Webhook機能は現在活発に開発されています。 イベントは追加または削除される場合があります。
 <ContactUsLink>フィードバックやリクエストがある場合はお問い合わせください</ ContactUsLink>。
configure-webhooks-webhookEndpointNotFound = Webhookエンドポイントが見つかりません
configure-webhooks-header-title = Webhookエンドポイントを構成する
configure-webhooks-description =
  Coral内でイベントが発生したときにイベントを送信するエンドポイントを構成します。
 これらのイベントはJSONでエンコードされ、署名されます。
 Webhook署名の詳細については、<externalLink> Webhookガイド</ externalLink>にアクセスしてください。
configure-webhooks-addEndpoint = Webhookエンドポイントを追加します
configure-webhooks-addEndpointButton = Webhookエンドポイントを追加します
configure-webhooks-endpoints = エンドポイント
configure-webhooks-url = URL
configure-webhooks-status = 状態
configure-webhooks-noEndpoints = Webhookエンドポイントは構成されていません。上記に追加してください。
configure-webhooks-enabledWebhookEndpoint = 有効
configure-webhooks-disabledWebhookEndpoint = 無効
configure-webhooks-eventsToSendDescription =
  これらは、この特定のエンドポイントに登録されているイベントです。
 これらのイベントのスキーマについては、<externalLink> Webhookガイド</ externalLink>にアクセスしてください。
    有効になっている場合、以下に一致するイベントはすべてエンドポイントに送信されます。
configure-webhooks-allEvents =
  エンドポイントは、将来追加されるものを含め、すべてのイベントを受け取ります。
configure-webhooks-selectAnEvent =
  上記のイベントを選択するか、<button>すべてのイベントを受信</ button>します。
configure-webhooks-configureWebhookEndpoint = Webhookエンドポイントを構成する
configure-webhooks-confirmEnable =
  Webhookエンドポイントを有効にすると、このURLへのイベントの送信が開始されます。 続行してもよろしいですか？
configure-webhooks-confirmDisable =
  このWebhookエンドポイントを無効にすると、新しいイベントがこのURLに送信されなくなります。 続行してもよろしいですか？
configure-webhooks-confirmDelete =
  このWebhookエンドポイントを削除すると、新しいイベントがこのURLに送信されなくなり、このWebhookエンドポイントに関連付けられているすべての設定が削除されます。 続行してもよろしいですか？
configure-webhooks-dangerZone = 危険ゾーン
configure-webhooks-rotateSigningSecret = 署名シークレットをローテーション
configure-webhooks-rotateSigningSecretDescription =
  署名シークレットをローテーションすると、本番環境で使用されている署名シークレットを遅延で安全に置き換えることができます。
configure-webhooks-rotateSigningSecretButton = 署名シークレットをローテーション
configure-webhooks-rotateSigningSecretHelper =
  有効期限が切れると、古いシークレットで署名が生成されなくなります。
configure-webhooks-rotateSigningSecretSuccessUseNewSecret =
  Webhookエンドポイント署名シークレットがローテーションされました。
 以下の新しいシークレットを使用するように統合を更新してください。
configure-webhooks-disableEndpoint = エンドポイントを無効にする
configure-webhooks-disableEndpointDescription =
  このエンドポイントは現在有効です。
  このエンドポイントを無効にすると、指定されたURLに新しいイベントが送信されなくなります。
configure-webhooks-disableEndpointButton = エンドポイントを無効にする
configure-webhooks-enableEndpoint = エンドポイントを有効にする
configure-webhooks-enableEndpointDescription =
  このエンドポイントは現在無効になっています。
  このエンドポイントを有効にすると、指定されたURLに新しいイベントが送信されます。
configure-webhooks-enableEndpointButton = エンドポイントを有効にする
configure-webhooks-deleteEndpoint = エンドポイントを削除する
configure-webhooks-deleteEndpointDescription =
  エンドポイントを削除すると、指定されたURLに新しいイベントが送信されなくなります。
configure-webhooks-deleteEndpointButton = エンドポイントを削除する
configure-webhooks-endpointStatus = エンドポイントの状態
configure-webhooks-signingSecret = 署名シークレット
configure-webhooks-signingSecretDescription =
  次の署名シークレットは、URLに送信される要求ペイロードに署名するために使用されます。
  Webhook署名の詳細については、<externalLink> Webhookガイド</ externalLink>にアクセスしてください。
configure-webhooks-expiresOldSecret = 古い署名シークレットを期限切れにする
configure-webhooks-expiresOldSecretImmediately = すぐに
configure-webhooks-expiresOldSecretHoursFromNow =
  { $hours ->
    [1] 1時間後
    *[other] { $hours } 時間後
  }  今から
configure-webhooks-detailsButton = 詳細を確認するには<icon>キーボードの右矢印</icon>

### General
configure-general-guidelines-title = コミュニティガイドラインの概要
configure-general-guidelines-explanation =
  これは、サイト全体のコメントの上に表示されます。
 Markdownを使用してテキストをフォーマットできます。
   Markdownの使用方法の詳細はこちら<externalLink>https://www.markdownguide.org/cheat-sheet/</externalLink>
configure-general-guidelines-showCommunityGuidelines = コミュニティガイドラインの概要を表示する

### Bio
configure-general-memberBio-title = メンバーの経歴
configure-general-memberBio-explanation =
  コメント投稿者がプロフィールに略歴を追加できるようにします。
 注：これにより、メンバーの経歴を報告できるため、モデレーターの作業負荷が増加する可能性があります。
configure-general-memberBio-label = メンバーの経歴を許可する

### Locale
configure-general-locale-language = 言語
configure-general-locale-chooseLanguage = Coralコミュニティの言語を選択してください。
configure-general-locale-invalidLanguage =
  以前お選びいただいた言語<lang> </ lang>は、現在は存在しません。 別の言語を選択してください。

### Sitewide Commenting
configure-general-sitewideCommenting-title = サイト全体のコメント
configure-general-sitewideCommenting-explanation =
  サイト全体の新しいコメントのコメントストリームを開くか閉じます。
   新しいコメントがオフになっている場合、新しいコメントを送信することはできません。
 ただし、既存のコメントは引き続き反応を受け取り、報告され、共有される可能性があります。
configure-general-sitewideCommenting-enableNewCommentsSitewide =
  サイト全体で新しいコメントを有効にする
configure-general-sitewideCommenting-onCommentStreamsOpened =
  オン-新しいコメントのために開かれたコメントストリーム
configure-general-sitewideCommenting-offCommentStreamsClosed =
  オフ-新しいコメントのためにコメントストリームを閉じました
configure-general-sitewideCommenting-message = サイト全体のクローズドコメントメッセージ
configure-general-sitewideCommenting-messageExplanation =
  コメントストリームがサイト全体で閉じられたときに表示されるメッセージを記述します
