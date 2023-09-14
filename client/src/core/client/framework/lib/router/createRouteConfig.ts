import { Match, RouteProps } from "found";
import React from "react";
import { Environment } from "relay-runtime";

import { Overwrite } from "coral-framework/types";

import { resolveModule } from "../relay/helpers";

export type RouteConfig<Props = any, QueryResponse = undefined> = Partial<
  Pick<RouteProps, "query" | "getQuery" | "Component">
> &
  Partial<Pick<RouteProps, "data" | "getData" | "defer">> & {
    cacheConfig?: {
      force?: boolean;
    };
    prepareVariables?: (
      params: Record<string, string>,
      match: Overwrite<Match, { context: { relayEnvironment: Environment } }>,
      environment: Environment
    ) => Record<string, any>;
    render?: (args: {
      error: Error;
      data: QueryResponse | null;
      retry: () => void;
      match: Match;
      Component: React.ComponentType<Partial<Props>>;
    }) => React.ReactElement;
  };

export default function createRouteConfig<Props, QueryResponse>(
  config: RouteConfig<Props, QueryResponse>
): RouteProps {
  return {
    ...config,
    query: config.query ? resolveModule(config.query) : undefined,
    getQuery: config.getQuery
      ? (...args: any[]) => {
          return resolveModule(config.getQuery(...args));
        }
      : undefined,
    render: function WithRouteConfig({
      error,
      props: data,
      retry,
      match,
      Component,
    }: any) {
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
}
