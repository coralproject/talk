import { QueueOptions } from "bull";

import logger from "coral-server/logger";
import Task, { JobProcessor } from "coral-server/queue/Task";
import { ExternalNotificationsService } from "coral-server/services/notifications/externalService";

const JOB_NAME = "external-notifications";

export interface ExternalNotificationProcessorOptions {
  externalNotifications: ExternalNotificationsService;
}

export interface ExternalNotificationData {
  tenantID: string;
  taskID: string;
  notifications: any[];
}

const createJobProcessor =
  ({
    externalNotifications,
  }: ExternalNotificationProcessorOptions): JobProcessor<ExternalNotificationData> =>
  async (job) => {
    const { tenantID, taskID, notifications } = job.data;

    const log = logger.child(
      {
        jobID: job.id,
        jobName: JOB_NAME,
        tenantID,
        taskID,
      },
      true
    );

    log.info("attempting to send notifications for task");

    try {
      await externalNotifications.sendMany(notifications);
    } catch (err) {
      log.error(
        { taskID, tenantID, notifications },
        "unable to send notifications to external service"
      );
    }
  };

export type ExternalNotificationsQueue = Task<ExternalNotificationData>;

export function createExternalNotificationsTask(
  queue: QueueOptions,
  options: ExternalNotificationProcessorOptions
) {
  return new Task({
    jobName: JOB_NAME,
    jobProcessor: createJobProcessor(options),
    queue,
    jobIdGenerator: ({ tenantID, taskID }) => `${tenantID}:${taskID}`,
    attempts: 1,
  });
}
