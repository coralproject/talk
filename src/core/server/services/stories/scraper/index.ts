import Logger from "bunyan";
import cheerio from "cheerio";
import authorScraper from "metascraper-author";
import dateScraper from "metascraper-date";
import descriptionScraper from "metascraper-description";
import imageScraper from "metascraper-image";
import titleScraper from "metascraper-title";
import { Db } from "mongodb";
import fetch, { RequestInit } from "node-fetch";
import ProxyAgent from "proxy-agent";

import { version } from "coral-common/version";
import { GQLStoryMetadata } from "coral-server/graph/tenant/schema/__generated__/types";
import logger from "coral-server/logger";
import { retrieveStory, updateStory } from "coral-server/models/story";
import { retrieveTenant } from "coral-server/models/tenant";

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
    this.log = logger.child({ taskName: "scraper" }, true);
  }

  public async scrape(
    url: string,
    proxyURL?: string
  ): Promise<GQLStoryMetadata | null> {
    // Grab the page HTML.

    const log = this.log.child({ storyURL: url }, true);

    const options: RequestInit = {
      headers: {
        "User-Agent": `Talk Scraper/${version}`,
      },
    };
    if (proxyURL) {
      // Force the type here because there's a slight mismatch.
      options.agent = (new ProxyAgent(
        proxyURL
      ) as unknown) as RequestInit["agent"];
      log.debug("using proxy for scrape");
    }

    const start = Date.now();
    log.debug("starting scrape of Story");

    const res = await fetch(url, options);
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
  // Grab the Tenant.
  const tenant = await retrieveTenant(mongo, tenantID);
  if (!tenant) {
    throw new Error("tenant not found");
  }

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
  const metadata = await scraper.scrape(
    storyURL,
    tenant.stories.scraping.proxyURL
  );
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
