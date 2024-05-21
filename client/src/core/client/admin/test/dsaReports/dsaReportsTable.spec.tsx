import { screen } from "@testing-library/react";

import { pureMerge } from "coral-common/common/lib/utils";
import { GQLResolver } from "coral-framework/schema";
import {
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
} from "coral-framework/testHelpers";

import { createContext } from "../create";
import customRenderAppWithContext from "../customRenderAppWithContext";
import { dsaReportConnection, settings, users } from "../fixtures";

const adminViewer = users.admins[0];

beforeEach(async () => {
  replaceHistoryLocation("http://localhost/admin/reports");
});

const createTestRenderer = async (
  params: CreateTestRendererParams<GQLResolver> = {}
) => {
  const { context } = createContext({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          viewer: () => adminViewer,
          dsaReports: () => dsaReportConnection,
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
  customRenderAppWithContext(context);

  const container = await screen.findByTestId("dsaReports-container");
  return { container };
};

it("has expected columns and sort functionality", async () => {
  await createTestRenderer();

  const sortBy = screen.getByRole("combobox", { name: "Sort by" });
  expect(sortBy).toBeVisible();

  screen.getByRole("row", {
    name: "Created Last updated Reported by Reference Law broken Comment author Status",
  });
  screen.getByRole("row", {
    name: "07/06/23, 06:24 PM - Isabelle dsa-report-1-referenceID The law that is alleged to be broken Isabelle",
  });

  const showClosedReports = screen.getByRole("button", {
    name: "Show closed reports",
  });
  expect(showClosedReports).toBeVisible();
});
