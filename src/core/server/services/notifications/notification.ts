import { DigestibleTemplate } from "coral-server/queue/tasks/mailer/templates";

/**
 * Notification stores the data used to issue a given notification.
 */
export interface Notification {
  /**
   * userID is the ID of the user to send the notification for.
   */
  userID: string;

  /**
   * template is the actual template/email data to use when sending the
   * notification to the user.
   */
  template: DigestibleTemplate;
}
