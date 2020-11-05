import { Decorator } from "./decorators";

export interface FrameControlConfig {
  id: string;
  url: string;
  title: string;
  decorators: ReadonlyArray<Decorator>;
}

export interface FrameControl {
  readonly rendered: boolean;
  render(): void;
  sendMessage(id: string, message?: string): void;
  remove(): void;
}

export type FrameControlFactory = (config: FrameControlConfig) => FrameControl;
