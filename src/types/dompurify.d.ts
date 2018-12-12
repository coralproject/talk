declare module "dompurify" {
  interface Config<T extends boolean> {
    ALLOWED_ATTR?: string[];
    ALLOWED_TAGS?: string[];
    RETURN_DOM?: boolean;
    RETURN_DOM_FRAGMENT?: T;
  }

  class DOMPurify<T extends boolean = true> {
    public setConfig(config: Config<T>): void;
    public sanitize(source: string): T extends true ? HTMLBodyElement : string;
    public addHook(name: string, callback: (node: Element) => void): void;
  }

  export default function createDOMPurify<T extends boolean>(
    window: any
  ): DOMPurify<T>;
}
