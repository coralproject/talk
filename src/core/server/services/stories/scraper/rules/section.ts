import { Rules } from "metascraper";

export const sectionScraper = (): Rules => ({
  section: [
    // From: http://ogp.me/#type_article
    ({ htmlDom: $ }) => $('meta[property="article:section"]').attr("content"),
  ],
});
