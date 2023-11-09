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
import { retrieveUser } from "coral-server/models/user";
import { I18n, translate } from "coral-server/services/i18n";

export enum NotificationType {
  COMMENT_FEATURED = "COMMENT_FEATURED",
  COMMENT_APPROVED = "COMMENT_APPROVED",
  COMMENT_REJECTED = "COMMENT_REJECTED",
  ILLEGAL_REJECTED = "ILLEGAL_REJECTED",
}

export interface LegalExplanation {
  grounds?: string;
  explanation?: string;
}

export interface CreateNotificationInput {
  targetUserID: string;
  type: NotificationType;

  comment?: Readonly<Comment>;
  report?: Readonly<DSAReport>;

  legal?: LegalExplanation;
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
    const { type, targetUserID, comment, legal } = input;

    const existingUser = retrieveUser(this.mongo, tenantID, targetUserID);
    if (!existingUser) {
      this.log.warn(
        { userID: targetUserID },
        "attempted to create notification for user that does not exist, ignoring"
      );
      return;
    }

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
        title: this.translatePhrase(
          lang,
          "notifications-commentWasFeatured-title",
          "Comment was featured"
        ),
        body: this.translatePhrase(
          lang,
          "notifications-commentWasFeatured-body",
          `The comment ${comment.id} was featured.`,
          {
            commentID: comment.id,
          }
        ),
        commentID: comment.id,
        commentStatus: comment.status,
      });
      result.attempted = true;
    } else if (type === NotificationType.COMMENT_APPROVED && comment) {
      result.notification = await createNotification(this.mongo, {
        id: uuid(),
        tenantID,
        createdAt: now,
        ownerID: targetUserID,
        title: this.translatePhrase(
          lang,
          "notifications-commentWasApproved-title",
          "Comment was approved"
        ),
        body: this.translatePhrase(
          lang,
          "notifications-commentWasApproved-body",
          `The comment ${comment.id} was approved.`,
          {
            commentID: comment.id,
          }
        ),
        commentID: comment.id,
        commentStatus: comment.status,
      });
      result.attempted = true;
    } else if (type === NotificationType.COMMENT_REJECTED && comment) {
      result.notification = await createNotification(this.mongo, {
        id: uuid(),
        tenantID,
        createdAt: now,
        ownerID: targetUserID,
        title: this.translatePhrase(
          lang,
          "notifications-commentWasRejected-title",
          "Comment was rejected"
        ),
        body: this.translatePhrase(
          lang,
          "notifications-commentWasRejected-body",
          `The comment ${comment.id} was rejected.`,
          {
            commentID: comment.id,
          }
        ),
        commentID: comment.id,
        commentStatus: comment.status,
      });
      result.attempted = true;
    } else if (type === NotificationType.ILLEGAL_REJECTED && comment) {
      result.notification = await this.createIllegalRejectionNotification(
        lang,
        tenantID,
        targetUserID,
        comment,
        legal,
        now
      );
      result.attempted = true;
    }

    if (!result.notification && result.attempted) {
      this.logCreateNotificationError(tenantID, input);
    }
  }

  private async createIllegalRejectionNotification(
    lang: LanguageCode,
    tenantID: string,
    targetUserID: string,
    comment: Readonly<Comment>,
    legal: LegalExplanation | undefined,
    now: Date
  ) {
    const reason = legal
      ? this.translatePhrase(
          lang,
          "notifications-dsaIllegalRejectedReason-information",
          `Grounds:
          ${legal?.grounds}
          Explanation:
          ${legal?.explanation}`,
          {
            grounds: legal.grounds,
            explanation: legal.explanation,
          }
        )
      : this.translatePhrase(
          lang,
          "notifications-dsaIllegalRejectedReason-informationNotFound",
          "The reasoning for this decision cannot be found."
        );

    const body = this.translatePhrase(
      lang,
      "notifications-commentWasRejectedAndIllegal-body",
      `The comment ${comment.id} was rejected for containing illegal content.
      The reason of which was: ${reason}
      `,
      {
        commentID: comment.id,
        reason,
      }
    ).replace("\n", "<br/>");

    const notification = await createNotification(this.mongo, {
      id: uuid(),
      tenantID,
      createdAt: now,
      ownerID: targetUserID,
      title: this.translatePhrase(
        lang,
        "notifications-commentWasRejectedAndIllegal-title",
        "Comment was deemed to contain illegal content and was rejected"
      ),
      body,
      commentID: comment.id,
      commentStatus: comment.status,
    });

    return notification;
  }

  private translatePhrase(
    lang: LanguageCode,
    key: string,
    text: string,
    args?: object | undefined
  ) {
    const bundle = this.i18n.getBundle(lang);

    const result = translate(bundle, text, key, args);

    // eslint-disable-next-line no-console
    console.log(result, args);

    return result;
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
