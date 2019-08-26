declare module "dompurify" {
  interface Config<T extends boolean> {
    ADD_TAGS?: string[];
    ALLOWED_ATTR?: string[];
    ALLOWED_TAGS?: string[];
    FORBID_TAGS?: string[];
    FORBID_ATTR?: string[];
    RETURN_DOM?: boolean;
    RETURN_DOM_FRAGMENT?: T;
    ALLOW_DATA_ATTR?: boolean;
    WHOLE_DOCUMENT?: boolean;
    SANITIZE_DOM?: boolean;
    IN_PLACE?: boolean;
  }

  class DOMPurify<T extends boolean = true> {
    public setConfig(config: Config<T>): void;
    public sanitize(
      source: HTMLElement | string,
      config?: Config<T>
    ): T extends true ? HTMLBodyElement : string;
    public addHook(name: string, callback: (node: Element) => void): void;
  }

  export default function createDOMPurify<T extends boolean>(
    window: any
  ): DOMPurify<T>;
}
