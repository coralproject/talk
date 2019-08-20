interface Template<T extends string, U extends {}> {
  name: T;
  context: U;
}

type UserNotificationContext<T extends string, U extends {}> = Template<
  T,
  U & {
    organizationURL: string;
    organizationName: string;
  }
>;

export type ForgotPasswordTemplate = UserNotificationContext<
  "forgot-password",
  {
    username: string;
    resetURL: string;
  }
>;

export type BanTemplate = UserNotificationContext<
  "ban",
  {
    username: string;
    organizationContactEmail: string;
    customMessage?: string;
  }
>;

export type SuspendTemplate = UserNotificationContext<
  "suspend",
  {
    username: string;
    until: string;
    organizationContactEmail: string;
    customMessage?: string;
  }
>;

export type PasswordChangeTemplate = UserNotificationContext<
  "password-change",
  {
    username: string;
    organizationContactEmail: string;
  }
>;

export type ConfirmEmailTemplate = UserNotificationContext<
  "confirm-email",
  {
    username: string;
    confirmURL: string;
    organizationContactEmail: string;
  }
>;

export type InviteEmailTemplate = UserNotificationContext<
  "invite",
  {
    inviteURL: string;
  }
>;

export type DownloadCommentsTemplate = UserNotificationContext<
  "download-comments",
  {
    username: string;
    date: string;
    downloadUrl: string;
  }
>;

export type UpdateUsernameTemplate = UserNotificationContext<
  "update-username",
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
