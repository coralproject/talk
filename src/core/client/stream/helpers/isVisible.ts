// TODO: use generated schema types.
const inReviewStatuses = ["NONE", "ACCEPTED"];

export default function isVisible(status: any) {
  return inReviewStatuses.includes(status);
}
