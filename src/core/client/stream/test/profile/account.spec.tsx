import sinon from "sinon";

import { pureMerge } from "coral-common/utils";
import {
  act,
  createResolversStub,
  CreateTestRendererParams,
  waitForElement,
  within,
} from "coral-framework/testHelpers";
import { GQLResolver } from "coral-framework/testHelpers/schema";

import {
  settings,
  settingsWithoutLocalAuth,
  stories,
  viewerPassive,
} from "../fixtures";
import create from "./create";

const story = stories[0];
const viewer = viewerPassive;

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { testRenderer, context } = create({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          viewer: () => viewer,
          stream: () => story,
        },
      }),
      params.resolvers
    ),
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue("ACCOUNT", "profileTab");
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });

  return {
    testRenderer,
    context,
  };
}

it("renders the empty settings pane", async () => {
  const {
    testRenderer: { root },
  } = await createTestRenderer();
  const account = await waitForElement(() =>
    within(root).getByTestID("profile-manageAccount")
  );
  expect(within(account).toJSON()).toMatchSnapshot();
  expect(await within(account).axe()).toHaveNoViolations();
});

it("doesn't show the change password pane when local auth is disabled", async () => {
  const {
    testRenderer: { root },
  } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        settings: () => settingsWithoutLocalAuth,
      },
    }),
  });
  const account = await waitForElement(() =>
    within(root).getByTestID("profile-manageAccount")
  );
  const changePassword = within(account).queryByTestID(
    "profile-account-changePassword"
  );
  expect(changePassword).toBeNull();
});

it("render password change form", async () => {
  const updatePassword = sinon.stub().callsFake((_: any, { input }) => {
    expectAndFail(input).toMatchObject({
      oldPassword: "testtest",
      newPassword: "testtest",
    });
    return {
      clientMutationId: input.clientMutationId,
    };
  });
  const { testRenderer } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Mutation: {
        updatePassword,
      },
    }),
  });
  const changePassword = await waitForElement(() =>
    within(testRenderer.root).getByTestID("profile-account-changePassword")
  );
  const editButton = within(changePassword).getByText("Change");
  act(() => {
    editButton.props.onClick();
  });

  const form = within(changePassword).getByType("form");
  const oldPassword = await waitForElement(() =>
    within(form).getByID("oldPassword", { exact: false })
  );
  const newPassword = await waitForElement(() =>
    within(form).getByID("newPassword", { exact: false })
  );
  expect(await within(changePassword).axe()).toHaveNoViolations();

  // Submit an empty form.
  act(() => {
    form.props.onSubmit();
  });
  within(changePassword).getAllByText("field is required", {
    exact: false,
  });

  // Password too short.
  act(() => {
    oldPassword.props.onChange("test");
    newPassword.props.onChange("test");
  });
  within(changePassword).getAllByText(
    "Password must contain at least 8 characters",
    {
      exact: false,
    }
  );

  await act(async () => {
    oldPassword.props.onChange("testtest");
    newPassword.props.onChange("testtest");
    await form.props.onSubmit();
  });

  expect(updatePassword.calledOnce).toBeTruthy();
});
