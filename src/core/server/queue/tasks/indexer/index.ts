import Queue, { Job } from "bull";
import { Db } from "mongodb";
import now from "performance-now";

import {
  CommentNotFoundError,
  StoryNotFoundError,
  UserNotFoundError,
} from "talk-server/errors";
import logger from "talk-server/logger";
import { retrieveComment } from "talk-server/models/comment";
import { indexComment } from "talk-server/models/search/comment";
import { indexStory } from "talk-server/models/search/story";
import { indexUser } from "talk-server/models/search/user";
import { retrieveStory } from "talk-server/models/story";
import { retrieveUser } from "talk-server/models/user";
import Task from "talk-server/queue/Task";
import { Elasticsearch } from "talk-server/services/elasticsearch";

const JOB_NAME = "indexer";

export interface IndexerData {
  tenantID: string;
  documentType: "comment" | "user" | "story";
  documentID: string;
}

export interface IndexerProcessorOptions {
  mongo: Db;
  elasticsearch: Elasticsearch;
}

const createJobProcessor = ({
  mongo,
  elasticsearch,
}: IndexerProcessorOptions) => async (job: Job<IndexerData>) => {
  // Pull out the job data.
  const { documentID, documentType, tenantID } = job.data;

  const log = logger.child({
    jobID: job.id,
    jobName: JOB_NAME,
    documentID,
    documentType,
    tenantID,
  });

  // Mark the start time.
  const startTime = now();

  log.debug("starting indexing operation");

  try {
    switch (documentType) {
      case "comment":
        const comment = await retrieveComment(mongo, tenantID, documentID);
        if (comment) {
          await indexComment(elasticsearch, comment);
        } else {
          throw new CommentNotFoundError(documentID);
        }
        break;
      case "story":
        const story = await retrieveStory(mongo, tenantID, documentID);
        if (story) {
          await indexStory(elasticsearch, story);
        } else {
          throw new StoryNotFoundError(documentID);
        }
        break;
      case "user":
        const user = await retrieveUser(mongo, tenantID, documentID);
        if (user) {
          await indexUser(elasticsearch, user);
        } else {
          throw new UserNotFoundError(documentID);
        }
        break;
      default:
        throw new Error(`invalid documentType=${documentType}`);
    }
  } catch (err) {
    log.error({ err }, "could not index the document");

    throw err;
  }

  // Compute the end time.
  const responseTime = Math.round(now() - startTime);

  log.debug({ responseTime }, "indexing complete");
};

export type IndexerQueue = Task<IndexerData>;

export function createIndexerTask(
  queue: Queue.QueueOptions,
  options: IndexerProcessorOptions
) {
  return new Task({
    jobName: JOB_NAME,
    jobProcessor: createJobProcessor(options),
    queue,
  });
}
