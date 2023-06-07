import { ScheduledJob } from "./job";

export interface ScheduledJobGroup<T extends {}> {
  name: string;
  schedulers: Array<ScheduledJob<T>>;
}
