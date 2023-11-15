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

import {
  GQLDSAReportDecisionLegality,
  GQLNOTIFICATION_TYPE,
  GQLREJECTION_REASON_CODE,
} from "coral-server/graph/schema/__generated__/types";

export interface DSALegality {
  legality: GQLDSAReportDecisionLegality;
  grounds?: string;
  explanation?: string;
}

export interface RejectionReasonInput {
  code: GQLREJECTION_REASON_CODE;
  legalGrounds?: string | undefined;
  detailedExplanation?: string | undefined;
}

export interface CreateNotificationInput {
  targetUserID: string;
  type: GQLNOTIFICATION_TYPE;

  comment?: Readonly<Comment> | null;
  rejectionReason?: RejectionReasonInput | null;

  report?: Readonly<DSAReport> | null;

  legal?: DSALegality;
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
    const { type, targetUserID, comment, rejectionReason, report, legal } =
      input;

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

    if (type === GQLNOTIFICATION_TYPE.COMMENT_FEATURED && comment) {
      result.notification = await this.createFeatureCommentNotification(
        lang,
        tenantID,
        type,
        targetUserID,
        comment,
        now
      );
      result.attempted = true;
    } else if (type === GQLNOTIFICATION_TYPE.COMMENT_APPROVED && comment) {
      result.notification = await this.createApproveCommentNotification(
        lang,
        tenantID,
        type,
        targetUserID,
        comment,
        now
      );
      result.attempted = true;
    } else if (type === GQLNOTIFICATION_TYPE.COMMENT_REJECTED && comment) {
      result.notification = await this.createRejectCommentNotification(
        lang,
        tenantID,
        type,
        targetUserID,
        comment,
        rejectionReason,
        now
      );
      result.attempted = true;
    } else if (type === GQLNOTIFICATION_TYPE.ILLEGAL_REJECTED && comment) {
      result.notification = await this.createIllegalRejectionNotification(
        lang,
        tenantID,
        type,
        targetUserID,
        comment,
        legal,
        now
      );
      result.attempted = true;
    } else if (
      type === GQLNOTIFICATION_TYPE.DSA_REPORT_DECISION_MADE &&
      comment &&
      report
    ) {
      result.notification = await this.createDSAReportDecisionMadeNotification(
        lang,
        tenantID,
        type,
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

  private async createRejectCommentNotification(
    lang: LanguageCode,
    tenantID: string,
    type: GQLNOTIFICATION_TYPE,
    targetUserID: string,
    comment: Readonly<Comment>,
    rejectionReason?: RejectionReasonInput | null,
    now = new Date()
  ) {
    const reason = this.translateReasonForRemval(
      lang,
      rejectionReason ? rejectionReason.code : null
    );

    const explanation =
      rejectionReason && rejectionReason.detailedExplanation
        ? rejectionReason.detailedExplanation
        : "";

    const details = this.translatePhrase(
      lang,
      "notifications-commentRejected-details-general",
      `<b>REASON FOR REMOVAL</b><br/>
      ${reason}<br/>
      <b>ADDITIONAL EXPLANATION</b><br/>
      ${explanation}`,
      {
        reason,
        explanation,
      }
    );

    const body = this.translatePhrase(
      lang,
      "notifications-commentRejected-description",
      `Our moderators have reviewed your comment and determined your comment contains content that violates our community guidelines or terms of service.
      <br/>
      <br/>
      ${details}`,
      {
        details,
      }
    ).replace("\n", "<br/>");

    const notification = await createNotification(this.mongo, {
      id: uuid(),
      tenantID,
      type,
      createdAt: now,
      ownerID: targetUserID,
      title: this.translatePhrase(
        lang,
        "notifications-commentRejected-title",
        "Your comment has been rejected and removed from our site"
      ),
      body,
      commentID: comment.id,
      commentStatus: comment.status,
    });

    return notification;
  }

  private async createFeatureCommentNotification(
    lang: LanguageCode,
    tenantID: string,
    type: GQLNOTIFICATION_TYPE,
    targetUserID: string,
    comment: Readonly<Comment>,
    now: Date
  ) {
    const notification = await createNotification(this.mongo, {
      id: uuid(),
      tenantID,
      type,
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

    return notification;
  }

  private async createApproveCommentNotification(
    lang: LanguageCode,
    tenantID: string,
    type: GQLNOTIFICATION_TYPE,
    targetUserID: string,
    comment: Readonly<Comment>,
    now: Date
  ) {
    const notification = await createNotification(this.mongo, {
      id: uuid(),
      tenantID,
      type,
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

    return notification;
  }

  private async createIllegalRejectionNotification(
    lang: LanguageCode,
    tenantID: string,
    type: GQLNOTIFICATION_TYPE,
    targetUserID: string,
    comment: Readonly<Comment>,
    legal: DSALegality | undefined,
    now: Date
  ) {
    const title = this.translatePhrase(
      lang,
      "notifications-commentRejected-title",
      "Your comment has been rejected and removed from our site"
    );

    const reasonForRemoval = this.translateReasonForRemval(
      lang,
      GQLREJECTION_REASON_CODE.ILLEGAL_CONTENT
    );

    const details = legal
      ? this.translatePhrase(
          lang,
          "notifications-commentRejected-details-illegalContent",
          `<b>REASON FOR REMOVAL</b><br/>
        ${reasonForRemoval}<br/>
        <b>LEGAL GROUNDS</b><br/>
        ${legal.grounds}<br/>
        <b>ADDITIONAL EXPLANATION</b><br/>
        ${legal.explanation}`,
          {
            reason: reasonForRemoval,
            grounds: legal.grounds ?? "",
            explanation: legal.explanation ?? "",
          }
        )
      : this.translatePhrase(
          lang,
          "notifications-commentRejected-details-notFound",
          "Details for this rejection cannot be found."
        );

    const description = this.translatePhrase(
      lang,
      "notifications-commentRejected-description",
      `Our moderators have reviewed your comment determined your comment contains
      violates our community guidelines or terms of service.<br/>
      <br/>
      ${details}`,
      {
        details,
      }
    ).replace("\n", "<br/>");

    const notification = await createNotification(this.mongo, {
      id: uuid(),
      tenantID,
      type,
      createdAt: now,
      ownerID: targetUserID,
      title,
      body: description,
      commentID: comment.id,
      commentStatus: comment.status,
    });

    return notification;
  }

  private async createDSAReportDecisionMadeNotification(
    lang: LanguageCode,
    tenantID: string,
    type: GQLNOTIFICATION_TYPE,
    targetUserID: string,
    comment: Readonly<Comment>,
    report: Readonly<DSAReport>,
    legal: DSALegality | undefined,
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
    if (legal.legality === GQLDSAReportDecisionLegality.LEGAL) {
      decision = this.translatePhrase(
        lang,
        "notifications-illegalContentReportReviewed-decision-legal",
        `does not appear to contain illegal content`
      );
    }
    if (legal.legality === GQLDSAReportDecisionLegality.ILLEGAL) {
      decision = this.translatePhrase(
        lang,
        "notifications-illegalContentReportReviewed-decision-illegal",
        `does contain illegal content`
      );
    }

    const commentAuthor = comment.authorID
      ? await retrieveUser(this.mongo, tenantID, comment.authorID)
      : null;

    const body = this.translatePhrase(
      lang,
      "notifications-illegalContentReportReviewed-description",
      `On ${report.createdAt.toDateString()} you reported a comment written by { $author } for
      containing illegal content. After reviewing your report, our moderation
      team has decided this comment { $decision }.`,
      {
        date: report.createdAt.toDateString(),
        author:
          commentAuthor && commentAuthor.username ? commentAuthor.username : "",
        decision,
      }
    ).replace("\n", "<br/>");

    const notification = await createNotification(this.mongo, {
      id: uuid(),
      tenantID,
      type,
      createdAt: now,
      ownerID: targetUserID,
      title: this.translatePhrase(
        lang,
        "notifications-illegalContentReportReviewed-title",
        "Your illegal content report has been reviewed"
      ),
      body,
      commentID: comment.id,
      commentStatus: comment.status,
      reportID: report.id,
    });

    return notification;
  }

  private translateReasonForRemval(
    lang: LanguageCode,
    code: GQLREJECTION_REASON_CODE | null
  ) {
    if (code === GQLREJECTION_REASON_CODE.OFFENSIVE) {
      return this.translatePhrase(
        lang,
        "notification-reasonForRemoval-offensive",
        "Offensive"
      );
    }
    if (code === GQLREJECTION_REASON_CODE.ABUSIVE) {
      return this.translatePhrase(
        lang,
        "notification-reasonForRemoval-abusive",
        "Abusive"
      );
    }
    if (code === GQLREJECTION_REASON_CODE.SPAM) {
      return this.translatePhrase(
        lang,
        "notification-reasonForRemoval-spam",
        "Spam"
      );
    }
    if (code === GQLREJECTION_REASON_CODE.BANNED_WORD) {
      return this.translatePhrase(
        lang,
        "notification-reasonForRemoval-bannedWord",
        "Banned word"
      );
    }
    if (code === GQLREJECTION_REASON_CODE.AD) {
      return this.translatePhrase(
        lang,
        "notification-reasonForRemoval-ad",
        "Ad"
      );
    }
    if (code === GQLREJECTION_REASON_CODE.OTHER) {
      return this.translatePhrase(
        lang,
        "notification-reasonForRemoval-other",
        "Other"
      );
    }
    if (code === GQLREJECTION_REASON_CODE.ILLEGAL_CONTENT) {
      return this.translatePhrase(
        lang,
        "notification-reasonForRemoval-illegal",
        "Illegal content"
      );
    }

    return this.translatePhrase(
      lang,
      "notification-reasonForRemoval-unknown",
      "Unknown"
    );
  }

  private translatePhrase(
    lang: LanguageCode,
    key: string,
    text: string,
    args?: object | undefined
  ) {
    const bundle = this.i18n.getBundle(lang);
    const result = translate(bundle, text, key, args);

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
