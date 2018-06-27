// Allowing loading fluent files.
declare module "*.ftl";

declare module "fluent-react/compat" {
  import { MessageContext } from "fluent/compat";
  import { ComponentType } from "react";

  export interface LocalizationProviderProps {
    messages: MessageContext[];
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
  export interface MessageContextOptions {
    functions: { [key: string]: (...args: any[]) => string };
    useIsolating: boolean;
    transform: ((s: string) => string);
  }

  export class MessageContext {
    constructor(locales: string, options?: MessageContext);
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
}
