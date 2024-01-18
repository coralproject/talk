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
import { I18n } from "coral-server/services/i18n";

import {
  GQLDSAReportDecisionLegality,
  GQLNOTIFICATION_TYPE,
  GQLREJECTION_REASON_CODE,
} from "coral-server/graph/schema/__generated__/types";
import { AugmentedRedis } from "coral-server/services/redis";

export interface DSALegality {
  legality: GQLDSAReportDecisionLegality;
  grounds?: string;
  explanation?: string;
}

export interface RejectionReasonInput {
  code: GQLREJECTION_REASON_CODE;
  legalGrounds?: string | undefined;
  detailedExplanation?: string | undefined;
  customReason?: string | undefined;
}

export interface CreateNotificationInput {
  targetUserID: string;
  type: GQLNOTIFICATION_TYPE;

  comment?: Readonly<Comment> | null;
  reply?: Readonly<Comment> | null;

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
  private redis: AugmentedRedis;
  private log: Logger;
  // private i18n: I18n;

  constructor(
    mongo: MongoContext,
    redis: AugmentedRedis,
    i18n: I18n,
    log: Logger
  ) {
    this.mongo = mongo;
    this.redis = redis;
    // this.i18n = i18n;
    this.log = log;
  }

  public async create(
    tenantID: string,
    lang: LanguageCode,
    input: CreateNotificationInput
  ) {
    const {
      type,
      targetUserID,
      comment,
      reply,
      rejectionReason,
      report,
      legal,
    } = input;

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

    /*
      For the time being, we are not doing approved and featured
      comment notifications.
    */
    if (type === GQLNOTIFICATION_TYPE.COMMENT_FEATURED && comment) {
      result.notification = await this.createFeatureCommentNotification(
        tenantID,
        type,
        targetUserID,
        comment,
        now
      );
      result.attempted = true;
    } else if (type === GQLNOTIFICATION_TYPE.COMMENT_REJECTED && comment) {
      result.notification = await this.createRejectCommentNotification(
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
        tenantID,
        type,
        targetUserID,
        comment,
        report,
        legal,
        now
      );
      result.attempted = true;
    } else if (type === GQLNOTIFICATION_TYPE.REPLY && comment && reply) {
      result.notification = await this.createCommentReplyNotification(
        tenantID,
        type,
        targetUserID,
        comment,
        reply,
        now
      );
      result.attempted = true;
    }

    if (!result.notification && result.attempted) {
      this.logCreateNotificationError(tenantID, input);
    }

    await this.incrementCountForUser(tenantID, targetUserID);
  }

  public async incrementCountForUser(tenantID: string, userID: string) {
    const key = this.computeCountKey(tenantID, userID);
    await this.redis.incr(key);
  }

  public async retrieveCount(tenantID: string, userID: string) {
    const key = this.computeCountKey(tenantID, userID);

    const countStr = await this.redis.get(key);
    if (!countStr) {
      return 0;
    }

    try {
      return parseInt(countStr, 10);
    } catch {
      this.log.warn({ userID, key }, `unable to parse notification count`);
      return 0;
    }
  }

  private computeCountKey(tenantID: string, userID: string) {
    return `${tenantID}:${userID}:notifications:count`;
  }

  private async createRejectCommentNotification(
    tenantID: string,
    type: GQLNOTIFICATION_TYPE,
    targetUserID: string,
    comment: Readonly<Comment>,
    rejectionReason?: RejectionReasonInput | null,
    now = new Date()
  ) {
    const notification = await createNotification(this.mongo, {
      id: uuid(),
      tenantID,
      type,
      createdAt: now,
      ownerID: targetUserID,
      commentID: comment.id,
      commentStatus: comment.status,
      rejectionReason: rejectionReason?.code ?? undefined,
      customReason: rejectionReason?.customReason ?? undefined,
      decisionDetails: {
        explanation: rejectionReason?.detailedExplanation ?? undefined,
      },
    });

    return notification;
  }

  private async createFeatureCommentNotification(
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
      commentID: comment.id,
      commentStatus: comment.status,
    });

    return notification;
  }

  private async createCommentReplyNotification(
    tenantID: string,
    type: GQLNOTIFICATION_TYPE,
    targetUserID: string,
    comment: Readonly<Comment>,
    reply: Readonly<Comment>,
    now: Date
  ) {
    const notification = await createNotification(this.mongo, {
      id: uuid(),
      tenantID,
      type,
      createdAt: now,
      ownerID: targetUserID,
      commentID: comment.id,
      replyID: reply.id,
      commentStatus: comment.status,
    });

    return notification;
  }

  private async createIllegalRejectionNotification(
    tenantID: string,
    type: GQLNOTIFICATION_TYPE,
    targetUserID: string,
    comment: Readonly<Comment>,
    legal: DSALegality | undefined,
    now: Date
  ) {
    const notification = await createNotification(this.mongo, {
      id: uuid(),
      tenantID,
      type,
      createdAt: now,
      ownerID: targetUserID,
      commentID: comment.id,
      commentStatus: comment.status,
      rejectionReason: GQLREJECTION_REASON_CODE.ILLEGAL_CONTENT,
      decisionDetails: {
        legality: legal ? legal.legality : undefined,
        grounds: legal ? legal.grounds : undefined,
        explanation: legal ? legal.explanation : undefined,
      },
    });

    return notification;
  }

  private async createDSAReportDecisionMadeNotification(
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

    const notification = await createNotification(this.mongo, {
      id: uuid(),
      tenantID,
      type,
      createdAt: now,
      ownerID: targetUserID,
      commentID: comment.id,
      commentStatus: comment.status,
      reportID: report.id,
      decisionDetails: {
        legality: legal.legality,
        grounds: legal.grounds,
        explanation: legal.explanation,
      },
    });

    return notification;
  }

  // private translatePhrase(
  //   lang: LanguageCode,
  //   key: string,
  //   text: string,
  //   args?: object | undefined
  // ) {
  //   const bundle = this.i18n.getBundle(lang);
  //   const result = translate(bundle, text, key, args);

  //   return result;
  // }

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
