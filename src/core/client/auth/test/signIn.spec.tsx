import React from "react";
import TestRenderer, {
  ReactTestInstance,
  ReactTestRenderer,
} from "react-test-renderer";
import { RecordProxy } from "relay-runtime";
import sinon from "sinon";

import AppContainer from "talk-auth/containers/AppContainer";
import { animationFrame, timeout } from "talk-common/utils";
import { TalkContext, TalkContextProvider } from "talk-framework/lib/bootstrap";
import { PostMessageService } from "talk-framework/lib/postMessage";
import { RestClient } from "talk-framework/lib/rest";
import { createInMemoryStorage } from "talk-framework/lib/storage";

import createEnvironment from "./createEnvironment";
import createFluentBundle from "./createFluentBundle";

const inputPredicate = (name: string) => (n: ReactTestInstance) => {
  return n.props.name === name && n.props.onChange;
};

let context: TalkContext;
let testRenderer: ReactTestRenderer;
let form: ReactTestInstance;
beforeEach(() => {
  const environment = createEnvironment({
    initLocalState: (localRecord: RecordProxy) => {
      localRecord.setValue("SIGN_IN", "view");
    },
  });

  context = {
    relayEnvironment: environment,
    localeBundles: [createFluentBundle()],
    localStorage: createInMemoryStorage(),
    sessionStorage: createInMemoryStorage(),
    rest: new RestClient("http://localhost/api"),
    postMessage: new PostMessageService(),
  };

  testRenderer = TestRenderer.create(
    <TalkContextProvider value={context}>
      <AppContainer />
    </TalkContextProvider>
  );
  form = testRenderer.root.findByType("form");
});

it("renders sign in form", async () => {
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
  form.props.onSubmit();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("accepts valid email", async () => {
  form
    .find(inputPredicate("email"))
    .props.onChange({ target: { value: "hans@test.com" } });
  form.props.onSubmit();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("accepts correct password", async () => {
  form
    .find(inputPredicate("password"))
    .props.onChange({ target: { value: "testtest" } });
  form.props.onSubmit();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("shows server error", async () => {
  form
    .find(inputPredicate("email"))
    .props.onChange({ target: { value: "hans@test.com" } });
  form
    .find(inputPredicate("password"))
    .props.onChange({ target: { value: "testtest" } });

  const windowMock = sinon.mock(window);
  windowMock.expects("resizeTo");

  const error = new Error("Server Error");
  const restMock = sinon.mock(context.rest);
  restMock
    .expects("fetch")
    .withArgs("/tenant/auth/local", {
      method: "POST",
      body: {
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
  form
    .find(inputPredicate("email"))
    .props.onChange({ target: { value: "hans@test.com" } });
  form
    .find(inputPredicate("password"))
    .props.onChange({ target: { value: "testtest" } });

  const windowMock = sinon.mock(window);
  windowMock.expects("close").once();
  windowMock.expects("resizeTo");

  const restMock = sinon.mock(context.rest);
  restMock
    .expects("fetch")
    .withArgs("/tenant/auth/local", {
      method: "POST",
      body: {
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
