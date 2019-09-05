import { CronCommand, CronJob } from "cron";
import now from "performance-now";
import uuid from "uuid";

import logger, { Logger } from "coral-server/logger";

export type ScheduledJobCommand<T extends {}> = (
  ctx: T & { log: Logger }
) => Promise<void>;

interface Options<T extends {}> {
  name: string;
  cronTime: string;
  command: ScheduledJobCommand<T>;
}

export class ScheduledJob<T extends {} = {}> {
  public readonly job: CronJob;
  public readonly log: Logger;
  public readonly context: T;

  constructor(context: T, opts: Options<T>) {
    this.context = context;
    this.log = logger.child({
      jobName: opts.name,
      jobFrequency: opts.cronTime,
    });
    this.job = new CronJob({
      cronTime: opts.cronTime,
      onTick: this.command(opts.command),
      timeZone: "America/New_York",
      start: false,
      runOnInit: false,
    });
  }

  private command(command: ScheduledJobCommand<T>): CronCommand {
    return async () => {
      const log = this.log.child({ scheduledExecutionID: uuid.v1() });
      log.debug("now starting scheduled job");
      const start = now();
      try {
        await command({
          ...this.context,
          log,
        });
        const processingTime = Math.floor(now() - start);
        log.debug({ processingTime }, "now finished scheduled job");
      } catch (err) {
        const processingTime = Math.floor(now() - start);
        log.error({ err, processingTime }, "failed to run scheduled job");
      }
    };
  }
}
