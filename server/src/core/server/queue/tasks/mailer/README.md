# mailer

The mailer is responsible for rendering and translating all email messages sent
by Coral.

## Adding a new email

The first step to defining your new email is to add a new email template to
`src/core/server/queue/tasks/mailer/templates/index.ts`. There you can see how
other templates define their requirements, and how you ensure that you get the
required context.

### Templates

Depending on the type of email you're adding, you're likely adding a:

- _Account Notification_ - an email sent as a result of an account action by the
  system or an administrator.
- _Notification_ - an email sent to a user based on a notification preference
  they've enabled.

There are folders under `templates` for each of these. Use any of the templates
in those folders as an example to craft your own template.

### Translations

Once you've added a template, you need to add a translation into the `src/core/server/locales/${locale}/email.ftl`
file. There are two translation lines you need to add to support a new email:

- _Subject_ - the subject of the email to be sent. Keys for these translations
  follow the form `email-subject-${camelCase(templateName)}`.
  - For example, for the template name `account-notification/confirm-email`
    the subject translation key would become `email-subject-accountNotificationConfirmEmail`.
- _Template_ - the translated body of the email to be sent. Keys for these
  translations follow the form: `email-template-${camelCase(templateName)}`.
  - For example, for the template name `account-notification/confirm-email`
    the subject translation key would become `email-template-accountNotificationConfirmEmail`.
