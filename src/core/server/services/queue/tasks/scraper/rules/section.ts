import { Rules } from "metascraper";

export const section = (): Rules => ({
  section: [
    ({ htmlDom: $ }) => $('meta[property="article:section"]').attr("content"),
  ],
});
