import { NotificationCategory } from "./category";
import { featured } from "./featured";
import { moderation } from "./moderation";
import { reply } from "./reply";
import { staffReply } from "./staffReply";

/**
 * categories stores all the notification categories in a flat list.
 */
const categories: NotificationCategory[] = [
  reply,
  staffReply,
  moderation,
  featured,
];

export default categories;
