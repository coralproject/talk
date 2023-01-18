import { isSiteModerationScoped } from "./isSiteModerationScoped";

export type UserRole =
  | "%future added value"
  | "COMMENTER"
  | "MEMBER"
  | "STAFF"
  | "MODERATOR"
  | "ADMIN";

export interface User {
  id: Readonly<string>;
  role: Readonly<UserRole>;
  moderationScopes?: null | Readonly<{
    scoped?: Readonly<boolean> | null;
    siteIDs?: Readonly<string[]> | null;
  }>;
  membershipScopes?: null | Readonly<{
    scoped?: Readonly<boolean> | null;
    siteIDs?: Readonly<string[]> | null;
  }>;
}

export type Moderator = User & {
  role: "MODERATOR";
};

export type SiteModerator = Moderator & {
  role: "MODERATOR";
  moderationScopes: {
    scoped: true;
    siteIDs: string[];
  };
};

export type SiteMember = User & {
  role: "MEMBER";
  membershipScopes: {
    scoped: true;
    siteIDs: string[];
  };
};

export type OrgModerator = Moderator & {
  moderationScopes?: {
    scoped: false;
    sites?: never[];
    siteIDs?: never[];
  };
};

export type LTModerator = User & {
  role: "STAFF" | "MEMBER" | "COMMENTER";
};

export type LTEModerator = User & {
  role: "MODERATOR" | "STAFF" | "MEMBER" | "COMMENTER";
};

export type LTESiteModerator = User;

export const isSiteMember = (user: Readonly<User>): user is SiteMember => {
  return (
    user.role === "MEMBER" &&
    (!!user.membershipScopes?.scoped ||
      !!user.membershipScopes?.siteIDs?.length)
  );
};

export const isModerator = (user: Readonly<User>): user is Moderator => {
  return user.role === "MODERATOR";
};

export const isSiteModerator = (user: Readonly<User>): user is SiteModerator =>
  user.role === "MODERATOR" && isSiteModerationScoped(user.moderationScopes);

export const isOrgModerator = (user: Readonly<User>): user is OrgModerator =>
  user.role === "MODERATOR" && !isSiteModerationScoped(user.moderationScopes);

export const isLTEModerator = (user: Readonly<User>): user is LTEModerator => {
  return user.role !== "ADMIN";
};

export const isLTModerator = (user: Readonly<User>): user is LTModerator =>
  user.role === "COMMENTER" || user.role === "MEMBER" || user.role === "STAFF";

export const isLTESiteModerator = (
  user: Readonly<User>
): user is LTESiteModerator =>
  isLTModerator(user) ||
  (isModerator(user) && isSiteModerationScoped(user.moderationScopes));

export interface PermissionsAction {
  viewer: Readonly<User>;
  user: Readonly<User>;
  newUserRole?: UserRole;
  scopeAdditions?: string[];
  scopeDeletions?: string[];
}

export interface PermissionsActionRuleResult {
  applies: boolean;
  reason: string;
  sideEffect?: () => Promise<void>;
}

/**
 * A PermissionsActionRuleTests checks to see if a pending
 * permissions action should be allowed according to a given rule,
 * and specifies an optional side effect that should be executed in the case
 * that it is allowed.
 */
export type PermissionsActionRuleTest = (
  action: PermissionsAction
) => PermissionsActionRuleResult;

export interface PermissionsActionPredicateResult {
  pass: boolean;
  reason: string;
}

export type PermissionsActionPredicate = (
  action: PermissionsAction
) => PermissionsActionPredicateResult;
