import { InnerRule, Rule } from "metascraper";

export const wrap =
  (rule: Rule): InnerRule =>
  ({ htmlDom, url }) =>
    rule(htmlDom, url);
