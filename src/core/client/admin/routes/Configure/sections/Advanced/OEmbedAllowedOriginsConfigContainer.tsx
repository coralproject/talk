import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { FormField, FormFieldDescription, Label } from "coral-ui/components/v2";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import AllowedOriginsTextarea from "../Sites/AllowedOriginsTextarea";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment OEmbedAllowedOriginsConfigContainer_formValues on Settings {
    oEmbedAllowedOrigins
  }
`;

interface Props {
  disabled: boolean;
}

const OEmbedAllowedOriginsConfigContainer: FunctionComponent<Props> = ({
  disabled,
}) => (
  <ConfigBox
    data-testid="oembed-allowed-origins-config"
    title={
      <Localized id="configure-advanced-oembedAllowedOrigins-header">
        <Header htmlFor="configure-advanced-oembedAllowedOrigins-header">
          oEmbed permitted domains
        </Header>
      </Localized>
    }
  >
    <FormField>
      <Localized id="configure-advanced-oembedAllowedOrigins-description">
        <FormFieldDescription>
          Domains that are permitted to make calls to the oEmbed API.
        </FormFieldDescription>
      </Localized>
      <Localized id="configure-advanced-oembedAllowedOrigins-label">
        <Label>oEmbed permitted domains</Label>
      </Localized>
      <AllowedOriginsTextarea name="oEmbedAllowedOrigins" disabled={disabled} />
    </FormField>
  </ConfigBox>
);

export default OEmbedAllowedOriginsConfigContainer;
