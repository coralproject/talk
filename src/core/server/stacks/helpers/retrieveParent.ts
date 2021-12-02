import { MongoContext } from "coral-server/data/context";
import {
  CommentNotFoundError,
  CommentRevisionNotFoundError,
  ParentCommentRejectedError,
} from "coral-server/errors";
import {
  getLatestRevision,
  hasPublishedStatus,
  retrieveComment,
} from "coral-server/models/comment";

import { GQLCOMMENT_STATUS } from "coral-server/graph/schema/__generated__/types";

async function retrieveParent(
  mongo: MongoContext,
  tenantID: string,
  input: { parentID?: string; parentRevisionID?: string }
) {
  if (!input.parentID || !input.parentRevisionID) {
    return null;
  }

  // Check to see that the reference parent ID exists.
  const parent = await retrieveComment(
    mongo.comments(),
    tenantID,
    input.parentID
  );
  if (!parent) {
    throw new CommentNotFoundError(input.parentID);
  }

  // Check to see that the most recent revision matches the one we just replied
  // to.
  const revision = getLatestRevision(parent);
  if (revision.id !== input.parentRevisionID) {
    throw new CommentRevisionNotFoundError(parent.id, input.parentRevisionID);
  }

  // Check that the parent comment was visible.
  if (!hasPublishedStatus(parent)) {
    if (parent.status === GQLCOMMENT_STATUS.REJECTED) {
      throw new ParentCommentRejectedError(parent.id);
    }
    throw new CommentRevisionNotFoundError(parent.id, input.parentRevisionID);
  }

  return parent;
}

export default retrieveParent;
