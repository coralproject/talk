import { Rules } from "metascraper";

export const modifiedScraper = (): Rules => ({
  modified: [
    // From: http://ogp.me/#type_article
    ({ htmlDom: $ }) => $('meta[property="article:modified"]').attr("content"),
  ],
});
