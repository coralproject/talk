import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GQLResolver } from "coral-framework/schema";
import { CreateTestRendererParams } from "coral-framework/testHelpers";

import customRenderAppWithContext from "coral-stream/test/customRenderAppWithContext";

import { createContext } from "../create";

const createTestRenderer = async (
  params: CreateTestRendererParams<GQLResolver> = {}
) => {
  const { context } = createContext({
    // ... base resolvers for this test suite
    // ... init relevant local state (probs flatten replies)
  });

  customRenderAppWithContext(context);
  // ... query and await for any elements that you need to

  return context;
};

it("should flatten replies", async () => {

});

