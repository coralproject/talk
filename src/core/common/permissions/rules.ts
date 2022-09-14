import {
  isLTESiteModerator,
  isOrgModerator,
  isSiteModerator,
  PermissionsActionRuleTest,
} from "./types";
// admins can do whatever they want to anyone except other admins
const adminsArePowerful: PermissionsActionRuleTest = ({ viewer, user }) => ({
  applies: viewer.role === "ADMIN" && user.role !== "ADMIN",
  reason: "Admins may change any non admin's role or scopes",
});

// org mods can promote anyone < site mod to be an unscoped member
// org modds can promote anyone < site mod to be a scoped member on any site
// org mods can demote unscoped members to commenters
// org mods can remove any site from a scoped member (if no membership sites remain for user, they should revert to commenter)
// org mods can promote anyone < org mod to be a scoped mod
// org mods can add any site to the scopes for a site mod
// org mods can remove any site from a site mods scopes (if no sites remain for site mod user, should revert to commenter)
const orgModsMayChangeLTESiteMods: PermissionsActionRuleTest = ({
  viewer,
  user,
  newUserRole,
}) => ({
  applies:
    isOrgModerator(viewer) &&
    isLTESiteModerator(user) &&
    newUserRole !== "ADMIN",
  reason:
    "Organization moderators may promote users below Organization Moderators to roles below Admin",
});

// ---
// site mods can promote anyone < member to be a scoped member within that site mods sites
// site mods can add sites within their scope to any scoped member
// site mods can remove sites within their scope from a scoped member (if no sites remain for the member user, revert them to commenter)
// site mods can promote anyone <= site mod to be a site mod on their sites
// site mods can add sites within their scope to another site mod
// site mods can remove sites within their scope from another site mods scopes (if not sites remain for site mod user), they should revert to commenter)
const siteModsMayAssignTheirSites: PermissionsActionRuleTest = ({
  viewer,
  user,
  newUserRole,
  scopeAdditions,
  scopeDeletions,
}) => {
  const reason =
    "Site moderators may add or remove their sites to users lower than or equal to site moderators";
  const roleChangeIsValid =
    isSiteModerator(viewer) &&
    isLTESiteModerator(user) &&
    newUserRole !== "ADMIN";

  if (!roleChangeIsValid) {
    return {
      applies: false,
      reason,
    };
  }

  const invalidAdditions =
    !!scopeAdditions &&
    !!scopeAdditions.find(
      (addition) => !viewer.moderationScopes?.siteIDs?.includes(addition)
    );

  const invalidDeletions =
    !!scopeDeletions &&
    !!scopeDeletions.find(
      (deletion) => !viewer.moderationScopes?.siteIDs?.includes(deletion)
    );

  return {
    applies: !invalidAdditions && !invalidDeletions,
    reason,
  };
};

/**
 * validationRules represents all possible reasons that a pending
 * action should be allowed. If no rule applies, the action
 * should be disallowed.
 */
export const validationRules: PermissionsActionRuleTest[] = [
  adminsArePowerful,
  orgModsMayChangeLTESiteMods,
  siteModsMayAssignTheirSites,
];
