// Allowing loading fluent files.
declare module "*.ftl";

declare module "fluent-react/compat" {
  import { FluentBundle } from "fluent/compat";
  import { ComponentType } from "react";

  export interface LocalizationProviderProps {
    bundles: FluentBundle[];
  }
  export const LocalizationProvider: ComponentType<LocalizationProviderProps>;

  export interface LocalizedProps {
    id: string;
    attrs?: { [name: string]: boolean };
    [args: string]: any;
  }
  export const Localized: ComponentType<LocalizedProps>;
}

declare module "fluent-langneg/compat" {
  export function negotiateLanguages(
    requestedLocales: ReadonlyArray<string>,
    available: ReadonlyArray<string>,
    options: {
      strategy: "filtering" | "matching" | "lookup";
      defaultLocale: string;
    }
  ): string[];
}

declare module "fluent/compat" {
  export interface FluentBundleOptions {
    functions?: { [key: string]: (...args: any[]) => string | FluentType };
    useIsolating?: boolean;
    transform?: ((s: string) => string);
  }

  export class FluentBundle {
    constructor(locales: string, options?: FluentBundleOptions);
    public locales: string[];
    public readonly messages: Iterator<[string, any]>;
    public hasMessage(id: string): boolean;
    public getMessage(id: string): any;
    public addMessages(source: string): string[];
    public format(
      message: any,
      args?: object,
      errors?: string[]
    ): string | null;
  }

  export class FluentType {
    protected value: any;
    protected opts: any;
    constructor(value: any, opts?: any);
    public valueOf(): any;
    public toString(bundle: FluentBundle): string;
  }

  export class FluentNumber extends FluentType {}
  export class FluentDateTime extends FluentType {}
}
