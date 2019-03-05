// TODO: use generated schema types.
const visibleStatuses = ["NONE", "ACCEPTED"];

export default function isVisible(status: any) {
  return visibleStatuses.includes(status);
}
