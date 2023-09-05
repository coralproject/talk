import Queue from "bull";

import { createTimer } from "coral-server/helpers";
import logger from "coral-server/logger";
import Task from "coral-server/queue/Task";
import MailerContent from "coral-server/queue/tasks/mailer/content";
import { TenantCache } from "coral-server/services/tenant/cache";

import {
  createJobProcessor,
  JOB_NAME,
  MailerData,
  MailProcessorOptions,
} from "./processor";
import { EmailTemplate } from "./templates";

export interface MailerInput {
  message: {
    to: string;
  };
  template: EmailTemplate;
  tenantID: string;
}

export class MailerQueue {
  private task: Task<MailerData>;
  private content: MailerContent;
  private tenantCache: TenantCache;

  constructor(queue: Queue.QueueOptions, options: MailProcessorOptions) {
    this.task = new Task<MailerData>({
      jobName: JOB_NAME,
      jobProcessor: createJobProcessor(options),
      queue,
      // Time the mailer job out after the specified timeout value has been
      // reached.
      timeout: options.config.get("mailer_job_timeout"),
    });
    this.content = new MailerContent(options);
    this.tenantCache = options.tenantCache;
  }

  public async counts() {
    return this.task.counts();
  }

  public async add({ template, tenantID, message: { to } }: MailerInput) {
    const log = logger.child(
      {
        jobName: JOB_NAME,
        tenantID,
      },
      true
    );

    // This is to handle sbn users that don't have an email.
    // These are users who signed up with a third-party login
    // identity (typically Google, FB, or Twitter) and that provider
    // does not disclose that identity's email address to us for
    // whatever reason. So we put an email similar to:
    //
    // missing-{{userID}}
    //
    // It's easy to check for since it's missing an '@' and
    // has their id embedded into it for easy debugging should
    // an error occur around it.
    if (!to.includes("@") && to.startsWith("missing-")) {
      log.error(
        { email: to },
        "not sending email, user does not have an email"
      );
      return;
    }

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

    const timer = createTimer();

    let html: string;
    try {
      // Generate the HTML for the email template.
      html = await this.content.generateHTML(tenant, template);
    } catch (err) {
      log.error({ err }, "could not generate the html");
      // TODO: (wyattjoh) maybe throw an error here?
      return;
    }

    // Compute the end time.
    log.trace({ took: timer() }, "finished template generation");

    // Return the job that'll add the email to the queue to be processed later.
    return this.task.add({
      tenantID,
      templateName: template.name,
      templateContext: template.context,
      message: {
        to,
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
) => new MailerQueue(queue, options);
