declare module "querystringify" {
  export function parse(query: string): any;
  export function stringify(obj: object, prefix?: string | boolean): string;
}
