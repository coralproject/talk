/* eslint-disable */
import { screen, within } from "@testing-library/react";
import { pureMerge } from "coral-common/utils";
import { GQLResolver } from "coral-framework/schema";
import { createResolversStub } from "coral-framework/testHelpers";

import { createContext } from "../create";
import customRenderAppWithContext from "../customRenderAppWithContext";

import { commenters, settings, stories } from "../../fixtures";
// import userEvent from "@testing-library/user-event";

async function createTestRenderer() {
  const { context } = createContext({
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          story: () => stories[0],
          viewer: () => commenters[0],
        },
      })
      // params.resolvers
    ),
  });

  customRenderAppWithContext(context);

  const commentForm = await screen.findByTestId("comments-postCommentForm-form")

  return { context, commentForm };
}

it.skip("RTL saves values", async () => {
  const { commentForm } = await createTestRenderer();

  expect(commentForm).toBeDefined();
  const textInput = within(commentForm).getByTitle("body");
  console.log(textInput, "INPUT");
  // userEvent.type(, "this should persist");
  // console.log(within(commentForm).queryByText("this should persist"), "PERSIST");
});
