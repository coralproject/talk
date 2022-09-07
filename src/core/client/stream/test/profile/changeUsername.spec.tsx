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
import {
  settings,
  stories,
  userWithChangedUsername,
  userWithNewUsername,
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

describe("with recently changed username", () => {
  beforeEach(async () => {
    await act(async () => {
      await createTestRenderer({
        resolvers: createResolversStub<GQLResolver>({
          Query: {
            viewer: () => userWithChangedUsername,
          },
        }),
      });
    });
  });

  it("does not allow editing", async () => {
    const changeUsername = await screen.findByTestId("profile-changeUsername");
    within(changeUsername).getByText("u_changed");
    const editButton = within(changeUsername).getByRole("button", {
      name: "Change",
    });
    userEvent.click(editButton);
    const form = within(changeUsername).queryByTestId(
      "profile-changeUsername-form"
    );
    const message = within(changeUsername).getByText(
      "You changed your username within the last 14 days",
      {
        exact: false,
      }
    );
    expect(form).toBeNull();
    expect(message).toBeVisible();
  });
});

describe("with new username", () => {
  beforeEach(async () => {
    await act(async () => {
      await createTestRenderer({
        resolvers: createResolversStub<GQLResolver>({
          Query: {
            viewer: () => userWithNewUsername,
          },
        }),
      });
    });
  });

  it("shows username change form", async () => {
    const changeUsername = await screen.findByTestId("profile-changeUsername");

    within(changeUsername).getByText("u_original");
    const editButton = within(changeUsername).getByRole("button", {
      name: "Change",
    });
    userEvent.click(editButton);
    expect(await axe(changeUsername)).toHaveNoViolations();
    const form = within(changeUsername).queryByTestId(
      "profile-changeUsername-form"
    );
    expect(form).toBeVisible();
    const message = within(changeUsername).queryByText(
      "Your username has been changed in the last 14 days",
      {
        exact: false,
      }
    );
    expect(message).toBeNull();
  });
});

describe("change username form", () => {
  beforeEach(async () => {
    await act(async () => {
      await createTestRenderer({
        resolvers: createResolversStub<GQLResolver>({
          Query: {
            viewer: () => userWithNewUsername,
          },
          Mutation: {
            updateUsername: ({ variables }) => {
              expectAndFail(variables).toMatchObject({
                username: "updated_username",
              });
              return {
                user: {
                  ...userWithNewUsername,
                  username: "updated_username",
                },
              };
            },
          },
        }),
      });
    });
  });

  it("ensures username field is required", async () => {
    const changeUsername = await screen.findByTestId("profile-changeUsername");
    const editButton = within(changeUsername).getByRole("button", {
      name: "Change",
    });
    userEvent.click(editButton);
    const saveChanges = within(changeUsername).getByRole("button", {
      name: "Save Changes",
    });
    expect(saveChanges).toBeDisabled();
  });

  it("ensures username confirmation matches", async () => {
    const changeUsername = await screen.findByTestId("profile-changeUsername");
    const editButton = within(changeUsername).getByRole("button", {
      name: "Change",
    });
    userEvent.click(editButton);
    const username = within(changeUsername).getByRole("textbox", {
      name: "New username",
    });
    const usernameConfirm = within(changeUsername).getByRole("textbox", {
      name: "Confirm new username",
    });
    userEvent.type(username, "testusername");
    userEvent.type(usernameConfirm, "test");
    const saveChanges = within(changeUsername).getByRole("button", {
      name: "Save Changes",
    });
    expect(saveChanges).toBeDisabled();
  });

  it("updates username if fields are valid", async () => {
    const changeUsername = await screen.findByTestId("profile-changeUsername");
    const editButton = within(changeUsername).getByRole("button", {
      name: "Change",
    });
    userEvent.click(editButton);
    const username = within(changeUsername).getByRole("textbox", {
      name: "New username",
    });
    const usernameConfirm = within(changeUsername).getByRole("textbox", {
      name: "Confirm new username",
    });
    userEvent.type(username, "updated_username");
    userEvent.type(usernameConfirm, "updated_username");
    const saveChanges = within(changeUsername).getByRole("button", {
      name: "Save Changes",
    });
    expect(saveChanges).toBeEnabled();
    await act(async () => {
      userEvent.click(saveChanges);
    });

    expect(
      within(changeUsername).getByText(
        "Your username has been successfully updated"
      )
    ).toBeVisible();
  });
});
