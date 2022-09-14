import { PermissionsActionPredicate } from "./types";

const usersCantUpdateSelves: PermissionsActionPredicate = ({
  viewer,
  user,
}) => ({
  pass: viewer.id !== user.id,
  reason: "Users cannot update their own roles or scopes",
});

export const predicates: PermissionsActionPredicate[] = [usersCantUpdateSelves];
