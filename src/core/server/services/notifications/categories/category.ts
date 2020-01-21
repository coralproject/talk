import {
  SUBSCRIPTION_CHANNELS,
  SUBSCRIPTION_INPUT,
} from "coral-server/graph/resolvers/Subscription/types";

import NotificationContext from "../context";
import { Notification } from "../notification";

/**
 * NotificationCategory define the Category that is used to define a
 * Notification type.
 */
export interface NotificationCategory {
  /**
   * name is the actual name of the notification that can be used to define the
   * other category names that are superseded by this one.
   */
  name: string;

  /**
   * process is the actual job processor. It accepts a input payload of the
   * correct type and context to create the actual Notification to send.
   */
  process: (
    ctx: NotificationContext,
    input: SUBSCRIPTION_INPUT["payload"]
  ) => Promise<Notification | null>;

  /**
   * event is the subscription event that when fired, will trigger this
   * notification processor to be called.
   */
  event: SUBSCRIPTION_CHANNELS;

  /**
   * digestOrder, when provided, allows the custom ordering of notifications in
   * a digest.
   */
  digestOrder: number;

  /**
   * supersedesCategories is the category names that this specific notification
   * category supersedes.
   */
  supersedesCategories?: string[];
}
