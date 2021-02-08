import GraphiQL from "graphiql";
import { useCallback } from "react";

import "graphiql/graphiql.min.css";

export default function GraphiQLPage() {
  const fetcher = useCallback(async (params: any) => {
    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    // TODO: when we move this to /src, reference the following token instead of hardcoding it.
    const accessToken = localStorage.getItem("coral:v2:accessToken");
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const data = await fetch("/api/graphql", {
      method: "POST",
      headers,
      body: JSON.stringify(params),
    });

    return data.json().catch(() => data.text());
  }, []);

  return (
    <div className="h-screen">
      <GraphiQL fetcher={fetcher} />
    </div>
  );
}
