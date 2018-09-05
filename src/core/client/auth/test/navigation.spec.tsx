// Enable after this is solved: https://github.com/projectfluent/fluent.js/issues/280

import React from "react";
import TestRenderer, { ReactTestRenderer } from "react-test-renderer";
import { RecordProxy } from "relay-runtime";

import AppContainer from "talk-auth/containers/AppContainer";
import { TalkContext, TalkContextProvider } from "talk-framework/lib/bootstrap";
import { PostMessageService } from "talk-framework/lib/postMessage";
import { RestClient } from "talk-framework/lib/rest";
import { createInMemoryStorage } from "talk-framework/lib/storage";

import createEnvironment from "./createEnvironment";
import createFluentBundle from "./createFluentBundle";

function createTestRenderer(initialView: string): ReactTestRenderer {
  const environment = createEnvironment({
    initLocalState: (localRecord: RecordProxy) => {
      localRecord.setValue(initialView, "view");
    },
  });

  const context: TalkContext = {
    relayEnvironment: environment,
    localeBundles: [createFluentBundle()],
    localStorage: createInMemoryStorage(),
    sessionStorage: createInMemoryStorage(),
    rest: new RestClient("http://localhost/api"),
    postMessage: new PostMessageService(),
    browserInfo: { ios: false },
  };
  return TestRenderer.create(
    <TalkContextProvider value={context}>
      <AppContainer />
    </TalkContextProvider>
  );
}

it("renders sign in form", async () => {
  const testRenderer = createTestRenderer("SIGN_IN");
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("navigates to sign up form", async () => {
  const testRenderer = createTestRenderer("SIGN_IN");
  testRenderer.root
    .findByProps({ id: "signIn-gotoSignUpButton" })
    .props.onClick();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("navigates to sign in form", async () => {
  const testRenderer = createTestRenderer("SIGN_UP");
  testRenderer.root
    .findByProps({ id: "signUp-gotoSignInButton" })
    .props.onClick();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("navigates to forgot password form", async () => {
  const testRenderer = createTestRenderer("SIGN_IN");
  testRenderer.root
    .findByProps({ id: "signIn-gotoForgotPasswordButton" })
    .props.onClick();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});
