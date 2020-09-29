/**
 * JobQueue is a Queue that will process tasks created for it.
 */
export interface JobQueue {
  process(): void;
}
