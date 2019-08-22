interface Template<T extends string, U extends {}> {
  name: T;
  context: U;
}

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

export type AccountDeletionConfirmation = UserNotificationContext<
  "delete-request-confirmation",
  {
    requestDate: string;
  }
>;

export type AccountDeletionCancellation = UserNotificationContext<
  "delete-request-cancel",
  {}
>;

export type AccountDeletionCompleted = UserNotificationContext<
  "delete-request-completed",
  {
    organizationContactEmail: string;
  }
>;

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
  | AccountDeletionCompleted;

export { Templates as Template };
