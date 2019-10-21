import mockConsole from "jest-mock-console";

import { COUNT_SELECTOR } from "coral-framework/constants";

import * as Coral from "../";

/* eslint-disable no-console */

describe("Basic integration test", () => {
  const container: HTMLElement = document.createElement("div");
  beforeAll(() => {
    container.id = "basic-integration-test-id";
    document.body.appendChild(container);
  });
  afterAll(() => {
    document.body.removeChild(container);
  });
  it("should not inject count script", () => {
    mockConsole();
    const CoralEmbedStream = Coral.createStreamEmbed({
      id: "basic-integration-test-id",
    });
    CoralEmbedStream.render();
    expect(document.head.querySelector("script")).toBeNull();
  });
  it("should inject count script", () => {
    mockConsole();
    const commentCount: HTMLElement = document.createElement("div");
    commentCount.className = "coral-count";
    document.body.appendChild(commentCount);
    Coral.createStreamEmbed({
      id: "basic-integration-test-id",
    });
    const s = document.head.querySelector("script");
    expect(s).not.toBeNull();
    expect(s!.defer).toBe(true);
    document.head.removeChild(s!);
    document.body.removeChild(commentCount);
  });
  it("should not inject count script when it's already there", () => {
    mockConsole();

    // Make detectCountScript return true.
    (window as any).CoralCount = {};

    const commentCount: HTMLElement = document.createElement("div");
    commentCount.className = COUNT_SELECTOR;
    document.body.appendChild(commentCount);
    const CoralEmbedStream = Coral.createStreamEmbed({
      id: "basic-integration-test-id",
    });
    CoralEmbedStream.render();
    expect(document.head.querySelector("script")).toBeNull();
    document.body.removeChild(commentCount);

    delete (window as any).CoralCount;
  });
});
