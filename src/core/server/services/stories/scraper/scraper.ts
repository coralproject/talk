import Logger from "bunyan";
import cheerio from "cheerio";
import authorScraper from "metascraper-author";
import descriptionScraper from "metascraper-description";
import imageScraper from "metascraper-image";
import titleScraper from "metascraper-title";
import { Db } from "mongodb";
import ProxyAgent from "proxy-agent";

import { Config } from "coral-server/config";
import { ScrapeFailed } from "coral-server/errors";
import logger from "coral-server/logger";
import { retrieveStory, updateStory } from "coral-server/models/story";
import { retrieveTenant } from "coral-server/models/tenant";
import { createFetch, Fetch, FetchOptions } from "coral-server/services/fetch";

import { GQLStoryMetadata } from "coral-server/graph/schema/__generated__/types";

import { modifiedScraper } from "./rules/modified";
import { publishedScraper } from "./rules/published";
import { sectionScraper } from "./rules/section";

export type Rule = Record<
  string,
  Array<
    (options: { htmlDom: CheerioSelector; url: string }) => string | undefined
  >
>;

class Scraper {
  private readonly rules: Rule[];
  private readonly log: Logger;
  private readonly fetch: Fetch;

  constructor(rules: Rule[]) {
    this.fetch = createFetch({ name: "Scraper" });
    this.rules = rules;
    this.log = logger.child({ taskName: "scraper" }, true);
  }

  public parse(url: string, html: string): GQLStoryMetadata {
    const log = this.log.child({ storyURL: url }, true);

    // Load the DOM.
    const htmlDom = cheerio.load(html);

    log.debug("parsed html");

    // Gather the results by evaluating each of the rules.
    const metadata: Record<string, string | undefined> = {};

    for (const rule of this.rules) {
      for (const property in rule) {
        if (!Object.prototype.hasOwnProperty.call(rule, property)) {
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
      publishedAt: metadata.published
        ? new Date(metadata.published)
        : undefined,
      modifiedAt: metadata.modified ? new Date(metadata.modified) : undefined,
      section: metadata.section || undefined,
    };
  }

  public async download(
    url: string,
    timeout: number,
    customUserAgent?: string,
    proxyURL?: string
  ) {
    const log = this.log.child({ storyURL: url }, true);

    const options: FetchOptions = { method: "GET", timeout };
    if (customUserAgent) {
      options.headers = {
        ...options.headers,
        "User-Agent": customUserAgent,
      };
    }

    if (proxyURL) {
      // Force the type here because there's a slight mismatch.
      options.agent = (new ProxyAgent(
        proxyURL
      ) as unknown) as FetchOptions["agent"];
      log.debug("using proxy for scrape");
    }

    const start = Date.now();
    log.debug("starting scrape of Story");

    try {
      const res = await this.fetch(url, options);
      if (!res.ok) {
        log.warn(
          { statusCode: res.status, statusText: res.statusText },
          "scrape failed with non-200 status code"
        );
        return null;
      }

      const html = await res.text();

      log.debug({ timeElapsed: Date.now() - start }, "scrape complete");

      return html;
    } catch (err) {
      throw new ScrapeFailed(url, err);
    }
  }

  public async scrape(
    url: string,
    abortAfterMilliseconds: number,
    customUserAgent?: string,
    proxyURL?: string
  ): Promise<GQLStoryMetadata | null> {
    const html = await this.download(
      url,
      abortAfterMilliseconds,
      customUserAgent,
      proxyURL
    );
    if (!html) {
      return null;
    }

    return this.parse(url, html);
  }
}

/**
 * createScraper will create a scraper that will utilize the rules defined to
 * scrape metadata from the target page.
 */
function createScraper() {
  return new Scraper([
    authorScraper(),
    publishedScraper(),
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
  config: Config,
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

  // This typecast is needed because the custom `ms` format does not return the
  // desired `number` type even though that's the only type it can output.
  const timeout = (config.get("scrape_timeout") as unknown) as number;

  // Get the metadata from the scraped html.
  const metadata = await scraper.scrape(
    storyURL,
    timeout,
    tenant.stories.scraping.customUserAgent,
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
