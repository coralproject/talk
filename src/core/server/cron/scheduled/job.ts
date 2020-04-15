import { CronCommand, CronJob } from "cron";
import { v1 as uuid } from "uuid";

import { createTimer } from "coral-server/helpers";
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
    this.log = logger.child(
      {
        jobName: opts.name,
        jobFrequency: opts.cronTime,
      },
      true
    );
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
      const log = this.log.child({ scheduledExecutionID: uuid() }, true);
      log.info("now starting scheduled job");
      const timer = createTimer();
      try {
        await command({
          ...this.context,
          log,
        });
        log.info({ took: timer() }, "now finished scheduled job");
      } catch (err) {
        log.error({ err, took: timer() }, "failed to run scheduled job");
      }
    };
  }
}
