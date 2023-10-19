import { MongoContext } from "coral-server/data/context";

import { ConnectionInput, Query, resolveConnection } from "../helpers";
import { TenantResource } from "../tenant";

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
  const query = new Query(mongo.notifications()).where({ tenantID });

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
