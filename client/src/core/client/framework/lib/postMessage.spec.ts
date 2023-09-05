import { PostMessageService } from "./postMessage";

it("post and subscribe to a message", (done) => {
  const postMessage = new PostMessageService(window, "coral", window, "*");
  const cancel = postMessage.on("test", (value) => {
    expect(value).toBe("value");
    done();
    cancel();
  });
  postMessage.send("test", "value", window);
});

it("should support complex value", (done) => {
  const complex = { foo: "bar" };
  const postMessage = new PostMessageService(window, "coral", window, "*");
  const cancel = postMessage.on("test", (value) => {
    expect(value).toBe(complex);
    done();
    cancel();
  });
  postMessage.send("test", complex, window);
});

it("send to a different origin", (done) => {
  const postMessage = new PostMessageService(window, "coral", window, "*");
  const cancelA = postMessage.on("testA", (value) => {
    throw new Error("Should not reach this");
  });
  const cancelB = postMessage.on("testB", (value) => {
    done();
    cancelA();
    cancelB();
  });
  postMessage.send("testA", "value", window, "http://i-do-not-exist.de");
  postMessage.send("testB", "value", window);
});

it("should cancel", (done) => {
  const postMessage = new PostMessageService(window, "coral", window, "*");
  const cancelA = postMessage.on("testA", (value) => {
    throw new Error("Should not reach this");
  });
  const cancelB = postMessage.on("testB", (value) => {
    done();
    cancelB();
  });
  cancelA();
  postMessage.send("testA", "value", window);
  postMessage.send("testB", "value", window);
});

it("different message names are isolated", (done) => {
  const postMessage = new PostMessageService(window, "coral", window, "*");
  const cancelA = postMessage.on("testA", (value) => {
    expect(value).toBe("valueA");
  });
  const cancelB = postMessage.on("testB", (value) => {
    expect(value).toBe("valueB");
    done();
    cancelA();
    cancelB();
  });
  postMessage.send("testA", "valueA", window);
  postMessage.send("testB", "valueB", window);
});
