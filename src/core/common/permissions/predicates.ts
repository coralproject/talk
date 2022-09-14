import { PermissionsActionPredicate } from "./types";

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

export const predicates: PermissionsActionPredicate[] = [
  usersCantUpdateSelves,
  onlyAdminsCanAllocateStaff,
  onlyAdminsCanDemoteStaffDirectly,
];
