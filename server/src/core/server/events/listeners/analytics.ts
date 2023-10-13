import Analytics, { Event } from "@rudderstack/rudder-sdk-node";

import { Config } from "coral-server/config";
import GraphContext from "coral-server/graph/context";
import { relativeTo } from "coral-server/helpers";
import logger from "coral-server/logger";

import { GQLCOMMENT_STATUS } from "coral-server/graph/schema/__generated__/types";

import {
  CommentCreatedCoralEventPayload,
  CommentFlagCreatedCoralEventPayload,
  CommentReactionCreatedCoralEventPayload,
  CommentReplyCreatedCoralEventPayload,
  CommentStatusUpdatedCoralEventPayload,
  StoryCreatedCoralEventPayload,
} from "../events";
import { CoralEventListener, CoralEventPublisherFactory } from "../publisher";
import { CoralEventType } from "../types";

type AnalyticsCoralEventListenerPayloads =
  | CommentStatusUpdatedCoralEventPayload
  | CommentCreatedCoralEventPayload
  | CommentReplyCreatedCoralEventPayload
  | CommentReactionCreatedCoralEventPayload
  | CommentFlagCreatedCoralEventPayload
  | StoryCreatedCoralEventPayload;

export class AnalyticsCoralEventListener
  implements CoralEventListener<AnalyticsCoralEventListenerPayloads>
{
  public readonly name = "analytics";
  public readonly events = [
    CoralEventType.COMMENT_CREATED,
    CoralEventType.COMMENT_REPLY_CREATED,
    CoralEventType.COMMENT_STATUS_UPDATED,
    CoralEventType.COMMENT_REACTION_CREATED,
    CoralEventType.COMMENT_FLAG_CREATED,
    CoralEventType.STORY_CREATED,
  ];

  public readonly disabled: boolean = false;
  private readonly analytics: Analytics;

  constructor(config: Config) {
    const key = config.get("analytics_backend_key");
    const url = config.get("analytics_data_plane_url");
    if (!key || !url) {
      this.disabled = true;

      return;
    }

    this.analytics = new Analytics(key, relativeTo("/v1/batch", url));
  }

  private track(event: Event) {
    return new Promise((resolve, reject) => {
      this.analytics.track(event, (err) => {
        if (err) {
          return reject(err);
        }

        return resolve();
      });
    });
  }

  private filter(event: AnalyticsCoralEventListenerPayloads): boolean {
    switch (event.type) {
      case CoralEventType.COMMENT_CREATED:
      case CoralEventType.COMMENT_REPLY_CREATED:
      case CoralEventType.COMMENT_REACTION_CREATED:
      case CoralEventType.COMMENT_FLAG_CREATED:
      case CoralEventType.STORY_CREATED:
        return true;
      case CoralEventType.COMMENT_STATUS_UPDATED:
        // We only record when a comment has been rejected/approved.
        if (
          event.data.newStatus !== GQLCOMMENT_STATUS.APPROVED &&
          event.data.newStatus !== GQLCOMMENT_STATUS.REJECTED
        ) {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  private async create(
    ctx: GraphContext,
    event: AnalyticsCoralEventListenerPayloads
  ): Promise<Pick<Event, "event" | "properties"> | undefined> {
    switch (event.type) {
      case CoralEventType.COMMENT_CREATED:
      case CoralEventType.COMMENT_REPLY_CREATED: {
        const [comment, story] = await Promise.all([
          ctx.loaders.Comments.comment.load(event.data.commentID),
          ctx.loaders.Stories.story.load(event.data.storyID),
        ]);
        if (!comment || !story || !comment.authorID) {
          return;
        }

        return {
          event: "Comment Created",
          properties: {
            siteID: comment.siteID,
            storyID: comment.storyID,
            storyURL: story.url,
            commentID: comment.id,
            commentStatus: comment.status,
            commentIsReply: !!comment.parentID,
            commentAuthorID: comment.authorID,
          },
        };
      }

      case CoralEventType.STORY_CREATED: {
        return {
          event: "Story Created",
          properties: {
            siteID: event.data.siteID,
            storyID: event.data.storyID,
            storyURL: event.data.storyURL,
          },
        };
      }

      case CoralEventType.COMMENT_REACTION_CREATED: {
        const story = await ctx.loaders.Stories.story.load(event.data.storyID);
        if (!story) {
          return;
        }

        return {
          event: "Comment Reaction Created",
          properties: {
            siteID: story.siteID,
            storyID: story.id,
            storyURL: story.url,
            commentID: event.data.commentID,
            commentIsReply: !!event.data.commentParentID,
            actionUserID: event.data.actionUserID,
          },
        };
      }

      case CoralEventType.COMMENT_FLAG_CREATED: {
        const story = await ctx.loaders.Stories.story.load(event.data.storyID);
        if (!story) {
          return;
        }

        return {
          event: "User Flagged Comment",
          properties: {
            siteID: story.siteID,
            storyID: story.id,
            storyURL: story.url,
            commentID: event.data.commentID,
            commentIsReply: !!event.data.commentParentID,
            actionUserID: event.data.actionUserID,
            flagReason: event.data.flagReason,
          },
        };
      }

      case CoralEventType.COMMENT_STATUS_UPDATED: {
        const story = await ctx.loaders.Stories.story.load(event.data.storyID);
        if (!story) {
          return;
        }

        return {
          event: "Comment Moderated",
          properties: {
            siteID: story.siteID,
            storyID: story.id,
            storyURL: story.url,
            commentID: event.data.commentID,
            commentStatus: event.data.newStatus,
            commentPreviousStatus: event.data.oldStatus,
          },
        };
      }
    }
  }

  public initialize: CoralEventPublisherFactory<AnalyticsCoralEventListenerPayloads> =
    (ctx) => async (event) => {
      // Check to see if we should process this event.
      if (!this.filter(event)) {
        // The event should not be processed.
        return;
      }

      // Create the event payload.
      const details = await this.create(ctx, event);
      if (!details) {
        return;
      }

      // Pull some properties out of the context.
      const {
        id,
        user,
        tenant: { id: tenantID, domain: tenantDomain },
      } = ctx;

      // Assemble the track payload.
      const payload: Event = {
        event: details.event,
        properties: {
          ...details.properties,
          tenantID,
          tenantDomain,
        },
        timestamp: event.createdAt,
      };

      if (user) {
        // If the user is available, attach it as the userId.
        payload.userId = user.id;
      } else {
        // Otherwise use the traceID of the request as the anonomousId.
        payload.anonymousId = id;
      }

      logger.debug({ payload }, "sending analytics event");

      // Send the event payload to analytics. We don't await on the event to be
      // sent because the analytics event system will batch these operations
      // and may not send them for a few seconds (we can't make the user wait that
      // long).
      this.track(payload)
        .then(() => {
          logger.debug({ payload }, "analytics event sent");
        })
        .catch((err) => {
          logger.error({ err, payload }, "could not send analytics event");
        });
    };
}
