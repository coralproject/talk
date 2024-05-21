import Context from "coral-server/graph/context";
import {
  hasNewNotifications,
  NotificationsConnectionInput,
  retrieveNotificationsConnection,
} from "coral-server/models/notifications/notification";

export default (ctx: Context) => ({
  connection: async ({
    ownerID,
    first,
    after,
  }: NotificationsConnectionInput) => {
    return await retrieveNotificationsConnection(ctx.mongo, ctx.tenant.id, {
      ownerID,
      first,
      after,
    });
  },
  hasNewNotifications: async (ownerID: string, lastSeen: Date) => {
    return hasNewNotifications(ctx.tenant.id, ctx.mongo, ownerID, lastSeen);
  },
});
