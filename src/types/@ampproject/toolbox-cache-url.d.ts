declare module "@ampproject/toolbox-cache-url" {
  export function createCacheUrl(
    domainSuffix: string,
    url: string
  ): Promise<string>;
}
