import { pureMerge } from "coral-common/utils";
import { GQLResolver } from "coral-framework/schema";
import {
  createResolversStub,
  CreateTestRendererParams,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import create from "./create";
import { settings } from "./fixtures";

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { testRenderer, context } = create({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
        },
      }),
      params.resolvers
    ),
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue("DUPLICATE_EMAIL", "view");
      localRecord.setValue("my@email.com", "duplicateEmail");
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });
  const container = await waitForElement(() =>
    within(testRenderer.root).getByTestID("linkAccount-container")
  );
  const form = within(container).queryByType("form")!;
  const passwordField = within(form).getByLabelText("Password");

  return {
    context,
    testRenderer,
    form,
    container,
    passwordField,
  };
}

it("renders link account view", async () => {
  const { testRenderer } = await createTestRenderer();
  expect(testRenderer.toJSON()).toMatchSnapshot();
  expect(await within(testRenderer.root).axe()).toHaveNoViolations();
});
