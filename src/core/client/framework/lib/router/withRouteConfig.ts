import { RouteMatch, RouteProps } from "found";
import * as React from "react";

interface InjectedProps<T> {
  error?: Error | null;
  data: T | null | undefined;
  retry?: Error | null;
}

type RouteConfig<QueryResponse> = Partial<
  Pick<RouteProps, "query" | "getQuery">
> &
  Partial<Pick<RouteProps, "data" | "getData" | "defer">> & {
    cacheConfig?: {
      force?: boolean;
    };
    prepareVariables?: (
      params: Record<string, string>,
      match: RouteMatch
    ) => Record<string, any>;
    render?: (args: {
      error: Error;
      data: QueryResponse | null;
      retry: () => void;
      match: RouteMatch;
      Component: React.ComponentType<any>;
    }) => React.ReactElement;
  };

function withRouteConfig<QueryResponse>(config: RouteConfig<QueryResponse>) {
  const hoc = <T extends InjectedProps<QueryResponse>>(
    component: React.ComponentType<T>
  ) => {
    (component as any).routeConfig = {
      ...config,
      Component: component,
      render: ({ error, props: data, retry, match, Component }: any) => {
        if (config.render) {
          return config.render({ error, data, retry, match, Component });
        }
        return React.createElement(Component, {
          error,
          data,
          retry,
          match,
        });
      },
    };
    return component as React.ComponentClass<T> & {
      routeConfig: RouteConfig<QueryResponse>;
    };
  };
  return hoc;
}

export default withRouteConfig;
