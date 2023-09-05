import { GQLCOMMENT_STATUS } from "coral-framework/schema";

const PUBLISHED_STATUSES = [GQLCOMMENT_STATUS.NONE, GQLCOMMENT_STATUS.APPROVED];

export default function isPublished(status: any) {
  return PUBLISHED_STATUSES.includes(status);
}
