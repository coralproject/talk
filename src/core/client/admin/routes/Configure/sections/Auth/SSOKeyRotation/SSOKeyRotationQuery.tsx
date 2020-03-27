import React, { FunctionComponent } from "react";

import {
  graphql,
  QueryRenderData,
  QueryRenderer,
} from "coral-framework/lib/relay";
import { CallOut, Spinner } from "coral-ui/components/v2";

import { SSOKeyRotationQuery as QueryTypes } from "coral-admin/__generated__/SSOKeyRotationQuery.graphql";

import SSOKeyRotationContainer from "./SSOKeyRotationContainer";

interface Props {
  disabled?: boolean;
}

const SSOKeyRotationQuery: FunctionComponent<Props> = ({ disabled }) => {
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query SSOKeyRotationQuery {
          settings {
            ...SSOKeyRotationContainer_settings
          }
        }
      `}
      variables={{}}
      cacheConfig={{ force: true }}
      render={({ error, props }: QueryRenderData<QueryTypes>) => {
        if (error) {
          return <CallOut>{error.message}</CallOut>;
        }

        if (!props) {
          return <Spinner />;
        }

        if (!props.settings) {
          return <Spinner />;
        }

        return (
          <SSOKeyRotationContainer
            settings={props.settings}
            disabled={disabled}
          />
        );
      }}
    />
  );
};

export default SSOKeyRotationQuery;
