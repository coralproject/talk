import { predicates } from "./predicates";
import { validationRules } from "./rules";
import { PermissionsAction } from "./types";

/* eslint-disable */
export const validatePermissionsAction = (action: PermissionsAction) => {
  for (const predicate of predicates) {
    const { pass} = predicate(action);
    if (!pass) {
      return false;
    }
  }

  for (const rule of validationRules) {
    const { applies } = rule(action);
    if (applies) {
      // TODO: Log reason
      // TODO: RUN SIDE EFFECTS
      return true;
    }
  }

  return false;
};
