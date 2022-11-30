import { act, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";

import { pureMerge } from "coral-common/utils";
import { GQLResolver } from "coral-framework/schema";
import {
  createResolversStub,
  CreateTestRendererParams,
} from "coral-framework/testHelpers";

import customRenderAppWithContext from "../customRenderAppWithContext";
import { settings, stories, userWithEmail } from "../fixtures";
import { createWithContext } from "./create";

const story = stories[0];

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { context } = createWithContext({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          viewer: () => userWithEmail,
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

describe("change email form", () => {
  beforeEach(async () => {
    await act(async () => {
      await createTestRenderer({
        resolvers: createResolversStub<GQLResolver>({
          Query: {
            viewer: () => userWithEmail,
          },
          Mutation: {
            updateEmail: ({ variables }) => {
              expectAndFail(variables).toMatchObject({
                email: "updated_email@test.com",
              });
              return {
                user: {
                  ...userWithEmail,
                  email: "updated_email@test.com",
                },
              };
            },
          },
        }),
      });
    });
  });

  it("ensures email field is required", async () => {
    const changeEmail = await screen.findByTestId("profile-changeEmail");
    const editButton = within(changeEmail).getByRole("button", {
      name: "Change",
    });
    userEvent.click(editButton);
    expect(await axe(changeEmail)).toHaveNoViolations();
    const submitButton = within(changeEmail).getByRole("button", {
      name: "Save changes",
    });

    expect(submitButton).toBeDisabled();
  });

  it("ensures password field is required", async () => {
    const changeEmail = await screen.findByTestId("profile-changeEmail");
    const editButton = within(changeEmail).getByRole("button", {
      name: "Change",
    });
    userEvent.click(editButton);
    const emailInput = within(changeEmail).getByLabelText("New email address", {
      exact: false,
    });
    const submitButton = within(changeEmail).getByRole("button", {
      name: "Save changes",
    });
    userEvent.type(emailInput, "test@test.com");
    expect(submitButton).toBeDisabled();
  });

  it("updates email if fields are valid", async () => {
    const changeEmail = await screen.findByTestId("profile-changeEmail");
    const editButton = within(changeEmail).getByRole("button", {
      name: "Change",
    });
    userEvent.click(editButton);
    const emailInput = within(changeEmail).getByLabelText("New email address", {
      exact: false,
    });
    const password = within(changeEmail).getByLabelText("Password");
    const submitButton = within(changeEmail).getByRole("button", {
      name: "Save changes",
    });
    userEvent.type(emailInput, "updated_email@test.com");
    userEvent.type(password, "test");
    await act(async () => {
      userEvent.click(submitButton);
    });
    expect(
      within(changeEmail).getByText(
        "An email has been sent to updated_email@test.com to verify your account. You must verify your new email address before it can be used to sign in to your account or to receive notifications."
      )
    ).toBeVisible();
  });
});
