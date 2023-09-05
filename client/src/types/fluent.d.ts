/* eslint-disable max-classes-per-file */

// Allowing loading fluent files.
declare module "*.ftl";

declare module "@fluent/dom/compat" {
  import { FluentBundle } from "@fluent/bundle/compat";

  export class DOMLocalization {
    constructor(resourceIDs: string[], generateBundles: any);

    /**
     * Translate a DOM element or fragment asynchronously using this
     * `DOMLocalization` object.
     *
     * Manually trigger the translation (or re-translation) of a DOM fragment.
     * Use the `data-l10n-id` and `data-l10n-args` attributes to mark up the DOM
     * with information about which translations to use.
     *
     * Returns a `Promise` that gets resolved once the translation is complete.
     *
     * @param   {DOMFragment} frag - Element or DocumentFragment to be translated
     * @returns {Promise}
     */
    public translateFragment(frag: DocumentFragment): Promise<DocumentFragment>;
  }
}

declare module "@fluent/react/compat" {
  import { FluentBundle } from "@fluent/bundle/compat";
  import { ReactLocalization } from "@fluent/react/compat";
  import { ComponentType } from "react";

  export const ReactLocalization: ReactLocalization;

  export interface LocalizationProviderProps {
    l10n: ReactLocalization;
    parseMarkup?: (s: string) => ChildNode[];
    children?: React.ReactNode;
  }
  export const LocalizationProvider: ComponentType<LocalizationProviderProps>;

  export interface LocalizedProps {
    id: string;
    attrs?: { [name: string]: boolean };
    [args: string]: any;
  }
  export const Localized: ComponentType<LocalizedProps>;
}

declare module "@fluent/bundle/compat" {
  export interface FluentBundleOptions {
    functions?: { [key: string]: (...args: any[]) => string | FluentType };
    useIsolating?: boolean;
    transform?: (s: string) => string;
  }

  export class FluentResource {
    constructor(source: string);
  }

  export type Pattern = string;

  export interface RawMessage {
    value: Pattern | null;
    attributes: Record<string, Pattern>;
  }

  export class FluentBundle {
    constructor(locales: string, options?: FluentBundleOptions);
    public locales: string[];
    public readonly messages: Iterator<[string, any]>;
    public hasMessage(id: string): boolean;
    public getMessage(id: string): RawMessage;
    public addResource(res: FluentResource, options?: {}): void;
    public formatPattern(
      pattern: Pattern,
      args?: object,
      errors?: Error[]
    ): string;
  }

  export interface FluentScope {
    bundle: FluentBundle;
    errors?: Error[];
    args?: object;
  }

  export class FluentType {
    protected value: any;
    protected opts: any;
    constructor(value: any, opts?: any);
    public valueOf(): any;
    public toString(scope: FluentScope): string;
  }

  export class FluentNumber extends FluentType {}
  export class FluentDateTime extends FluentType {}
}
