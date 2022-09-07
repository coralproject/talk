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

export type Moderator = User & {
  role: "MODERATOR";
};

export type LTEModerator = User & {
  role: "MODERATOR" | "STAFF" | "MEMBER" | "COMMENTER";
};

export const isModerator = (user: User): user is Moderator => {
  return user.role === "MODERATOR";
};

export const isLTEModerator = (user: User): user is LTEModerator => {
  return user.role !== "ADMIN";
};
