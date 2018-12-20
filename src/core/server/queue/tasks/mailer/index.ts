import Queue, { Job } from "bull";
import htmlToText from "html-to-text";
import Joi from "joi";
import { Db } from "mongodb";
import { createTransport } from "nodemailer";

import { Config } from "talk-server/config";
import logger from "talk-server/logger";
import Task from "talk-server/queue/Task";
import MailerContent from "talk-server/queue/tasks/mailer/content";
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
          jobID: job.id,
          jobName: JOB_NAME,
          err,
        },
        "job data did not match expected schema"
      );
      return;
    }

    // Pull the data out of the validated model.
    const { message, tenantID } = value;

    const log = logger.child({
      jobID: job.id,
      jobName: JOB_NAME,
      tenantID,
    });

    // Get the referenced tenant so we know who to send it from.
    const tenant = await tenantCache.retrieveByID(tenantID);
    if (!tenant) {
      log.error("referenced tenant was not found");
      return;
    }

    if (!tenant.email.enabled) {
      log.error("not sending email, it was disabled");
      return;
    }

    if (!tenant.email.smtpURI) {
      log.error("email was enabled but the smtpURI configuration was missing");
      return;
    }

    if (!tenant.email.fromAddress) {
      // TODO: possibly have fallback email address?
      log.error(
        "email was enabled but the fromAddress configuration was missing"
      );
      return;
    }

    let transport = cache.get(tenantID);
    if (!transport) {
      // Create the transport based on the smtp uri.
      transport = createTransport(tenant.email.smtpURI);

      // Set the transport back into the cache.
      cache.set(tenantID, transport);

      log.debug("transport was not cached");
    } else {
      log.debug("transport was cached");
    }

    log.debug("starting to send the email");

    // Send the mail message.
    await transport.sendMail({
      ...message,
      // Generate the text content of the message from the HTML.
      text: htmlToText.fromString(message.html),
      from: tenant.email.fromAddress,
    });

    log.debug("sent the email");
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

    const log = logger.child({
      jobName: JOB_NAME,
      tenantID,
    });

    // All email templates require the tenant in order to insert the footer, so
    // load it from the tenant cache here.
    const tenant = await this.tenantCache.retrieveByID(tenantID);
    if (!tenant) {
      log.error("referenced tenant was not found");
      // TODO: (wyattjoh) maybe throw an error here?
      return;
    }

    if (!tenant.email.enabled) {
      log.error("not adding email, it was disabled");
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

  /**
   * process maps the interface to the task process function.
   */
  public process() {
    return this.task.process();
  }
}

export const createMailerTask = (
  queue: Queue.QueueOptions,
  options: MailProcessorOptions
) => new Mailer(queue, options);
