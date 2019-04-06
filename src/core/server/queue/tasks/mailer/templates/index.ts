// TODO: (wyattjoh) look at implementing when typescript 3.4.1 lands.

// interface Template<T extends string, U extends {}> {
//   name: T;
//   context: U;
// }

// type UserNotificationContext<T extends string, U extends {}> = Template<
//   T,
//   U & {
//     organizationURL: string;
//     organizationName: string;
//   }
// >;

// export type ForgotPasswordTemplate = UserNotificationContext<
//   "forgot-password",
//   {
//     resetURL: string;
//   }
// >;

interface OrganizationContext {
  organizationURL: string;
  organizationName: string;
}

export interface ForgotPasswordTemplate {
  name: "forgot-password";
  context: OrganizationContext & {
    username: string;
    resetURL: string;
  };
}

type Templates = ForgotPasswordTemplate;

export { Templates as Template };
