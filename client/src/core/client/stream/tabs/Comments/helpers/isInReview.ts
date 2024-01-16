import { GQLCOMMENT_STATUS } from "coral-framework/schema";

const inReviewStatuses = [
  GQLCOMMENT_STATUS.PREMOD,
  GQLCOMMENT_STATUS.SYSTEM_WITHHELD,
];

export default function isInReview(status: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return inReviewStatuses.includes(status);
}
