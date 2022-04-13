### Localization for Admin

## General
general-notAvailable = 无法适用
general-none = 没有
general-noTextContent =没有文本内容

## Story Status
storyStatus-open = 打开
storyStatus-closed = 关闭
storyStatus-archiving = 存档中
storyStatus-archived = 已存档

## Roles
role-admin = 管理员
role-moderator = 版主
role-siteModerator = 网站站长
role-organizationModerator = 机构审核员
role-staff = 员工
role-commenter = 留言者

role-plural-admin = 管理员
role-plural-moderator = 版主
role-plural-staff = 员工
role-plural-commenter = 留言者

comments-reacted =
  .aria-label = {$count ->
    [0] {$reaction} 留言来自 {$username}
    [one] {$reaction} 留言来自 {$username}
    *[other] {$reaction} ({$count}) 留言来自 {$username}
  }

## User Statuses
userStatus-active = 激活
userStatus-banned = 禁止
userStatus-siteBanned = 网站被禁
userStatus-banned-all = 禁止（全部）
userStatus-banned-count = 禁止 ({$count})
userStatus-suspended = 暂停
userStatus-premod = 始终预先审核
userStatus-warned = 受警告

# Queue Sort
queue-sortMenu-newest = 最新的
queue-sortMenu-oldest = 最旧的

## Navigation
navigation-moderate = 审核
navigation-community = 社区
navigation-stories = 故事
navigation-configure = 设置
navigation-dashboard = 功能板

## User Menu
userMenu-signOut = 退出
userMenu-viewLatestRelease = 查看最近的声明
userMenu-reportBug = 报告问题或提供反馈
userMenu-popover =
  .description = 用户菜单对话框及相关链接和操作

## Restricted
restricted-currentlySignedInTo =当前正在登录
restricted-noPermissionInfo = 您无权访问本页。
restricted-signedInAs = 您已经登录: <strong>{ $username }</strong>
restricted-signInWithADifferentAccount =使用不同账户登录
restricted-contactAdmin = 如果您认为有错误，请联系您的管理员来获得帮助。

## Login

# Sign In
login-signInTo = 登录
login-signIn-enterAccountDetailsBelow = 在下方输入您账户的具体信息

login-emailAddressLabel = 电子邮箱地址
login-emailAddressTextField =
  .placeholder = 电子邮箱地址

login-signIn-passwordLabel = 密码
login-signIn-passwordTextField =
  .placeholder = 密码

login-signIn-signInWithEmail = 用电子邮箱登录
login-orSeparator = 或者
login-signIn-forgot-password = 忘记您的密码？

login-signInWithFacebook = 用Facebook账户登录
login-signInWithGoogle = 用Google账户登录
login-signInWithOIDC = 用 { $name }登录

# Create Username

createUsername-createUsernameHeader =创建用户名
createUsername-whatItIs =
  您的用户名将作为身份在您的所有留言中显示
createUsername-createUsernameButton = 创建用户名
createUsername-usernameLabel = 用户名
createUsername-usernameDescription = 您可以使用 “_” and “.” 不能使用空格.
createUsername-usernameTextField =
  .placeholder =用户名

# Add 电子邮件地址
addEmailAddress-addEmailAddressHeader = 添加电子邮箱地址

addEmailAddress-emailAddressLabel = 电子邮箱地址
addEmailAddress-emailAddressTextField =
  .placeholder = 电子邮箱地址

addEmailAddress-confirmEmailAddressLabel = 确认电子邮箱地址
addEmailAddress-confirmEmailAddressTextField =
  .placeholder = 确认电子邮箱地址

addEmailAddress-whatItIs =
  为了保障您账户的安全，我们要求用户为账户添加电子邮箱地址。

addEmailAddress-addEmailAddressButton =
  添加电子邮箱地址

# Create Password
createPassword-createPasswordHeader = 创建密码
createPassword-whatItIs =
  为了防止对您账户的未经授权的修改，我们要求用户创建密码
createPassword-createPasswordButton =
  创建密码

createPassword-passwordLabel = 密码
createPassword-passwordDescription = 必须至少有 {$minLength}个字符
createPassword-passwordTextField =
  .placeholder = 密码

# Forgot Password
forgotPassword-forgotPasswordHeader = 忘记密码？
forgotPassword-checkEmailHeader = 检查您的电子邮箱
forgotPassword-gotBackToSignIn = 返回登录页
forgotPassword-checkEmail-receiveEmail =
  如果账户与 <strong>{ $email }</strong>有关联,
  您将收到一封包含链接的邮件，用于创建新密码。
forgotPassword-enterEmailAndGetALink =
  在下方输入您的电子邮箱地址，我们将给你发送链接，用于重设您的密码。
forgotPassword-emailAddressLabel = 电子邮箱地址
forgotPassword-emailAddressTextField =
  .placeholder = 电子邮箱地址
forgotPassword-sendEmailButton = 发送电子邮件

# Link Account
linkAccount-linkAccountHeader = 关联账户
linkAccount-alreadyAssociated =
  电子邮箱 <strong>{ $email }</strong> 已经与一个账户关联。如果你想与之关联，请输入密码。

linkAccount-passwordLabel = 密码
linkAccount-passwordTextField =
  .label = 密码
linkAccount-linkAccountButton = 关联账户
linkAccount-useDifferentEmail = 使用不同的电子邮箱地址

## Configure

configure-experimentalFeature = 试验性功能

configure-unsavedInputWarning =
  您还未保存修改。您仍要继续吗？

configure-sideBarNavigation-general = 常规
configure-sideBarNavigation-authentication = 验证
configure-sideBarNavigation-moderation = 审核
configure-sideBarNavigation-moderation-comments = 留言
configure-sideBarNavigation-moderation-users = 用户
configure-sideBarNavigation-organization = 机构
configure-sideBarNavigation-moderationPhases = 审核程序
configure-sideBarNavigation-advanced = 高级
configure-sideBarNavigation-email = 电子邮箱
configure-sideBarNavigation-bannedAndSuspectWords = 禁止和可疑单词
configure-sideBarNavigation-slack = Slack
configure-sideBarNavigation-webhooks = Webhooks

configure-sideBar-saveChanges = 保存修改 保存修改
configure-configurationSubHeader = 设置
configure-onOffField-on = 开启
configure-onOffField-off = 关闭
configure-radioButton-allow = 允许
configure-radioButton-dontAllow = 不允许

### Moderation Phases

configure-moderationPhases-generatedAt = 关键产生于:
  { DATETIME($date, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric") }
configure-moderationPhases-phaseNotFound =外部审核程序没有找到
configure-moderationPhases-experimentalFeature =
  自定义审核程序功能目前正在积极开发中。
  请 <ContactUsLink>告知我们您的反馈要求</ContactUsLink>.
configure-moderationPhases-header-title = 审核程序
configure-moderationPhases-description =
  配置外部审核程序，以自动进行一些审核行动。审核要求将被JSON编码和签名。要了解更多关于审核请求的信息，请查阅我们的<externalLink>文档</externalLink>.
configure-moderationPhases-addExternalModerationPhaseButton =
  添加外部审核程序
configure-moderationPhases-moderationPhases = 审核程序
configure-moderationPhases-name = 名字
configure-moderationPhases-status = 状态
configure-moderationPhases-noExternalModerationPhases =
  没有设定外部审核程序，在上面添加一个。
configure-moderationPhases-enabledModerationPhase = 启用
configure-moderationPhases-disableModerationPhase = 关闭
configure-moderationPhases-detailsButton = 详情 <icon>keyboard_arrow_right</icon>
configure-moderationPhases-addExternalModerationPhase = 添加外部审核程序
configure-moderationPhases-updateExternalModerationPhaseButton = 更新详情
configure-moderationPhases-cancelButton = 取消
configure-moderationPhases-format =留言字体格式
configure-moderationPhases-endpointURL = 找回URL
configure-moderationPhases-timeout = 超时
configure-moderationPhases-timeout-details = Coral等待您审核反应的时间以毫秒为单位。
configure-moderationPhases-format-details =
  Coral将发送留言正文的格式。默认情况下，Coral会以原始的HTML编码格式发送留言。如果选择了 "纯文本”，那么就会以HTML剥离的版本来发送。
configure-moderationPhases-format-html = HTML
configure-moderationPhases-format-plain = 纯文本
configure-moderationPhases-endpointURL-details =
  Coral审核要求的URL将被发布到。所提供的URL必须对指定的超时做出反应，否则审核的决定将不被执行。
configure-moderationPhases-configureExternalModerationPhase =
  设定外部审核程序
configure-moderationPhases-phaseDetails = 程序详情
onfigure-moderationPhases-status = 状态
configure-moderationPhases-signingSecret = 签名密钥
configure-moderationPhases-signingSecretDescription =
 以下签名密钥用来同意发送到该URL的请求数量。了解回调签名的更多信息，请查阅我们的<externalLink>文件</externalLink>。
configure-moderationPhases-phaseStatus = 程序状态
configure-moderationPhases-status = 状态
configure-moderationPhases-signingSecret = 签名密钥
configure-moderationPhases-signingSecretDescription =
  以下签名密钥用来同意发送到该URL的请求数量。了解回调签名的更多信息，请查阅我们的<externalLink>文件</externalLink>。
configure-moderationPhases-dangerZone = 危险区域
configure-moderationPhases-rotateSigningSecret = 轮换签名密钥
configure-moderationPhases-rotateSigningSecretDescription =
  轮换签名密钥将允许您安全地替换用于制作的签名密钥出现延误。
configure-moderationPhases-rotateSigningSecretButton = 轮换签名密钥

configure-moderationPhases-disableExternalModerationPhase =
  停用外部审核程序
configure-moderationPhases-disableExternalModerationPhaseDescription =
  外部审核程序现已启用。通过停用，没有新的审核查询指令将发送到指定的URL。
configure-moderationPhases-disableExternalModerationPhaseButton = 停用程序
configure-moderationPhases-enableExternalModerationPhase =
  启用外部审核程序
configure-moderationPhases-enableExternalModerationPhaseDescription =
  该外部审核程序现已停用。通过启用，新的审核查询指令将发送到指定的URL。
configure-moderationPhases-enableExternalModerationPhaseButton = 启用程序
configure-moderationPhases-deleteExternalModerationPhase =
  删除外部审核程序
configure-moderationPhases-deleteExternalModerationPhaseDescription =
  删除外部审核程序将停止所有新的审核查询指令发送到该URL，并且取消所有相关设定。
configure-moderationPhases-deleteExternalModerationPhaseButton = 删除程序
configure-moderationPhases-rotateSigningSecret = 轮换签名密钥
configure-moderationPhases-rotateSigningSecretHelper =
  过期之后，不再与旧密钥生成签名。
configure-moderationPhases-expiresOldSecret =
  使旧密钥过期
configure-moderationPhases-expiresOldSecretImmediately =
  立即
configure-moderationPhases-expiresOldSecretHoursFromNow =
  { $hours ->
    [1] 1小时
    *[other] { $hours } 小时
  } 从现在起
configure-moderationPhases-rotateSigningSecretSuccessUseNewSecret =
  外部审核程序签名密钥已经轮换。请确保您更新新的集合以使用以下新密钥。
configure-moderationPhases-confirmDisable =
  停用外部审核程序将停止发送所有新的审核查询指令到提供的URL。您确定您想继续吗？
configure-moderationPhases-confirmEnable =
  启用外部审核程序将开始发送所有新的审核查询指令到提供的URL。您确定您想继续吗？
configure-moderationPhases-confirmDelete =
  删除外部审核程序将停止发送所有新的审核查询指令到提供的URL。您确定您想继续吗？


### Webhooks

configure-webhooks-generatedAt = 密钥生成于:
  { DATETIME($date, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric") }
configure-webhooks-experimentalFeature =
  Webhook功能当前处于活动开发状态。可以添加或取消事件。任何反馈或请求，请<ContactUsLink>联系我们</ContactUsLink>。
configure-webhooks-webhookEndpointNotFound = 回调端点无法找到
configure-webhooks-header-title = 设定回调端点
configure-webhooks-description =
  设定一个端点来发送事件到Coral内事件发生的时间。这些事件将被JSON编码并签名。了解关于webhook签名的更多信息，请查阅我们的<externalLink>回调指导</externalLink>。
configure-webhooks-addEndpoint = 添加回调端点
configure-webhooks-addEndpointButton = 添加回调端点
configure-webhooks-endpoints = 端点
configure-webhooks-url = URL
configure-webhooks-status = 状态
configure-webhooks-noEndpoints = 没有设定的回调端点，在上面添加一个。
configure-webhooks-enabledWebhookEndpoint = 启用
configure-webhooks-disabledWebhookEndpoint = 停用
configure-webhooks-endpointURL = 端点URL
configure-webhooks-cancelButton = 取消
configure-webhooks-updateWebhookEndpointButton =更新回调端点
configure-webhooks-eventsToSend = Events to send 待发送的事件
configure-webhooks-clearEventsToSend = 清除
configure-webhooks-eventsToSendDescription =
  这些是注册到该端点的事件。访问我们的 <externalLink>回调指导</externalLink> 查阅这些事件的纲要。符合下列特征的事件将被发送到端点，如果已经启用：
configure-webhooks-allEvents =
  端点将接收所有事件，包括未来添加的。
configure-webhooks-selectedEvents =
  { $count } { $count ->
    [1] 事件
    *[other] events
  } 选择
configure-webhooks-selectAnEvent =
  选择以上事件或<button>接收所有事件</button>.
configure-webhooks-configureWebhookEndpoint = 设定回调端点
configure-webhooks-confirmEnable =
  启用回调端点将开始发送新的事件到该URL。您确定您想继续吗？
configure-webhooks-confirmDisable =
  停用回调端点将停止发送新的事件到该URL。您确定您想继续吗？
configure-webhooks-confirmDelete =
  删除回调端点将停止发送新的事件到该URL，并且取消所有与该回调端点相关的设定。您确定您想继续吗？

configure-webhooks-dangerZone = 危险区域
configure-webhooks-rotateSigningSecret = 轮换签名密钥
configure-webhooks-rotateSigningSecretDescription =
  轮换签名密钥将允许您安全地替换用于制作的签名密钥出现延误。
configure-webhooks-rotateSigningSecretButton =轮换签名密钥
configure-webhooks-rotateSigningSecretHelper =
  过期之后，不再与旧密钥生成签名。
configure-webhooks-rotateSigningSecretSuccessUseNewSecret =
  回调端点签名密钥已经被轮换。请确保您更新您的集合以使用以下新密钥。
configure-webhooks-disableEndpoint = 停用端点
configure-webhooks-disableEndpointDescription =
  该端点现已启用。通过停用该端点，不再有新的事件将被发送到提供的URL。
configure-webhooks-disableEndpointButton = 停用端点
configure-webhooks-enableEndpoint = 启用端点
configure-webhooks-enableEndpointDescription =
  该端点现已停用。通过启用该端点，新的事件将被发送到提供的URL。
configure-webhooks-enableEndpointButton = 启用端点
configure-webhooks-deleteEndpoint = 删除端点
configure-webhooks-deleteEndpointDescription =
  删除该端点将阻止新的事件将被发送到提供的URL。
configure-webhooks-deleteEndpointButton = 删除端点
configure-webhooks-endpointStatus =端点状态
configure-webhooks-signingSecret = 签名密钥
configure-webhooks-signingSecretDescription =
  以下签名密钥用于同意发送到该URL的请求数量。了解关于回调签名的更多信息，请查阅我们的 <externalLink>回调指导</externalLink>。
configure-webhooks-expiresOldSecret = 使旧密钥过期
configure-webhooks-expiresOldSecretImmediately = 立即
configure-webhooks-expiresOldSecretHoursFromNow =
  { $hours ->
    [1] 1小时
    *[other] { $hours } hours
  }  f从现在起
configure-webhooks-detailsButton = 详情 <icon>键盘_箭头_右</icon>

### General
configure-general-guidelines-title = 社区指导综述
configure-general-guidelines-explanation =
  这将显示在留言区域上方。
  您可以使用Markdown排列文本。
  如何使用Markdown的更多信息
  这里： <externalLink>https://www.markdownguide.org/cheat-sheet/</externalLink>
configure-general-guidelines-showCommunityGuidelines = 显示社区指导

### 个人介绍
configure-general-memberBio-title = 会员个人介绍
configure-general-memberBio-explanation =
  允许留言人添加个人资料。注意：这可能增加审核工作量，因为会员个人介绍可能被举报。
configure-general-memberBio-label =允许会员个人介绍

### Locale
configure-general-locale-language = 语言
configure-general-locale-chooseLanguage = 选择您的Coral社区的语言。
configure-general-locale-invalidLanguage =
  先前选择的语言<lang></lang> 已经不存在。请选择不同的语言。

### Sitewide Commenting
configure-general-sitewideCommenting-title = 全站留言
configure-general-sitewideCommenting-explanation =
  开启或关闭全站新留言的留言流。当新留言关闭时，新留言不会被递交，但已有留言可以持续收到回应、被举报和分享。
configure-general-sitewideCommenting-enableNewCommentsSitewide =
  启用全站新留言
configure-general-sitewideCommenting-onCommentStreamsOpened =
  开启：留言流为新留言开启
configure-general-sitewideCommenting-offCommentStreamsClosed =
  关闭：留言流为新留言关闭
configure-general-sitewideCommenting-message = 全站关闭留言消息
configure-general-sitewideCommenting-messageExplanation =
  编写一条将在留言流全站关闭时显示的消息。

### Embed Links
configure-general-embedLinks-title = 嵌入媒体
configure-general-embedLinks-desc = 允许留言人在留言内容最后添加YouTube视频、推特或来自GIPHY相册的GIF。
configure-general-embedLinks-enableTwitterEmbeds = 允许嵌入Twitter
configure-general-embedLinks-enableYouTubeEmbeds = 允许嵌入YouTube
configure-general-embedLinks-enableGiphyEmbeds =允许嵌入来自 GIPHY的动图
configure-general-embedLinks-enableExternalEmbeds =启用外部媒体

configure-general-embedLinks-On = 开启
configure-general-embedLinks-Off = 关闭

configure-general-embedLinks-giphyMaxRating = 动图内容评分
configure-general-embedLinks-giphyMaxRating-desc = 为将显示在留言者搜索结果中的动图选择最高内容等级

configure-general-embedLinks-giphyMaxRating-g = 普通观众级
configure-general-embedLinks-giphyMaxRating-g-desc =内容适合所有年龄
configure-general-embedLinks-giphyMaxRating-pg = 家长指导级
configure-general-embedLinks-giphyMaxRating-pg-desc = 内容对所有人安全，但建议儿童在家长指导下观看。
configure-general-embedLinks-giphyMaxRating-pg13 = 特别辅导级
configure-general-embedLinks-giphyMaxRating-pg13-desc =轻度的性暗示、轻度的药物使用、轻度的脏话或威胁性图像。可能包含半裸体图像，但不展示真实的人类生殖器或裸体。
configure-general-embedLinks-giphyMaxRating-r = 限制级
configure-general-embedLinks-giphyMaxRating-r-desc = 强烈的语言、强烈的性暗示、暴力和非法使用毒品；不适合青少年或较年轻的人观看。没有裸体。

configure-general-embedLinks-configuration = 配置
configure-general-embedLinks-configuration-desc =
  更多关于GIPHY的API信息，请访问：<externalLink>https://developers.giphy.com/docs/api</externalLink>
configure-general-embedLinks-giphyAPIKey = GIPHY API密钥


### Configure Announcements

configure-general-announcements-title = 社区公告
configure-general-announcements-description =
  添加的临时通告，将在一定时间内显示在您机构留言区域的最上方。
configure-general-announcements-delete =取消通告
configure-general-announcements-add = 添加通告
configure-general-announcements-start = 发起通告
configure-general-announcements-cancel = 取消
configure-general-announcements-current-label =当前的通告
configure-general-announcements-current-duration =
  本通告将在: { $timestamp }自动结束。
configure-general-announcements-duration = 显示本通告

### Closing Comment Streams
configure-general-closingCommentStreams-title = 关闭留言区域
configure-general-closingCommentStreams-explanation = 设定留言区域在文章发布一段自定义的时间后关闭。
configure-general-closingCommentStreams-closeCommentsAutomatically =自动关闭留言
configure-general-closingCommentStreams-closeCommentsAfter = 在……之后关闭留言

### Comment Length
configure-general-commentLength-title = 留言字数
configure-general-commentLength-maxCommentLength = 最多留言字数
configure-general-commentLength-setLimit =
  设定最少和最多留言字数要求。
  回复开头和结尾的空格将被去除。
configure-general-commentLength-limitCommentLength =限制回复字数
configure-general-commentLength-minCommentLength = 最少回复字数
configure-general-commentLength-characters = 字符数
configure-general-commentLength-textField =
  .placeholder = 没有限制
configure-general-commentLength-validateLongerThanMin =
  请输入大于最少字数的数字

### Comment Editing
configure-general-commentEditing-title = 留言编辑
configure-general-commentEditing-explanation =
  对留言者在网站上编辑留言的时间设置限制。 被编辑的留言会在留言流和审核面板上被标记为（已编辑）。
configure-general-commentEditing-commentEditTimeFrame = 留言编辑时间范围
configure-general-commentEditing-seconds = 秒

### Flatten replies
configure-general-flattenReplies-title = 平铺回复
configure-general-flattenReplies-enabled = 平铺回复已启用
configure-general-flattenReplies-explanation =
  改变回复的层次显示方式。当启用时，对留言的回复可以深入到四层，然后就不再在页面上缩进。当禁用时，在回复的深度达到四层后，对话的其余部分将显示在远离其他留言的专用视图中。

### Closed Stream Message
configure-general-closedStreamMessage-title = 关闭留言流消息
configure-general-closedStreamMessage-explanation = 编写一条信息，在故事关闭留言时出现。

### Organization
configure-organization-name = 机构名字
configure-organization-sites = 网站
configure-organization-nameExplanation =
  您的机构名字将显示在{ -product-name }发送到您的社区和机构成员的电子邮件上。
configure-organization-sites-explanation =
  为您的机构添加新网站或编辑已有网站的详情。
configure-organization-sites-add-site = <icon>add</icon> 添加网站
configure-organization-email =机构电子邮件
configure-organization-emailExplanation =
  这个电子邮件地址将被用于电子邮件和整个平台，以便社区成员在有任何关于其账户状态或审核问题的疑问时，与该机构取得联系。
configure-organization-url = 机构URL地址
configure-organization-urlExplanation = 您的机构地址将出现在{ -product-name }发送到您的社区和机构成员的电子邮件里。


### Sites
configure-sites-site-details = 详情 <icon>keyboard_arrow_right</icon>
configure-sites-add-new-site = 添加新网站至 { $site }
configure-sites-add-success = { $site } 已经被添加至 { $org }
configure-sites-edit-success = 对 { $site }的修改已经被保存。.
configure-sites-site-form-name = 网站名
configure-sites-site-form-name-explanation = 网站名将出现在Coral发送给您的社区和机构成员的电子邮件里。
configure-sites-site-form-url = 该网站地址将出现在Coral发送给您的机构成员的电子邮件里。
configure-sites-site-form-url-explanation = 该网站地址将出现在Coral发送给您的机构成员的社区成员的电子邮件里。
configure-sites-site-form-email = 网站电子邮箱
configure-sites-site-form-url-explanation = 这个电子邮件地址是供社区成员在有问题或需要帮助时与你联系。例如：comments@yoursite.com
configure-sites-site-form-domains =网站许可的域名
configure-sites-site-form-domains-explanation =允许嵌入您的Coral留言流的域名 （例如：http://localhost:3000、https://staging.domain.com、 https://domain.com）。
configure-sites-site-form-submit = <icon>添加</icon> 添加网站
configure-sites-site-form-cancel = 取消
configure-sites-site-form-save = 保存修改
configure-sites-site-edit = 编辑 { $site } 详情
configure-sites-site-form-embed-code = 嵌入代码
sites-emptyMessage =我们无法找到符合您标准的网站。
sites-selector-allSites = 所有网站
site-filter-option-allSites = 所有网站

site-selector-all-sites = s所有网站
stories-filter-sites-allSites = 所有网站
stories-filter-statuses = 状态
stories-column-site = 网站
site-table-siteName = 网站名
stories-filter-sites = 网站

site-search-searchButton =
  .aria-label = 搜索
site-search-textField =
  .aria-label =按网站名字搜索
site-search-textField =
  .placeholder = 按网站名字搜索
site-search-none-found = 本次搜索没有找到网站
specificSitesSelect-validation =你必须选择至少一个网站。

stories-column-actions = 动作
stories-column-rescrape = 重新拖拽

stories-actionsButton =
  .aria-label = 选择动作
stories-actions-popover =
  .description = 向下滚动来选择故事动作
stories-actions-rescrape = 重新拖拽
stories-actions-close = 关闭故事
stories-actions-open = 开始故事
stories-actions-archive = 存档故事
stories-actions-unarchive = 未存档故事

### Sections

moderate-section-selector-allSections = 所有部分
moderate-section-selector-uncategorized = 未分类
moderate-section-uncategorized =未分类

### Email

configure-email = 电子邮箱设置
configure-email-configBoxEnabled =启用
configure-email-fromNameLabel =来自名字
configure-email-fromNameDescription =
  名字将显示在所有发送的电子邮件上
configure-email-fromEmailLabel =来自电子邮箱
configure-email-fromEmailDescription =
 电子邮箱地址将被用于发送消息
configure-email-smtpHostLabel = SMTP host
configure-email-smtpHostDescription = (ex. smtp.sendgrid.net)
configure-email-smtpPortLabel = SMTP port
configure-email-smtpPortDescription = (ex. 25)
configure-email-smtpTLSLabel = TLS
configure-email-smtpAuthenticationLabel = SMTP 严重
configure-email-smtpCredentialsHeader =电子邮件凭证
configure-email-smtpUsernameLabel = 用户名
configure-email-smtpPasswordLabel = 密码
configure-email-send-test = Send test email

### Authentication

configure-auth-clientID = 客户ID
configure-auth-clientSecret = 客户密钥
configure-auth-configBoxEnabled = 启用
configure-auth-targetFilterCoralAdmin = { -product-name } 管理员
configure-auth-targetFilterCommentStream =留言流
configure-auth-redirectURI = 重新定向URI
configure-auth-registration = 重新注册
configure-auth-registrationDescription =
  integration to register for a new account. 允许之前没有用此认证一体化的用户注册一个新账户
configure-auth-registrationCheckBox = 允许注册
configure-auth-pleaseEnableAuthForAdmin =
  请为了{ -product-name } 管理员启用至少一种认证一体化
configure-auth-confirmNoAuthForCommentStream =
  留言区域未启用认证一体化
  您真的想继续吗？

configure-auth-facebook-loginWith = 用Facebook账号登录
configure-auth-facebook-toEnableIntegration =
  若要启用与Facebook认证的一体化，
  您需要创建和设置一个网络应用程序。
  了解详情，请访问: <Link></Link>.
configure-auth-facebook-useLoginOn = 用Facebook账号登录

configure-auth-google-loginWith = 用Google账号登录
configure-auth-google-toEnableIntegration =
  若要启用与Google认证的一体化，
  您需要创建和设置一个网络应用程序。
  了解详情，请访问:   <Link></Link>.
configure-auth-google-useLoginOn = 用Google账号登录

configure-auth-sso-loginWith = 用Single Sign On登录
configure-auth-sso-useLoginOn = 用Single Sign On登录
configure-auth-sso-key = 密钥
configure-auth-sso-regenerate =重新生成
configure-auth-sso-regenerateAt = 密钥产生于:
  { DATETIME($date, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric") }
configure-auth-sso-regenerateHonoredWarning =
  重新生成密钥时，用先前密钥签署的令牌将在30天内有效。
configure-auth-sso-description =
  为了能够与您现有的认证系统一体化，您需要创建一个JWT令牌来连接。您可以通过<IntroLink>该介绍</IntroLink>了解更多关于创建JWT令牌所需的信息。查阅我们的<DocLink>文件</DocLink>掌握关于single sign on的其他信息。


configure-auth-sso-rotate-keys = 密钥
configure-auth-sso-rotate-keyID = 密钥ID
configure-auth-sso-rotate-secret = Secret
configure-auth-sso-rotate-copySecret = 密码
  .aria-label = Copy Secret 复制密码

configure-auth-sso-rotate-date =
  { DATETIME($date, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric") }
configure-auth-sso-rotate-activeSince = 激活于
configure-auth-sso-rotate-inactiveAt = 休眠在
configure-auth-sso-rotate-inactiveSince = Inactive Since 休眠于

configure-auth-sso-rotate-status =状态
configure-auth-sso-rotate-statusActive = 激活
configure-auth-sso-rotate-statusExpiring = 将过期
configure-auth-sso-rotate-statusExpired = 已过期
configure-auth-sso-rotate-statusUnknown = 未知

configure-auth-sso-rotate-expiringTooltip =
 SSO密钥将在它预先设定的轮换时刻过期。

configure-auth-sso-rotate-expiringTooltip-toggleButton =
  .aria-label = 切换即将到期工具提示的可见性
configure-auth-sso-rotate-expiredTooltip =
  SSO密钥在被轮换使用后就过期了。
configure-auth-sso-rotate-expiredTooltip-toggleButton =
  切换已过期工具提示的可见性

configure-auth-sso-rotate-rotate = 轮换
configure-auth-sso-rotate-deactivateNow = 立即停用
configure-auth-sso-rotate-delete = 删除

configure-auth-sso-rotate-now = 现在
configure-auth-sso-rotate-10seconds = 从现在起10秒
configure-auth-sso-rotate-1day = 从现在起1天
configure-auth-sso-rotate-1week = 从现在起1周
configure-auth-sso-rotate-30days = 从现在起30天
configure-auth-sso-rotate-dropdown-description =
  .description = 用来轮换SSO密钥的下拉菜单

configure-auth-local-loginWith = 通过电子邮件认证登录
configure-auth-local-useLoginOn = 使用电子邮件认证登录
configure-auth-local-forceAdminLocalAuth =
  管理员本地认证已经永久启用。
  这用来保证Coral服务团队能访问管理面板。

configure-auth-oidc-loginWith = 用OpenID Connect账号登录
configure-auth-oidc-toLearnMore = 了解更多： <Link></Link>
configure-auth-oidc-providerName = 供应商名字
configure-auth-oidc-providerNameDescription =
 OpenID Connect供应商整合。这将在供应商的名字需要显示时使用，例如“用 &lt;Facebook&gt登录;”.
configure-auth-oidc-issuer = 发行人
configure-auth-oidc-issuerDescription =
  在输入发行人信息后，点击 "发现 "按钮，由{ -product-name }完成剩余地方。您也可以手动输入信息。
configure-auth-oidc-authorizationURL = 认证URL
configure-auth-oidc-tokenURL = 令牌URL
configure-auth-oidc-jwksURI = JWKS URI
configure-auth-oidc-useLoginOn = 用OpenID Connect 账户登录

configure-auth-settings =程序设定
configure-auth-settings-session-duration-label = 程序时长

### Moderation

### Recent Comment History

configure-moderation-recentCommentHistory-title = 近期历史
configure-moderation-recentCommentHistory-timeFrame = 近期留言历史时间段
configure-moderation-recentCommentHistory-timeFrame-description =
  计算留言者被拒绝率的时间量。
configure-moderation-recentCommentHistory-enabled = 近期历史过滤
configure-moderation-recentCommentHistory-enabled-description =
  防止屡教不改者未经批准就发表留言。当一名留言者的被拒绝率超过阈值时，他们的留言会进入“待处理”队列，由版主批准。这不适用于工作人员的回复。
configure-moderation-recentCommentHistory-triggerRejectionRate = 拒绝率阈值
configure-moderation-recentCommentHistory-triggerRejectionRate-description =
 拒绝的留言÷（拒绝的留言+发表的留言）  在上述时间范围内，以百分比表示。
  它不包括因有害的、垃圾邮件或预审而有待处理的回复。

### Pre-Moderation
configure-moderation-preModeration-title = 预审
configure-moderation-preModeration-explanation =
  预审打开时，留言在版主批准前不会发布。
configure-moderation-preModeration-moderation =
  预审所有留言
configure-moderation-preModeration-premodLinksEnable =
  预审所有包含链接的留言
configure-moderation-specificSites = 个别网站
configure-moderation-allSites = 所有网站

configure-moderation-apiKey = API 密钥

configure-moderation-akismet-title = 垃圾邮件侦测过滤器
configure-moderation-akismet-explanation =
  当一条留言被认定为可能是垃圾邮件时，Akismet API过滤器会警告用户。Akismet认为是垃圾邮件的评论将不会被发布  而是置于待处理队列中由版主审查。
  如果得到版主批准，留言将被发布。

configure-moderation-premModeration-premodSuspectWordsEnable =
  您可以在<wordListLink>这里</wordListLink>查阅和修改您的可疑词名单

### Akismet
configure-moderation-akismet-filter = 垃圾邮件侦测过滤器
configure-moderation-akismet-ipBased = 以IP为基础的垃圾邮件侦测
configure-moderation-akismet-accountNote =
  Note: You must add your active domain(s) 注意：您必须在您的Akismt账户里: <externalLink>https://akismet.com/account/</externalLink> 添加您活动的域名
configure-moderation-akismet-siteURL = 网站URL


### Perspective
configure-moderation-perspective-title = 恶意留言过滤器
configure-moderation-perspective-explanation =
  当恶意留言超过预先定义的恶意范围时，恶意留言过滤器Perspective API将警告用户 。
  恶意程度超出范围的留言 <strong>将不会被发布</strong> 并且置于<strong>待处理列表等待版主审查</strong>.
  如果被版主批准，留言将被发布。
configure-moderation-perspective-filter = 恶意留言过滤器
configure-moderation-perspective-toxicityThreshold =恶意范围
configure-moderation-perspective-toxicityThresholdDescription =
  这个值可以设定为0到100之间的百分比。根据Perspective API，这个数字表示一条留言是恶意的。默认情况下，该阈值被设置为{ $default }。
configure-moderation-perspective-toxicityModel = 阈值模型
configure-moderation-perspective-toxicityModelDescription =
  选择您的Perspective模型。默认值为{ $default }。
 您可以从 <externalLink>这里</externalLink>找到更多模型选择。
configure-moderation-perspective-allowStoreCommentData = 允许谷歌储存留言数据
configure-moderation-perspective-allowStoreCommentDataDescription =
  存储的留言将被用于未来研究和社区模型建立的目的，以持续改进API。
configure-moderation-perspective-allowSendFeedback =
  允许Coal把审批动作发送到谷歌
configure-moderation-perspective-allowSendFeedbackDescription =
  发送的审核动作将被用于未来研究和社区模型建设的目的，以持续改进API。
configure-moderation-perspective-customEndpoint =自定义端点
configure-moderation-perspective-defaultEndpoint =
  默认情况下，端点设置为 { $default }。您可以由此覆盖。
configure-moderation-perspective-accountNote =
  关于如何设置Perspective恶意留言过滤器的其他信息，请访问：
  <externalLink>https://github.com/conversationai/perspectiveapi#readme</externalLink>

configure-moderation-newCommenters-title = New commenter approval 新留言者批准
configure-moderation-newCommenters-enable = 启用新留言者批准
configure-moderation-newCommenters-description =
  该功能激活时，新留言者的前几条留言将被发送到待处理队列，版主批准后才能发布。
  对新留言者启用预审
configure-moderation-newCommenters-approvedCommentsThreshold =必须得到批准的留言数
configure-moderation-newCommenters-approvedCommentsThreshold-description =
  一位留言者的留言在不需要接受预审之前，需要得到批准的留言数。
configure-moderation-newCommenters-comments = comments


### Banned Words Configuration
configure-wordList-banned-bannedWordsAndPhrases =禁用的词汇和短语
configure-wordList-banned-explanation =
  留言中包含禁用词清单内的词汇或短语将<strong>自动被拒绝且不被发表<strong>。
configure-wordList-banned-wordList = 禁用词清单
configure-wordList-banned-wordListDetailInstructions =
  换新行来分隔被禁用的词汇或短语。词汇/短语不分大小写。

### Suspect Words Configuration
configure-wordList-suspect-bannedWordsAndPhrases = 可疑词汇和短语
configure-wordList-suspect-explanation =
  留言中包含可疑词清单中词汇或短语将<strong>被置于举报队列由版主审查发布（如果留言没有受到预审）。</strong>

configure-wordList-suspect-explanationSuspectWordsList =
  留言中包含可疑词清单中词汇或短语将<strong>被置于举报队列由版主审查，并且不会发布，除非得到版主的批准。</strong>
configure-wordList-suspect-wordList = 可疑词清单configure-wordList-suspect-wordListDetailInstructions =
  换新行来分隔被可疑的词汇或短语。词汇/短语不分大小写。


### Advanced
configure-advanced-customCSS = 自定义CSS
configure-advanced-customCSS-override =
  一个CSS样式表的URL将覆盖默认的嵌入流样式。
configure-advanced-permittedDomains = 允许的域名
configure-advanced-permittedDomains-description =
  允许您的{ -product-name }实例被嵌入的域名包括该计划（例如：http://localhost:3000、https://staging.domain.com、  https://domain.com）。
configure-advanced-liveUpdates =留言流实时更新
configure-advanced-liveUpdates-explanation =
  启用时，将有留言实时加载和更新。
  禁用时，用户需要刷新页面来看到新的留言。

configure-advanced-embedCode-title = 嵌入代码
configure-advanced-embedCode-explanation =
  复制并粘贴下面的代码到您的内容管理系统中，从而在您网站的每个故事中嵌入Coral留言流。

configure-advanced-embedCode-comment =
  取消这几行留言，用您的内容管理系统中的故事的ID和URL替换。
  以提供最紧密的整合。请参考我们的文档https://docs.coralproject.net，了解所有的配置选项。

configure-advanced-amp =加速移动页面
configure-advanced-amp-explanation =
  在留言流中启用对<LinkToAMP>AMP</LinkToAMP>的支持。一旦启用，您需要把Coral的AMP嵌入代码添加到你的页面模板。请参阅我们的<LinkToDocs>文档</LinkToDocs>来了解更多信息。启用启用支持。

configure-advanced-for-review-queue =审查所有用户的举报
configure-advanced-for-review-queue-explanation =
  只要一个回复被批准，即使有更多的用户举报，它也不会再出现在报告队列中。这个功能增加了一个 "供审查 "队列，允许版主看到系统中所有的用户举报，并手动将它们标记为 "已审查"。
configure-advanced-for-review-queue-label = 显示"供审查"队列

## Decision History
decisionHistory-popover =
  .description = 一个显示决策历史的对话框
decisionHistory-youWillSeeAList =
  您会在这里看到您的帖子审核动作的列表。
decisionHistory-showMoreButton =
  显示更多
decisionHistory-yourDecisionHistory =您的决策历史
decisionHistory-rejectedCommentBy =  留言被<Username></Username>拒绝
decisionHistory-approvedCommentBy =留言被 <Username></Username>批准
decisionHistory-goToComment = 前去留言

### Slack

configure-slack-header-title = Slack整合
configure-slack-description =
  自动将Coral审核队列中的留言发送到Slack 频道。您需要Slack的管理员权限来进行设置。关于如何创建Slack应用程序的步骤，请参阅我们的<externalLink>文</externalLink>。
configure-slack-notRecommended =
  不推荐每个月留言多余1万条的网站使用。
configure-slack-addChannel = 添加频道

configure-slack-channel-defaultName = 新频道
configure-slack-channel-enabled = 启用
configure-slack-channel-remove = 取消 频道
configure-slack-channel-name-label = 名称
configure-slack-channel-name-description =
  仅供参考，以便识别每个Slack连接。Slack不会告诉我们您所连接的频道的名称。
configure-slack-channel-hookURL-label = Webhook URL
configure-slack-channel-hookURL-description =
  Slack提供了一个频道特定的URL来激活webhook连接。要找到您某个Slack频道的URL，请按照<externalLink>的指示</externalLink>进行。
configure-slack-channel-triggers-label =
  在该Slack频道中接受到以下通知
configure-slack-channel-triggers-reportedComments = 被举报的留言
configure-slack-channel-triggers-pendingComments =待处理的留言
configure-slack-channel-triggers-featuredComments = 重要的留言
configure-slack-channel-triggers-allComments = 所有留言
configure-slack-channel-triggers-staffComments =雇员留言

## moderate
moderate-navigation-reported = 被举报
moderate-navigation-pending = 待处理
moderate-navigation-unmoderated = 未审查
moderate-navigation-rejected = 被拒绝
moderate-navigation-approved = 获批准
moderate-navigation-comment-count = { SHORT_NUMBER($count) }
moderate-navigation-forReview = 待检查

moderate-marker-preMod = 预审
moderate-marker-link = 链接
moderate-marker-bannedWord = 禁用词
moderate-marker-bio = 介绍
moderate-marker-possibleBannedWord =可能的禁用词
moderate-marker-suspectWord = 可疑词
moderate-marker-possibleSuspectWord = 可能的可疑词
moderate-marker-spam = 垃圾邮件
moderate-marker-spamDetected = 侦测到的垃圾邮件
moderate-marker-toxic = 恶意
moderate-marker-recentHistory = 近期历史
moderate-marker-bodyCount = 出席人数
moderate-marker-offensive = 无礼
moderate-marker-abusive = 辱骂
moderate-marker-newCommenter = 新留言者
moderate-marker-repeatPost = 重复留言
moderate-marker-other = 其他

moderate-markers-details = 详情
moderate-flagDetails-offensive = 无礼
moderate-flagDetails-abusive = 辱骂
moderate-flagDetails-spam = 垃圾邮件
moderate-flagDetails-other = 其他

moderate-flagDetails-toxicityScore = 恶意评分
moderate-toxicityLabel-likely = 有可能<score></score>
moderate-toxicityLabel-unlikely = 不可能<score></score>
moderate-toxicityLabel-maybe = 也许<score></score>

moderate-linkDetails-label = 复制链接到此留言
moderate-in-stream-link-copy = 在流中
moderate-in-moderation-link-copy = 在审核中

moderate-emptyQueue-pending = 干很好！没有更多的待处理留言需要审核了。
moderate-emptyQueue-reported =干很好！没有更多的被举报的留言需要审核了。moderate-emptyQueue-unmoderated = 干很好！所有留言已接受审核。
moderate-emptyQueue-rejected = 没有被拒绝的留言。
moderate-emptyQueue-approved = 没有批准的留言。

moderate-comment-edited = （编辑）
moderate-comment-inReplyTo = 回复给 <Username></Username>
moderate-comment-viewContext = 查看上下文
moderate-comment-viewConversation = 查看对话
moderate-comment-rejectButton =
  .aria-label = 拒绝
moderate-comment-approveButton =
  .aria-label = 同意
moderate-comment-decision = 决策
moderate-comment-story = 故事
moderate-comment-storyLabel = 留言在
moderate-comment-moderateStory = 审核故事
moderate-comment-featureText = 专题
moderate-comment-featuredText = 特色
moderate-comment-moderatedBy = 由审核
moderate-comment-moderatedBySystem = 系统
moderate-comment-play-gif = 播放动图
moderate-comment-load-video = 载入视频

moderate-single-goToModerationQueues =前往审核队列
moderate-single-singleCommentView =单挑留言查看

moderate-queue-viewNew =
  { $count ->
    [1] View {$count} 新留言
    *[other] View {$count} 新留言
  }

moderate-comment-deleted-body =
  此留言已不再适用。留言者已经删除了他们的账户。

### Moderate Search Bar
moderate-searchBar-allStories = 所有故事
  .title = 所有故事
moderate-searchBar-noStories = 我们无法找到符合您标准的故事
moderate-searchBar-stories = 故事：
moderate-searchBar-searchButton = 搜索
moderate-searchBar-titleNotAvailable =
  .title = 标题不可用
moderate-searchBar-comboBox =
  .aria-label = 搜索或跳到故事
moderate-searchBar-searchForm =
  .aria-label = 故事
moderate-searchBar-currentlyModerating =
  .title = 当前审核
moderate-searchBar-searchResults = 搜索结果
moderate-searchBar-searchResultsMostRecentFirst = 搜索结果（最新的显示在最前）
moderate-searchBar-searchResultsMostRelevantFirst = 搜索结果（最相关的显示在最前）
moderate-searchBar-moderateAllStories = 审核所有故事
moderate-searchBar-comboBoxTextField =
  .aria-label = 搜索或跳到故事……
  .placeholder = 按故事标题、作者、url、ID等搜索
moderate-searchBar-goTo = 前往
moderate-searchBar-seeAllResults = 查看所有结果

moderateCardDetails-tab-info = 信息
moderateCardDetails-tab-edits = 编辑历史
moderateCardDetails-tab-automatedActions = 自动化动作
moderateCardDetails-tab-reactions = 反应
moderateCardDetails-tab-reactions-loadMore = 载入更多
moderateCardDetails-tab-noIssuesFound = 没有发现问题
moderateCardDetails-tab-missingPhase = 没有使用

moderateCardDetails-tab-externalMod-status = 状态
moderateCardDetails-tab-externalMod-flags = 标记
moderateCardDetails-tab-externalMod-tags = 标签

moderateCardDetails-tab-externalMod-none = 没有
moderateCardDetails-tab-externalMod-approved = 被批准
moderateCardDetails-tab-externalMod-rejected = 被拒绝
moderateCardDetails-tab-externalMod-premod = 预审过的
moderateCardDetails-tab-externalMod-systemWithheld = 被扣留的系统

### Moderate User History Drawer

moderate-user-drawer-email =
  .title = 电子邮件地址
moderate-user-drawer-created-at =
  .title = 账户创建日期
moderate-user-drawer-member-id =
  .title = 成员ID
moderate-user-drawer-tab-all-comments = 所有留言
moderate-user-drawer-tab-rejected-comments = 被拒绝
moderate-user-drawer-tab-account-history = 账户历史
moderate-user-drawer-tab-notes = 注释
moderate-user-drawer-load-more = 载入更多
moderate-user-drawer-all-no-comments = {$username} 没有递交任何留言。
moderate-user-drawer-rejected-no-comments = {$username}没有任何被拒绝的留言。
moderate-user-drawer-user-not-found = 没有找到该用户。
moderate-user-drawer-status-label = 状态：
moderate-user-drawer-bio-title = 成员介绍
moderate-user-drawer-username-not-available = 用户名不可用
moderate-user-drawer-username-not-available-tooltip-title = 用户名 不可用
moderate-user-drawer-username-not-available-tooltip-body = 用户没有完成账户设置程序

moderate-user-drawer-account-history-system = <icon>电脑</icon> 系统
moderate-user-drawer-account-history-suspension-ended = 暂停结束
moderate-user-drawer-account-history-suspension-removed = 暂停取消
moderate-user-drawer-account-history-banned = 被禁止
moderate-user-drawer-account-history-ban-removed = 禁令取消
moderate-user-drawer-account-history-site-banned = 网站被禁
moderate-user-drawer-account-history-site-ban-removed = 网站禁令取消
moderate-user-drawer-account-history-no-history = 尚未对该账户采取任何措施
moderate-user-drawer-username-change = 用户名修改
moderate-user-drawer-username-change-new = 新的
moderate-user-drawer-username-change-old = 旧的

moderate-user-drawer-account-history-premod-set = 始终预审
moderate-user-drawer-account-history-premod-removed = 取消预审

moderate-user-drawer-account-history-modMessage-sent =收到消息的用户
moderate-user-drawer-account-history-modMessage-acknowledged = 消息已在{ $acknowledgedAt }确认

moderate-user-drawer-suspension =
 暂停， { $value } { $unit ->
    [second] { $value ->
      [1] 秒
      *[other] 秒
    }
    [minute] { $value ->
      [1] 分钟
      *[other] 分钟
    }
    [hour] { $value ->
      [1] 小时
      *[other] 小时
    }
    [day] { $value ->
      [1] 天
      *[other] 天
    }
    [week] { $value ->
      [1] 周
      *[other] 周
    }
    [month] { $value ->
      [1] 个月
      *[other]个月
    }
    [year] { $value ->
      [1] 年
      *[other] 年
    }
    *[other]未知单位
  }


moderate-user-drawer-recent-history-title = 最近的留言历史
moderate-user-drawer-recent-history-calculated =
  过去{ framework-timeago-time }中计算出
moderate-user-drawer-recent-history-rejected = 被拒绝
moderate-user-drawer-recent-history-tooltip-title = 这是如何计算的？
moderate-user-drawer-recent-history-tooltip-body =
 被拒绝的留言÷ （被拒绝的留言 + 被发布的留言）
  该阈值可以由管理员在配置>审核中修改
moderate-user-drawer-recent-history-tooltip-button =
  .aria-label = 切换最近的留言历史工具提示
moderate-user-drawer-recent-history-tooltip-submitted = 递交

moderate-user-drawer-notes-field =
  .placeholder =  留下注释……
moderate-user-drawer-notes-button = 添加注释
moderatorNote-left-by = 留下注释的人
moderatorNote-delete = 删除

# For Review Queue

moderate-forReview-reviewedButton =
  .aria-label = 被审查
moderate-forReview-markAsReviewedButton =
  .aria-label = 标记为被审查
moderate-forReview-time = 时间
moderate-forReview-comment = 留言
moderate-forReview-reportedBy = 举报者
moderate-forReview-reason = 原因
moderate-forReview-description = 描述
moderate-forReview-reviewed = 被审查

moderate-forReview-detectedBannedWord = 被禁词
moderate-forReview-detectedLinks = 链接
moderate-forReview-detectedNewCommenter =新留言
moderate-forReview-detectedPreModUser = 被预审的用户
moderate-forReview-detectedRecentHistory = 近期的历史
moderate-forReview-detectedRepeatPost = 重复的帖子
moderate-forReview-detectedSpam = 垃圾邮件
moderate-forReview-detectedSuspectWord = 可疑词
moderate-forReview-detectedToxic = 恶意语言
moderate-forReview-reportedAbusive = 辱骂
moderate-forReview-reportedBio = 用户介绍
moderate-forReview-reportedOffensive = 无礼
moderate-forReview-reportedOther = 其他
moderate-forReview-reportedSpam = 垃圾邮件

# Archive

moderate-archived-queue-title = 该故事已被归档
moderate-archived-queue-noModerationActions =
  当一个故事被归档时，不能对留言进行修改。
moderate-archived-queue-toPerformTheseActions =
  要执行这些操作，请解除故事的存档。

## Community
community-emptyMessage = 我们无法在您的社区里找到符合你标准的人。

community-filter-searchField =
  .placeholder =按用户名或电子邮件地址搜索……
  .aria-label = 按用户名或电子邮件地址搜索
community-filter-searchButton =
  .aria-label = 搜索

community-filter-roleSelectField =
  .aria-label = 按角色搜索

community-filter-statusSelectField =
  .aria-label = 按用户状态搜索

community-changeRoleButton =
  .aria-label = 修改角色

community-assignMySitesToModerator = 分配我的网站
community-removeMySitesFromModerator = 取消我的网站
community-stillHaveSiteModeratorPrivileges = 他们仍将拥有网站版主的权限：
community-userNoLongerPermitted =不再允许用户做出修改决定或分配暂停令：
community-assignThisUser = 分配该用户到
community-assignYourSitesTo = 分配您的网站给 <strong>{ $username }</strong>
community-siteModeratorsArePermitted = 允许网站版主在他们所分配的网站上做出修改决定和发布暂停令。
community-removeSiteModeratorPermissions = 取消网站版主的权限

community-filter-optGroupAudience =
  .label = 受众
community-filter-optGroupOrganization =
  .label = 机构
community-filter-search = 搜索
community-filter-showMe = 对我显示
community-filter-allRoles =所有角色
community-filter-allStatuses =所有状态

community-column-username = 用户名
community-column-username-not-available = 用户名不可用
community-column-email-not-available = 电子邮件不可用
community-column-username-deleted = 被删除
community-column-email = 电子邮件
community-column-memberSince = 成员自从
community-column-role = 角色
community-column-status = 状态

community-role-popover =
  .description =用于修改用户角色的下拉菜单
community-siteRoleActions-popover =
  .description =用于提拔/下放用户之/来自网站的下拉菜单

community-userStatus-popover =
  .description = 修改用户状态的下拉菜单

community-userStatus-banUser = 禁止用户
community-userStatus-ban = 禁止
community-userStatus-removeBan = 取消禁止
community-userStatus-removeUserBan = 取消禁止
community-userStatus-suspendUser = 暂停用户
community-userStatus-suspend = 暂停
community-userStatus-suspendEverywhere = 暂停所有地方
community-userStatus-removeSuspension = 取消暂停
community-userStatus-removeUserSuspension = 取消暂停
community-userStatus-unknown = 未知
community-userStatus-changeButton =
  .aria-label = 修改用户状态
community-userStatus-premodUser =始终预审
community-userStatus-removePremod = 取消预审

community-banModal-areYouSure = 您确定要禁止<username></username>?
community-banModal-consequence =
  一旦被禁，用户无法留言、使用回应功能或举报留言。
community-banModal-cancel = 取消
community-banModal-banUser = 禁止用户
community-banModal-customize = 自定义禁止电子邮件消息
community-banModal-reject-existing =拒绝该用户的所有留言

community-banModal-noSites = 没有网站
community-banModal-banFrom = 禁止来自
community-banModal-allSites = 所有网站
community-banModal-specificSites = 个别网站

community-suspendModal-areYouSure = 暂停<strong>{ $username }</strong>?
community-suspendModal-consequence =
  一旦被暂停，用户无法留言、使用回应功能或举报留言。
community-suspendModal-duration-3600 = 1小时
community-suspendModal-duration-10800 = 3 小时
community-suspendModal-duration-86400 = 24 小时
community-suspendModal-duration-604800 = 7天
community-suspendModal-cancel = 取消
community-suspendModal-suspendUser = 暂停用户
community-suspendModal-emailTemplate =
 您好 { $username },

  根据{$organizationName }的社区准则，您的账户已被暂停使用。在暂用期间，您将无法留言、标记或与其他留言者互动。请在{ framework-timeago-time }后重新加入对话。

community-suspendModal-customize = 自定义暂停的电子邮件消息

community-suspendModal-success =
  <strong>{ $username }</strong> 已经被暂停使用 <strong>{ $duration }</strong>

community-suspendModal-success-close = 关闭
community-suspendModal-selectDuration =选择暂停使用时长

community-premodModal-areYouSure =
 确认您要始终预审<strong>{ $username }</strong>?
community-premodModal-consequence =
  他们所有的留言都将进入待定队列，直到你取消这个状态。
community-premodModal-cancel = 取消
community-premodModal-premodUser = 是，始终预审

community-siteRoleModal-assignSites =
  Assign sites for <strong>{ $username }</strong>
community-siteRoleModal-assignSitesDescription-siteModerator =
  允许网站版主在他们所分配的网站上做出修改决定和发布暂停令。

community-siteRoleModal-cancel = 取消
community-siteRoleModal-assign = 分配
community-siteRoleModal-remove = 取消
community-siteRoleModal-selectSites-siteModerator = 选择网站进行审核
community-siteRoleModal-noSites = 没有网站

community-invite-inviteMember = 邀请成员到您的机构
community-invite-emailAddressLabel = 电子邮件地址：
community-invite-inviteMore = 邀请更多
community-invite-inviteAsLabel =  邀请作为
community-invite-sendInvitations = 发送邀请
community-invite-role-staff =
  <strong>员工角色：</strong> 获得 "员工 "徽章，并且留言会被自动批准。不能调节或修改任何{ -product-name }配置。
community-invite-role-moderator =
  <strong>版主角色：</strong> 获得 "员工 "徽章，并且留言会被自动批准。拥有所有审核权限（批准、拒绝和高亮留言）。能够配置个人文章，但不拥有全网站配置权限。
community-invite-role-admin =
  <strong>管理员角色：</strong> 获得 "员工 "徽章，并且留言会被自动批准。拥有所有审核权限（批准、拒绝和高亮留言）。能够配置个人文章，且拥有全网站配置权限。
community-invite-invitationsSent =您的邀请已经发送！
community-invite-close = 关闭
community-invite-invite = 邀请

community-warnModal-success =
  警告已经发送给<strong>{ $username }</strong>.
community-warnModal-success-close = Ok
community-warnModal-areYouSure = 警告<strong>{ $username }</strong>?
community-warnModal-consequence = 警告可以改善留言者的行为，而无需暂停或禁止。用户必须接受警告才能继续发表留言。
community-warnModal-message-label = 消息
community-warnModal-message-required = 必需的
community-warnModal-message-description =向该用户解释他们应该如何改变他们在您网站上的行为。
community-warnModal-cancel = 取消
community-warnModal-warnUser = 警告用户
community-userStatus-warn = 用户
community-userStatus-warnEverywhere = 到处警告
community-userStatus-message = 消息

community-modMessageModal-success = 一条消息已经发送<strong>{ $username }</strong>.
community-modMessageModal-success-close = Ok
community-modMessageModal-areYouSure = 给 <strong>{ $username }</strong>发消息?
community-modMessageModal-consequence = 向留言者者发送仅对其可见的消息。
community-modMessageModal-message-label = 消息
community-modMessageModal-message-required = 必需的
community-modMessageModal-cancel = 取消
community-modMessageModal-messageUser = 给用户发消息

## Stories
stories-emptyMessage = 当前没有发布的故事。
stories-noMatchMessage = 无法找到符合您标准的故事。

stories-filter-searchField =
  .placeholder = 按故事标题或作者搜索……
  .aria-label = 按故事标题或作者搜索
stories-filter-searchButton =
  .aria-label = 搜索

stories-filter-statusSelectField =
  .aria-label = 按状态搜索

stories-changeStatusButton =
  .aria-label = 修改 状态

stories-filter-search = 搜索
stories-filter-showMe = 向我显示
stories-filter-allStories = 所有故事
stories-filter-openStories = 开放故事
stories-filter-closedStories = 关闭故事

stories-column-title = 标题
stories-column-author = 作者
stories-column-publishDate = 发布日期
stories-column-status = 状态
stories-column-clickToModerate = 点击标题可以调节故事
stories-column-reportedCount = 被举报
stories-column-pendingCount = 待处理
stories-column-publishedCount = 已发布

stories-status-popover =
  .description = 修改故事状态的下拉菜单

## Invite

invite-youHaveBeenInvited = 您被邀请加入 { $organizationName }
invite-finishSettingUpAccount = 完成账户设置：
invite-createAccount = 创建账户
invite-passwordLabel = 密码
invite-passwordDescription = 必需至少 { $minLength } 字符
invite-passwordTextField =
  .placeholder = 密码
invite-usernameLabel = 用户名
invite-usernameDescription = 您可以使用 “_” 和“.”
invite-usernameTextField =
  .placeholder = 用户名
invite-oopsSorry = 哦抱歉！
invite-successful = 您的账户已经创建
invite-youMayNowSignIn = 您现在可以登录到 { -product-name } 使用：
invite-goToAdmin = 前往 { -product-name } 管理页面
invite-goToOrganization = 前往{ $organizationName }
invite-tokenNotFound =
  指定的链接无效，检查该链接复制是否正确。

userDetails-banned-on = 在{ $timestamp }上<strong>禁止</strong>
userDetails-banned-by = <strong>被</strong> { $username }
userDetails-suspended-by = <strong>被</strong> { $username }暂停
userDetails-suspension-start = <strong>开始：</strong> { $timestamp }
userDetails-suspension-end = <strong>结束：</strong> { $timestamp }

userDetails-warned-on = 在{ $timestamp }上<strong>禁止</strong>
userDetails-warned-by = <strong>被</strong> { $username }
userDetails-warned-explanation = 用户不接受该警告。

configure-general-reactions-title = 回应
configure-general-reactions-explanation =
  允许您的社区互动并使用一键式回应表达他们的想法。默认情况下，Coral允许留言者 "认可" 彼此的留言。
configure-general-reactions-label = 回应标签
configure-general-reactions-input =
  .placeholder = 例如：认可
configure-general-reactions-active-label = 激活的回应标签
configure-general-reactions-active-input =
  .placeholder = E.g. Respected 例如：受认可的
configure-general-reactions-sort-label = 分类标签
configure-general-reactions-sort-input =
  .placeholder = 例如：受认可最多的
configure-general-reactions-preview = 预览
configure-general-reaction-sortMenu-sortBy = 按分类

configure-general-badges-title =员工成员徽章
configure-general-badges-explanation =
  为您机构的工作人员展示一个自定义的徽章。这个徽章会出现在留言流和管理界面中。
configure-general-badges-label = Badge text
configure-general-badges-input =
  .placeholder = 例如：员工
configure-general-badges-moderator-input =
  .placeholder = 例如：版主
configure-general-badges-admin-input =
  .placeholder = 例如：管理员
configure-general-badges-preview = 预览
configure-general-badges-moderator-preview = 预览
configure-general-staff-admin-preview = 预览
configure-general-badges-staff-member-label = 员工成员徽章文本
configure-general-badges-admin-label =管理员徽章文本
configure-general-badges-moderator-label =版主徽章文本

configure-general-rte-title = rich-text留言
configure-general-rte-express = 给您的社区提供更多的方式来表达自己，而不是用丰富文本格式化的纯文本。
configure-general-rte-richTextComments = rich-text留言
configure-general-rte-onBasicFeatures = 开启：粗体、斜体、方块引号和子弹头列表
configure-general-rte-additional = 额外的rich-text选项
configure-general-rte-strikethrough = 删减线
configure-general-rte-spoiler = 剧透
configure-general-rte-spoilerDesc =
  作为剧透而格式化的单词和短语用深色背景隐藏，直到读者选择显示文本。

configure-account-features-title = 留言者账户管理功能
configure-account-features-explanation =
  你可以启用和禁用某些功能，让你的留言者在他们的个人资料中使用。这些功能也有助于遵守GDPR。
configure-account-features-allow = 允许用户：
configure-account-features-change-usernames = 修改他们的用户名
configure-account-features-change-usernames-details = 每14天可以修改一次用户名。
configure-account-features-yes = 是
configure-account-features-no = 否
configure-account-features-download-comments =下载他们的留言
configure-account-features-download-comments-details =留言者可以把他们留言历史的csv文件。
configure-account-features-delete-account = 删除他们的账户
configure-account-features-delete-account-details =
  从网站和数据库里移除所有他们留言的数据、用户和电子邮件地址。

configure-account-features-delete-account-fieldDescriptions =
  从网站和数据库里移除他们留言的数据、用户和电子邮件地址。


configure-advanced-stories =故事创建
configure-advanced-stories-explanation = 关于如何在Coral内创建故事的高级设置。configure-advanced-stories-lazy = 懒人故事创建
configure-advanced-stories-lazy-detail =启用故事在其从您的内容管理系统发布时能够自动创建。
configure-advanced-stories-scraping = 故事搜刮
configure-advanced-stories-scraping-detail =启用故事元数据，以便其在从您的内容管理系统发布时自动刮取。
configure-advanced-stories-proxy =搜刮代理url
configure-advanced-stories-proxy-detail =
  允许在指定时搜刮请求使用所提供的代理。所有的请求都将通过适当的代理，并由<externalLink>npm 代理-代理商</externalLink>软件包解析。
configure-advanced-stories-custom-user-agent =自定义搜刮用户代理头
configure-advanced-stories-custom-user-agent-detail =
  在指定时，覆盖随每个搜刮请求发送的<code>用户-代理</code>头

configure-advanced-stories-authentication = 验证
configure-advanced-stories-scrapingCredentialsHeader = 搜刮凭证
configure-advanced-stories-scraping-usernameLabel = 用户名
configure-advanced-stories-scraping-passwordLabel = 密码

commentAuthor-status-banned = 被禁止
commentAuthor-status-premod = 预审
commentAuthor-status-suspended = 被暂停

hotkeysModal-title = 键盘快捷键
hotkeysModal-navigation-shortcuts = 导航快捷键
hotkeysModal-shortcuts-next =下一条留言
hotkeysModal-shortcuts-prev = 前一天留言
hotkeysModal-shortcuts-search = 打开搜索
hotkeysModal-shortcuts-jump = 跳到特定队列
hotkeysModal-shortcuts-switch =切换队列
hotkeysModal-shortcuts-toggle =切换快捷键帮助
hotkeysModal-shortcuts-single-view = 单条留言查看
hotkeysModal-moderation-decisions = 审核决定
hotkeysModal-shortcuts-approve = 批准
hotkeysModal-shortcuts-reject = 拒绝
hotkeysModal-shortcuts-ban = 禁止留言作者
hotkeysModal-shortcuts-zen =切换单条留言查看

authcheck-network-error = 出现一个网络错误。请刷新页面。

dashboard-heading-last-updated = 最新更新：

dashboard-today-heading = 今天的活动
dashboard-today-new-comments = 新留言
dashboard-alltime-new-comments = 所有时间总数
dashboard-today-rejections = 拒绝率
dashboard-alltime-rejections = 所有时间平均数
dashboard-today-staff-comments = 员工留言
dashboard-alltime-staff-comments =所有时间总数
dashboard-today-signups = 新社区成员
dashboard-alltime-signups = 成员总数
dashboard-today-bans = 被禁的成员
dashboard-alltime-bans = 被禁的成员总数

dashboard-top-stories-today-heading =今天留言最多的故事
dashboard-top-stories-table-header-story = 故事
dashboard-top-stories-table-header-comments = 留言
dashboard-top-stories-no-comments = 今天没有留言

dashboard-commenters-activity-heading =本周新社区成员

dashboard-comment-activity-heading = 每小时留言动态
dashboard-comment-activity-tooltip-comments = 留言
dashboard-comment-activity-legend = 过去3天平均

conversation-modal-conversationOn = 对话
conversation-modal-moderateStory =查看故事
conversation-modal-showMoreParents = 显示该对话的更多内容
conversation-modal-showReplies = 显示回复
conversation-modal-commentNotFound = 没有发现留言
conversation-modal-showMoreReplies = 显示更多回复
conversation-modal-header-title =对话：
conversation-modal-header-moderate-link =查看故事
