import { $jsonld } from "@metascraper/helpers";
import { Rules } from "metascraper";

import { wrap } from "./helpers";

export const sectionScraper = (): Rules => ({
  section: [
    // From: http://ogp.me/#type_article
    wrap($jsonld("articleSection")),
    wrap(($) => $('meta[property="article:section"]').attr("content")),
  ],
});
