import { Job, Queue } from "bull";
import { Db } from "mongodb";
import { createTransport } from "nodemailer";

import { Config } from "talk-common/config";
import logger from "talk-server/logger";
import { Task } from "talk-server/services/queue/tasks";

const JOB_NAME = "mailer";

export interface MailProcessorOptions {
  mongo: Db;
  config: Config;
}

export interface MailerData {
  message: {
    to: string;
    subject: string;
    text: string;
    html: string;
  };
  tenantID: string;
}

const createJobProcessor = (options: MailProcessorOptions) => {
  const transport = createTransport(options.config.get("smtp.uri"));

  return async (job: Job<MailerData>) => {
    const { message, tenantID } = job.data;

    logger.debug(
      {
        job_id: job.id,
        job_name: JOB_NAME,
        tenant_id: tenantID,
      },
      "starting to send the email"
    );

    // Send the mail message.
    await transport.sendMail({
      ...message,
      from: options.config.get("smtp.from_address"),
    });

    logger.debug(
      {
        job_id: job.id,
        job_name: JOB_NAME,
        tenant_id: tenantID,
      },
      "sent the email"
    );
  };
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
