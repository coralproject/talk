declare module "dompurify" {
  interface Config {
    ALLOWED_ATTR?: string[];
    ALLOWED_TAGS?: string[];
    RETURN_DOM?: boolean;
    RETURN_DOM_FRAGMENT?: boolean;
  }

  class DOMPurify {
    public setConfig(config: Config): void;
    public sanitize(source: string | Node): HTMLBodyElement;
    public addHook(name: string, callback: (node: Element) => void): void;
  }

  export default function createDOMPurify(window: any): DOMPurify;
}
