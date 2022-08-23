export type UserRole =
  | "%future added value"
  | "COMMENTER"
  | "MEMBER"
  | "STAFF"
  | "MODERATOR"
  | "ADMIN";

export interface User {
  id: string;
  role: UserRole;
  moderationScopes?: null | {
    scoped?: boolean;
    siteIDs?: string[];
  };
}
