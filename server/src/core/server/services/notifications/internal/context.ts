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

import { GQLDSAReportDecisionLegality } from "coral-server/graph/schema/__generated__/types";

export enum NotificationType {
  COMMENT_FEATURED = "COMMENT_FEATURED",
  COMMENT_APPROVED = "COMMENT_APPROVED",
  COMMENT_REJECTED = "COMMENT_REJECTED",
  ILLEGAL_REJECTED = "ILLEGAL_REJECTED",
  DSA_REPORT_DECISION_MADE = "DSA_REPORT_DECISION_MADE",
}

export interface Legality {
  legality: GQLDSAReportDecisionLegality;
  grounds?: string;
  explanation?: string;
}

export interface CreateNotificationInput {
  targetUserID: string;
  type: NotificationType;

  comment?: Readonly<Comment> | null;
  report?: Readonly<DSAReport> | null;

  legal?: Legality;
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
    const { type, targetUserID, comment, report, legal } = input;

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
    } else if (
      type === NotificationType.DSA_REPORT_DECISION_MADE &&
      comment &&
      report
    ) {
      result.notification = await this.createDSAReportDecisionMadeNotification(
        lang,
        tenantID,
        targetUserID,
        comment,
        report,
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
    legal: Legality | undefined,
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

  private async createDSAReportDecisionMadeNotification(
    lang: LanguageCode,
    tenantID: string,
    targetUserID: string,
    comment: Readonly<Comment>,
    report: Readonly<DSAReport>,
    legal: Legality | undefined,
    now: Date
  ) {
    if (!legal) {
      this.log.warn(
        { reportID: report.id, commentID: comment.id, targetUserID },
        "attempted to notify of DSA report decision when legality was null or undefined"
      );
      return null;
    }

    let decision = "";
    let information: string | null = null;
    if (legal.legality === GQLDSAReportDecisionLegality.LEGAL) {
      decision = this.translatePhrase(
        lang,
        "notifications-dsaReportDecision-legal",
        `The report ${report.id} was determined to be legal.`,
        {
          reportID: report.id,
        }
      );
    }
    if (legal.legality === GQLDSAReportDecisionLegality.ILLEGAL) {
      decision = this.translatePhrase(
        lang,
        "notifications-dsaReportDecision-illegal",
        `The report ${report.id} was determined to be illegal.`,
        {
          reportID: report.id,
        }
      );
      information = this.translatePhrase(
        lang,
        "notifications-dsaReportDecision-legalInformation",
        `Grounds:
        <br/>
        ${legal.grounds}
        <br/>
        Explanation:
        <br/>
        ${legal.explanation}`,
        {
          grounds: legal.grounds,
          explanation: legal.explanation,
        }
      );
    }

    const body = this.translatePhrase(
      lang,
      information
        ? "notifications-dsaReportDecisionMade-body-withInfo"
        : "notifications-dsaReportDecisionMade-body-withoutInfo",
      information
        ? `${decision}
      <br/>
      ${information}`
        : `${decision}`,
      information
        ? {
            decision,
            information,
          }
        : {
            decision,
          }
    ).replace("\n", "<br/>");

    const notification = await createNotification(this.mongo, {
      id: uuid(),
      tenantID,
      createdAt: now,
      ownerID: targetUserID,
      title: this.translatePhrase(
        lang,
        "notifications-dsaReportDecisionMade-title",
        "A decision was made on your DSA report"
      ),
      body,
      commentID: comment.id,
      commentStatus: comment.status,
      reportID: report.id,
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
