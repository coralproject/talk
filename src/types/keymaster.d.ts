interface KeymasterEvent {
  key: string;
  method: KeyHandler;
  mods: number[];
  scope: string;
  shortcut: string;
}

type KeyHandler = (
  keyboardEvent: KeyboardEvent,
  keymasterEvent: KeymasterEvent
) => void;

interface FilterEvent {
  target?: {
    tagName?: string;
  };
  srcElement?: {
    tagName?: string;
  };
}

interface Keymaster {
  (key: string, callback: KeyHandler): void;
  (key: string, scope: string, callback: KeyHandler): void;

  shift: boolean;
  alt: boolean;
  option: boolean;
  ctrl: boolean;
  control: boolean;
  command: boolean;

  setScope(scopeName: string): void;
  getScope(): string;
  deleteScope(scopeName: string): void;

  noConflict(): void;

  unbind(key: string, scopeName?: string): void;

  isPressed(keyCode: number): boolean;
  getPressedKeyCodes(): number[];

  filter(event: FilterEvent): void;
}

declare let key: Keymaster;

declare module "keymaster" {
  export = key;
}
