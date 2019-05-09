declare module "querystringify" {
  export function parse(query: string): Record<string, string | undefined>;
  export function stringify(obj: object, prefix?: string | boolean): string;
}
