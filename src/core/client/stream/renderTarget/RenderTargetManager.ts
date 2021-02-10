import { Child } from "pym.js";

import { areWeInIframe } from "coral-framework/utils";

import { RenderTargetContext } from "./RenderTargetContext";

type ReleaseRenderTarget = () => void;
export type RenderTarget = keyof RenderTargetContext;

/**
 * Finds frame window with `name` inside of `parent`
 */
function getFrameWindow(name: string, parent: Window): Window {
  if (!parent) {
    throw new Error(`Parent window not available`);
  }
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < parent.frames.length; i++) {
    try {
      if (parent.frames[i].name === name) {
        return parent.frames[i];
      }
    } catch {
      continue;
    }
  }
  throw new Error(`Frame ${name} not found`);
}

/**
 * RenderTargetManager deals with all the logic of managing
 * a render target which usually lives in another iframe that
 * we control.
 */
class RenderTargetManager {
  private name: string;
  private target: string;
  private window: Window;
  private cachedFrameWindow: Window | null;
  private renderTargetCount: number;
  private pym?: Child;

  constructor(target: RenderTarget, window: Window, pym: Child | undefined) {
    this.target = target;
    this.name = `${window.name}_${target}`;
    this.window = window;
    this.renderTargetCount = 0;
    this.pym = pym;
  }
  public getWindow(): Window {
    if (!areWeInIframe(this.window)) {
      return this.window;
    }
    if (!this.pym) {
      throw new Error("Pym was not available");
    }
    if (!this.cachedFrameWindow) {
      this.cachedFrameWindow = getFrameWindow(this.name, this.window.parent);
    }
    return this.cachedFrameWindow;
  }

  private incRenderTargetCount() {
    if (this.renderTargetCount === 0) {
      this.sendRenderTargetAction("show");
    }
    this.renderTargetCount++;
  }

  private decRenderTargetCount() {
    this.renderTargetCount--;
    if (this.renderTargetCount === 0) {
      this.sendRenderTargetAction("hide");
    }
  }

  private sendRenderTargetAction(action: "show" | "hide") {
    if (!areWeInIframe(this.window)) {
      return;
    }
    if (!this.pym) {
      throw new Error("Pym was not available");
    }
    this.pym.sendMessage(
      "renderTargetAction",
      JSON.stringify({
        action,
        target: this.target,
      })
    );
  }

  public acquireRenderTarget(): [HTMLElement, ReleaseRenderTarget] {
    const frameWindow = this.getWindow();
    this.incRenderTargetCount();
    const div = frameWindow.document.createElement("div");
    frameWindow.document.body.appendChild(div);
    return [
      div,
      () => {
        this.decRenderTargetCount();
        div.parentElement!.removeChild(div);
      },
    ];
  }
}

export default RenderTargetManager;
