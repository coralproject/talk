import {
  isSiteMember,
  isSiteModerator,
  PermissionsActionPredicate,
} from "./types";

const usersCantUpdateSelves: PermissionsActionPredicate = ({
  viewer,
  user,
}) => ({
  pass: viewer.id !== user.id,
  reason: "Users cannot update their own roles or scopes",
});

const onlyAdminsCanAllocateStaff: PermissionsActionPredicate = ({
  viewer,
  user,
  newUserRole,
}) => ({
  pass: !(viewer.role !== "ADMIN" && newUserRole === "STAFF"),
  reason: "Only admins may allocate staff",
});

const onlyAdminsCanDemoteStaffDirectly: PermissionsActionPredicate = ({
  viewer,
  user,
}) => ({
  pass: !(viewer.role !== "ADMIN" && user.role === "STAFF"),
  reason: "Only admins may change staffs roles",
});

/**
 * This (terribly named) predicate ensures that a scoped viewer cannot
 * change a scoped user's role in a way that inadvertantly
 * remove scopes the viewer does not posses.
 */
const scopedUsersCantIndirectlyRemoveScopesTheyDontPosses: PermissionsActionPredicate =
  ({ viewer, user, newUserRole }) => {
    const reason =
      "This role change would remove scopes outside of the viewers authorization";

    const changingAwayFromCurrentScopedRole =
      (isSiteModerator(user) && !!newUserRole && newUserRole !== "MODERATOR") ||
      (isSiteMember(user) && !!newUserRole && newUserRole !== "MEMBER");

    if (!isSiteModerator(viewer) || !changingAwayFromCurrentScopedRole) {
      return {
        pass: true,
        reason,
      };
    }

    const relevantScopes =
      user.role === "MODERATOR" ? user.moderationScopes : user.membershipScopes;

    const userHasScopesViewerDoesnt = !!relevantScopes?.siteIDs?.find(
      (userSiteID) => !viewer.moderationScopes?.siteIDs?.includes(userSiteID)
    );

    return {
      pass: !userHasScopesViewerDoesnt,
      reason,
    };
  };

export const predicates: PermissionsActionPredicate[] = [
  usersCantUpdateSelves,
  onlyAdminsCanAllocateStaff,
  onlyAdminsCanDemoteStaffDirectly,
  scopedUsersCantIndirectlyRemoveScopesTheyDontPosses,
];
