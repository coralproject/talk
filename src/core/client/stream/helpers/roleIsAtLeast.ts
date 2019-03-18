// TODO: use generated schema types.
type Role =
  | "ADMIN"
  | "MODERATOR"
  | "STAFF"
  | "COMMENTER"
  | "%future added value";

const hierarchy: Role[] = ["COMMENTER", "STAFF", "MODERATOR", "ADMIN"];
export default function roleIsAtLeast(role: Role, atLeast: Role) {
  [role, atLeast].forEach(r => {
    if (!hierarchy.includes(r)) {
      throw new Error(`Unknown role ${r}`);
    }
  });
  return hierarchy.indexOf(atLeast) <= hierarchy.indexOf(role);
}
