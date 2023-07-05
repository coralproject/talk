import { $jsonld } from "@metascraper/helpers";
import { RuleBundle } from "metascraper";

import { wrap } from "./helpers";

export const sectionScraper = (): RuleBundle => ({
  section: [
    // an override for newsrooms using section differently than
    // the default way
    wrap(($) => $(`meta[property="sectionOverride"]`).attr("content")),
    // From: http://ogp.me/#type_article
    wrap($jsonld("articleSection")),
    wrap(($) => $('meta[itemprop="articleSection"]').attr("content")),
    wrap(($) => $('meta[property="article:section"]').attr("content")),
  ],
});
