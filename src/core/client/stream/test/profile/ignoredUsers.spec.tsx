import { pureMerge } from "coral-common/utils";
import { GQLResolver } from "coral-framework/schema";
import {
  createResolversStub,
  CreateTestRendererParams,
  waitForElement,
  waitUntilThrow,
  within,
} from "coral-framework/testHelpers";

import { commenters, settings, stories, viewerPassive } from "../fixtures";
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

  const section = await waitForElement(() =>
    within(testRenderer.root).getByTestID("profile-settings-ignoredCommenters")
  );

  return {
    testRenderer,
    context,
    section,
  };
}

it("render empty ignored users list", async () => {
  const { section } = await createTestRenderer();
  await waitForElement(() =>
    within(section).getByText("You are not currently ignoring anyone", {
      exact: false,
    })
  );
});

it("render ignored users list", async () => {
  const { section } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        viewer: () =>
          pureMerge<typeof viewer>(viewer, {
            ignoredUsers: [commenters[0], commenters[1]],
          }),
      },
      Mutation: {
        removeUserIgnore: ({ variables }) => {
          expectAndFail(variables).toMatchObject({
            userID: commenters[0].id,
          });
          return {};
        },
      },
    }),
  });
  within(section).getByText(commenters[0].username!);
  within(section).getByText(commenters[1].username!);

  // Stop ignoring first users.
  within(section)
    .getAllByText("Stop ignoring", { selector: "button" })[0]
    .props.onClick();

  // First user should dissappear from list.
  await waitUntilThrow(() =>
    within(section).getByText(commenters[0].username!)
  );
  within(section).getByText(commenters[1].username!);
});
