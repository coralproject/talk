import { CoralEventPayload } from "coral-server/events/event";

import NotificationContext from "../context";
import { Notification } from "../notification";

/**
 * NotificationCategory define the Category that is used to define a
 * Notification type.
 */
export interface NotificationCategory<T extends CoralEventPayload = any> {
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
    payload: T
  ) => Promise<Notification | null>;

  /**
   * events is the subscription event that when fired, will trigger this
   * notification processor to be called.
   */
  events: T["type"][];

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
