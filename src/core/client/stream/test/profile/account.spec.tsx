import { act, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import sinon from "sinon";

import { pureMerge } from "coral-common/utils";
import { GQLResolver } from "coral-framework/schema";
import {
  createResolversStub,
  CreateTestRendererParams,
} from "coral-framework/testHelpers";

import customRenderAppWithContext from "../customRenderAppWithContext";
import {
  settings,
  settingsWithoutLocalAuth,
  stories,
  viewerPassive,
} from "../fixtures";
import { createWithContext } from "./create";

const story = stories[0];
const viewer = viewerPassive;

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { context } = createWithContext({
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
  customRenderAppWithContext(context);

  return {
    context,
  };
}

it("renders the empty settings pane", async () => {
  await act(async () => {
    await createTestRenderer();
  });
  const account = await screen.findByTestId("profile-manageAccount");
  expect(account).toMatchSnapshot();
  expect(await axe(account)).toHaveNoViolations();
});

it("doesn't show the change password pane when local auth is disabled", async () => {
  await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        settings: () => settingsWithoutLocalAuth,
      },
    }),
  });
  const account = await screen.findByTestId("profile-manageAccount");
  const changePassword = within(account).queryByTestId(
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
  await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Mutation: {
        updatePassword,
      },
    }),
  });
  const changePassword = await screen.findByTestId(
    "profile-account-changePassword"
  );
  const editButton = within(changePassword).getByText("Change");
  userEvent.click(editButton);

  const oldPassword = within(changePassword).getByLabelText("Old Password");
  const newPassword = within(changePassword).getByLabelText("New Password");
  expect(await axe(changePassword)).toHaveNoViolations();

  const submitButton = within(changePassword).getByRole("button", {
    name: "Change Password",
  });
  expect(submitButton).toBeDisabled();

  // Password too short.
  userEvent.clear(oldPassword);
  userEvent.type(oldPassword, "test");
  userEvent.clear(newPassword);
  userEvent.type(newPassword, "test");
  userEvent.click(submitButton);
  expect(
    await within(changePassword).findAllByText(
      "Password must contain at least 8 characters",
      {
        exact: false,
      }
    )
  ).toHaveLength(2);

  userEvent.clear(oldPassword);
  userEvent.type(oldPassword, "testtest");
  userEvent.clear(newPassword);
  userEvent.type(newPassword, "testtest");
  await act(async () => {
    userEvent.click(submitButton);
  });

  expect(updatePassword.calledOnce).toBeTruthy();
});
