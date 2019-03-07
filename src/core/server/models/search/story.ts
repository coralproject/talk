import { Elasticsearch } from "talk-server/services/elasticsearch";

import { Story } from "../story";
import { deleteDocument, indexDocument } from "./helpers";

/**
 * IndexedStory is a version of the Story that is indexed in Elasticsearch.
 */
export type IndexedStory = Story;

/**
 * buildIndexedStoryBody will convert a Story into an IndexedStory.
 *
 * @param story the story to convert into an IndexedStory.
 */
export function buildIndexedStoryBody(story: Story): IndexedStory {
  return {
    tenantID: story.tenantID,
    id: story.id,
    url: story.url,
    metadata: story.metadata,
    scrapedAt: story.scrapedAt,
    commentCounts: story.commentCounts,
    settings: story.settings,
    closedAt: story.closedAt,
    createdAt: story.createdAt,
  };
}

/**
 * indexStory will index a given Story in their IndexedStory form.
 *
 * @param elasticsearch the Elasticsearch client to use for indexing the Story.
 * @param story the Story to index.
 */
export const indexStory = (elasticsearch: Elasticsearch, story: Story) =>
  indexDocument(elasticsearch, buildIndexedStoryBody(story), "stories");

export const deleteIndexedStory = (elasticsearch: Elasticsearch, id: string) =>
  deleteDocument(elasticsearch, id, "stories");
