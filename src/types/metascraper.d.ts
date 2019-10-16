declare module "metascraper" {
  export interface Scraper {
    (
      options: {
        url: string;
        html: string;
      }
    ): Promise<Record<string, string | undefined>>;
  }

  export type Rules = Record<
    string,
    Array<(options: { htmlDom: CheerioSelector }) => string | undefined>
  >;

  export function load(rules: Rules[]): Scraper;
}

declare module "metascraper-author" {
  import { Rules } from "metascraper";
  export default function def(): Rules;
}

declare module "metascraper-date" {
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
