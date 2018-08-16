import Queue, { Job } from "bull";
import htmlToText from "html-to-text";
import { Db } from "mongodb";
import { createTransport } from "nodemailer";

import logger from "talk-server/logger";
import { Task } from "talk-server/services/queue/tasks";
import TenantCache from "talk-server/services/tenant/cache";
import { TenantCacheAdapter } from "talk-server/services/tenant/cache/adapter";

const JOB_NAME = "mailer";

export interface MailProcessorOptions {
  mongo: Db;
  tenantCache: TenantCache;
}

export interface MailerData {
  message: {
    to: string;
    subject: string;
    html: string;
  };
  tenantID: string;
}

const createJobProcessor = (options: MailProcessorOptions) => {
  const { tenantCache } = options;

  // Create the cache adapter that will handle invalidating the email transport
  // when the tenant experiences a change.
  const cache = new TenantCacheAdapter<ReturnType<typeof createTransport>>(
    tenantCache
  );

  return async (job: Job<MailerData>) => {
    const { message, tenantID } = job.data;

    // Get the referenced tenant so we know who to send it from.
    const tenant = await tenantCache.retrieveByID(tenantID);
    if (!tenant) {
      logger.error(
        {
          job_id: job.id,
          job_name: JOB_NAME,
          tenant_id: tenantID,
        },
        "referenced tenant was not found"
      );
      return;
    }

    if (!tenant.email.enabled) {
      logger.error(
        {
          job_id: job.id,
          job_name: JOB_NAME,
          tenant_id: tenantID,
        },
        "not sending email, it was disabled"
      );
      return;
    }

    if (!tenant.email.smtpURI) {
      logger.error(
        {
          job_id: job.id,
          job_name: JOB_NAME,
          tenant_id: tenantID,
        },
        "email was enabled but configuration was missing"
      );
      return;
    }

    if (!tenant.email.fromAddress) {
      // TODO: possibly have fallback email address?
      logger.error(
        {
          job_id: job.id,
          job_name: JOB_NAME,
          tenant_id: tenantID,
        },
        "email was enabled but configuration was missing"
      );
      return;
    }

    let transport = cache.get(tenantID);
    if (!transport) {
      // Create the transport based on the smtp uri.
      transport = createTransport(tenant.email.smtpURI);

      // Set the transport back into the cache.
      cache.set(tenantID, transport);

      logger.debug(
        {
          job_id: job.id,
          job_name: JOB_NAME,
          tenant_id: tenantID,
        },
        "transport was not cached"
      );
    } else {
      logger.debug(
        {
          job_id: job.id,
          job_name: JOB_NAME,
          tenant_id: tenantID,
        },
        "transport was cached"
      );
    }

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
      // Generate the text content of the message from the HTML.
      text: htmlToText.fromString(message.html),
      from: tenant.email.fromAddress,
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
  queue: Queue.QueueOptions,
  options: MailProcessorOptions
) {
  return new Task({
    jobName: JOB_NAME,
    jobProcessor: createJobProcessor(options),
    queue,
  });
}
