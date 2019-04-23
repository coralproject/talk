import Logger from "bunyan";
import cheerio from "cheerio";
import authorScraper from "metascraper-author";
import dateScraper from "metascraper-date";
import descriptionScraper from "metascraper-description";
import imageScraper from "metascraper-image";
import titleScraper from "metascraper-title";
import { Db } from "mongodb";

import { GQLStoryMetadata } from "talk-server/graph/tenant/schema/__generated__/types";
import logger from "talk-server/logger";
import { retrieveStory, updateStory } from "talk-server/models/story";

import { modifiedScraper } from "./rules/modified";
import { sectionScraper } from "./rules/section";

export type Rule = Record<
  string,
  Array<
    (options: { htmlDom: CheerioSelector; url: string }) => string | undefined
  >
>;

class Scraper {
  private rules: Rule[];
  private log: Logger;

  constructor(rules: Rule[]) {
    this.rules = rules;
    this.log = logger.child({ taskName: "scraper" });
  }

  public async scrape(url: string): Promise<GQLStoryMetadata | null> {
    // Grab the page HTML.

    const log = this.log.child({ storyURL: url });

    const start = Date.now();
    log.debug("starting scrape of Story");

    // TODO: investigate adding scraping proxy support based on the Tenant.
    const res = await fetch(url, {});
    if (res.status !== 200) {
      log.warn(
        { statusCode: res.status },
        "scrape failed with non-200 status code"
      );
      return null;
    }

    const html = await res.text();

    log.debug({ timeElapsed: Date.now() - start }, "scrape complete");

    // Load the DOM.
    const htmlDom = cheerio.load(html);

    log.debug("parsed html");

    // Gather the results by evaluating each of the rules.
    const metadata: Record<string, string | undefined> = {};

    for (const rule of this.rules) {
      for (const property in rule) {
        if (!rule.hasOwnProperty(property)) {
          continue;
        }

        // Proceed through each of the properties and try to find the mapped
        // properties.
        for (const getter of rule[property]) {
          const value = getter({ htmlDom, url });
          if (value && value.length > 0) {
            metadata[property] = value;

            break;
          }
        }
      }
    }

    log.debug("extracted metadata");

    return {
      title: metadata.title || undefined,
      description: metadata.description || undefined,
      image: metadata.image ? metadata.image : undefined,
      author: metadata.author || undefined,
      publishedAt: metadata.date ? new Date(metadata.date) : undefined,
      modifiedAt: metadata.modified ? new Date(metadata.modified) : undefined,
      section: metadata.section || undefined,
    };
  }
}

/**
 * createScraper will create a scraper that will utilize the rules defined to
 * scrape metadata from the target page.
 */
function createScraper() {
  return new Scraper([
    authorScraper(),
    dateScraper(),
    descriptionScraper(),
    imageScraper(),
    titleScraper(),
    modifiedScraper(),
    sectionScraper(),
  ]);
}

export const scraper = createScraper();

export async function scrape(
  mongo: Db,
  tenantID: string,
  storyID: string,
  storyURL?: string
) {
  // If the URL wasn't provided, grab it from the database.
  if (!storyURL) {
    const retrievedStory = await retrieveStory(mongo, tenantID, storyID);
    if (!retrievedStory) {
      throw new Error("story at specified id not found");
    }

    // Update the story URL.
    storyURL = retrievedStory.url;
  }

  // Get the metadata from the scraped html.
  const metadata = await scraper.scrape(storyURL);
  if (!metadata) {
    throw new Error("story at specified url not found");
  }

  const now = new Date();

  // Update the Story with the scraped details.
  const story = await updateStory(
    mongo,
    tenantID,
    storyID,
    {
      metadata,
      scrapedAt: now,
    },
    now
  );
  if (!story) {
    throw new Error("story at specified id not found");
  }

  return story;
}
