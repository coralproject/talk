declare module "squire-rte" {
  type Config = {
    blockTag?: string;
    blockAttributes?: Record<string, string>;
    tagAttributes?: {
      blockquote?: Record<string, string>;
      ul?: Record<string, string>;
      ol?: Record<string, string>;
      li?: Record<string, string>;
      a?: Record<string, string>;
    };
    classNames?: {
      colour?: string;
      fontFamily?: string;
      fontSize?: string;
      highlight?: string;
    };
    leafNodeNames?: Record<string, 1>;
    undo?: {
      documentSizeThreshold?: Number;
      undoLimit?: Number;
    };
    isInsertedHTMLSanitized?: boolean;
    isSetHTMLSanitized?: boolean;
    sanitizeToDOMFragment?: (
      html: string,
      isPaste: boolean,
      self: Squire
    ) => DocumentFragment;
    willCutCopy?: (html: string) => string;
    addLinks?: boolean;
  };
  class Squire {
    constructor(node: Node, config?: Config);
    addEventListener(key: string, handler: (event: any) => void): Squire;
    removeEventListener(key: string, handler: (event: any) => void): Squire;
    setKeyHandler(
      key: string,
      handler:
        | null
        | ((self: Squire, event: KeyboardEvent, range: Range) => void)
    ): Squire;
    focus: () => Squire;
    blur: () => Squire;
    getDocument: () => Node;
    getRoot: () => Node;
    getHTML: () => string;
    setHTML: (html: string) => Squire;
    getSelectedText: () => string;
    insertImage: (
      src: string,
      attributes: Record<string, string>
    ) => HTMLImageElement;
    insertHTML: (html: string) => Squire;
    getPath: () => string;
    getFontInfo: () => {
      family?: string;
      size?: string;
      color?: string;
      backgroundColor?: string;
    };
    createRange: (
      startContainer: Node,
      startOffset: number,
      endContainer?: Node,
      endOffset?: number
    ) => Range;
    getCursorPosition: () => DOMRect;
    getSelection: () => Range;
    setSelection: (range: Range) => Squire;
    moveCursorToStart: () => Squire;
    moveCursorToEnd: () => Squire;
    saveUndoState: () => Squire;
    undo: () => Squire;
    redo: () => Squire;
    hasFormat: (tag: string, attributes?: Record<string, string>) => boolean;
    bold: () => Squire;
    italic: () => Squire;
    underline: () => Squire;
    removeBold: () => Squire;
    removeItalic: () => Squire;
    removeUnderline: () => Squire;
    makeLink: (url: string, attributes?: Record<string, string>) => Squire;
    removeLink: () => Squire;
    setFontFace: (font: string) => Squire;
    setFontSize: (size: string) => Squire;
    setTextColour: (colour: string) => Squire;
    setHighlightColour: (colour: string) => Squire;
    setTextAlignment: (
      alignment: "left" | "right" | "center" | "justify"
    ) => Squire;
    setTextDirection: (direction: "ltr" | "rtl") => Squire;
    forEachBlock: (fn: (block: Node) => void, mutates?: boolean) => Squire;
    modifyBlocks: (
      modify: (frag: DocumentFragment) => DocumentFragment
    ) => Squire;
    increaseQuoteLevel: () => Squire;
    decreaseQuoteLevel: () => Squire;
    makeUnorderedList: () => Squire;
    makeOrderedList: () => Squire;
    removeList: () => Squire;
    increaseListLevel: () => Squire;
    decreaseListLevel: () => Squire;
    code: () => Squire;
    removeCode: () => Squire;
    toggleCode: () => Squire;
    removeAllFormatting: () => Squire;
    changeFormat: (
      add: null | { tag: string; attributes?: Record<string, string> },
      remove?: null | { tag: string; attributes?: Record<string, string> },
      range?: null | Range,
      partial?: boolean
    ) => Squire;
    modifyDocument: (modificationCallback: () => void) => Squire;
    linkRegExp: RegExp;
  }
  export = Squire;
}
