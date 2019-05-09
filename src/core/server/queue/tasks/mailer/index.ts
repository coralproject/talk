import Queue from "bull";
import now from "performance-now";

import logger from "talk-server/logger";
import Task from "talk-server/queue/Task";
import MailerContent from "talk-server/queue/tasks/mailer/content";
import TenantCache from "talk-server/services/tenant/cache";

import {
  createJobProcessor,
  JOB_NAME,
  MailerData,
  MailProcessorOptions,
} from "./processor";
import { Template } from "./templates";

export interface MailerInput {
  message: {
    to: string;
  };
  template: Template;
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
    });
    this.content = new MailerContent(options);
    this.tenantCache = options.tenantCache;
  }

  public async add({ template, tenantID, message: { to } }: MailerInput) {
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

    const startTemplateGenerationTime = now();

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
    const responseTime = Math.round(now() - startTemplateGenerationTime);
    log.trace({ responseTime }, "finished template generation");

    // Return the job that'll add the email to the queue to be processed later.
    return this.task.add({
      tenantID,
      templateName: template.name,
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
