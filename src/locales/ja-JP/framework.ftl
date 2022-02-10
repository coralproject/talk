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

framework-validation-required = この項目は必須です。
framework-validation-tooShort = 最小文字数は {$minLength} 文字です。
framework-validation-tooLong = 最大文字数は {$maxLength} 文字です。
framework-validation-usernameTooShort = ユーザー名の最小文字数は {$minLength} 文字です。
framework-validation-usernameTooLong = ユーザー名の最大文字数は  {$maxLength} 文字です。
framework-validation-invalidCharacters = 無効な文字列です。修正してください。
framework-validation-invalidEmail = 正しいEメールアドレスを入力してください。
framework-validation-passwordTooShort = パスワードの最小文字数は{$minLength} 文字です。
framework-validation-passwordsDoNotMatch = パスワードが一致しません。修正してください。
framework-validation-invalidURL = 無効なURLです。
framework-validation-emailsDoNotMatch =Eメールアドレスが一致しません。修正してください。
framework-validation-notAWholeNumberBetween = { $min } 〜 { $max } 文字の間で入力してください。
framework-validation-notAWholeNumberGreaterThan = { $x } より大きな数を入力してください。
framework-validation-notAWholeNumberGreaterThanOrEqual = { $x } より大きな数を入力してください。
framework-validation-usernamesDoNotMatch = ユーザー名が一致しません。修正してください。
framework-validation-deleteConfirmationInvalid = 確認が正しく行なわれていません。再施行してください。
framework-validation-invalidWebhookEndpointEventSelection = 受信するイベントを少なくとも1つ選択してください。
framework-validation-media-url-invalid = 有効な画像のURLを入力してください (.png, .jpg, or .gif)

framework-timeago-just-now = 今すぐ

framework-timeago-time =
  { $value } { $unit ->
    [second] { $value ->
      [1] 秒
      *[other] 秒
    }
    [minute] { $value ->
      [1] 分
      *[other] 分
    }
    [hour] { $value ->
      [1] 時間
      *[other] 時間
    }
    [day] { $value ->
      [1] 日
      *[other] 日
    }
    [week] { $value ->
      [1] 週間
      *[other] 週間
    }
    [month] { $value ->
      [1] ヵ月
      *[other] ヵ月
    }
    [year] { $value ->
      [1] 年
      *[other] 年
    }
    *[other] 不明
  }

framework-timeago =
  { $suffix ->
    [ago] {framework-timeago-time} 前
    *[noSuffix] {framework-timeago-time}
  }

## Components

### Copy Button
framework-copyButton-copy = コピー
framework-copyButton-copied = コピーしました

### Password Field
framework-passwordField =
  .showPasswordTitle = パスワードを見る
  .hidePasswordTitle = パスワードを隠す

### Markdown Editor
framework-markdownEditor-bold = 太字
framework-markdownEditor-italic = 斜字
framework-markdownEditor-titleSubtitleHeading = タイトル、サブタイトル、ヘッドライン
framework-markdownEditor-quote = 引用
framework-markdownEditor-genericList = 全体的なリスト
framework-markdownEditor-numberedList = 番号付けされたリスト
framework-markdownEditor-createLink = リンクを作成
framework-markdownEditor-insertImage = イメージを挿入
framework-markdownEditor-togglePreview = プレビューを切り替え
framework-markdownEditor-toggleSideBySide = サイド・バイ・サイドを切り替える
framework-markdownEditor-toggleFullscreen = フルスクリーンに切り替える
framework-markdownEditor-markdownGuide = マークダウン・ガイド

### Duration Field

framework-durationField-unit =
  { $unit ->
    [second] { $value ->
      [1] 秒
      *[other] 秒
    }
    [minute] { $value ->
      [1] 分
      *[other] 分
    }
    [hour] { $value ->
      [1] 時間
      *[other] 時間
    }
    [day] { $value ->
      [1] 日
      *[other] 日
    }
    [week] { $value ->
      [1] 週
      *[other] 週
    }
    *[other] 不明なユニット
  }

framework-starRating =
  .aria-label = { $value ->
    [1] 星1
    *[other] 星 {$value}
  }

### Relay Network Request Error

framework-error-relayNetworkRequestError-anUnexpectedNetworkError =
 予期しないネットワークエラーが発生しています。後ほど改めてお試しください。
framework-error-relayNetworkRequestError-code = コード
