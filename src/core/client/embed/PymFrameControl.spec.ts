import sinon from "sinon";
import timekeeper from "timekeeper";

import { Decorator } from "./decorators";
import PymFrameControl from "./PymFrameControl";

describe("PymControl", () => {
  const container: HTMLElement = document.createElement("div");
  const cleanupDecorator = sinon.mock().once();

  const withMockDecorator: Decorator = sinon
    .mock()
    .once()
    .withArgs(sinon.match.object)
    .returns(cleanupDecorator);

  let control: PymFrameControl;
  beforeAll(() => {
    timekeeper.freeze(new Date(1589310827300));
    container.id = "pymcontrol-test-id";
    document.body.appendChild(container);
  });
  afterAll(() => {
    timekeeper.reset();
    document.body.removeChild(container);
  });
  it("should create iframe", () => {
    control = new PymFrameControl({
      decorators: [withMockDecorator],
      id: container.id,
      url: "http://coralproject.net",
      title: "iFrame title",
    });
    control.render();
    expect(container.innerHTML).toMatchSnapshot();
  });
  it("should send message", (done) => {
    const messages: MessageEvent[] = [];
    const messageRecorder = (e: MessageEvent) => messages.push(e);
    const contentWindow = (container.firstChild as HTMLIFrameElement)
      .contentWindow!;
    contentWindow.addEventListener("message", messageRecorder, false);
    control.sendMessage("test", "hello world");

    setTimeout(() => {
      contentWindow.removeEventListener("message", messageRecorder, false);
      expect(messages).toHaveLength(1);
      expect(messages[0].data).toMatchSnapshot();
      done();
    });
  });
  it("should remove iframe", () => {
    control.remove();
    expect(container.innerHTML).toBe("");
  });
  it("should cleanup decorators", () => {
    cleanupDecorator.verify();
  });
});
