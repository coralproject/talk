import { ReactTestRenderer } from "react-test-renderer";

import { pureMerge } from "coral-common/utils";
import { GQLResolver } from "coral-framework/schema";
import {
  act,
  createResolversStub,
  CreateTestRendererParams,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import { baseUser, settings, stories } from "../fixtures";
import create from "./create";

const story = stories[0];

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { testRenderer, context } = create({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          viewer: () => baseUser,
          story: () => story,
        },
      }),
      params.resolvers
    ),
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue("SETTINGS", "profileTab");
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

describe("delete account steps", () => {
  let testRenderer: ReactTestRenderer;
  beforeEach(async () => {
    const setup = await createTestRenderer({
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
    testRenderer = setup.testRenderer;
  });

  it("request account deletion button shows deletion modal", async () => {
    const deleteAccount = await waitForElement(() =>
      within(testRenderer.root).queryByTestID("profile-settings-deleteAccount")
    );

    const requestDeletionButton = within(deleteAccount).getByText("Request", {
      selector: "button",
    });
    act(() => {
      requestDeletionButton.props.onClick();
    });

    const modal = await waitForElement(() =>
      within(testRenderer.root).getByTestID("delete-account-modal")
    );

    expect(modal).toBeDefined();
  });

  it("schedules deletion if deletion steps are followed", async () => {
    const deleteAccount = await waitForElement(() =>
      within(testRenderer.root).queryByTestID("profile-settings-deleteAccount")
    );

    const requestDeletionButton = within(deleteAccount).getByText("Request", {
      selector: "button",
    });
    act(() => {
      requestDeletionButton.props.onClick();
    });
    const modal = await waitForElement(() =>
      within(testRenderer.root).getByTestID("delete-account-modal")
    );
    // iterate through the delete account modal steps
    for (let i = 0; i < 3; i++) {
      const nextButton = await waitForElement(() =>
        within(modal).getByText("Proceed", { selector: "button" })
      );
      act(() => {
        nextButton.props.onClick();
      });
    }
    const form = within(modal).getByType("form");
    const confirm = within(modal).getByTestID("confirm-page-confirmation");
    const password = within(modal).getByTestID("confirm-page-password");

    await act(async () => {
      confirm.props.onChange("delete");
      password.props.onChange("password");
      await form.props.onSubmit();
    });

    const successHeader = within(modal).getByText(
      "Account deletion requested",
      { exact: false }
    );
    expect(successHeader).toBeDefined();
  });

  it("deletion confirmation is required during deletion steps", async () => {
    const deleteAccount = await waitForElement(() =>
      within(testRenderer.root).queryByTestID("profile-settings-deleteAccount")
    );

    const requestDeletionButton = within(deleteAccount).getByText("Request", {
      selector: "button",
    });
    act(() => {
      requestDeletionButton.props.onClick();
    });
    const modal = await waitForElement(() =>
      within(testRenderer.root).getByTestID("delete-account-modal")
    );
    // iterate through the delete account modal steps
    for (let i = 0; i < 3; i++) {
      const nextButton = await waitForElement(() =>
        within(modal).getByText("Proceed", { selector: "button" })
      );
      act(() => {
        nextButton.props.onClick();
      });
    }
    const form = within(modal).getByType("form");
    const password = within(modal).getByTestID("confirm-page-password");

    await act(async () => {
      password.props.onChange("password");
      await form.props.onSubmit();
    });

    const confirmRequiredWarning = within(modal).getByText(
      "This field is required.",
      { exact: false }
    );
    expect(confirmRequiredWarning).toBeDefined();
  });

  it("password is required during deletion steps", async () => {
    const deleteAccount = await waitForElement(() =>
      within(testRenderer.root).queryByTestID("profile-settings-deleteAccount")
    );

    const requestDeletionButton = within(deleteAccount).getByText("Request", {
      selector: "button",
    });
    act(() => {
      requestDeletionButton.props.onClick();
    });
    const modal = await waitForElement(() =>
      within(testRenderer.root).getByTestID("delete-account-modal")
    );
    // iterate through the delete account modal steps
    for (let i = 0; i < 3; i++) {
      const nextButton = await waitForElement(() =>
        within(modal).getByText("Proceed", { selector: "button" })
      );
      act(() => {
        nextButton.props.onClick();
      });
    }
    const form = within(modal).getByType("form");
    const confirm = within(modal).getByTestID("confirm-page-confirmation");

    await act(async () => {
      confirm.props.onChange("delete");
      await form.props.onSubmit();
    });

    const passwordRequiredWarning = within(modal).getByText(
      "This field is required.",
      { exact: false }
    );
    expect(passwordRequiredWarning).toBeDefined();
  });
});
