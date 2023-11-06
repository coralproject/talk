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
import { dsaReports, settings, users } from "../fixtures";

const adminViewer = users.admins[0];

beforeEach(async () => {
  replaceHistoryLocation("http://localhost/admin/reports/report/dsa-report-1");
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
          dsaReport: () => dsaReports[0],
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

  const container = await screen.findByTestId("single-report-route");
  return { container };
};

it("includes expected information about dsa report", async () => {
  await createTestRenderer();

  const allDSAReportsButton = screen.getByRole("link", {
    name: "All DSA Reports",
  });
  expect(allDSAReportsButton).toHaveProperty(
    "href",
    "http://localhost/admin/reports"
  );

  expect(screen.getByRole("combobox", { name: "Status" })).toBeVisible();

  expect(screen.getByText("What law was broken?")).toBeVisible();
  expect(
    screen.getByText("The law that is alleged to be broken")
  ).toBeVisible();

  expect(screen.getByText("Explanation")).toBeVisible();
  expect(
    screen.getByText(
      "The additional information supporting why that law is alleged to have been broken"
    )
  ).toBeVisible();

  expect(
    screen.getByRole("link", { name: "View comment in stream" })
  ).toHaveProperty(
    "href",
    "http://localhost/admin/reports/report/dsa-report-1?commentID=comment-regular-0"
  );

  expect(
    screen.getByRole("link", { name: "View comment in moderation" })
  ).toHaveProperty(
    "href",
    "http://localhost/admin/moderate/comment/comment-regular-0"
  );
});
