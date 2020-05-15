import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { QueryRenderData, QueryRenderer } from "coral-framework/lib/relay";
import { CallOut, Spinner } from "coral-ui/components/v2";

import { SSOSigningSecretRotationQuery as QueryTypes } from "coral-admin/__generated__/SSOSigningSecretRotationQuery.graphql";

import SSOSigningSecretRotationContainer from "./SSOSigningSecretRotationContainer";

interface Props {
  disabled?: boolean;
}

const SSOSigningSecretRotationQuery: FunctionComponent<Props> = ({
  disabled,
}) => {
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query SSOSigningSecretRotationQuery {
          settings {
            ...SSOSigningSecretRotationContainer_settings
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
          <SSOSigningSecretRotationContainer
            settings={props.settings}
            disabled={disabled}
          />
        );
      }}
    />
  );
};

export default SSOSigningSecretRotationQuery;
