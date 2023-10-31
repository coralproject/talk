import { MongoContext } from "coral-server/data/context";

import { ConnectionInput, Query, resolveConnection } from "../helpers";
import { TenantResource } from "../tenant";
import { User } from "../user";

export interface Notification extends TenantResource {
  readonly id: string;

  readonly tenantID: string;

  createdAt: Date;

  ownerID: string;

  reportID?: string;
  commentID?: string;

  title?: string;
  body?: string;
}

type BaseConnectionInput = ConnectionInput<Notification>;

export interface NotificationsConnectionInput extends BaseConnectionInput {
  ownerID: string;
}

export const retrieveNotificationsConnection = async (
  mongo: MongoContext,
  tenantID: string,
  input: NotificationsConnectionInput
) => {
  const query = new Query(mongo.notifications()).where({
    tenantID,
    ownerID: input.ownerID,
  });

  query.orderBy({ createdAt: -1 });

  if (input.after) {
    query.where({ createdAt: { $lt: input.after as Date } });
  }

  return resolveConnection(query, input, (n) => n.createdAt);
};

export const createNotification = async (
  mongo: MongoContext,
  notification: Notification
) => {
  const op = await mongo.notifications().insertOne(notification);

  return op.result.ok ? notification : null;
};

interface LastSeenNotificationChange {
  $set: {
    lastSeenNotificationDate?: Date | null;
  };
}

export const markLastSeenNotification = async (
  tenantID: string,
  mongo: MongoContext,
  user: Readonly<User>,
  notificationDates: Date[]
) => {
  if (!notificationDates || notificationDates.length === 0) {
    return;
  }

  let max = new Date(0);
  for (const date of notificationDates) {
    if (max.getTime() < date.getTime()) {
      max = date;
    }
  }

  const change: LastSeenNotificationChange = {
    $set: { lastSeenNotificationDate: user.lastSeenNotificationDate },
  };

  if (
    user.lastSeenNotificationDate &&
    user.lastSeenNotificationDate.getTime() < max.getTime()
  ) {
    change.$set.lastSeenNotificationDate = max;
  } else if (
    user.lastSeenNotificationDate === null ||
    user.lastSeenNotificationDate === undefined
  ) {
    change.$set.lastSeenNotificationDate = max;
  }

  await mongo.users().findOneAndUpdate({ tenantID, id: user.id }, change);
};

export const hasNewNotifications = async (
  tenantID: string,
  mongo: MongoContext,
  ownerID: string,
  lastSeen: Date
) => {
  const exists = await mongo
    .notifications()
    .findOne({ tenantID, ownerID, createdAt: { $gt: lastSeen } });

  return exists !== null;
};
