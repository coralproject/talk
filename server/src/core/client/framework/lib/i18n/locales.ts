export interface BundledLocales {
  [locale: string]: string;
}

export interface LoadableLocales {
  [locale: string]: () => Promise<string>;
}

/**
 * This type describes the shape of the generated code from our `locales-loader`.
 * Please check `./src/loaders` and the webpack config for more information.
 */
export interface LocalesData {
  readonly defaultLocale: string;
  readonly fallbackLocale: string;
  readonly availableLocales: ReadonlyArray<string>;
  readonly bundled: BundledLocales;
  readonly loadables: LoadableLocales;
}
