import { PermissionsAction } from "coral-common/permissions/types";

type SideEffect = () => Promise<void>;
export const sideEffectRules: PermissionsActionSideEffectTest[] = [];
export type PermissionsActionSideEffectTest = (
  action: PermissionsAction
) => () => Promise<void> | null;

/**
 * runSideEffects assumes an action has been deemed valid, and
 * checks for what actions need to be taken (if any) for the given action.
 */
export const runSideEffects = async (
  action: PermissionsAction
): Promise<void> => {
  const sideEffects = sideEffectRules
    .map((rule) => rule(action))
    .filter((sideEffect) => sideEffect !== null) as SideEffect[];

  await Promise.all(sideEffects);
};
