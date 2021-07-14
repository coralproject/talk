import pym from "pym.js";

import getOrigin from "coral-common/utils/getOrigin";
import { PostMessageService } from "coral-framework/lib/postMessage";

import { CleanupCallback, Decorator } from "./decorators";
import {
  FrameControl,
  FrameControlConfig,
  FrameControlFactory,
} from "./FrameControl";

export const defaultPymControlFactory: FrameControlFactory = (config) =>
  new PymFrameControl(config);

export default class PymFrameControl implements FrameControl {
  private readonly id: string;
  private readonly url: string;
  private readonly title: string;
  private readonly decorators: ReadonlyArray<Decorator>;

  public rendered = false;

  private parent: pym.Parent | null;
  private cleanups: CleanupCallback[] | null;

  constructor(config: FrameControlConfig) {
    this.id = config.id;
    this.url = config.url;
    this.title = config.title;
    this.decorators = config.decorators;
  }

  public render() {
    if (this.rendered) {
      // The instance has already been removed.
      return;
    }

    // Create the new pym.Parent that when created will create the iFrame.
    const parent = new pym.Parent(this.id, this.url, {
      title: this.title,
      id: `${this.id}_iframe`,
      name: `${this.id}_iframe`,
    });

    const iframe = parent.iframe as HTMLIFrameElement;
    const postMessage = new PostMessageService(
      "coral",
      iframe.contentWindow!,
      getOrigin(iframe.src)
    );

    // Run all the decorators on the parent, and capture any cleanup functions.
    const cleanups = this.decorators
      .map((enhance) => enhance(parent, postMessage))
      .filter((cb) => !!cb) as CleanupCallback[];

    this.rendered = true;
    this.parent = parent;
    this.cleanups = cleanups;
  }

  public sendMessage(id: string, message = "") {
    if (!this.rendered || !this.parent) {
      throw new Error("not mounted");
    }

    this.parent.sendMessage(id, message);
  }

  public remove() {
    if (!this.rendered || !this.parent || !this.cleanups) {
      throw new Error("not mounted");
    }

    this.cleanups.forEach((cb) => cb());
    this.cleanups = null;

    this.parent.remove();
    this.parent = null;

    this.rendered = false;
  }
}
