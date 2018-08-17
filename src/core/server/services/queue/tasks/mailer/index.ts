import Queue, { Job } from "bull";
import htmlToText from "html-to-text";
import Joi from "joi";
import { Db } from "mongodb";
import { createTransport } from "nodemailer";

import { Config } from "talk-common/config";
import logger from "talk-server/logger";
import Task from "talk-server/services/queue/Task";
import MailerContent from "talk-server/services/queue/tasks/mailer/content";
import TenantCache from "talk-server/services/tenant/cache";
import { TenantCacheAdapter } from "talk-server/services/tenant/cache/adapter";

const JOB_NAME = "mailer";

export interface MailProcessorOptions {
  config: Config;
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

const MailerDataSchema = Joi.object().keys({
  message: Joi.object().keys({
    to: Joi.string(),
    subject: Joi.string(),
    html: Joi.string(),
  }),
  tenantID: Joi.string(),
});

const createJobProcessor = (options: MailProcessorOptions) => {
  const { tenantCache } = options;

  // Create the cache adapter that will handle invalidating the email transport
  // when the tenant experiences a change.
  const cache = new TenantCacheAdapter<ReturnType<typeof createTransport>>(
    tenantCache
  );

  return async (job: Job<MailerData>) => {
    const { value, error: err } = Joi.validate(job.data, MailerDataSchema, {
      stripUnknown: true,
      presence: "required",
      abortEarly: false,
    });
    if (err) {
      logger.error(
        {
          job_id: job.id,
          job_name: JOB_NAME,
          err,
        },
        "job data did not match expected schema"
      );
      return;
    }

    // Pull the data out of the validated model.
    const { message, tenantID } = value;

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

export interface MailerInput {
  message: {
    to: string;
    subject: string;
  };
  template: {
    name: string;
    context: object;
  };
  tenantID: string;
}

export class Mailer {
  private task: Task<MailerData>;
  private content: MailerContent;
  private tenantCache: TenantCache;

  constructor(queue: Queue.QueueOptions, options: MailProcessorOptions) {
    this.task = new Task<MailerData>({
      jobName: JOB_NAME,
      jobProcessor: createJobProcessor(options),
      queue,
    });
    this.content = new MailerContent(options.config);
    this.tenantCache = options.tenantCache;
  }

  public async add({ template, ...rest }: MailerInput) {
    const { tenantID } = rest;

    // All email templates require the tenant in order to insert the footer, so
    // load it from the tenant cache here.
    const tenant = await this.tenantCache.retrieveByID(tenantID);
    if (!tenant) {
      logger.error(
        {
          job_name: JOB_NAME,
          tenant_id: tenantID,
        },
        "referenced tenant was not found"
      );
      // TODO: (wyattjoh) maybe throw an error here?
      return;
    }

    if (!tenant.email.enabled) {
      logger.error(
        {
          job_name: JOB_NAME,
          tenant_id: tenantID,
        },
        "not adding email, it was disabled"
      );
      // TODO: (wyattjoh) maybe throw an error here?
      return;
    }

    // Generate the HTML for the email template.
    const html = this.content.generateHTML({
      ...template,
      context: {
        ...template.context,
        tenant,
      },
    });

    // Return the job that'll add the email to the queue to be processed later.
    return this.task.add({
      ...rest,
      message: {
        ...rest.message,
        html,
      },
    });
  }
}

export const createMailerTask = (
  queue: Queue.QueueOptions,
  options: MailProcessorOptions
) => new Mailer(queue, options);
