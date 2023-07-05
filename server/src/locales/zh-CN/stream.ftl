### Localization for Embed Stream

## General

general-commentsEmbedSection =
  .aria-label = 嵌入的留言

general-moderate = 调节
general-archived = 已归档

general-userBoxUnauthenticated-joinTheConversation =加入对话
general-userBoxUnauthenticated-signIn = 登录
general-userBoxUnauthenticated-register = 注册

general-authenticationSection =
  .aria-label = 验证

general-userBoxAuthenticated-signedIn =
  登录作为
general-userBoxAuthenticated-notYou =
  不是您？ <button>退出</button>

general-userBox-youHaveBeenSuccessfullySignedOut =
  您已经成功退出

general-tabBar-commentsTab = 留言
general-tabBar-myProfileTab = 我的个人资料
general-tabBar-discussionsTab = 讨论
general-tabBar-reviewsTab = 审查
general-tabBar-configure = 配置

general-mainTablist =
  .aria-label = 主要标签列表

general-secondaryTablist =
  .aria-label = 次要的标签列表

## Comment Count

comment-count-text =
  { $count  ->
    [one] 留言
    *[other] 留言
  }

## Comments Tab

comments-allCommentsTab = 所有留言
comments-featuredTab = 高亮的
comments-counter-shortNum = { SHORT_NUMBER($count) }
comments-watchers =
  { $count  ->
    [one] 1人查看讨论
    *[other] { SHORT_NUMBER($count) } 人查看讨论
  }

comments-announcement-section =
  .aria-label =公告
comments-announcement-closeButton =
  .aria-label = 关闭公告

comments-accountStatus-section =
  .aria-label = 账户状态

comments-featuredCommentTooltip-how = 如何成为特色留言？
comments-featuredCommentTooltip-handSelectedComments =
  由我们的团队选择值得阅读的留言。
comments-featuredCommentTooltip-toggleButton =
  .aria-label =切换特色留言的工具提示
  .title = 切换特色留言的工具提示

comments-collapse-toggle =
  .aria-label = 折叠留言主题
comments-expand-toggle =
  .aria-label = 展开留言主题
comments-bannedInfo-bannedFromCommenting =您的账户已被禁止留言。
comments-bannedInfo-violatedCommunityGuidelines =
  有权限进入您账户的人违反了我们的社区准则。因此您的账户已被禁止使用。您将不再能发表留言，使用反应或举报留言。如果您认为这是个错误，请联系我们的社区团队。

comments-noCommentsAtAll = 该故事没有留言。
comments-noCommentsYet = 目前还没有留言。您为什么不写一个呢？

comments-streamQuery-storyNotFound = 故事无法找到

comments-communityGuidelines-section =
  .aria-label = 社区指南

comments-commentForm-cancel = 取消
comments-commentForm-saveChanges = 保存修改
comments-commentForm-submit = 递交

comments-postCommentForm-section =
  .aria-label = 发布一个留言
comments-postCommentForm-submit = 递交
comments-replyList-showAll = 显示所有
comments-replyList-showMoreReplies = 显示更多回复

comments-postComment-gifSearch = 搜索一个动图
comments-postComment-gifSearch-search =
  .aria-label = 搜索
comments-postComment-gifSearch-loading = 载入中……
comments-postComment-gifSearch-no-results = 没有发现{$query}的结果
comments-postComment-gifSearch-powered-by-giphy =
  .alt = 由giphy提供

comments-postComment-pasteImage = 粘贴图像URL
comments-postComment-insertImage = 插入

comments-postComment-confirmMedia-youtube = 在您的留言末尾添加这个YouTube视频？
comments-postComment-confirmMedia-twitter = 在您的留言末尾加上本条Tweet？
comments-postComment-confirmMedia-cancel = 取消
comments-postComment-confirmMedia-add-tweet = 添加Tweet
comments-postComment-confirmMedia-add-video = 添加视频
comments-postComment-confirmMedia-remove = 取消
comments-commentForm-gifPreview-remove = 取消
comments-viewNew =
  { $count ->
    [1] View {$count}新留言
    *[other] View {$count} 新留言
  }
comments-loadMore = 载入更多

comments-permalinkPopover =
  .description =  一个显示留言的固定链接的对话框
comments-permalinkPopover-permalinkToComment =
  .aria-label = 留言的固定连接
comments-permalinkButton-share =分享
comments-permalinkButton =
  .aria-label = 由{$username}分享留言
comments-permalinkView-section =
  .aria-label = 单个对话
comments-permalinkView-viewFullDiscussion = 查看完整讨论
comments-permalinkView-commentRemovedOrDoesNotExist = 该留言已被删除或不存在。
comments-rte-bold =
  .title = 粗体

comments-rte-italic =
  .title = 斜体

comments-rte-blockquote =
  .title = 块状引文

comments-rte-bulletedList =
  .title = 有标题的列表

comments-rte-strikethrough =
  .title = 删减线

comments-rte-spoiler = 剧透

comments-rte-sarcasm = 讽刺

comments-rte-externalImage =
  .title = 外部图像

comments-remainingCharacters =还剩 { $remaining } 个字符

comments-postCommentFormFake-signInAndJoin = 登录并加入对话

comments-postCommentForm-rteLabel =发布一个留言

comments-postCommentForm-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentFormFake-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-replyButton-reply = 回复
comments-replyButton =
  .aria-label = 由{$username}回复留言

comments-permalinkViewQuery-storyNotFound = { comments-streamQuery-storyNotFound }

comments-replyCommentForm-submit = 递交
comments-replyCommentForm-cancel = 取消
comments-replyCommentForm-rteLabel = 编写一个回复
comments-replyCommentForm-rte =
  .placeholder = { comments-replyCommentForm-rteLabel }

comments-commentContainer-threadLevelLabel = 主题层{ $level }:
comments-commentContainer-highlightedLabel = 高亮的：
comments-commentContainer-ancestorLabel = 最早的：
comments-commentContainer-replyLabel =
  来自{ $username } <RelativeTime></RelativeTime>的评论
comments-commentContainer-questionLabel =
 引用自{ $username } <RelativeTime></RelativeTime>
comments-commentContainer-commentLabel =
  来自 { $username } <RelativeTime></RelativeTime>的留言
comments-commentContainer-editButton = 编辑

comments-commentContainer-avatar =
  .alt = 化身 { $username }

comments-editCommentForm-saveChanges = 保存修改
comments-editCommentForm-cancel = 取消
comments-editCommentForm-close = 关闭
comments-editCommentForm-rteLabel = 编辑留言
comments-editCommentForm-rte =
  .placeholder = { comments-editCommentForm-rteLabel }
comments-editCommentForm-editRemainingTime = 编辑：剩余<time></time>
comments-editCommentForm-editTimeExpired = 编辑已超时。您不能再编辑此留言。为什么不再发一条？
comments-editedMarker-edited = 已编辑
comments-showConversationLink-readMore = 阅读更多此对话 >
comments-conversationThread-showMoreOfThisConversation =
  展示更多此对话

comments-permalinkView-youAreCurrentlyViewing =
  您当前正在查看一个单独对话
comments-inReplyTo = 回复<Username></Username>
comments-replyingTo = 回复 <Username></Username>

comments-reportButton-report = 举报
comments-reportButton-reported = 被举报
comments-reportButton-aria-report =
  .aria-label = 由 {$username}举报留言
comments-reportButton-aria-reported =
  .aria-label = 被举报

comments-sortMenu-sortBy = 按
comments-sortMenu-newest = 最新
comments-sortMenu-oldest = 最早
comments-sortMenu-mostReplies = 最多回复

comments-userPopover =
  .description = 有更多用户信息的弹出窗口
comments-userPopover-memberSince = 自从 { DATETIME($timestamp, year: "numeric", month: "long", day: "numeric") }成为成员
comments-userPopover-ignore = 忽略

comments-userIgnorePopover-ignoreUser = 忽略 {$username}?
comments-userIgnorePopover-description =
  当您忽略一个留言者时，他们在网站上的所有评论都会被隐藏起来。您可以撤销该操作。
comments-userIgnorePopover-ignore = 忽略
comments-userIgnorePopover-cancel = 取消

comments-userBanPopover-title = 禁止 {$username}?
comments-userBanPopover-description =
  旦被禁止，该用户将不再能够发表留言、使用回应或举报评论。 这个留言也将被拒绝。
comments-userBanPopover-cancel = 取消
comments-userBanPopover-ban = 禁止

comments-moderationDropdown-popover =
  .description = 一个调节评论的弹出式菜单
comments-moderationDropdown-feature = 高亮
comments-moderationDropdown-unfeature = 取消高亮
comments-moderationDropdown-approve = 同意
comments-moderationDropdown-approved = 获得同意
comments-moderationDropdown-reject = 拒绝
comments-moderationDropdown-rejected = 遭到拒绝
comments-moderationDropdown-ban = 禁止用户
comments-moderationDropdown-banned =被禁止
comments-moderationDropdown-moderationView = 调节视角
comments-moderationDropdown-moderateStory = 调节故事
comments-moderationDropdown-caretButton =
  .aria-label = 调节

comments-moderationRejectedTombstone-title = 您已经拒绝该留言。
comments-moderationRejectedTombstone-moderateLink =
  前往调节来审核该决定

comments-featuredTag = F被高亮

  #以$reaction可以是 "认可"为例。在翻译成具有不同语法情况的其他语言时要小心。
comments-react =
  .aria-label = {$count ->
    [0] {$reaction} 由 {$username}发表留言
    *[other] {$reaction}由 {$username} 发表（总共：{$count})
  }

  #以$reaction可以是 "认可"为例。在翻译成具有不同语法情况的其他语言时要小心。
comments-reacted =
  .aria-label = {$count ->
    [0] {$reaction} 由 {$username}发表留言
    [one] {$reaction}由 {$username}发表留言
  *[other] {$reaction}由 {$username} 发表（总共：{$count})
  }

comments-jumpToComment-title = 您的回复已张贴在下面
comments-jumpToComment-GoToReply = 前去回复

comments-mobileToolbar-closeButton =
  .aria-label = 关闭
comments-mobileToolbar-unmarkAll = 取消标记所有
comments-mobileToolbar-nextUnread = 下一条未读

comments-replyChangedWarning-theCommentHasJust =
  这条评论刚刚被编辑过。最新版本显示在上面。

### Q&A

general-tabBar-qaTab = Q&A

qa-postCommentForm-section =
  .aria-label = 发布一个问题

qa-answeredTab = 已回答
qa-unansweredTab = 未回答
qa-allCommentsTab = 所有

qa-answered-answerLabel =
  Answer from {$username} <RelativeTime></RelativeTime>
qa-answered-gotoConversation = 前往对话
qa-answered-replies = 回复

qa-noQuestionsAtAll =
  这个故事没有任何问题。
qa-noQuestionsYet =
  目前还没有任何问题。您为什么不问一个呢？
qa-viewNew =
  { $count ->
    [1]查看{$count} 新问题
    *[other] 查看{$count} 新问题
  }

qa-postQuestionForm-rteLabel = 发布一个问题
qa-postQuestionForm-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }
qa-postQuestionFormFake-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }

qa-sortMenu-mostVoted = 投票最多

qa-answered-tag = 已回答
qa-expert-tag = 专家

qa-reaction-vote = 投票
qa-reaction-voted = 已投票

qa-reaction-aria-vote =
  .aria-label = {$count ->
    [0] 由 {$username}为留言投票
    *[other] 由{$username}为留言投票({$count})
  }
qa-reaction-aria-voted =
  .aria-label = {$count ->
    [0]由 {$username}为留言投票
    [one] 由 {$username}为留言投票
    *[other]  由 {$username}为留言投票({$count})
  }

qa-unansweredTab-doneAnswering = 完成

qa-expert-email = ({ $email })

qa-answeredTooltip-how = 如何回答问题？
qa-answeredTooltip-answeredComments =
  由Q&A问答专家回答问题。
qa-answeredTooltip-toggleButton =
  .aria-label = 切换回答问题的工具提示
  .title = 切换回答问题的工具提示

### Account Deletion Stream

comments-stream-deleteAccount-callOut-title =
  要求删除账户
comments-stream-deleteAccount-callOut-receivedDesc =
 在{$date }收到了删除您的账户的请求。
comments-stream-deleteAccount-callOut-cancelDesc =
  如果您想继续留下评论、回复或作出回应。
  您可以在{$date }之前取消删除您账户的请求。
comments-stream-deleteAccount-callOut-cancel =
  取消删除账户的请求
comments-stream-deleteAccount-callOut-cancelAccountDeletion =
  取消删除账户

comments-permalink-copyLink = 复制链接
comments-permalink-linkCopied = 链接已复制

### Embed Links

comments-embedLinks-showEmbeds = 显示嵌入的内容
comments-embedLinks-hideEmbeds = 隐藏嵌入的内容

comments-embedLinks-show-giphy = 显示动图
comments-embedLinks-hide-giphy = 隐藏动图

comments-embedLinks-show-youtube = 显示视频
comments-embedLinks-hide-youtube = 隐藏视频

comments-embedLinks-show-twitter = 显示Tweet
comments-embedLinks-hide-twitter = 隐藏Tweet

comments-embedLinks-show-external = 显示图片
comments-embedLinks-hide-external = 隐藏图片


### Featured Comments
comments-featured-label =
  来自{$username}的特色评论<RelativeTime></RelativeTime>
comments-featured-gotoConversation =前往对话
comments-featured-replies = 回复

## Profile Tab

profile-myCommentsTab = 我的留言
profile-myCommentsTab-comments = 我的留言
profile-accountTab = 账户
profile-preferencesTab = 偏好

### Bio
profile-bio-title = Bio
profile-bio-description =
  编写一份介绍公开显示在您的留言资料上。必须少于100个字符。
profile-bio-remove = 取消
profile-bio-update = 更新
profile-bio-success = 您的资料已经更新成功。
profile-bio-removed = 您的资料已经移除。


### Account Deletion

profile-accountDeletion-deletionDesc =
  您的账户将于{$date }被删除。
profile-accountDeletion-cancelDeletion =
  取消账户删除请求
profile-accountDeletion-cancelAccountDeletion =
  取消删除账户

### Comment History
profile-commentHistory-section =
  .aria-label = 留言历史
profile-historyComment-commentLabel =
   <RelativeTime></RelativeTime> 在{ $storyTitle }上留言
profile-historyComment-viewConversation =查看对话
profile-historyComment-replies = 回复{$replyCount}
profile-historyComment-commentHistory = 留言历史
profile-historyComment-story = 故事：{$title}
profile-historyComment-comment-on =留言：
profile-profileQuery-errorLoadingProfile = 载入资料出错
profile-profileQuery-storyNotFound = 故事无法找到
profile-commentHistory-loadMore = 载入更多
profile-commentHistory-empty = 您没有写过任何留言
profile-commentHistory-empty-subheading = 你的留言历史将出现在这里

### Preferences

profile-preferences-mediaPreferences = 媒体偏好
profile-preferences-mediaPreferences-alwaysShow = 始终显示动图、Tweets、YouTube等。
profile-preferences-mediaPreferences-thisMayMake = 这可能会使留言的加载速度变慢
profile-preferences-mediaPreferences-update = 更新
profile-preferences-mediaPreferences-preferencesUpdated =
  您的媒体偏好已被更新

### Account
profile-account-ignoredCommenters = 忽略留言
profile-account-ignoredCommenters-description =
  您可以通过点击其他留言者的用户名来忽略他们 并选择 "忽略"。当您忽略某人时，他们所有的留言都会被隐藏起来。被您忽略的留言者仍然能够看到您的评论。
profile-account-ignoredCommenters-empty = 您当前没有忽略过任何人
profile-account-ignoredCommenters-stopIgnoring = 停止忽略
profile-account-ignoredCommenters-youAreNoLonger =
 您不再忽略
profile-account-ignoredCommenters-manage = 管理
profile-account-ignoredCommenters-cancel = 取消
profile-account-ignoredCommenters-close = 关闭

profile-account-changePassword-cancel = 取消
profile-account-changePassword = 修改密码
profile-account-changePassword-oldPassword =就密码
profile-account-changePassword-forgotPassword = 忘记您的密码？
profile-account-changePassword-newPassword = 新密码
profile-account-changePassword-button = 修改密码
profile-account-changePassword-updated =
  您的密码已更新
profile-account-changePassword-password = 密码

profile-account-download-comments-title = 下载您的留言历史
profile-account-download-comments-description =
  您将收到一封邮件，其中附有用于下载您留言历史的链接。您可以<strong>每14天发送一次下载请求。</strong>
profile-account-download-comments-request =
  请求留言历史
profile-account-download-comments-request-icon =
  .title = 请求留言历史
profile-account-download-comments-recentRequest =
  您最近的请求{ $timeStamp }
profile-account-download-comments-yourMostRecentRequest =
  你最近的请求是在过去14天内。您可以在{ $timeStamp }再次请求下载您的留言。
profile-account-download-comments-requestSubmitted =
  您的请求已成功提交。您可以在{ framework-timeago-time }后要求再次下载您的留言历史。
profile-account-download-comments-error =
  我们无法完成您的下载请求。
profile-account-download-comments-request-button = 请求

## Delete Account

profile-account-deleteAccount-title = 删除我的账户
profile-account-deleteAccount-deleteMyAccount = 删除我的账户
profile-account-deleteAccount-description =
  删除您的账户将永久删除您的个人资料，并删除您在本网站的所有留言。
profile-account-deleteAccount-requestDelete =请求删除账户

profile-account-deleteAccount-cancelDelete-description =
  您已经提交了删除账户的请求。
  您的账户将在{$date }被删除。
  在那之前，您可以取消该请求。
profile-account-deleteAccount-cancelDelete = 取消删除账户请求

profile-account-deleteAccount-request =请求
profile-account-deleteAccount-cancel = 取消
profile-account-deleteAccount-pages-deleteButton = 删除我的账户
profile-account-deleteAccount-pages-cancel = 取消
profile-account-deleteAccount-pages-proceed = 进行中
profile-account-deleteAccount-pages-done = 完成
profile-account-deleteAccount-pages-phrase =
  .aria-label = 阶段

profile-account-deleteAccount-pages-sharedHeader = 删除我的账户

profile-account-deleteAccount-pages-descriptionHeader = 删除我的账户？
profile-account-deleteAccount-pages-descriptionText =
  您正试图删除您的账户。这意味着
profile-account-deleteAccount-pages-allCommentsRemoved =
  您在该网站上的所有留言都被删除
profile-account-deleteAccount-pages-allCommentsDeleted =
  所有您的留言已经从我们的数据库里删除
profile-account-deleteAccount-pages-emailRemoved =
 您的电子邮件地址已经从我们的系统中移除

profile-account-deleteAccount-pages-whenHeader = 删除我的账户：何时？
profile-account-deleteAccount-pages-whenSubHeader = 何时？
profile-account-deleteAccount-pages-whenSec1Header =
  我的账户将在何时被删除？
profile-account-deleteAccount-pages-whenSec1Content =
  您的账户将在您提交请求24小时后被删除。
profile-account-deleteAccount-pages-whenSec2Header =
  在我的账户被删除之前，我还能写留言吗？
profile-account-deleteAccount-pages-whenSec2Content =
  不行。一旦您要求删除账户，您就不能再写留言、回复留言或选择。

profile-account-deleteAccount-pages-downloadCommentHeader = 下载我的留言？
profile-account-deleteAccount-pages-downloadSubHeader = 下载我的留言？
profile-account-deleteAccount-pages-downloadCommentsDesc =
  在您的账户被删除之前，我们建议您下载您的留言历史作为您的记录。在您的帐户被删除后，您将无法请求下载您的留言历史。
profile-account-deleteAccount-pages-downloadCommentsPath =
  我的资料 > 下载我的留言历史

profile-account-deleteAccount-pages-confirmHeader = 确认删除账户？
profile-account-deleteAccount-pages-confirmSubHeader = 您确定吗？
profile-account-deleteAccount-pages-confirmDescHeader =
  您真的想删除您的账户？
profile-account-deleteAccount-confirmDescContent =
  为了确认您想删除您的账户，请在下面的文本框中输入以下短语：
profile-account-deleteAccount-pages-confirmPhraseLabel =
  为了确认，输入以下短语
profile-account-deleteAccount-pages-confirmPasswordLabel =
  输入您的密码：

profile-account-deleteAccount-pages-completeHeader = 已请求删除账户
profile-account-deleteAccount-pages-completeSubHeader = 请求已递交
profile-account-deleteAccount-pages-completeDescript =
  您的请求已被提交，确认函已被发送到与您的账户相关的电子邮件。
profile-account-deleteAccount-pages-completeTimeHeader =
  您的账户将在{ $date }被删除
profile-account-deleteAccount-pages-completeChangeYourMindHeader = 您改变了主意？
profile-account-deleteAccount-pages-completeSignIntoYourAccount =
  只要在这之前再次登录你的账户，并选择 <strong>取消删除账户的请求</strong>.

profile-account-deleteAccount-pages-completeTellUsWhy = 告诉我们原因
profile-account-deleteAccount-pages-completeWhyDeleteAccount =
  我们想知道您为什么选择删除你的账户。通过{$email }向我们的留言系统发送反馈。
profile-account-changePassword-edit = 修改
profile-account-changePassword-change = 修改


## Notifications
profile-notificationsTab = 通知
profile-account-notifications-emailNotifications = 电子邮件通知
profile-account-notifications-emailNotifications = 电子邮件通知
profile-account-notifications-receiveWhen = 接受电子邮件通知：
profile-account-notifications-onReply = 我的留言收到回复时
profile-account-notifications-onFeatured = 我的留言被高亮时
profile-account-notifications-onStaffReplies =有员工成员回复我的留言时
profile-account-notifications-onModeration = 我的待处理留言已经得到审查时
profile-account-notifications-sendNotifications =发送通知：
profile-account-notifications-sendNotifications-immediately = 立即
profile-account-notifications-sendNotifications-daily = 每天
profile-account-notifications-sendNotifications-hourly = 每小时
profile-account-notifications-updated =您的通知设置已经更新
profile-account-notifications-button = 更新设置
profile-account-notifications-button-update = 更新

## Report Comment Popover
comments-reportPopover =
  .description = 一个举报留言的对话框
comments-reportPopover-reportThisComment = 举报这条留言
comments-reportPopover-whyAreYouReporting = 为什么您举报这条留言？

comments-reportPopover-reasonOffensive = 这条留言无礼
comments-reportPopover-reasonAbusive = 这条留言有侮辱性
comments-reportPopover-reasonIDisagree = 我不同意这条留言
comments-reportPopover-reasonSpam =它看起来像广告或营销
comments-reportPopover-reasonOther = 其他

comments-reportPopover-additionalInformation =
 额外信息 <optional>可选</optional>
comments-reportPopover-pleaseLeaveAdditionalInformation =
  请留下任何可能对我们的版主有帮助的额外信息。

comments-reportPopover-maxCharacters = Max. { $maxCharacters } 字符
comments-reportPopover-restrictToMaxCharacters = 请将您的举报限制在{ $maxCharacters }字符范围内
comments-reportPopover-cancel = 取消
comments-reportPopover-submit = 递交

comments-reportPopover-thankYou = 谢谢！
comments-reportPopover-receivedMessage =
  我们已经收到您的消息。来自像您这样的成员的举报保证了社区的安全。
comments-reportPopover-dismiss = 不理会

## Archived Report Comment Popover

comments-archivedReportPopover-reportThisComment = 举报这条留言
comments-archivedReportPopover-doesThisComment =
  这条留言违反我们的社区准则吗？这是无礼的留言或垃圾留言？
  在{ $orgName }</a>上向我们的审核团队发送电子邮件并附上该留言的链接和简单的解释。
comments-archivedReportPopover-needALink =
  需要这条留言的链接？
comments-archivedReportPopover-copyLink = 复制链接

comments-archivedReportPopover-emailSubject = 举报留言
comments-archivedReportPopover-emailBody =
  我想举报下面的留言：
  %0A
  { $permalinkURL }
  %0A
  %0A
  出于以下原因：

## Submit Status
comments-submitStatus-dismiss = 不理会
comments-submitStatus-submittedAndWillBeReviewed =
  您的留言已经提交，将由版主审核。
comments-submitStatus-submittedAndRejected =
  该留言因违反我们的准则而被拒绝。

# Configure
configure-configureQuery-errorLoadingProfile = 加载配置时出错
configure-configureQuery-storyNotFound = 无法找到故事

## Archive
configure-archived-title = 该留言流已被归档
configure-archived-onArchivedStream =
  对于已经归档的流，不会提交新的留言、回应或举报。同时，留言也无法审核。
configure-archived-toAllowTheseActions =
  要允许这些回应，解除流归档。
configure-archived-unarchiveStream = 解除流归档

## Change username
profile-changeUsername-username = 用户名
profile-changeUsername-success = 您的用户名已更新
profile-changeUsername-edit = 编辑
profile-changeUsername-change = 修改
profile-changeUsername-heading = 编辑您的用户名
profile-changeUsername-heading-changeYourUsername = 修改您的用户名
profile-changeUsername-desc = 修改显示在你过去和未来所有留言上的用户名。<strong>用户名可以每{ framework-timeago-time }修改一次.</strong>
profile-changeUsername-desc-text = 修改显示在你过去和未来所有留言上的用户名。 用户名可以每{ framework-timeago-time }修改一次。
profile-changeUsername-current = 当前的用户名
profile-changeUsername-newUsername-label = 新的用户名
profile-changeUsername-confirmNewUsername-label = 确认新的用户名
profile-changeUsername-cancel = 取消
profile-changeUsername-save = 保存
profile-changeUsername-saveChanges = 保存修改
profile-changeUsername-recentChange = 您在{ framework-timeago-time }前修改过用户名。您可以在{ $nextUpdate }再次修改您的用户名。
profile-changeUsername-youChangedYourUsernameWithin =
 您在{ framework-timeago-time }之内修改过用户名。您可以在{ $nextUpdate }再次修改您的用户名。
profile-changeUsername-close = 关闭

## Discussions tab

discussions-mostActiveDiscussions = 最活跃的讨论
discussions-mostActiveDiscussions-subhead = 按照过去24小时内{ $siteName }上收到留言最多来排名
discussions-mostActiveDiscussions-empty = 您没有参加过任何讨论
discussions-myOngoingDiscussions = 我持续进行的讨论
discussions-myOngoingDiscussions-subhead = 你在{ $orgName }上做过的留言
discussions-viewFullHistory = 观看完整留言历史
discussions-discussionsQuery-errorLoadingProfile = 加载配置时出错
discussions-discussionsQuery-storyNotFound = 没有找到故事

## Comment Stream
configure-stream-title-configureThisStream =
  配置流
configure-stream-update = 更新
configure-stream-streamHasBeenUpdated =
  流已经被更新

configure-premod-premoderateAllComments = 预审所有留言
configure-premod-description =
  对该故事的任何留言在发布之前必须经由版主批准。

configure-premodLink-commentsContainingLinks =
  预审包含链接的留言
configure-premodLink-description =
  对该故事的任何包含链接的留言在发布之前必须经由版主批准。

configure-addMessage-title =
   添加一条消息或一个问题
configure-addMessage-description =
  在留言区的顶部为您的读者添加一条信息。可以是提出一个话题，问一个问题，或发布与这个故事有关的公告。
configure-addMessage-addMessage = 添加消息
configure-addMessage-removed =消息已经被取消
config-addMessage-messageHasBeenAdded =
  消息已经被添加到留言区
configure-addMessage-remove = 取消
configure-addMessage-submitUpdate = 更新
configure-addMessage-cancel = 取消
configure-addMessage-submitAdd = 添加消息

configure-messageBox-preview = 预览
configure-messageBox-selectAnIcon = 选择一个图标
configure-messageBox-iconConversation = 对话
configure-messageBox-iconDate = 日期
configure-messageBox-iconHelp = 帮助
configure-messageBox-iconWarning = 警告
configure-messageBox-iconChatBubble = 聊天气泡
configure-messageBox-noIcon = 没有图标
configure-messageBox-writeAMessage = 写消息

configure-closeStream-closeCommentStream =
  关闭留言流
configure-closeStream-description =
  该留言流目前开放。通过关闭此留言流，将不再提交新的留言，所有以前提交的留言仍将被显示。
configure-closeStream-closeStream = 关闭流
configure-closeStream-theStreamIsNowOpen = 该流现在开放

configure-openStream-title = 打开流
configure-openStream-description =
  该留言流目前关闭。通过开放此留言流，可以提交新的留言并且将被显示。

configure-openStream-openStream = 打开流
configure-openStream-theStreamIsNowClosed = 流现在关闭

qa-experimentalTag-tooltip-content =
  Q&A问答形式目前正在积极开发中。如有任何反馈或要求，请联系我们。

configure-enableQA-switchToQA =
  切换至Q&A问答形式
configure-enableQA-description =
  Q&A问答形式允许社区成员提交问题，由指定的达人来回答。
configure-enableQA-enableQA = Switch to Q&A
configure-enableQA-streamIsNowComments =
  该流现在以留言形式呈现

configure-disableQA-title = 配置本Q&A问答
configure-disableQA-description =
 Q&A问答形式允许社区成员提交问题，由指定的达人来回答。
configure-disableQA-disableQA = 切换至留言
configure-disableQA-streamIsNowQA =
  该流现在以留言形式呈现

configure-experts-title = 添加达人
configure-experts-filter-searchField =
  .placeholder =通过电子邮件或用户名搜索
  .aria-label = 通过电子邮件或用户名搜索
configure-experts-filter-searchButton =
  .aria-label = 搜索
configure-experts-filter-description =
  为注册用户的评论添加达人徽章，仅限在此页面。新用户必须先注册并打开一个页面的留言来创建他们的账户。
configure-experts-search-none-found = 无法找到使用该电子邮件或用户名的用户
configure-experts-remove-button = 取消
configure-experts-load-more = 载入更多
configure-experts-none-yet = 该Q&A问答目前没有达人。
configure-experts-search-title = 寻找达人
configure-experts-assigned-title = 达人
configure-experts-noLongerAnExpert = 不再是达人
comments-tombstone-ignore = 该留言被隐藏，因为您忽略了{$username}
comments-tombstone-showComment = 显示留言
comments-tombstone-deleted =
  该留言不可见。留言者已经删除他们的账户。
comments-tombstone-rejected =
  该留言者因违反我们的社区准则，已被版主删除。

suspendInfo-heading-yourAccountHasBeen =
  您的账户已经被暂时停止发表留言。
suspendInfo-description-inAccordanceWith =
  根据{ $organization }的社区准则，您的帐户已被暂停。在暂停期间，你将不能发表留言、使用回应或报告留言。
suspendInfo-until-pleaseRejoinThe =
  请在 { $until }重新加入对话

warning-heading = 您的账户已经受到警告
warning-explanation =
  根据我们的社区准则，您的账户已被发出警告。
warning-instructions =
  要继续参与讨论，请按下面的 “确认”按钮。
warning-acknowledge = 确认

warning-notice = 您的账户已被发出警告。要继续参与，请<a>回顾警告消息</a>。


modMessage-heading = 您的账户已经收到版主发送的一条消息。
modMessage-acknowledge = 确认

profile-changeEmail-unverified = （未验证）
profile-changeEmail-current = （目前）
profile-changeEmail-edit = 编辑
profile-changeEmail-change = 修改
profile-changeEmail-please-verify =验证您的电子邮件地址
profile-changeEmail-please-verify-details =
  一封电子邮件已经被发送到{ $email }来验证您的账户。
  您必须先验证您的新电子邮件地址，才能使用它登录您的账户或接收通知。
profile-changeEmail-resend = 重新发送验证码
profile-changeEmail-heading = 编辑您的电子邮件地址
profile-changeEmail-changeYourEmailAddress =
  修改您的电子邮件地址
profile-changeEmail-desc = 修改电子邮箱地址来登录并接受关于您账户的通讯。
profile-changeEmail-newEmail-label = 新的电子邮件地址
profile-changeEmail-password = 密码
profile-changeEmail-password-input =
  .placeholder = 密码
profile-changeEmail-cancel = 取消
profile-changeEmail-submit = 保存
profile-changeEmail-saveChanges = 保存修改
profile-changeEmail-email = 电子邮件
profile-changeEmail-title = 电子邮件地址
profile-changeEmail-success = 您的电子邮件已经更新成功

## Ratings and Reviews

ratingsAndReviews-postCommentForm-section =
  .aria-label = 递交回顾或提出一个问题

ratingsAndReviews-reviewsTab = 评价
ratingsAndReviews-questionsTab = 问题
ratingsAndReviews-noReviewsAtAll =没有评价。
ratingsAndReviews-noQuestionsAtAll = 没有问题。
ratingsAndReviews-noReviewsYet =还没有评价。您何不写一条？
ratingsAndReviews-noQuestionsYet = 还没有问题。您何不提出一个问题？
ratingsAndReviews-selectARating = 选择评分
ratingsAndReviews-youRatedThis =  您评分过
ratingsAndReviews-showReview = 显示评价
  .title = { ratingsAndReviews-showReview }
ratingsAndReviews-rateAndReview = 评分和评价
ratingsAndReviews-askAQuestion = 提出一个问题
ratingsAndReviews-basedOnRatings = { $count ->
  [0] 还没有评分
  [1] 基于1评分
  *[other] 基于{ SHORT_NUMBER($count) } 评分
}

ratingsAndReviews-allReviewsFilter = 所有评价
ratingsAndReviews-starReviewsFilter = { $rating ->
  [1] 1 星
  *[other] { $rating } Stars
}

comments-addAReviewForm-rteLabel = 添加评价（可选）

comments-addAReviewForm-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

comments-addAReviewFormFake-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

stream-footer-links-top-of-article = 文章顶端
  .title = 去到文章顶端
stream-footer-links-top-of-comments = 最佳留言
  .title =去到最佳留言
stream-footer-links-profile = 资料 & 回复
  .title = 去到资料和回复
stream-footer-links-discussions = 更多讨论
  .title = 去到更多讨论
stream-footer-navigation =
  .aria-label = 评论注脚

