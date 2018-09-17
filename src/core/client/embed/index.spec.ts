import mockConsole from "jest-mock-console";
import * as Coral from "./";

// tslint:disable:no-console

describe("Basic integration test", () => {
  const container: HTMLElement = document.createElement("div");
  beforeAll(() => {
    container.id = "basic-integration-test-id";
    document.body.appendChild(container);
  });
  afterAll(() => {
    document.body.removeChild(container);
  });
  it("should render iframe", () => {
    mockConsole();
    const TalkEmbedStream = Coral.Talk.createStreamEmbed({
      id: "basic-integration-test-id",
    });
    TalkEmbedStream.render();
    expect(container.innerHTML).toMatchSnapshot();
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.error).not.toHaveBeenCalled();
  });
  it("should use canonical link", () => {
    mockConsole();
    const link = document.createElement("link");
    link.rel = "canonical";
    link.href = "http://localhost/canonical";
    document.head.appendChild(link);
    const TalkEmbedStream = Coral.Talk.createStreamEmbed({
      id: "basic-integration-test-id",
    });
    TalkEmbedStream.render();
    expect(container.innerHTML).toMatchSnapshot();
    document.head.removeChild(link);
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });
  it("should remove iframe", () => {
    mockConsole();
    const TalkEmbedStream = Coral.Talk.createStreamEmbed({
      id: "basic-integration-test-id",
    });
    TalkEmbedStream.render();
    TalkEmbedStream.remove();
    expect(container.innerHTML).toBe("");
    // tslint:disable-next-line:no-console
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.error).not.toHaveBeenCalled();
  });
});
