import { Rules } from "metascraper";

export const modifiedScraper = (): Rules => ({
  modified: [
    ({ htmlDom: $ }) => $('meta[property="article:modified"]').attr("content"),
  ],
});
