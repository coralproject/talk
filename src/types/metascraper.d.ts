declare module "metascraper" {
  export type Ruler = (options: {
    htmlDom: CheerioSelector;
    url: string;
  }) => string | undefined;

  export type Rule = (
    htmlDom: CheerioSelector,
    url: string
  ) => string | undefined;

  export type Rules = Record<string, Array<Ruler>>;
}

declare module "metascraper-author" {
  import { Rules } from "metascraper";
  export default function def(): Rules;
}

declare module "metascraper-description" {
  import { Rules } from "metascraper";
  export default function def(): Rules;
}

declare module "metascraper-image" {
  import { Rules } from "metascraper";
  export default function def(): Rules;
}

declare module "metascraper-title" {
  import { Rules } from "metascraper";
  export default function def(): Rules;
}

declare module "@metascraper/helpers" {
  import { Rule } from "metascraper";
  export const $jsonld: (key: string) => Rule;
  export const jsonld: (url: string, htmlDom: CheerioSelector) => Rule;
  export const toRule: (fn: any, opts?: any) => (rule: Rule) => any;
  export const date: Rule;
}
