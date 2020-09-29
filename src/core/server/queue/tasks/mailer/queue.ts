import { singleton } from "tsyringe";

import { createTimer } from "coral-server/helpers";
import logger from "coral-server/logger";
import { TaskQueueOptions } from "coral-server/queue/options";
import { JobQueue } from "coral-server/queue/queue";
import Task from "coral-server/queue/task";
import MailerContent from "coral-server/queue/tasks/mailer/content";
import { TenantCache } from "coral-server/services/tenant/cache";

import { JOB_NAME, MailerData, MailerQueueProcessor } from "./processor";
import { EmailTemplate } from "./templates";

export interface MailerInput {
  message: {
    to: string;
  };
  template: EmailTemplate;
  tenantID: string;
}

@singleton()
export class MailerQueue implements JobQueue {
  private readonly task: Task<MailerData>;

  constructor(
    private readonly content: MailerContent,
    private readonly tenantCache: TenantCache,
    processor: MailerQueueProcessor,
    queue: TaskQueueOptions
  ) {
    this.task = new Task<MailerData>({
      name: JOB_NAME,
      processor,
      queue,
    });
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
