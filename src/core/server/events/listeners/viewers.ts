import { createStoryViewer } from "coral-server/models/story/viewers";
import { hasFeatureFlag } from "coral-server/models/tenant";

import { GQLFEATURE_FLAG } from "coral-server/graph/schema/__generated__/types";

import {
  CommentCreatedCoralEventPayload,
  CommentReactionCreatedCoralEventPayload,
  CommentReplyCreatedCoralEventPayload,
} from "../events";
import { CoralEventListener, CoralEventPublisherFactory } from "../publisher";
import { CoralEventType } from "../types";

type ViewersCoralEventListenerPayloads =
  | CommentReplyCreatedCoralEventPayload
  | CommentCreatedCoralEventPayload
  | CommentReactionCreatedCoralEventPayload;

export class ViewersCoralEventListener
  implements CoralEventListener<ViewersCoralEventListenerPayloads> {
  public readonly name = "viewers";
  public readonly events = [
    CoralEventType.COMMENT_REPLY_CREATED,
    CoralEventType.COMMENT_CREATED,
    CoralEventType.COMMENT_REACTION_CREATED,
  ];

  public initialize: CoralEventPublisherFactory<
    ViewersCoralEventListenerPayloads
  > = ({ clientID, redis, tenant, config }) => async ({ data }) => {
    if (!clientID) {
      return;
    }

    // If the feature flag isn't enabled, then we have nothing to do!
    if (!hasFeatureFlag(tenant, GQLFEATURE_FLAG.VIEWER_COUNT)) {
      return;
    }

    await createStoryViewer(
      redis,
      {
        tenantID: tenant.id,
        siteID: data.siteID,
        storyID: data.storyID,
      },
      clientID,
      config.get("story_viewer_timeout")
    );
  };
}
