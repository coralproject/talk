import { Rule, Ruler } from "metascraper";

export const wrap = (rule: Rule): Ruler => ({ htmlDom, url }) =>
  rule(htmlDom, url);
