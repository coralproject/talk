interface Template<T extends string, U extends {}> {
  name: T;
  context: U;
}

/**
 * NotificationContext
 */

type NotificationContext<T extends string, U extends {}> = Template<
  T,
  U & {
    organizationURL: string;
    organizationName: string;
    unsubscribeURL: string;
  }
>;

export type OnReplyTemplate = NotificationContext<
  "notifications/on-reply",
  {
    storyTitle: string;
    storyURL: string;
    authorUsername: string;
    commentPermalink: string;
  }
>;

/**
 * AccountNotificationContext
 */

type AccountNotificationContext<T extends string, U extends {}> = Template<
  T,
  U & {
    organizationURL: string;
    organizationName: string;
  }
>;

export type ForgotPasswordTemplate = AccountNotificationContext<
  "account-notification/forgot-password",
  {
    username: string;
    resetURL: string;
  }
>;

export type BanTemplate = AccountNotificationContext<
  "account-notification/ban",
  {
    username: string;
    organizationContactEmail: string;
    customMessage?: string;
  }
>;

export type SuspendTemplate = AccountNotificationContext<
  "account-notification/suspend",
  {
    username: string;
    until: string;
    organizationContactEmail: string;
    customMessage?: string;
  }
>;

export type PasswordChangeTemplate = AccountNotificationContext<
  "account-notification/password-change",
  {
    username: string;
    organizationContactEmail: string;
  }
>;

export type ConfirmEmailTemplate = AccountNotificationContext<
  "account-notification/confirm-email",
  {
    username: string;
    confirmURL: string;
    organizationContactEmail: string;
  }
>;

export type InviteEmailTemplate = AccountNotificationContext<
  "account-notification/invite",
  {
    inviteURL: string;
  }
>;

export type DownloadCommentsTemplate = AccountNotificationContext<
  "account-notification/download-comments",
  {
    username: string;
    date: string;
    downloadUrl: string;
  }
>;

export type UpdateUsernameTemplate = AccountNotificationContext<
  "account-notification/update-username",
  {
    username: string;
    organizationContactEmail: string;
  }
>;

export type AccountDeletionConfirmation = AccountNotificationContext<
  "account-notification/delete-request-confirmation",
  {
    requestDate: string;
  }
>;

export type AccountDeletionCancellation = AccountNotificationContext<
  "account-notification/delete-request-cancel",
  {}
>;

export type AccountDeletionCompleted = AccountNotificationContext<
  "account-notification/delete-request-completed",
  {
    organizationContactEmail: string;
  }
>;

/**
 * Templates
 */

type Templates =
  | BanTemplate
  | ConfirmEmailTemplate
  | ForgotPasswordTemplate
  | InviteEmailTemplate
  | PasswordChangeTemplate
  | SuspendTemplate
  | DownloadCommentsTemplate
  | UpdateUsernameTemplate
  | AccountDeletionConfirmation
  | AccountDeletionCancellation
  | AccountDeletionCompleted
  | OnReplyTemplate;

export { Templates as Template };
