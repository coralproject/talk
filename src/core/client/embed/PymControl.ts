import pym from "pym.js";

import { CleanupCallback, Decorator } from "./decorators";

export interface PymControlConfig {
  id: string;
  url: string;
  title: string;
  decorators?: ReadonlyArray<Decorator>;
}

export type PymControlFactory = (config: PymControlConfig) => PymControl;

export const defaultPymControlFactory: PymControlFactory = (config) =>
  new PymControl(config);

export default class PymControl {
  private pym: pym.Parent;
  private cleanups: CleanupCallback[];

  constructor(config: PymControlConfig) {
    const decorators = config.decorators || [];

    this.pym = new pym.Parent(config.id, config.url, {
      title: config.title,
      id: `${config.id}_iframe`,
      name: `${config.id}_iframe`,
    });

    this.cleanups = decorators
      .map((enhance) => enhance(this.pym))
      .filter((cb) => cb) as CleanupCallback[];
  }

  public sendMessage(id: string, raw?: string) {
    this.pym.sendMessage(id, raw || "");
  }

  public remove() {
    this.cleanups.forEach((cb) => cb());
    this.cleanups = [];

    // Remove the pym parent.
    this.pym.remove();
  }
}
