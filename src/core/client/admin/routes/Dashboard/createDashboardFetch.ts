import { Environment } from "relay-runtime";

import { createFetch } from "coral-framework/lib/relay";

export default function createDashboardFetch<T>(name: string, url: string) {
  return createFetch(
    name,
    async (environment: Environment, variables: any, { rest }) => {
      const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const params = new URLSearchParams();
      params.set("tz", zone);
      if (variables.siteID) {
        params.set("siteID", variables.siteID);
      }
      return rest.fetch<T>(`${url}?${params.toString()}`, {
        method: "GET",
      });
    }
  );
}
