import React, { FunctionComponent, useState } from "react";
import { useForm } from "react-final-form";
import { graphql } from "react-relay";

import { useFetch, withFragmentContainer } from "coral-framework/lib/relay";

import { OIDCConfigContainer_auth as AuthData } from "coral-admin/__generated__/OIDCConfigContainer_auth.graphql";

import DiscoverOIDCConfigurationFetch from "./DiscoverOIDCConfigurationFetch";
import OIDCConfig from "./OIDCConfig";

interface Props {
  auth: AuthData;
  disabled?: boolean;
}

const OIDCConfigContainer: FunctionComponent<Props> = ({ auth, disabled }) => {
  const [awaitingResponse, setAwaitingResponse] = useState(false);
  const discoverOIDCConfiguration = useFetch(DiscoverOIDCConfigurationFetch);
  const form = useForm();

  const handleDiscover = async () => {
    const issuer = form.getState().values.auth.integrations.oidc.issuer;
    if (!issuer) {
      return;
    }
    setAwaitingResponse(true);
    try {
      const { discoverOIDCConfiguration: config } =
        await discoverOIDCConfiguration({
          issuer,
        });
      if (config) {
        if (config.issuer) {
          form.change(
            // TODO: @(cvle) Types in final-form are not accurate...
            "auth.integrations.oidc.issuer" as any,
            config.issuer
          );
        }
        form.change(
          // TODO: @(cvle) Types in final-form are not accurate...
          "auth.integrations.oidc.authorizationURL" as any,
          config.authorizationURL
        );
        form.change(
          // TODO: @(cvle) Types in final-form are not accurate...
          "auth.integrations.oidc.jwksURI" as any,
          config.jwksURI
        );
        form.change(
          // TODO: @(cvle) Types in final-form are not accurate...
          "auth.integrations.oidc.tokenURL" as any,
          config.tokenURL
        );
      }
    } catch (error) {
      // FIXME: (wyattjoh) handle error
      // eslint-disable-next-line no-console
      console.warn(error);
    }
    setAwaitingResponse(false);
  };

  return (
    <OIDCConfig
      disabled={disabled}
      callbackURL={auth.integrations.oidc.callbackURL}
      onDiscover={handleDiscover}
      disableForDiscover={awaitingResponse}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  auth: graphql`
    fragment OIDCConfigContainer_auth on Auth {
      integrations {
        oidc {
          callbackURL
        }
      }
    }
  `,
})(OIDCConfigContainer);

export default enhanced;
