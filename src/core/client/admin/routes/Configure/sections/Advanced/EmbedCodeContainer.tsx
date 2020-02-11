import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { EmbedCodeContainer_settings } from "coral-admin/__generated__/EmbedCodeContainer_settings.graphql";

import EmbedCode from "./EmbedCode";

interface Props {
  settings: EmbedCodeContainer_settings;
}

const EmbedCodeContainer: FunctionComponent<Props> = ({ settings }) => {
  return <EmbedCode siteID="site-id" staticURI={settings.staticURI} />;
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment EmbedCodeContainer_settings on Settings {
      staticURI
    }
  `,
})(EmbedCodeContainer);

export default enhanced;
