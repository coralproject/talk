// TODO: use generated schema types.
const inReviewStatuses = ["PREMOD", "SYSTEM_WITHHELD"];
export default function isInReview(status: any) {
  return inReviewStatuses.includes(status);
}
