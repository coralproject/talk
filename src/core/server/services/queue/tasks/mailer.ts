import { Job, Queue } from "bull";
import { Db } from "mongodb";

import logger from "talk-server/logger";
import { Task } from "talk-server/services/queue/tasks";

const JOB_NAME = "mailer";

export interface MailProcessorOptions {
  mongo: Db;
}

export interface MailerData {
  to: string;
  body: string;
  subject: string;
  tenantID: string;
}

const createJobProcessor = (options: MailProcessorOptions) => async (
  job: Job<MailerData>
) => {
  logger.debug({ job_id: job.id, job_name: JOB_NAME }, "sent the email");

  // FIXME: (wyattjoh) implement.
};

export function createMailerTask(
  queue: Queue<MailerData>,
  options: MailProcessorOptions
) {
  return new Task(queue, {
    jobName: JOB_NAME,
    jobProcessor: createJobProcessor(options),
  });
}
