import { Environment } from "relay-runtime";

import { createFetch } from "coral-framework/lib/relay";

export default function createDashboardFetch<T>(name: string, url: string) {
  return createFetch(
    name,
    async (
      environment: Environment,
      variables: { siteID: string },
      { rest }
    ) => {
      const params = new URLSearchParams(variables);

      const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
      params.set("tz", timeZone);

      // // FIXME: remove, date forced for development
      // params.set("date", "2020-05-05T12:30:00.000Z");

      return rest.fetch<T>(`${url}?${params.toString()}`, {
        method: "GET",
      });
    }
  );
}
