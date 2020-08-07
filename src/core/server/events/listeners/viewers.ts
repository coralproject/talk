import { touchStoryViewer } from "coral-server/models/story/viewers";

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
  > = ({ clientID, mongo, now }) => async () => {
    if (!clientID) {
      return;
    }

    // NOTE: (wyattjoh) maybe replace this with the create instead?
    await touchStoryViewer(mongo, clientID, now);
  };
}
