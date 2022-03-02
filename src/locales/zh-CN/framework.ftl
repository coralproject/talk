### Localizations for the framework.
### All keys must start with `framework` because this file is shared
### among different targets.

## Short Number

# Implementation based on unicode Short Number patterns
# http://cldr.unicode.org/translation/number-patterns#TOC-Short-Numbers

framework-shortNumber-1000 = 0.0k
framework-shortNumber-10000 = 00k
framework-shortNumber-100000 = 000k
framework-shortNumber-1000000 = 0.0M
framework-shortNumber-10000000 = 00M
framework-shortNumber-100000000 = 000M
framework-shortNumber-1000000000 = 0.0B

## Validation

framework-validation-required = 此栏为必填项。
framework-validation-tooShort = 请至少输入{$minLength}个字符。
framework-validation-tooLong = 请最多输入{$maxLength} 个字符。
framework-validation-usernameTooShort = 用户名必须包含 {$minLength}个字符。
framework-validation-usernameTooLong = 用户名不能多于 {$maxLength} 个字符。
framework-validation-invalidCharacters = 无效的字符。请再次尝试。
framework-validation-invalidEmail = 请输入一个有效的电子邮件地址。
framework-validation-passwordTooShort = 密码必须包含至少{$minLength} 个字符。
framework-validation-passwordsDoNotMatch = 密码不匹配。请再次尝试。
framework-validation-invalidURL = 无效的URL 
framework-validation-emailsDoNotMatch = 电子邮件不匹配。请再次尝试。
framework-validation-notAWholeNumberBetween = 请输入一个{$min }和{$max }之间的整数。
framework-validation-notAWholeNumberGreaterThan = 请输入一个大于{ $x }的整数。
framework-validation-notAWholeNumberGreaterThanOrEqual = 请输入一个大于或等于{ $x }的整数。
framework-validation-usernamesDoNotMatch = 用户名不匹配。请再次尝试。
framework-validation-deleteConfirmationInvalid = 错误的确认。请再次尝试。
framework-validation-invalidWebhookEndpointEventSelection = 选择至少一个要接收的事件。
framework-validation-media-url-invalid = 请输入一个有效的图像URL (.png、.jpg或.gif)

framework-timeago-just-now = 刚才

framework-timeago-time =
  { $value } { $unit ->
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
      *[other] 个月
    }
    [year] { $value ->
      [1] 年
      *[other] 年
    }
    *[other] 未知单位
  }

framework-timeago =
  { $suffix ->
    [ago] {framework-timeago-time} 之前
    *[noSuffix] {framework-timeago-time}
  }

## Components

### Copy Button
framework-copyButton-copy = 复制
framework-copyButton-copied = 已复制的

### Password Field
framework-passwordField =
  .showPasswordTitle = 显示密码
  .hidePasswordTitle = 隐藏密码

### Markdown Editor
framework-markdownEditor-bold = 粗体
framework-markdownEditor-italic = 斜体
framework-markdownEditor-titleSubtitleHeading =文章标题、副标题、小标题
framework-markdownEditor-quote = 引文
framework-markdownEditor-genericList = 通用列表
framework-markdownEditor-numberedList = 有编号的列表
framework-markdownEditor-createLink = 创建链接
framework-markdownEditor-insertImage = 插入图像
framework-markdownEditor-togglePreview = 切换预览
framework-markdownEditor-toggleSideBySide = 并排切换
framework-markdownEditor-toggleFullscreen = 切换全屏
framework-markdownEditor-markdownGuide = 标记指南

### Duration Field

framework-timeago-time =
  { $value } { $unit ->
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
      *[other] 个月
    }
    [year] { $value ->
      [1] 年
      *[other] 年
    }
    *[other] 未知单位
  }

framework-starRating =
  .aria-label = { $value ->
    [1] 1 星
    *[other] {$value} 星
  }

### Relay Network Request Error

framework-error-relayNetworkRequestError-anUnexpectedNetworkError = 
  出现了一个意外的网络错误，请稍后再试。
framework-error-relayNetworkRequestError-code = 代码