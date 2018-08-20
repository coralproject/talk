import { Rules } from "metascraper";

export const sectionScraper = (): Rules => ({
  section: [
    ({ htmlDom: $ }) => $('meta[property="article:section"]').attr("content"),
  ],
});
