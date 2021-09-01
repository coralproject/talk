import { $jsonld, date, toRule } from "@metascraper/helpers";
import { RuleBundle } from "metascraper";

const toDate = toRule(date);

export const modifiedScraper = (): RuleBundle => ({
  modified: [
    // From: http://ogp.me/#type_article
    toDate($jsonld("dateModified")),
    toDate(($) => $('meta[property="article:modified"]').attr("content")),
  ],
});
