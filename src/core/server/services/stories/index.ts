import { Db } from "mongodb";

import {
  findOrCreateStory,
  FindOrCreateStoryInput,
} from "talk-server/models/story";
import { Tenant } from "talk-server/models/tenant";
import Task from "talk-server/services/queue/Task";
import { ScraperData } from "talk-server/services/queue/tasks/scraper";

export type FindOrCreateStory = FindOrCreateStoryInput;

export async function findOrCreate(
  db: Db,
  tenant: Tenant,
  input: FindOrCreateStory,
  scraper: Task<ScraperData>
) {
  // TODO: check to see if the tenant has enabled lazy story creation.

  const story = await findOrCreateStory(db, tenant.id, input);
  if (!story) {
    return null;
  }

  if (!story.scraped) {
    await scraper.add({
      storyID: story.id,
      storyURL: story.url,
      tenantID: tenant.id,
    });
  }

  return story;
}
