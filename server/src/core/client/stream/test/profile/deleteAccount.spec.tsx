import { act, fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";

import { pureMerge } from "coral-common/utils";
import { GQLResolver } from "coral-framework/schema";
import {
  createResolversStub,
  CreateTestRendererParams,
} from "coral-framework/testHelpers";

import customRenderAppWithContext from "../customRenderAppWithContext";
import { baseUser, settings, stories } from "../fixtures";
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
          viewer: () => baseUser,
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

describe("delete account steps", () => {
  beforeEach(async () => {
    await act(async () => {
      await createTestRenderer({
        resolvers: createResolversStub<GQLResolver>({
          Query: {
            viewer: () => baseUser,
          },
          Mutation: {
            requestAccountDeletion: ({ variables }) => {
              return {
                user: {
                  ...baseUser,
                  scheduledDeletionDate: new Date().toISOString(),
                },
              };
            },
          },
        }),
      });
    });
  });

  it("request account deletion button shows deletion modal", async () => {
    const deleteAccount = await screen.findByTestId(
      "profile-account-deleteAccount"
    );
    const requestDeletionButton = within(deleteAccount).getByRole("button", {
      name: "Request",
    });

    userEvent.click(requestDeletionButton);

    const modal = await screen.findByTestId("delete-account-modal");
    expect(modal).toBeVisible();
  });

  it("schedules deletion if deletion steps are followed", async () => {
    const deleteAccount = await screen.findByTestId(
      "profile-account-deleteAccount"
    );
    const requestDeletionButton = within(deleteAccount).getByRole("button", {
      name: "Request",
    });
    userEvent.click(requestDeletionButton);
    const modal = await screen.findByTestId("delete-account-modal");

    // iterate through the delete account modal steps
    for (let i = 0; i < 3; i++) {
      const nextButton = within(modal).getByRole("button", {
        name: "Proceed",
      });
      userEvent.click(nextButton);
    }

    expect(await axe(modal)).toHaveNoViolations();
    const confirm = within(modal).getByTestId("confirm-page-confirmation");
    const password = within(modal).getByTestId("password-field");
    const submitButton = within(modal).getByRole("button", {
      name: "Delete my account",
    });

    userEvent.type(confirm, "delete");
    userEvent.type(password, "password");

    userEvent.click(submitButton);

    const successHeader = await within(modal).findByText("Request submitted", {
      exact: false,
    });
    expect(successHeader).toBeDefined();
  });

  it("deletion confirmation is required during deletion steps", async () => {
    const deleteAccount = await screen.findByTestId(
      "profile-account-deleteAccount"
    );

    const requestDeletionButton = within(deleteAccount).getByRole("button", {
      name: "Request",
    });

    userEvent.click(requestDeletionButton);

    const modal = await screen.findByTestId("delete-account-modal");

    // iterate through the delete account modal steps
    for (let i = 0; i < 3; i++) {
      const nextButton = within(modal).getByRole("button", {
        name: "Proceed",
      });
      userEvent.click(nextButton);
    }
    const password = within(modal).getByTestId("password-field");

    userEvent.type(password, "password");

    const submitButton = within(modal).getByRole("button", {
      name: "Delete my account",
    });
    expect(submitButton).toBeDisabled();
  });

  it("password is required during deletion steps", async () => {
    const deleteAccount = await screen.findByTestId(
      "profile-account-deleteAccount"
    );

    const requestDeletionButton = within(deleteAccount).getByRole("button", {
      name: "Request",
    });
    fireEvent.click(requestDeletionButton);

    const modal = await screen.findByTestId("delete-account-modal");

    // iterate through the delete account modal steps
    for (let i = 0; i < 3; i++) {
      const nextButton = within(modal).getByRole("button", {
        name: "Proceed",
      });
      userEvent.click(nextButton);
    }
    const confirm = within(modal).getByTestId("confirm-page-confirmation");

    userEvent.type(confirm, "delete");
    const submitButton = within(modal).getByRole("button", {
      name: "Delete my account",
    });
    expect(submitButton).toBeDisabled();
  });
});
