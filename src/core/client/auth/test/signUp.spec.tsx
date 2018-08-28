import React from "react";
import TestRenderer, { ReactTestInstance } from "react-test-renderer";
import { RecordProxy } from "relay-runtime";
import sinon from "sinon";

import AppContainer from "talk-auth/containers/AppContainer";
import { animationFrame, timeout } from "talk-common/utils";
import { TalkContext, TalkContextProvider } from "talk-framework/lib/bootstrap";
import { PostMessageService } from "talk-framework/lib/postMessage";
import { RestClient } from "talk-framework/lib/rest";
import { createInMemoryStorage } from "talk-framework/lib/storage";

import createEnvironment from "./createEnvironment";

const environment = createEnvironment({
  initLocalState: (localRecord: RecordProxy) => {
    localRecord.setValue("SIGN_UP", "view");
  },
});

const context: TalkContext = {
  relayEnvironment: environment,
  localeBundles: [],
  localStorage: createInMemoryStorage(),
  sessionStorage: createInMemoryStorage(),
  rest: new RestClient("http://localhost/api"),
  postMessage: new PostMessageService(),
};

const testRenderer = TestRenderer.create(
  <TalkContextProvider value={context}>
    <AppContainer />
  </TalkContextProvider>
);

const inputPredicate = (name: string) => (n: ReactTestInstance) => {
  return n.props.name === name && n.props.onChange;
};

const form = testRenderer.root.findByType("form");

it("renders sign up form", async () => {
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("shows error when submitting empty form", async () => {
  form.props.onSubmit();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("checks for invalid email", async () => {
  form
    .find(inputPredicate("email"))
    .props.onChange({ target: { value: "invalid-email" } });
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("accepts valid email", async () => {
  form
    .find(inputPredicate("email"))
    .props.onChange({ target: { value: "hans@test.com" } });
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("checks for too short username", async () => {
  form
    .find(inputPredicate("username"))
    .props.onChange({ target: { value: "u" } });
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("checks for too long username", async () => {
  form
    .find(inputPredicate("username"))
    .props.onChange({ target: { value: "a".repeat(100) } });
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("checks for invalid characters in username", async () => {
  form
    .find(inputPredicate("username"))
    .props.onChange({ target: { value: "$%$§$%$§%" } });
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("accepts valid username", async () => {
  form
    .find(inputPredicate("username"))
    .props.onChange({ target: { value: "hans" } });
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("checks for too short password", async () => {
  form
    .find(inputPredicate("password"))
    .props.onChange({ target: { value: "pass" } });
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("accepts correct password", async () => {
  form
    .find(inputPredicate("password"))
    .props.onChange({ target: { value: "testtest" } });
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("checks for wrong password confirmation", async () => {
  form
    .find(inputPredicate("confirmPassword"))
    .props.onChange({ target: { value: "not-matching" } });
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("accepts correct password confirmation", async () => {
  form
    .find(inputPredicate("confirmPassword"))
    .props.onChange({ target: { value: "testtest" } });
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("shows server error", async () => {
  const windowMock = sinon.mock(window);
  windowMock.expects("resizeTo");

  const error = new Error("Server Error");
  const restMock = sinon.mock(context.rest);
  restMock
    .expects("fetch")
    .withArgs("/tenant/auth/local/signup", {
      method: "POST",
      body: {
        username: "hans",
        email: "hans@test.com",
        password: "testtest",
      },
    })
    .once()
    .throws(error);

  const postMessageMock = sinon.mock(context.postMessage);
  postMessageMock
    .expects("send")
    .withArgs("authError", error.toString(), window.opener)
    .once();

  form.props.onSubmit();
  expect(testRenderer.toJSON()).toMatchSnapshot();
  // popup resize will be triggered if we wait for the animation frame first.
  await animationFrame();
  await timeout();
  expect(testRenderer.toJSON()).toMatchSnapshot();
  restMock.verify();
  postMessageMock.verify();
  windowMock.verify();
});

it("submits form successfully", async () => {
  const windowMock = sinon.mock(window);
  windowMock.expects("close").once();
  windowMock.expects("resizeTo");

  const restMock = sinon.mock(context.rest);
  restMock
    .expects("fetch")
    .withArgs("/tenant/auth/local/signup", {
      method: "POST",
      body: {
        username: "hans",
        email: "hans@test.com",
        password: "testtest",
      },
    })
    .once()
    .returns({ token: "auth-token" });

  const postMessageMock = sinon.mock(context.postMessage);
  postMessageMock
    .expects("send")
    .withArgs("setAuthToken", "auth-token", window.opener)
    .once();

  form.props.onSubmit();
  expect(testRenderer.toJSON()).toMatchSnapshot();
  // popup resize will be triggered if we wait for the animation frame first.
  await animationFrame();
  await timeout();
  expect(testRenderer.toJSON()).toMatchSnapshot();
  restMock.verify();
  postMessageMock.verify();
  windowMock.verify();
});
