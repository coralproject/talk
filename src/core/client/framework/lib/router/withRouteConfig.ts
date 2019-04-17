import { RouteMatch, RouteProps } from "found";
import * as React from "react";

interface InjectedProps<T> {
  error?: Error | null;
  data: T | null | undefined;
  retry?: Error | null;
}

type RouteConfig = Partial<Pick<RouteProps, "query" | "getQuery">> &
  Partial<Pick<RouteProps, "data" | "getData" | "defer">> & {
    cacheConfig?: {
      force?: boolean;
    };
    prepareVariables?: (
      params: Record<string, string>,
      match: RouteMatch
    ) => Record<string, any>;
  };

function withRouteConfig<QueryResponse>(config: RouteConfig) {
  const hoc = <T extends InjectedProps<QueryResponse>>(
    component: React.ComponentType<T>
  ) => {
    (component as any).routeConfig = {
      ...config,
      Component: component,
      render: ({ error, props, retry, Component }: any) => {
        return React.createElement(Component, { error, data: props, retry });
      },
    };
    return component as React.ComponentClass<T> & { routeConfig: RouteConfig };
  };
  return hoc;
}

export default withRouteConfig;
