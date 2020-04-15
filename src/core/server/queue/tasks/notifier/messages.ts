import { CoralEventPayload } from "coral-server/events/event";
import logger from "coral-server/logger";
import { NotificationCategory } from "coral-server/services/notifications/categories";
import NotificationContext from "coral-server/services/notifications/context";
import { Notification } from "coral-server/services/notifications/notification";

import { GQLDIGEST_FREQUENCY } from "coral-server/graph/schema/__generated__/types";

import { MailerQueue } from "../mailer";
import { DigestibleTemplate } from "../mailer/templates";
import { CategoryNotification } from "./processor";

/**
 * SupersededNotification is a subset of `CategoryNotification` to provide a
 * minimal implementation.
 */
export interface SupersededNotification {
  category: Pick<
    CategoryNotification["category"],
    "name" | "supersedesCategories"
  >;
  notification: Pick<CategoryNotification["notification"], "userID">;
}

/**
 * filterSuperseded will filter all the possible notifications and only send
 * those notifications that are not superseded by another type of notification.
 */
export const filterSuperseded = (
  {
    category: { name },
    notification: { userID: destinationUserID },
  }: SupersededNotification,
  index: number,
  notifications: SupersededNotification[]
) =>
  !notifications.some(
    ({
      category: { supersedesCategories = [] },
      notification: { userID: notificationUserID },
    }) =>
      // Only allow notifications to supersede another notification if that
      // notification is also destined for the same user.
      notificationUserID === destinationUserID &&
      // If another notification that is destined for the same user also exists
      // and declares that it supersedes this one, return true so we can filter
      // this one from the list.
      supersedesCategories.some(
        (supersededCategory) => supersededCategory === name
      )
  );

export const handleHandlers = async (
  ctx: NotificationContext,
  categories: NotificationCategory[],
  payload: CoralEventPayload
): Promise<CategoryNotification[]> => {
  const notifications: Array<CategoryNotification | null> = await Promise.all(
    categories.map(async (category) => {
      const notification = await category.process(ctx, payload);
      if (!notification) {
        return null;
      }

      return { category, notification };
    })
  );

  // Filter out the categories that don't have notifications.
  return notifications.filter(
    (notification) => notification !== null
  ) as CategoryNotification[];
};

/**
 * processNewNotifications will handle notifications that are collected after
 * an event hook. These notifications will be batched by user and optionally
 * queued for digesting or sent immediately depending on the user's settings.
 */
export const processNewNotifications = async (
  ctx: NotificationContext,
  notifications: Notification[],
  mailer: MailerQueue
) => {
  // Group all the notifications by user.
  const userNotifications: Record<string, DigestibleTemplate[]> = {};
  for (const { userID, template } of notifications) {
    if (userID in userNotifications) {
      userNotifications[userID].push(template);
    } else {
      userNotifications[userID] = [template];
    }
  }

  // Load all the user's profiles into the context.
  await ctx.users.loadMany(Object.keys(userNotifications));

  // Send all the notifications for each user.
  for (const [userID, templates] of Object.entries(userNotifications)) {
    // Get the user from the context (which should have been already loaded from
    // before).
    const user = await ctx.users.load(userID);
    if (!user) {
      logger.warn(
        { userID },
        "attempted notification for user that wasn't found"
      );
      continue;
    }

    if (user.notifications.digestFrequency === GQLDIGEST_FREQUENCY.NONE) {
      // Send the notifications for the user now, they don't have digesting
      // enabled.
      for (const template of templates) {
        await mailer.add({
          tenantID: ctx.tenant.id,
          message: {
            to: user.email!,
          },
          template,
        });
      }
    } else {
      // Queue up the notifications to be sent in the next user's digest.
      await ctx.addDigests(user.id, templates);
    }
  }
};
