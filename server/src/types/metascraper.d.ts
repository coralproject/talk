declare module "metascraper" {
  export type InnerRule = (options: {
    htmlDom: CheerioSelector,
    url: string
  }) => Promise<string | undefined> | string | undefined;

  export type Rule = (
    htmlDom: CheerioSelector,
    url: string
  ) => Promise<string | undefined> | string | undefined;

  export type RuleBundle = Record<string, Array<InnerRule>>;
}

declare module "metascraper-author" {
  import { RuleBundle } from "metascraper";
  export default function def(): RuleBundle;
}

declare module "metascraper-description" {
  import { RuleBundle } from "metascraper";
  export default function def(): RuleBundle;
}

declare module "metascraper-image" {
  import { RuleBundle } from "metascraper";
  export default function def(): RuleBundle;
}

declare module "metascraper-title" {
  import { RuleBundle } from "metascraper";
  export default function def(): RuleBundle;
}

declare module "@metascraper/helpers" {
  import { Rule } from "metascraper";
  export const $jsonld: (key: string) => Rule;
  export const jsonld: (url: string, htmlDom: CheerioSelector) => Rule;
  export const toRule: (fn: any, opts?: any) => (rule: Rule) => InnerRule;
  export const date: Rule;
}
