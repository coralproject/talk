import { v4 as uuid } from "uuid";

import { MongoContext } from "coral-server/data/context";
import { Logger } from "coral-server/logger";
import { Comment } from "coral-server/models/comment";
import { DSAReport } from "coral-server/models/dsaReport/report";
import {
  createNotification,
  Notification,
} from "coral-server/models/notifications/notification";

export enum NotificationType {
  COMMENT_FEATURED = "COMMENT_FEATURED",
  COMMENT_APPROVED = "COMMENT_APPROVED",
  COMMENT_REJECTED = "COMMENT_REJECTED",
}

export interface CreateNotificationInput {
  targetUserID: string;
  type: NotificationType;

  comment?: Readonly<Comment>;
  report?: Readonly<DSAReport>;
}

interface CreationResult {
  notification: Notification | null;
  attempted: boolean;
}

export class InternalNotificationContext {
  private mongo: MongoContext;
  private log: Logger;

  constructor(mongo: MongoContext, log: Logger) {
    this.mongo = mongo;
    this.log = log;
  }

  public async create(tenantID: string, input: CreateNotificationInput) {
    const { type, targetUserID, comment } = input;

    const now = new Date();

    const result: CreationResult = {
      notification: null,
      attempted: false,
    };

    if (type === NotificationType.COMMENT_FEATURED && comment) {
      result.notification = await createNotification(this.mongo, {
        id: uuid(),
        tenantID,
        createdAt: now,
        ownerID: targetUserID,
        body: `comment ${comment.id} was featured.`,
      });
      result.attempted = true;
    } else if (type === NotificationType.COMMENT_APPROVED && comment) {
      result.notification = await createNotification(this.mongo, {
        id: uuid(),
        tenantID,
        createdAt: now,
        ownerID: targetUserID,
        body: `comment ${comment.id} was approved.`,
      });
      result.attempted = true;
    } else if (type === NotificationType.COMMENT_REJECTED && comment) {
      result.notification = await createNotification(this.mongo, {
        id: uuid(),
        tenantID,
        createdAt: now,
        ownerID: targetUserID,
        body: `comment ${comment.id} was rejected.`,
      });
      result.attempted = true;
    }

    if (!result.notification && result.attempted) {
      this.logCreateNotificationError(tenantID, input);
    }
  }

  private logCreateNotificationError(
    tenantID: string,
    input: CreateNotificationInput
  ) {
    this.log.error(
      {
        tenantID,
        userID: input.targetUserID,
        commentID: input.comment ? input.comment.id : null,
        reportID: input.report ? input.report.id : null,
        type: input.type,
      },
      "failed to create internal notification"
    );
  }
}
