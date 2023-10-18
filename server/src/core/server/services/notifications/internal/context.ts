import { v4 as uuid } from "uuid";

import { LanguageCode } from "coral-common/common/lib/helpers";
import { MongoContext } from "coral-server/data/context";
import { Logger } from "coral-server/logger";
import { Comment } from "coral-server/models/comment";
import { DSAReport } from "coral-server/models/dsaReport/report";
import {
  createNotification,
  Notification,
} from "coral-server/models/notifications/notification";
import { I18n, translate } from "coral-server/services/i18n";

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
  private i18n: I18n;

  constructor(mongo: MongoContext, i18n: I18n, log: Logger) {
    this.mongo = mongo;
    this.i18n = i18n;
    this.log = log;
  }

  public async create(
    tenantID: string,
    lang: LanguageCode,
    input: CreateNotificationInput
  ) {
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
        body: this.translatePhrase(
          lang,
          "notifications-commentWasFeatured",
          "Comment was featured"
        ),
        commentID: comment.id,
      });
      result.attempted = true;
    } else if (type === NotificationType.COMMENT_APPROVED && comment) {
      result.notification = await createNotification(this.mongo, {
        id: uuid(),
        tenantID,
        createdAt: now,
        ownerID: targetUserID,
        body: this.translatePhrase(
          lang,
          "notifications-commentWasApproved",
          "Comment was approved"
        ),
        commentID: comment.id,
      });
      result.attempted = true;
    } else if (type === NotificationType.COMMENT_REJECTED && comment) {
      result.notification = await createNotification(this.mongo, {
        id: uuid(),
        tenantID,
        createdAt: now,
        ownerID: targetUserID,
        body: this.translatePhrase(
          lang,
          "notifications-commentWasRejected",
          "Comment was rejected"
        ),
        commentID: comment.id,
      });
      result.attempted = true;
    }

    if (!result.notification && result.attempted) {
      this.logCreateNotificationError(tenantID, input);
    }
  }

  private translatePhrase(lang: LanguageCode, key: string, text: string) {
    const bundle = this.i18n.getBundle(lang);
    return translate(bundle, text, key);
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
