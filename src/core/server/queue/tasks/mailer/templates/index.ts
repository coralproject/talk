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
  }
>;

export type SuspendTemplate = UserNotificationContext<
  "suspend",
  {
    username: string;
    until: string;
    organizationContactEmail: string;
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

type Templates =
  | ForgotPasswordTemplate
  | BanTemplate
  | SuspendTemplate
  | PasswordChangeTemplate
  | ConfirmEmailTemplate;

export { Templates as Template };
