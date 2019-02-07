// TODO: use generated schema types.
const priviledgedRoles = ["ADMIN", "MODERATOR"];
export default function isRolePriviledged(role: any) {
  return priviledgedRoles.includes(role);
}
