import { ReactTestRenderer } from "react-test-renderer";
import sinon from "sinon";

import { act, waitForElement, within } from "coral-framework/testHelpers";

import create from "./create";
import { settings } from "./fixtures";

async function createTestRenderer(
  initialView: string
): Promise<ReactTestRenderer> {
  const resolvers = {
    Query: {
      settings: sinon.stub().returns(settings),
    },
  };
  const { testRenderer } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: (localRecord) => {
      localRecord.setValue(initialView, "view");
    },
  });
  return testRenderer;
}

it("renders sign in form", async () => {
  const testRenderer = await createTestRenderer("SIGN_IN");
  await waitForElement(() =>
    within(testRenderer.root).getByTestID("signIn-container")
  );
});

it("navigates to sign up form", async () => {
  const testRenderer = await createTestRenderer("SIGN_IN");
  const container = await waitForElement(() =>
    within(testRenderer.root).getByTestID("signIn-container")
  );
  act(() => within(container).getByText("Sign up").props.onClick({}));
  await waitForElement(() =>
    within(testRenderer.root).getByTestID("signUp-container")
  );
});

it("navigates to sign in form", async () => {
  const testRenderer = await createTestRenderer("SIGN_UP");
  const container = await waitForElement(() =>
    within(testRenderer.root).getByTestID("signUp-container")
  );
  act(() => within(container).getByText("Sign in").props.onClick({}));
  await waitForElement(() =>
    within(testRenderer.root).getByTestID("signIn-container")
  );
});

it("navigates to forgot password form", async () => {
  const testRenderer = await createTestRenderer("SIGN_IN");
  const container = await waitForElement(() =>
    within(testRenderer.root).getByTestID("signIn-container")
  );
  act(() =>
    within(container).getByText("Forgot your password?").props.onClick({})
  );
  await waitForElement(() =>
    within(testRenderer.root).getByTestID("forgotPassword-container")
  );
});

it("navigates back from forgot password form", async () => {
  const testRenderer = await createTestRenderer("FORGOT_PASSWORD");
  const container = await waitForElement(() =>
    within(testRenderer.root).getByTestID("forgotPassword-container")
  );
  act(() =>
    within(container)
      .getByText("back to sign in", { exact: false })
      .props.onClick({})
  );
  await waitForElement(() =>
    within(testRenderer.root).getByTestID("signIn-container")
  );
});
