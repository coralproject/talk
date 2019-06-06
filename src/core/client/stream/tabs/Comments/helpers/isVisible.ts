// TODO: use generated schema types.
const visibleStatuses = ["NONE", "APPROVED"];

export default function isVisible(status: any) {
  return visibleStatuses.includes(status);
}
