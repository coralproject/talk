import { ReactTestRenderer } from "react-test-renderer";

import { pureMerge } from "coral-common/utils";
import {
  act,
  createResolversStub,
  CreateTestRendererParams,
  waitForElement,
  within,
} from "coral-framework/testHelpers";
import { GQLResolver } from "coral-framework/testHelpers/schema";

import { settings, stories, userWithEmail } from "../fixtures";
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

  return {
    testRenderer,
    context,
  };
}

describe("change email form", () => {
  let testRenderer: ReactTestRenderer;
  beforeEach(async () => {
    const setup = await createTestRenderer({
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
    testRenderer = setup.testRenderer;
  });

  it("ensures email field is required", async () => {
    const changeEmail = await waitForElement(() =>
      within(testRenderer.root).getByTestID("profile-changeEmail")
    );
    const editButton = within(changeEmail).getByText("Change");
    act(() => {
      editButton.props.onClick();
    });
    expect(await within(changeEmail).axe()).toHaveNoViolations();
    const form = within(changeEmail).getByType("form");
    act(() => {
      form.props.onSubmit();
    });
    within(changeEmail).getAllByText("This field is required", {
      exact: false,
    });
    const button = within(changeEmail).getByText("Save changes", {
      exact: false,
    });
    expect(button.props.disabled).toBeTruthy();
  });

  it("ensures password field is required", async () => {
    const changeEmail = await waitForElement(() =>
      within(testRenderer.root).getByTestID("profile-changeEmail")
    );
    const editButton = within(changeEmail).getByText("Change");
    act(() => {
      editButton.props.onClick();
    });
    const form = within(changeEmail).getByType("form");
    const emailInput = within(changeEmail).getByLabelText("New email address", {
      exact: false,
    });
    act(() => {
      emailInput.props.onChange("test@test.com");
      form.props.onSubmit();
    });
    within(changeEmail).getByText("This field is required", {
      exact: false,
    });
    const button = within(changeEmail).getByText("Save changes", {
      exact: false,
    });
    expect(button.props.disabled).toBeTruthy();
  });

  it("updates email if fields are valid", async () => {
    const changeEmail = await waitForElement(() =>
      within(testRenderer.root).getByTestID("profile-changeEmail")
    );
    const editButton = within(changeEmail).getByText("Change");
    act(() => {
      editButton.props.onClick();
    });
    const form = within(changeEmail).getByType("form");
    const emailInput = within(changeEmail).getByLabelText("New email address", {
      exact: false,
    });
    const password = within(changeEmail).getByLabelText("Password");
    await act(async () => {
      emailInput.props.onChange("updated_email@test.com");
      password.props.onChange("test");
      await form.props.onSubmit();
    });

    within(changeEmail).getAllByText("updated_email@test.com", {
      exact: false,
    });
  });
});
