import cheerio from "cheerio";
import { RuleBundle } from "metascraper";
import authorScraper from "metascraper-author";
import descriptionScraper from "metascraper-description";
import imageScraper from "metascraper-image";
import titleScraper from "metascraper-title";
import ProxyAgent from "proxy-agent";

import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import { ScrapeFailed } from "coral-server/errors";
import logger from "coral-server/logger";
import { retrieveStory, updateStory } from "coral-server/models/story";
import { retrieveTenant } from "coral-server/models/tenant";
import { createFetch, FetchOptions } from "coral-server/services/fetch";

import { GQLStoryMetadata } from "coral-server/graph/schema/__generated__/types";

import { modifiedScraper } from "./rules/modified";
import { publishedScraper } from "./rules/published";
import { sectionScraper } from "./rules/section";

interface ScrapeOptions {
  url: string;
  timeout: number;
  size: number;
  customUserAgent?: string;
  proxyURL?: string;
  authorization?: string;
}

class Scraper {
  private readonly rules: RuleBundle[];
  private readonly log = logger.child({ taskName: "scraper" }, true);
  private readonly fetch = createFetch({ name: "Scraper" });

  constructor(rules: RuleBundle[]) {
    this.rules = rules;
  }

  public async parse(url: string, html: string): Promise<GQLStoryMetadata> {
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
          const value = await getter({ htmlDom, url });
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

  public async download({
    url,
    timeout,
    customUserAgent,
    proxyURL,
    authorization,
    size,
  }: ScrapeOptions) {
    const log = this.log.child({ storyURL: url }, true);

    const options: FetchOptions = { method: "GET", timeout, size };
    if (customUserAgent) {
      options.headers = {
        ...options.headers,
        "User-Agent": customUserAgent,
      };
    }

    if (authorization) {
      options.headers = {
        ...options.headers,
        Authorization: authorization,
      };
    }

    if (proxyURL) {
      // Force the type here because there's a slight mismatch.
      options.agent = new ProxyAgent(
        proxyURL
      ) as unknown as FetchOptions["agent"];
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
    options: ScrapeOptions
  ): Promise<GQLStoryMetadata | null> {
    const html = await this.download(options);
    if (!html) {
      return null;
    }

    return await this.parse(options.url, html);
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
  mongo: MongoContext,
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

  const timeout = config.get("scrape_timeout");
  const size = config.get("scrape_max_response_size");

  const options: ScrapeOptions = {
    url: storyURL ?? "",
    timeout,
    size,
    customUserAgent: tenant.stories.scraping.customUserAgent,
    proxyURL: tenant.stories.scraping.proxyURL,
  };

  const { authentication, username, password } = tenant.stories.scraping;
  if (authentication && username && password) {
    const credentials = Buffer.from(
      `${username}:${password}`,
      "utf-8"
    ).toString("base64");

    options.authorization = `Basic ${credentials}`;
  }

  // Get the metadata from the scraped html.
  const metadata = await scraper.scrape(options);
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
