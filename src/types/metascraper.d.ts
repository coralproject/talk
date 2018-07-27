declare module "metascraper" {
    export interface Scraper {
        (options: {
            url: string;
            html: string;
        }): Promise<Record<string, string | undefined>>;
    }

    export type Rules = Record<string, Array<(options: {htmlDom: CheerioSelector})=> string | undefined>>;

    export function load(rules: Rules[]): Scraper;
}