import { SUBSCRIPTION_INPUT } from "coral-server/graph/tenant/resolvers/Subscription/types";
import { NotificationCategory } from "coral-server/services/notifications/categories";
import NotificationContext from "coral-server/services/notifications/context";
import { Notification } from "coral-server/services/notifications/notification";

import logger from "coral-server/logger";
import { MailerQueue } from "../mailer";
import { Template } from "../mailer/templates";
import { CategoryNotification } from "./processor";

/**
 * filterSuperseded will filter all the possible notifications and only send
 * those notifications that are not superseded by another type of notification.
 */
export const filterSuperseded = (
  {
    category: { name },
    notification: { userID: destinationUserID },
  }: CategoryNotification,
  index: number,
  notifications: CategoryNotification[]
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
        supersededCategory => supersededCategory === name
      )
  );

export const handleHandlers = async (
  ctx: NotificationContext,
  categories: NotificationCategory[],
  input: SUBSCRIPTION_INPUT
): Promise<CategoryNotification[]> => {
  const notifications: Array<CategoryNotification | null> = await Promise.all(
    categories.map(async category => {
      const notification = await category.process(ctx, input.payload);
      if (!notification) {
        return null;
      }

      return { category, notification };
    })
  );

  // Filter out the categories that don't have notifications.
  return notifications.filter(
    notification => notification !== null
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
  const userNotifications: Record<string, Template[]> = {};
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

    // TODO: (wyattjoh) determine if the user wants their notifications digested

    for (const template of templates) {
      // Add notification for user.
      mailer.add({
        tenantID: ctx.tenant.id,
        message: {
          to: user.email!,
        },
        template,
      });
    }
  }
};
