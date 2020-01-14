import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { EmbedCodeContainer_settings } from "coral-admin/__generated__/EmbedCodeContainer_settings.graphql";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import EmbedCode from "./EmbedCode";

interface Props {
  settings: EmbedCodeContainer_settings;
}

const EmbedCodeContainer: FunctionComponent<Props> = ({ settings }) => {
  return (
    <ConfigBox
      title={
        <Localized id="configure-advanced-embedCode-title">
          <Header htmlFor="configure-advanced-embedCode">Embed code</Header>
        </Localized>
      }
    >
      <EmbedCode staticURI={settings.staticURI} />
    </ConfigBox>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment EmbedCodeContainer_settings on Settings {
      staticURI
    }
  `,
})(EmbedCodeContainer);

export default enhanced;
