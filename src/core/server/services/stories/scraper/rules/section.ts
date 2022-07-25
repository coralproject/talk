import { $jsonld } from "@metascraper/helpers";
import { RuleBundle } from "metascraper";

import { wrap } from "./helpers";

export const sectionScraper = (): RuleBundle => ({
  section: [
    // From: http://ogp.me/#type_article
    wrap($jsonld("articleSection")),
    wrap(($) => $('meta[itemprop="articleSection"]').attr("content")),
    wrap(($) => $('meta[property="article:section"]').attr("content")),
  ],
});
