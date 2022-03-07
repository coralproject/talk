import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { pureMerge } from "coral-common/utils";
import { GQLResolver } from "coral-framework/schema";
import {
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
} from "coral-framework/testHelpers";

import { createContext } from "../create";
import customRenderAppWithContext from "../customRenderAppWithContext";
import { settings, siteConnection, users } from "../fixtures";

beforeEach(() => {
  replaceHistoryLocation("http://localhost/admin/configure/organization");
});

const viewer = users.admins[0];

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { context } = createContext({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          viewer: () => viewer,
          sites: () => siteConnection,
        },
      }),
      params.resolvers
    ),
    initLocalState: (localRecord, source, environment) => {
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });
  return context;
}

it("change organization name", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      updateSettings: ({ variables }) => {
        expectAndFail(variables.settings.organization!.name).toEqual(
          "Coral Test"
        );
        return {
          settings: pureMerge(settings, variables.settings),
        };
      },
    },
  });
  const context = await createTestRenderer({ resolvers });

  customRenderAppWithContext(context);

  const organizationNameField = await screen.findByRole("textbox", {
    name: /Organization name/i,
  });
  const saveChangesButton = screen.getByRole("button", {
    name: /Save Changes/i,
  });
  const organizationContainer = screen.getByTestId(
    "configure-organizationContainer"
  );

  // shows validation error when form submitted without required name field
  userEvent.clear(organizationNameField);
  userEvent.click(saveChangesButton);
  expect(
    within(organizationContainer).getByText("This field is required.")
  ).toBeDefined();

  // successfully submits with no validation error with required name field
  userEvent.type(organizationNameField, "Coral Test");
  expect(
    within(organizationContainer).queryByText("This field is required.")
  ).toBeNull();
  userEvent.click(saveChangesButton);

  // Submit button and text field should be disabled.
  expect(saveChangesButton).toBeDisabled();
  expect(organizationNameField).toBeDisabled();

  // Should have successfully sent with server.
  expect(resolvers.Mutation!.updateSettings!.called).toBe(true);
});
