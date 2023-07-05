import { RouteProps } from "found";
import React from "react";

import createRouteConfig, { RouteConfig } from "./createRouteConfig";

function withRouteConfig<
  Props = any,
  QueryResponse = Props extends { data: infer T | null | undefined }
    ? T
    : undefined
>(config: Omit<RouteConfig<Props, QueryResponse>, "Component">) {
  const hoc = <T>(component: React.ComponentType<T>) => {
    (component as any).routeConfig = createRouteConfig({
      ...config,
      Component: component as any,
    });
    return component as React.ComponentClass<T> & {
      routeConfig: RouteProps;
    };
  };
  return hoc;
}

export default withRouteConfig;
