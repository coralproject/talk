import { ScheduledJob } from "./job";

export interface ScheduledJobGroup<T> {
  name: string;
  schedulers: Array<ScheduledJob<T>>;
}
