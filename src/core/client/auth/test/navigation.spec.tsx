import { ReactTestRenderer } from "react-test-renderer";

import create from "./create";

function createTestRenderer(initialView: string): ReactTestRenderer {
  const { testRenderer } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    initLocalState: localRecord => {
      localRecord.setValue(initialView, "view");
    },
  });
  return testRenderer;
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
