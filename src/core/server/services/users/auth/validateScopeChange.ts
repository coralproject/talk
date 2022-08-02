import { User } from "coral-server/models/user";

export interface ScopeChangeValidationParams {
  viewer: Readonly<User>;
  user: Readonly<User>;
  additions: string[];
  deletions: string[];
}

export const validateScopeChange = ({
  viewer,
  user,
  additions,
  deletions,
}: ScopeChangeValidationParams): boolean => {
  return false;
};
