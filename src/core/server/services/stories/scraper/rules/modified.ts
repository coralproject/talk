import { $jsonld } from "@metascraper/helpers";
import { Rules } from "metascraper";

import { wrap } from "./helpers";

export const modifiedScraper = (): Rules => ({
  modified: [
    // From: http://ogp.me/#type_article
    wrap($jsonld("dateModified")),
    wrap($ => $('meta[property="article:modified"]').attr("content")),
  ],
});
