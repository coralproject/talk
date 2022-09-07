import { User, UserRole } from "./types";
import { validateRoleChange } from "./validateRoleChange";
import { validateScopeChange } from "./validateScopeChange";

interface PermissionsAction {
  viewer: User;
  user: User;
  newUserRole?: UserRole;
  scopeAdditions?: string[];
  scopeDeletions?: string[];
}

export const validatePermissionsAction = ({
  viewer,
  user,
  newUserRole,
  scopeAdditions,
  scopeDeletions,
}: PermissionsAction): boolean => {
  const scoped = !!scopeAdditions?.length;
  const validRoleChange = validateRoleChange(
    viewer,
    user,
    newUserRole || user.role,
    scoped
  );

  const validScopeChange = validateScopeChange({
    viewer,
    user: {
      ...user,
      role: newUserRole || user.role,
    },
    additions: scopeAdditions,
    deletions: scopeDeletions,
  });

  return validScopeChange && validRoleChange;
};
