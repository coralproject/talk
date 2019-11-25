import Queue from "bull";

import logger from "coral-server/logger";
import Task from "coral-server/queue/Task";
import TenantCache from "coral-server/services/tenant/cache";

import {
  createJobProcessor,
  JOB_NAME,
  WebhookData,
  WebhookProcessorOptions,
} from "./processor";

export interface WebhookInput<T extends {} = any> {
  eventContextID: string;
  eventName: string;
  eventData: T;
  tenantID: string;
}

export class WebhookQueue {
  private task: Task<WebhookData>;
  private tenantCache: TenantCache;

  constructor(queue: Queue.QueueOptions, options: WebhookProcessorOptions) {
    this.task = new Task({
      jobName: JOB_NAME,
      jobProcessor: createJobProcessor(options),
      queue,
    });
    this.tenantCache = options.tenantCache;
  }

  public async add({
    eventContextID,
    tenantID,
    eventName,
    eventData,
  }: WebhookInput) {
    const log = logger.child(
      {
        jobName: JOB_NAME,
        tenantID,
        eventName,
        eventContextID,
      },
      true
    );

    // Get the Tenant to determine which webhooks need to be triggered.
    const tenant = await this.tenantCache.retrieveByID(tenantID);
    if (!tenant) {
      log.error("referenced tenant was not found");
      // TODO: (wyattjoh) maybe throw an error here?
      return;
    }

    // Based on the incoming event, determine which endpoints we should send.
    const endpoints = tenant.webhooks.endpoints.filter(endpoint => {
      // If the endpoint is disabled, don't include it.
      if (!endpoint.enabled) {
        return false;
      }

      // If all notifications have been enabled for this endpoint, include it.
      if (endpoint.all) {
        return true;
      }

      // If this event name is specifically listed, include it.
      if (endpoint.events.includes(eventName)) {
        return true;
      }

      return false;
    });

    // Log some important details.
    if (endpoints.length > 0) {
      log.trace(
        { endpoints: endpoints.length },
        "matched endpoints that will receive event"
      );
    } else {
      log.trace({ endpoints: 0 }, "no endpoints matched for event");
    }

    // For each of these endpoints that need a delivery of these notifications,
    // queue up the job that will send it.
    return Promise.all(
      endpoints.map(endpoint =>
        this.task.add({
          tenantID,
          eventContextID,
          endpointID: endpoint.id,
          eventName,
          eventData,
        })
      )
    );
  }

  public process() {
    return this.task.process();
  }
}

export const createWebhookTask = (
  queue: Queue.QueueOptions,
  options: WebhookProcessorOptions
) => new WebhookQueue(queue, options);
