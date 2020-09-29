import { inject, singleton } from "tsyringe";

import getHTMLPlainText from "coral-common/helpers/getHTMLPlainText";
import { reconstructTenantURL } from "coral-server/app/url";
import { CONFIG, Config } from "coral-server/config";
import { retrieveComment } from "coral-server/models/comment";
import { retrieveStory } from "coral-server/models/story";
import { MONGO, Mongo } from "coral-server/services/mongodb";
import { sendToPerspective } from "coral-server/services/perspective";

import { GQLCOMMENT_STATUS } from "coral-server/graph/schema/__generated__/types";

import { CommentStatusUpdatedCoralEventPayload } from "../events";
import { CoralEventHandler, CoralEventListener } from "../listener";
import { CoralEventType } from "../types";

type PerspectiveCoralEventListenerPayloads = CommentStatusUpdatedCoralEventPayload;

@singleton()
export class PerspectiveCoralEventListener
  implements CoralEventListener<PerspectiveCoralEventListenerPayloads> {
  public readonly name = "perspective";
  public readonly events = [CoralEventType.COMMENT_STATUS_UPDATED];

  constructor(
    @inject(MONGO) private readonly mongo: Mongo,
    @inject(CONFIG) private readonly config: Config
  ) {}

  private computeStatus(status: GQLCOMMENT_STATUS) {
    if (status === GQLCOMMENT_STATUS.APPROVED) {
      return "APPROVED";
    }
    if (status === GQLCOMMENT_STATUS.REJECTED) {
      return "DELETED";
    }

    return null;
  }

  public handle: CoralEventHandler<
    PerspectiveCoralEventListenerPayloads
  > = async (ctx, { data: { newStatus, commentID, commentRevisionID } }) => {
    const {
      tenant: {
        integrations: { perspective },
      },
    } = ctx;

    if (
      // If perspective isn't enabled,
      !perspective.enabled ||
      // Or the key isn't provided
      !perspective.key ||
      // Or the feedback sending option is disabled
      !perspective.sendFeedback
    ) {
      // Exit out then.
      return;
    }

    // Compute the status being sent to perspective.
    const status = this.computeStatus(newStatus);
    if (!status) {
      // The new status was not associated with
      return;
    }

    try {
      // Get the comment in question.
      const comment = await retrieveComment(
        this.mongo,
        ctx.tenant.id,
        commentID
      );
      if (!comment) {
        return;
      }

      // Get the target revision.
      const revision = comment.revisions.find(
        (r) => r.id === commentRevisionID
      );
      if (!revision) {
        return;
      }

      // Get the story for this comment.
      const story = await retrieveStory(
        this.mongo,
        ctx.tenant.id,
        comment.storyID
      );
      if (!story) {
        return;
      }

      // Reconstruct the Tenant URL.
      const tenantURL = reconstructTenantURL(this.config, ctx.tenant);

      // Get the timeout value.
      const timeout = this.config.get("perspective_timeout");

      // Get the response from perspective.
      const result = await sendToPerspective(
        { key: perspective.key, endpoint: perspective.endpoint, timeout },
        {
          operation: "comments:suggestscore",
          locale: ctx.tenant.locale,
          body: {
            text: getHTMLPlainText(revision.body),
            commentID: comment.id,
            commentParentID: comment.parentID,
            commentStatus: status,
            storyURL: story.url,
            tenantURL,
          },
        }
      );

      if (result.ok) {
        ctx.logger.debug(
          { commentID: comment.id, commentRevisionID },
          "successfully sent moderation feedback to perspective"
        );
      } else {
        ctx.logger.error(
          { status: result.status },
          "unable to send moderation feedback to perspective"
        );
      }
    } catch (err) {
      ctx.logger.error(
        { err },
        "unable to send moderation feedback to perspective"
      );
    }
  };
}
