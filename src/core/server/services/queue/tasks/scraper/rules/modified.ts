import { Rules } from "metascraper";

export const modified = (): Rules => ({
  modified: [
    ({ htmlDom: $ }) => $('meta[property="article:modified"]').attr("content"),
  ],
});
