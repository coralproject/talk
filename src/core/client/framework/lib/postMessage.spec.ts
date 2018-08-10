import { PostMessageService } from "./postMessage";

it("post and subscribe to a message", done => {
  const postMessage = new PostMessageService();
  const cancel = postMessage.on("test", value => {
    expect(value).toBe("value");
    done();
    cancel();
  });
  postMessage.send("test", "value", window);
});

it("send to a different origin", done => {
  const postMessage = new PostMessageService();
  const cancelA = postMessage.on("testA", value => {
    throw new Error("Should not reach this");
  });
  const cancelB = postMessage.on("testB", value => {
    done();
    cancelA();
    cancelB();
  });
  postMessage.send("testA", "value", window, "http://i-do-not-exist.de");
  postMessage.send("testB", "value", window);
});

it("should cancel", done => {
  const postMessage = new PostMessageService();
  const cancelA = postMessage.on("testA", value => {
    throw new Error("Should not reach this");
  });
  const cancelB = postMessage.on("testB", value => {
    done();
    cancelB();
  });
  cancelA();
  postMessage.send("testA", "value", window);
  postMessage.send("testB", "value", window);
});

it("different scopes are isolated", done => {
  const postMessageA = new PostMessageService("scopeA");
  const postMessageB = new PostMessageService("scopeB");
  const cancelA = postMessageA.on("testA", value => {
    throw new Error("Should not reach this");
  });
  const cancelB = postMessageA.on("testB", value => {
    done();
    cancelA();
    cancelB();
  });
  postMessageB.send("testA", "value", window);
  postMessageA.send("testB", "value", window);
});

it("different message names are isolated", done => {
  const postMessage = new PostMessageService();
  const cancelA = postMessage.on("testA", value => {
    expect(value).toBe("valueA");
  });
  const cancelB = postMessage.on("testB", value => {
    expect(value).toBe("valueB");
    done();
    cancelA();
    cancelB();
  });
  postMessage.send("testA", "valueA", window);
  postMessage.send("testB", "valueB", window);
});
