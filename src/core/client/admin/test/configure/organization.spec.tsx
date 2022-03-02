import { noop } from "lodash";

import { pureMerge } from "coral-common/utils";
import { GQLResolver } from "coral-framework/schema";
import {
  act,
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
  wait,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import create from "../create";
import { settings, siteConnection, users } from "../fixtures";

beforeEach(() => {
  replaceHistoryLocation("http://localhost/admin/configure/organization");
});

const viewer = users.admins[0];

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { testRenderer } = create({
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
  const configureContainer = await waitForElement(() =>
    within(testRenderer.root).getByTestID("configure-container")
  );
  const organizationContainer = await waitForElement(() =>
    within(configureContainer).getByTestID("configure-organizationContainer")
  );
  const saveChangesButton = within(configureContainer).getByTestID(
    "configure-sideBar-saveChanges"
  );
  return {
    testRenderer,
    configureContainer,
    organizationContainer,
    saveChangesButton,
  };
}

it("renders configure organization", async () => {
  const { configureContainer } = await createTestRenderer();
  expect(within(configureContainer).toJSON()).toMatchSnapshot();
});

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
  const {
    configureContainer,
    organizationContainer,
    saveChangesButton,
  } = await createTestRenderer({ resolvers });

  const organizationNameField = within(organizationContainer).getByLabelText(
    "Organization name"
  );

  // Let's change some organization name.
  act(() => organizationNameField.props.onChange(""));

  // Send form
  act(() => {
    within(configureContainer)
      .getByType("form")
      .props.onSubmit({ preventDefault: noop });
  });

  // Should show validation error.
  within(organizationContainer).getByText("This field is required.");

  // Let's change to some valid organization name.
  act(() => organizationNameField.props.onChange("Coral Test"));

  // Should not show validation error.
  expect(
    within(organizationContainer).queryByText("This field is required.")
  ).toBeNull();

  // Send form
  act(() => {
    within(configureContainer)
      .getByType("form")
      .props.onSubmit({ preventDefault: noop });
  });

  // Submit button and text field should be disabled.
  expect(saveChangesButton.props.disabled).toBe(true);
  expect(organizationNameField.props.disabled).toBe(true);

  // Wait for submission to be finished
  await act(async () => {
    await wait(() => {
      expect(organizationNameField.props.disabled).toBe(false);
    });
  });

  // Should have successfully sent with server.
  expect(resolvers.Mutation!.updateSettings!.called).toBe(true);
});
