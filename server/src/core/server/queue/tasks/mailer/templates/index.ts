interface EmailTemplate<T extends string, U extends {}> {
  name: T;
  context: U;
}

type TestContext<T extends string, U extends {}> = EmailTemplate<T, U>;

export type SMTPTestTemplate = TestContext<
  "test/smtp-test",
  {
    email: string;
  }
>;

/**
 * NotificationContext
 */

type NotificationContext<T extends string, U extends {}> = EmailTemplate<
  T,
  U & {
    organizationURL: string;
    organizationName: string;
    unsubscribeURL: string;
  }
>;

export type OnReplyTemplate = NotificationContext<
  "notification/on-reply",
  {
    storyTitle: string;
    storyURL: string;
    authorUsername: string;
    commentPermalink: string;
  }
>;

export type OnStaffReplyTemplate = NotificationContext<
  "notification/on-staff-reply",
  {
    storyTitle: string;
    storyURL: string;
    authorUsername: string;
    commentPermalink: string;
  }
>;

export type OnFeaturedTemplate = NotificationContext<
  "notification/on-featured",
  {
    storyTitle: string;
    storyURL: string;
    commentPermalink: string;
  }
>;

export type OnCommentRejectedTemplate = NotificationContext<
  "notification/on-comment-rejected",
  {}
>;

export type OnCommentApprovedTemplate = NotificationContext<
  "notification/on-comment-approved",
  {
    commentPermalink: string;
  }
>;

export type DigestibleTemplate =
  | OnReplyTemplate
  | OnStaffReplyTemplate
  | OnFeaturedTemplate
  | OnCommentRejectedTemplate
  | OnCommentApprovedTemplate;

type DigestTemplate = NotificationContext<
  "notification/digest",
  {
    digests: Array<{
      /**
       * partial stores the part of the filename that can be used to tie the
       * given notification into a specific template.
       */
      partial: string;

      /**
       * contexts is the array of all the contexts under this partial that
       * should be used to create the digest context.
       */
      contexts: Array<DigestibleTemplate["context"]>;
    }>;
  }
>;

/**
 * AccountNotificationContext
 */

type AccountNotificationContext<T extends string, U extends {}> = EmailTemplate<
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
  | OnReplyTemplate
  | OnStaffReplyTemplate
  | OnFeaturedTemplate
  | DigestTemplate
  | OnCommentRejectedTemplate
  | SMTPTestTemplate
  | OnCommentApprovedTemplate;

export { Templates as EmailTemplate };
