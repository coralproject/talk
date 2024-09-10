### Localization for Embed Stream

## General

general-commentsEmbedSection =
  .aria-label =コメント埋め込み

general-moderate = モデレート
general-archived = アーカイブ

general-userBoxUnauthenticated-joinTheConversation = 会話に加わる
general-userBoxUnauthenticated-signIn = サインイン
general-userBoxUnauthenticated-register = 登録

general-authenticationSection =
  .aria-label = 認証

general-userBoxAuthenticated-signedIn =
  サインインする
general-userBoxAuthenticated-notYou =
  あなたのアカウントではありませんか？ <button>サインアウト</button>

general-userBox-youHaveBeenSuccessfullySignedOut =
  正常にサインアウトされました

general-tabBar-commentsTab = コメント
general-tabBar-myProfileTab = マイ・プロフィール
general-tabBar-discussionsTab = ディスカッション
general-tabBar-reviewsTab = レビュー
general-tabBar-configure = 設定

general-mainTablist =
  .aria-label = メインのタブリスト

general-secondaryTablist =
  .aria-label = 第2のタブリスト

## Comment Count

comment-count-text =
  { $count  ->
    [one]コメント
    *[other] コメント
  }

## Comments Tab

comments-allCommentsTab = 全てのコメント
comments-featuredTab = 特集
comments-counter-shortNum = { SHORT_NUMBER($count) }
comments-watchers =
  { $count  ->
    [one] 現在1人のユーザーがこのディスカッションを閲覧中
    *[other] 現在 { SHORT_NUMBER($count) } 人のユーザーがこのディスカッションを閲覧中
  }

comments-announcement-section =
  .aria-label = 告知
comments-announcement-closeButton =
  .aria-label = 告知を閉じる

comments-accountStatus-section =
  .aria-label = アカウントの状態

comments-featuredCommentTooltip-how = コメントはどのような形で取り上げられるか？
comments-featuredCommentTooltip-handSelectedComments =
  これらのコメントは、我々のチームによって、読む価値のあるモノとして選ばれています。
comments-featuredCommentTooltip-toggleButton =
  .aria-label = 注目のコメントのツールチップを切り替える
  .title = 注目のコメントのツールチップを切り替える

comments-collapse-toggle =
  .aria-label = コメントスレッドを折りたたむ
comments-expand-toggle =
  .aria-label = コメントスレッドを開く
comments-bannedInfo-bannedFromCommenting = あなたのアカウントはコメントを禁止されています。
comments-bannedInfo-violatedCommunityGuidelines =
  あなたのアカウントにアクセスできる人が、コミュニティガイドラインに違反しています。
  その結果、あなたのアカウントは禁止されました。
  コメントしたり、リアクションを使用したり、コメントを報告したりすることはできなくなります。
  これが誤って行われたと思われる場合は、コミュニティチームにご連絡ください。
comments-noCommentsAtAll = この話についてのコメントはありません。
comments-noCommentsYet = コメントはまだありません。 最初のコメントを投稿しませんか？

comments-streamQuery-storyNotFound = ストーリーが見つかりません

comments-communityGuidelines-section =
  .aria-label = コミュニティのガイドライン

comments-commentForm-cancel = キャンセル
comments-commentForm-saveChanges = 変更を保存
comments-commentForm-submit = 送信

comments-postCommentForm-section =
  .aria-label = コメントを投稿
comments-postCommentForm-submit = 送信
comments-replyList-showAll = 全てを見る
comments-replyList-showMoreReplies = 返信をもっと見る

comments-postComment-gifSearch = GIF画像を検索する
comments-postComment-gifSearch-search =
  .aria-label = 検索
comments-postComment-gifSearch-loading = 読み込み中...
comments-postComment-gifSearch-no-results = {$query} の結果が見つかりません

comments-postComment-pasteImage = 画像のURLを貼り付ける
comments-postComment-insertImage = 挿入

comments-postComment-confirmMedia-youtube = このYouTube動画をコメントの最後に貼り付けますか？
comments-postComment-confirmMedia-twitter = このツイートをコメントの最後に貼り付けますか？
comments-postComment-confirmMedia-cancel = キャンセル
comments-postComment-confirmMedia-add-tweet = ツイートを追加
comments-postComment-confirmMedia-add-video = ビデオを追加
comments-postComment-confirmMedia-remove = 削除
comments-commentForm-gifPreview-remove = 削除
comments-viewNew =
  { $count ->
    [1] 新しいコメント {$count} を見る
    *[other] 新しいコメント {$count} を見る
  }
comments-loadMore = もっと読み込む

comments-permalinkPopover =
  .description = コメントへの固定リンクを表示するダイアログ
comments-permalinkPopover-permalinkToComment =
  .aria-label = コメントへの固定リンク
comments-permalinkButton-share = 共有
comments-permalinkButton =
  .aria-label = {$username} でコメントを共有する
comments-permalinkView-section =
  .aria-label = ひとつの会話
comments-permalinkView-viewFullDiscussion = 全てのやりとりと見る
comments-permalinkView-commentRemovedOrDoesNotExist = このコメントは削除されたか、存在しません。

comments-rte-bold =
  .title = 太字

comments-rte-italic =
  .title = 斜字

comments-rte-blockquote =
  .title = 引用、転載

comments-rte-bulletedList =
  .title = 箇条書きリスト

comments-rte-strikethrough =
  .title = 取り消し戦

comments-rte-spoiler = ネタバレ

comments-rte-sarcasm = 辛辣

comments-rte-externalImage =
  .title = 外部画像

comments-remainingCharacters = あと { $remaining }  文字

comments-postCommentFormFake-signInAndJoin = サインインして、会話に参加する

comments-postCommentForm-rteLabel = コメントを投稿する

comments-postCommentForm-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentFormFake-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-replyButton-reply = 返信
comments-replyButton =
  .aria-label = {$username} でコメントに返信する

comments-permalinkViewQuery-storyNotFound = { comments-streamQuery-storyNotFound }

comments-replyCommentForm-submit = 送信
comments-replyCommentForm-cancel = キャンセル
comments-replyCommentForm-rteLabel = 返信を書く
comments-replyCommentForm-rte =
  .placeholder = { comments-replyCommentForm-rteLabel }

comments-commentContainer-threadLevelLabel = スレッドレベル { $level }：
comments-commentContainer-highlightedLabel = ハイライト：
comments-commentContainer-ancestorLabel = 上位：
comments-commentContainer-replyLabel =
   { $username } から返信 <RelativeTime></RelativeTime>
comments-commentContainer-questionLabel =
   { $username }  から質問 <RelativeTime></RelativeTime>
comments-commentContainer-commentLabel =
   { $username } からコメント <RelativeTime></RelativeTime>
comments-commentContainer-editButton = 編集

comments-commentContainer-avatar =
  .alt = { $username } のアバター

comments-editCommentForm-saveChanges = 変更を保存する
comments-editCommentForm-cancel = キャンセル
comments-editCommentForm-close = 閉じる
comments-editCommentForm-rteLabel = コメントを編集
comments-editCommentForm-rte =
  .placeholder = { comments-editCommentForm-rteLabel }
comments-editCommentForm-editRemainingTime = 編集可能時間： <time></time> まで
comments-editCommentForm-editTimeExpired = 編集可能時間が終了しました。 このコメントは編集できなくなります。 別のコメントを投稿してみませんか？
comments-editedMarker-edited = 編集済み
comments-showConversationLink-readMore = この会話をもっと見る>
comments-conversationThread-showMoreOfThisConversation =
  このコメントをもっと見る

comments-permalinkView-youAreCurrentlyViewing =
  現在ひとつの会話を表示しています。
comments-inReplyTo = <Username></Username> に返信する
comments-replyingTo = <Username></Username> に返信する

comments-reportButton-report = 報告
comments-reportButton-reported = 報告済み
comments-reportButton-aria-report =
  .aria-label = {$username} のコメントを報告する
comments-reportButton-aria-reported =
  .aria-label = 報告済み

comments-sortMenu-sortBy = 並び替え
comments-sortMenu-newest = 最新
comments-sortMenu-oldest = 最も古い
comments-sortMenu-mostReplies = もっと返信を見る

comments-userPopover =
  .description = より多くのユーザー情報を含むポップオーバー
comments-userPopover-memberSince = { DATETIME($timestamp, year: "numeric", month: "long", day: "numeric") } 以降のメンバー
comments-userPopover-ignore = 無視する

comments-userIgnorePopover-ignoreUser = {$username} を無視しますか？
comments-userIgnorePopover-ignore = 無視する
comments-userIgnorePopover-cancel = キャンセル

comments-userBanPopover-title = {$username} を禁止しますか？
comments-userBanPopover-description =
  禁止されると、このユーザーはコメントしたり、リアクションを使用したり、コメントを報告したりできなくなります。
  このコメントも拒否されます。
comments-userBanPopover-cancel = キャンセル
comments-userBanPopover-ban = 禁止する

comments-moderationDropdown-popover =
  .description = コメントをモデレートするためのポップオーバーメニュー
comments-moderationDropdown-feature = 特集
comments-moderationDropdown-unfeature = 特集しない
comments-moderationDropdown-approve = 承認
comments-moderationDropdown-approved = 承認済み
comments-moderationDropdown-reject = 排除
comments-moderationDropdown-rejected = 排除済み
comments-moderationDropdown-ban = 禁止ユーザー
comments-moderationDropdown-banned = 禁止済み
comments-moderationDropdown-moderationView = モデレーションビュー
comments-moderationDropdown-moderateStory = モデレートストーリー
comments-moderationDropdown-caretButton =
  .aria-label = モデレート

comments-moderationRejectedTombstone-title = このコメントは排除済みです
comments-moderationRejectedTombstone-moderateLink =
  この決定を確認するために、モデレーションに移動

comments-featuredTag = 特集

# $reaction could be "Respect" as an example. Be careful when translating to other languages with different grammar cases.
comments-react =
  .aria-label = {$count ->
    [0] {$reaction} 投稿者 {$username}
    *[other] {$reaction} 投稿者 {$username} (合計： {$count})
  }

# $reaction could be "Respected" as an example. Be careful when translating to other languages with different grammar cases.
comments-reacted =
  .aria-label = {$count ->
    [0] {$reaction} 投稿者 {$username}
    [one] {$reaction} 投稿者 {$username}
    *[other] {$reaction} comment by {$username} (Total: {$count})
  }

comments-jumpToComment-title = あなたの返信は、下記に投稿されています
comments-jumpToComment-GoToReply = 返信する

comments-mobileToolbar-closeButton =
  .aria-label = 閉じる
comments-mobileToolbar-unmarkAll = 全てのマークを外す
comments-mobileToolbar-nextUnread = 次の未読コメント

### Q&A

general-tabBar-qaTab = Q&A

qa-postCommentForm-section =
  .aria-label = 質問を投稿する

qa-answeredTab = 回答済み
qa-unansweredTab = 未回答
qa-allCommentsTab = 全て

qa-answered-answerLabel =
  回答者 {$username} <RelativeTime></RelativeTime>
qa-answered-gotoConversation = 会話へ移動
qa-answered-replies = 返信

qa-noQuestionsAtAll =
  この記事には質問がありません。
qa-noQuestionsYet =
  この記事にはまだ質問がありません。質問してみませんか？
qa-viewNew =
  { $count ->
    [1] View {$count} 新しい質問
    *[other] View {$count} 新しい質問
  }

qa-postQuestionForm-rteLabel = 質問を投稿する
qa-postQuestionForm-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }
qa-postQuestionFormFake-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }

qa-sortMenu-mostVoted = 最多投票

qa-answered-tag = 回答済み
qa-expert-tag = エキスパート

qa-reaction-vote = 投票
qa-reaction-voted = 投票済み

qa-reaction-aria-vote =
  .aria-label = {$count ->
    [0] 投稿者 {$username} に投票する
    *[other]投稿者 {$username} への投票数 ({$count})
  }
qa-reaction-aria-voted =
  .aria-label = {$count ->
    [0] 投稿者 {$username} に投票済み
    [one] 投稿者 {$username} に投票済み
    *[other]投稿者 {$username} に ({$count}) 票を投票済み

  }

qa-unansweredTab-doneAnswering = 完了

qa-expert-email = ({ $email })

qa-answeredTooltip-how = 質問にはどうやって回答できますか？
qa-answeredTooltip-answeredComments =
  質問にはQ&Aの専門家が回答します。
qa-answeredTooltip-toggleButton =
  .aria-label = 回答済みのツールチップを切り替える
  .title = 回答済みのツールチップを切り替える

### Account Deletion Stream

comments-stream-deleteAccount-callOut-title =
  アカウントの削除が要求されました
comments-stream-deleteAccount-callOut-receivedDesc =
  あなたのアカウント削除の要求が、{ $date } によって受信されました。
comments-stream-deleteAccount-callOut-cancelDesc =
  コメント、返信、反応などを引き続き残したい場合は、
{ $date } までアカウント削除のリクエストをキャンセルできます。
comments-stream-deleteAccount-callOut-cancel =
  アカウント削除のリクエストをキャンセルする
comments-stream-deleteAccount-callOut-cancelAccountDeletion =
  アカウント削除をキャンセルする

comments-permalink-copyLink = リンクをコピー
comments-permalink-linkCopied = リンクをコピーしました

### Embed Links

comments-embedLinks-showEmbeds = 埋め込みを表示
comments-embedLinks-hideEmbeds = 埋め込みを非表示

comments-embedLinks-show-giphy = GIFを表示
comments-embedLinks-hide-giphy = GIFを非表示

comments-embedLinks-show-youtube = ビデオを表示
comments-embedLinks-hide-youtube = ビデオを非表示

comments-embedLinks-show-twitter = ツイートを表示
comments-embedLinks-hide-twitter = ツイートを非表示

comments-embedLinks-show-external = 画像を表示
comments-embedLinks-hide-external = 画像を非表示


### Featured Comments
comments-featured-label =
  {$username} から注目のコメント <RelativeTime></RelativeTime>
comments-featured-gotoConversation = 会話に参加
comments-featured-replies = 返信する

## Profile Tab

profile-myCommentsTab = 自分のコメント
profile-myCommentsTab-comments = 自分のコメント
profile-accountTab = アカウント
profile-preferencesTab = 環境設定

### Bio
profile-bio-title = 略歴
profile-bio-description =
  コメントプロフィールに表示する略歴を作成します。
  100文字以内でご作成ください。
profile-bio-remove = 削除
profile-bio-update = アップデート
profile-bio-success = 略歴のアップデートが完了しました
profile-bio-removed = 略歴の削除が完了しました


### Account Deletion

profile-accountDeletion-deletionDesc =
  あなたのアカウントは、 { $date } に削除される予定です。
profile-accountDeletion-cancelDeletion =
  アカウントの削除がキャンセルされました
profile-accountDeletion-cancelAccountDeletion =
  アカウントの削除をキャンセルする

### Comment History
profile-commentHistory-section =
  .aria-label = コメント履歴
profile-historyComment-commentLabel =
  { $storyTitle } にコメントする<RelativeTime></RelativeTime>
profile-historyComment-viewConversation = コメントを見る
profile-historyComment-replies = 返信 {$replyCount}
profile-historyComment-commentHistory = コメント履歴
profile-historyComment-story = 記事： {$title}
profile-historyComment-comment-on = コメントする
profile-profileQuery-errorLoadingProfile = プロフィールの読み込みエラー
profile-profileQuery-storyNotFound = 記事が見つかりません
profile-commentHistory-loadMore = もっと読み込む
profile-commentHistory-empty = コメントを投稿していません。
profile-commentHistory-empty-subheading = あなたのコメント履歴がここに表示されます

### Preferences

profile-preferences-mediaPreferences = メディア環境設定
profile-preferences-mediaPreferences-alwaysShow = GIF、ツイート、YouTubeなどを常に表示する
profile-preferences-mediaPreferences-thisMayMake = これにより、コメントの読み込みが遅くなる場合があります
profile-preferences-mediaPreferences-update = アップデート
profile-preferences-mediaPreferences-preferencesUpdated =
  メディア環境設定がアップデートされました

### Account
profile-account-ignoredCommenters = 無視されたコメント投稿者
profile-account-ignoredCommenters-description =
  コメント投稿者のユーザー名をクリックして“無視”を選択すると、コメント投稿者を無視できます。
  あなたが誰かを無視すると、彼らのコメントはすべてあなたから隠されます。
  無視したコメント投稿者は、引き続きあなたのコメントを見ることができます。
profile-account-ignoredCommenters-empty = 現時点では誰も“無視”していません
profile-account-ignoredCommenters-stopIgnoring = 無視をやめる
profile-account-ignoredCommenters-youAreNoLonger =
  誰も無視していません
profile-account-ignoredCommenters-manage = 管理
profile-account-ignoredCommenters-cancel = キャンセル
profile-account-ignoredCommenters-close = 閉じる

profile-account-changePassword-cancel = 勘セル
profile-account-changePassword = パスワード変更
profile-account-changePassword-oldPassword = 古いパスワード
profile-account-changePassword-forgotPassword = パスワードをお忘れですか？
profile-account-changePassword-newPassword = 新しいパスワード
profile-account-changePassword-button = パスワードを変更
profile-account-changePassword-updated =
  パスワードが更新されました
profile-account-changePassword-password = パスワード

profile-account-download-comments-title = コメント履歴をダウンロード
profile-account-download-comments-description =
  コメント履歴をダウンロードするためのリンクが記載されたメールが届きます。
   <strong> 14日ごとに1つのダウンロード</strong>をリクエストできます。
profile-account-download-comments-request =
  コメント履歴をリクエスト
profile-account-download-comments-request-icon =
  .title = コメント履歴をリクエスト
profile-account-download-comments-recentRequest =
  最新のリクエスト： { $timeStamp }
profile-account-download-comments-yourMostRecentRequest =
  最近のリクエストは過去14日以内でした。
  次は {$timeStamp} 以降にコメント履歴のダウンロードをリクエストできます。
profile-account-download-comments-requested =
  リクエストが送信されました。{ framework-timeago-time } で別のリクエストを送信できます。
profile-account-download-comments-requestSubmitted =
  リクエストは正常に送信されました。 {framework-timeago-time}でコメント履歴のダウンロードを再度リクエストできます。
profile-account-download-comments-error =
  ダウンロードリクエストを完了できませんでした。
profile-account-download-comments-request-button = リクエスト

## Delete Account

profile-account-deleteAccount-title = アカウント情報を削除する
profile-account-deleteAccount-deleteMyAccount = アカウントを削除
profile-account-deleteAccount-description =
   アカウントを削除すると、プロフィールが完全に消去され、このサイトからすべてのコメントが削除されます。
profile-account-deleteAccount-requestDelete = アカウント消去をリクエストする

profile-account-deleteAccount-cancelDelete-description =
   アカウントの削除リクエストは既に送信されました。
   アカウントは {$date} に削除されます。
   それまでの間は、削除リクエストをキャンセルすることができます。
profile-account-deleteAccount-cancelDelete = アカウント削除リクエストをキャンセル

profile-account-deleteAccount-request = リクエスト
profile-account-deleteAccount-cancel = キャンセル
profile-account-deleteAccount-pages-deleteButton = 自分のアカウントを削除
profile-account-deleteAccount-pages-cancel = キャンセル
profile-account-deleteAccount-pages-proceed = 続行
profile-account-deleteAccount-pages-done = 完了
profile-account-deleteAccount-pages-phrase =
  .aria-label = フェーズ

profile-account-deleteAccount-pages-sharedHeader = アカウントを削除する

profile-account-deleteAccount-pages-descriptionHeader = アカウントを削除しますか?
profile-account-deleteAccount-pages-descriptionText =
  アカウントを削除しようとしています。それが意味するところは：
profile-account-deleteAccount-pages-allCommentsRemoved =
  投稿した全てのコメントはこのサイトから削除されます
profile-account-deleteAccount-pages-allCommentsDeleted =
  あなたが投稿した全てのコメントは、我々のサーバーからも削除されます
profile-account-deleteAccount-pages-emailRemoved =
  あなたのメールアドレスも、我々のシステムから削除されます

profile-account-deleteAccount-pages-whenHeader = マイ・アカウントが削除されるのはいつ？
profile-account-deleteAccount-pages-whenSubHeader = いつ？
profile-account-deleteAccount-pages-whenSec1Header =
  マイアカウントはいつ削除されますか？
profile-account-deleteAccount-pages-whenSec1Content =
  アカウントは、リクエストが送信されてから24時間後に削除されます。
profile-account-deleteAccount-pages-whenSec2Header =
  アカウントが削除されるまでコメントを書くことはできますか？
profile-account-deleteAccount-pages-whenSec2Content =
  いいえ。アカウントの削除をリクエストすると、コメントを書き込んだり、コメントに返信したり、リアクションしたりすることはできなくなります。
profile-account-deleteAccount-pages-downloadCommentHeader = コメント履歴をダウンロードしますか？
profile-account-deleteAccount-pages-downloadSubHeader = コメント履歴をダウンロードする
profile-account-deleteAccount-pages-downloadCommentsDesc =
  カウントを削除する前に、記録のためにコメント履歴をダウンロードすることをお勧めします。 アカウントが削除されると、コメント履歴をリクエストできなくなりますprofile-account-deleteAccount-pages-downloadCommentsPath =
  マイ・プロフィール > コメント履歴をダウンロードする

profile-account-deleteAccount-pages-confirmHeader = アカウントを削除してよろしいですか？
profile-account-deleteAccount-pages-confirmSubHeader = 本当によろしいですか？
profile-account-deleteAccount-pages-confirmDescHeader =
  アカウントを削除してもよろしいですか？
profile-account-deleteAccount-confirmDescContent =
  アカウントを削除することを確認するには、次のように入力してください
  下のテキストボックスにフレーズを入力してください。
profile-account-deleteAccount-pages-confirmPhraseLabel =
  確認するには、以下のフレーズを入力します：
profile-account-deleteAccount-pages-confirmPasswordLabel =
  パスワードを入力してください：

profile-account-deleteAccount-pages-completeHeader = アカウント削除のリクエスト
profile-account-deleteAccount-pages-completeSubHeader = リクエストが送信されました
profile-account-deleteAccount-pages-completeDescript =
 リクエストが送信され、ご登録いただいたメールに確認のためのメッセージが送信されました。
profile-account-deleteAccount-pages-completeTimeHeader =
  あなたのアカウントは { $date } に削除されます。
profile-account-deleteAccount-pages-completeChangeYourMindHeader = 変更しますか？
profile-account-deleteAccount-pages-completeSignIntoYourAccount =
  期限までに改めてサインインし、
  <strong>アカウント削除のリクエストをキャンセル</strong>を選択してください。
profile-account-deleteAccount-pages-completeTellUsWhy =理由をお聞かせください。
profile-account-deleteAccount-pages-completeWhyDeleteAccount =
  アカウントを削除する理由についてお聞かせください。
 また、このコメントシステムに関するフィードバックを { $email } までお寄せいただければ幸いです。
profile-account-changePassword-edit = 編集
profile-account-changePassword-change = 変更


## Notifications
profile-notificationsTab = 通知
profile-account-notifications-emailNotifications = Eメール通知
profile-account-notifications-emailNotifications = Eメール通知
profile-account-notifications-receiveWhen = 通知を受け取る
profile-account-notifications-onReply = コメントに返信があります
profile-account-notifications-onFeatured = コメントが注目されています
profile-account-notifications-onStaffReplies = コメントに運営からの返信があります
profile-account-notifications-onModeration = 保留中のコメントが確認されました
profile-account-notifications-sendNotifications = 通知を送信する
profile-account-notifications-sendNotifications-immediately = すぐに
profile-account-notifications-sendNotifications-daily = 1日ごと
profile-account-notifications-sendNotifications-hourly = 1時間ごと
profile-account-notifications-updated = 通知設定が変更されました
profile-account-notifications-button = 通知設定を変更する
profile-account-notifications-button-update = アップデート

## Report Comment Popover
comments-reportPopover =
  .description = コメントについて報告する会話
comments-reportPopover-reportThisComment = このコメントを報告する
comments-reportPopover-whyAreYouReporting = このコメントを報告した理由をお聞かせください。

comments-reportPopover-reasonOffensive = 不快なコメントである
comments-reportPopover-reasonAbusive = このコメントは暴言などを含んでおり、不適当である
comments-reportPopover-reasonIDisagree = このコメントには同意できない
comments-reportPopover-reasonSpam = 広告やマーケティング活動のように見える
comments-reportPopover-reasonOther = その他

comments-reportPopover-additionalInformation =
  追加のインフォメーション <optional>Optional</optional>
comments-reportPopover-pleaseLeaveAdditionalInformation =
  モデレータの役に立つと思われる情報があれば、お知らせください。

comments-reportPopover-maxCharacters = 最大 { $maxCharacters } 文字
comments-reportPopover-restrictToMaxCharacters =  { $maxCharacters }  文字以内でご報告ください。
comments-reportPopover-cancel = キャンセル
comments-reportPopover-submit = 送信

comments-reportPopover-thankYou = ありがとうございます
comments-reportPopover-receivedMessage =
  メッセージを受け取りました。お寄せいただいた報告は、コミュニティの安全を保ちます。

comments-reportPopover-dismiss = 棄却する

## Archived Report Comment Popover

comments-archivedReportPopover-reportThisComment = このコメントを報告する
comments-archivedReportPopover-doesThisComment =
  このコメントはコミュニティのガイドラインに違反していますか？
  攻撃的なコメントですか？　それともスパムですか？
  <a> {$orgName} </a>のモデレートチームに、このコメントへのリンクと簡単な説明を記載したメールを送信してください。
comments-archivedReportPopover-needALink =
  このコメントへのリンクが必要ですか？
comments-archivedReportPopover-copyLink = リンクをコピーする

comments-archivedReportPopover-emailSubject = コメントを報告
comments-archivedReportPopover-emailBody =
  次のコメントを報告します：
  %0A
  { $permalinkURL }
  %0A
  %0A
  理由は下記の通りです：

## Submit Status
comments-submitStatus-dismiss = 棄却する
comments-submitStatus-submittedAndWillBeReviewed =
  コメントが送信され、モデレーターによって検証されます
comments-submitStatus-submittedAndRejected =
  このコメントは、ガイドラインに反しているため、削除されました

# Configure
configure-configureQuery-errorLoadingProfile = 構成の読み込み中にエラーが発生しました
configure-configureQuery-storyNotFound = ストーリーが見つかりません

## Archive
configure-archived-title = このコメントストリームは、アーカイブされています
configure-archived-onArchivedStream =
  アーカイブされたストリームでは、新しいコメント、反応、報告などを送信することはできません。
 またコメントをモデレートすることもできません。
configure-archived-toAllowTheseActions =
  これらのアクションを許可するためには、アーカイブを解除する必要があります
configure-archived-unarchiveStream = ストリームのアーカイブを解除

## Change username
profile-changeUsername-username = ユーザー名
profile-changeUsername-success = ユーザー名の変更が完了しました
profile-changeUsername-edit = 編集
profile-changeUsername-change = 変更
profile-changeUsername-heading = ユーザー名を編集
profile-changeUsername-heading-changeYourUsername = ユーザー名を変更
profile-changeUsername-desc = すべてのコメントに表示されるユーザー名を変更します。 <strong>ユーザー名は{framework-timeago-time}ごとに1回変更できます。</strong>
profile-changeUsername-desc-text = すべてのコメントに表示されるユーザー名を変更します。ユーザー名は{framework-timeago-time}ごとに1回変更できます。
profile-changeUsername-current = 現在のユーザー名
profile-changeUsername-newUsername-label = 新しいユーザー名
profile-changeUsername-confirmNewUsername-label = 新しいユーザー名を確認
profile-changeUsername-cancel = キャンセル
profile-changeUsername-save = 保存
profile-changeUsername-saveChanges = 変更を保存
profile-changeUsername-recentChange = ユーザー名が変更されました。 {$nextUpdate}でユーザー名を再度変更できます。
profile-changeUsername-youChangedYourUsernameWithin =
  {framework-timeago-time}内にユーザー名を変更しました。 {$nextUpdate}でユーザー名を再度変更できます。
profile-changeUsername-close = 閉じる

## Discussions tab

discussions-mostActiveDiscussions = 最も活発な議論
discussions-mostActiveDiscussions-subhead =  {$siteName}における直近24時間のコメント数ランキング
discussions-mostActiveDiscussions-empty = ディスカッションに参加していません
discussions-myOngoingDiscussions = 進行中のディスカッション
discussions-myOngoingDiscussions-subhead = { $orgName } で最もコメントした場所
discussions-viewFullHistory = コメント履歴を全て見る
discussions-discussionsQuery-errorLoadingProfile = プロフィールの読み込みエラー
discussions-discussionsQuery-storyNotFound = ストーリーが見つかりません

## Comment Stream
configure-stream-title-configureThisStream =
  このストリームを構成する
configure-stream-update = アップデート
configure-stream-streamHasBeenUpdated =
  このストリームはアップデートされました

configure-premod-premoderateAllComments = 全てのコメントを予備的にモデレートする
configure-premod-description =
  モデレータは、このコメントを公開する前に、コメントを承認する必要があります。

configure-premodLink-commentsContainingLinks =
  リンクを含む予備的なモデレートコメント
configure-premodLink-description =
  モデレーターは、このストーリーを公開する前に、リンクを含むコメントを承認する必要があります。

configure-addMessage-title =
   Add a message or question
configure-addMessage-description =
  読者向けのコメントボックスの上部にメッセージを追加します。
  これを使用して、トピックを提起したり、質問したり、
  このストーリーに関連する発表を行ったりします。
configure-addMessage-addMessage = メッセージを追加
configure-addMessage-removed = メッセージは消去されました
config-addMessage-messageHasBeenAdded =
  メッセージはコメントボックスに追加されています
configure-addMessage-remove = 削除
configure-addMessage-submitUpdate = 更新
configure-addMessage-cancel = キャンセル
configure-addMessage-submitAdd = メッセージを追加

configure-messageBox-preview = プレビュー
configure-messageBox-selectAnIcon = アイコンを選択
configure-messageBox-iconConversation = 会話
configure-messageBox-iconDate = 日付
configure-messageBox-iconHelp = ヘルプ
configure-messageBox-iconWarning = 注意
configure-messageBox-iconChatBubble = チャットバブル
configure-messageBox-noIcon = アイコンがありません
configure-messageBox-writeAMessage = メッセージを書く

configure-closeStream-closeCommentStream =
  コメントストリームを閉じる
configure-closeStream-description =
  このコメントストリームは現在開いています。
 このコメントストリームを閉じると、新しいコメントを送信できなくなりますが、以前に送信されたすべてのコメントが引き続き表示されます。
configure-closeStream-closeStream = ストリームを閉じる
configure-closeStream-theStreamIsNowOpen = このストリームは、現在開かれています

configure-openStream-title = ストリームを開く
configure-openStream-description =
  このコメントストリームは現在閉じられています。
 このコメントストリームを開くと、新しいコメントを送信して表示できます。
configure-openStream-openStream = ストリームを開く
configure-openStream-theStreamIsNowClosed = このストリームは現在閉じられています

qa-experimentalTag-tooltip-content =
  Q＆Aフォーマットは現在開発が行なわれています。
 フィードバックやご要望がございましたら、お問い合わせください。
configure-enableQA-switchToQA =
  Q&Aフォーマットを切り替える
configure-enableQA-description =
  Q＆A形式では、コミュニティメンバーは、選択した専門家が回答できるように質問を送信できます。
configure-enableQA-enableQA = Q&Aを切り替える
configure-enableQA-streamIsNowComments =
  このストリームはコメント形式になりました

configure-disableQA-title = このQ&Aを構築する
configure-disableQA-description =
  Q＆A形式では、コミュニティメンバーは、選択した専門家が回答できるように質問を送信できます。
configure-disableQA-disableQA = コメントを切り替える
configure-disableQA-streamIsNowQA =
 このストリームは現在Q＆A形式です

configure-experts-title = エキスパートを追加する
configure-experts-filter-searchField =
  .placeholder = Eメールもしくはユーザー名で検索する
  .aria-label = Eメールもしくはユーザー名で検索する
configure-experts-filter-searchButton =
  .aria-label = 検索
configure-experts-filter-description =
  このページでのみ、登録ユーザーによるコメントにエキスパートバッジを追加します。
 新規ユーザーは、最初にサインアップしてページのコメントを開き、アカウントを作成する必要があります。
configure-experts-search-none-found = そのメールアドレスまたはユーザー名のユーザーは見つかりませんでした
configure-experts-remove-button = 削除
configure-experts-load-more = もっと読み込む
configure-experts-none-yet = 現在、このQ＆Aのエキスパートはいません。
configure-experts-search-title = エキスパートを検索する
configure-experts-assigned-title = エキスパート
configure-experts-noLongerAnExpert = 今はエキスパートではありません
comments-tombstone-ignore = {$username}を無視したため、このコメントは非表示になっています
comments-tombstone-showComment = コメントを見る
comments-tombstone-deleted =
  このコメントは利用できなくなりました。 コメント投稿者は自分のアカウントを削除しました。
comments-tombstone-rejected =
  このコメント投稿者は、コミュニティガイドラインに違反したため、モデレーターによって削除されました。

suspendInfo-heading-yourAccountHasBeen =
  あなたのアカウントのコメントが一時的に停止されました
suspendInfo-description-inAccordanceWith =
 {$Organisation}のコミュニティガイドラインに従い、アカウントは一時的に停止されています。
 一時停止中は、コメントしたり、リアクションを使用したり、コメントを報告したりすることはできません。
suspendInfo-until-pleaseRejoinThe =
  {$until}で会話に再度参加してください

warning-heading = アカウントに警告が発行されました
warning-explanation =
  コミュニティガイドラインに従って、アカウントに警告が発行されました。
warning-instructions =
  引き続きディスカッションに参加するには、下の“承認”ボタンを押してください。
warning-acknowledge = 承認

warning-notice = アカウントに警告が発行されました。 引き続き参加するには、<a>警告メッセージ</a>を確認してください。

modMessage-heading = アカウントにモデレーターからメッセージが送信されましたmodMessage-acknowledge = 承認

profile-changeEmail-unverified = （未確認）
profile-changeEmail-current = （現在）
profile-changeEmail-edit = 編集
profile-changeEmail-change = 変更
profile-changeEmail-please-verify = あなたのメールアドレスを確認してください
profile-changeEmail-please-verify-details =
   アカウントを確認するためのメールが{$email}に送信されました。
  アカウントへのサインインや通知の受信に使用する前に、
  新しいメールアドレスを確認する必要があります。
profile-changeEmail-resend = 確認を再送
profile-changeEmail-heading = メールアドレスを編集する
profile-changeEmail-changeYourEmailAddress =
  メールアドレスを変更する
profile-changeEmail-desc = サインインとアカウントに関する連絡の受信に使用するメールアドレスを変更します。
profile-changeEmail-newEmail-label = 新しいメールアドレス
profile-changeEmail-password = パスワード
profile-changeEmail-password-input =
  .placeholder = パスワード
profile-changeEmail-cancel = キャンセル
profile-changeEmail-submit = 保存
profile-changeEmail-saveChanges = 変更を保存
profile-changeEmail-email = Eメール
profile-changeEmail-title = Eメールアドレス
profile-changeEmail-success = メールの変更が完了しました

## Ratings and Reviews

ratingsAndReviews-postCommentForm-section =
  .aria-label = レビューを送信するか、質問をする

ratingsAndReviews-reviewsTab = レビュー
ratingsAndReviews-questionsTab = 質問
ratingsAndReviews-noReviewsAtAll = レビューはありません
ratingsAndReviews-noQuestionsAtAll = 質問はありません
ratingsAndReviews-noReviewsYet = レビューはまだありません。最初のレビューを投稿してみませんか？
ratingsAndReviews-noQuestionsYet = まだ質問はありません。最初の質問を書いてみませんか？
ratingsAndReviews-selectARating = 評価を選択
ratingsAndReviews-youRatedThis = すでに評価しています
ratingsAndReviews-showReview = レビューを表示する
  .title = { ratingsAndReviews-showReview }
ratingsAndReviews-rateAndReview = 評価とレビュー
ratingsAndReviews-askAQuestion = 質問する
ratingsAndReviews-basedOnRatings = { $count ->
  [0] まだ評価はありません
  [1] ひとつの評価に基づく
  *[other]  { SHORT_NUMBER($count) }  の評価に基づく
}

ratingsAndReviews-allReviewsFilter = 全てのレビュー
ratingsAndReviews-starReviewsFilter = { $rating ->
  [1] 星1
  *[other] 星 { $rating }
}

comments-addAReviewForm-rteLabel = レビューを追加（オプション）

comments-addAReviewForm-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

comments-addAReviewFormFake-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

stream-footer-links-top-of-article = 最初の記事
  .title = 最初の記事に行く
stream-footer-links-top-of-comments = 最初のコメント
  .title = 最初のコメントに行く
stream-footer-links-profile = プロフィールと返信
  .title = プロフィールと返信に行く
stream-footer-links-discussions = もっと議論する
  .title = 議論に行く
stream-footer-navigation =
  .aria-label = コメント足跡
