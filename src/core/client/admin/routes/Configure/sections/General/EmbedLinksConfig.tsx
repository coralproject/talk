import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { FieldSet, FormField, Label } from "coral-ui/components/v2";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import OnOffField from "../../OnOffField";

interface Props {
  disabled: boolean;
}

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment EmbedLinksConfig_formValues on Settings {
    embedLinks {
      twitterEnabled
      youtubeEnabled
    }
  }
`;

const EmbedLinksConfig: FunctionComponent<Props> = ({ disabled }) => {
  return (
    <ConfigBox
      title={
        <Localized id="configure-general-embedLinks-title">
          <Header container={<legend />}>Embed links</Header>
        </Localized>
      }
      container={<FieldSet />}
    >
      <FormField>
        <Localized id="configure-general-embedLinks-enableTwitterEmbeds">
          <Label component="legend">Enable Twitter embeds</Label>
        </Localized>
        <OnOffField
          name="embedLinks.twitterEnabled"
          disabled={disabled}
          onLabel={
            <Localized id="configure-general-embedLinks-On">
              <span>On</span>
            </Localized>
          }
          offLabel={
            <Localized id="configure-general-embedLinks-Off">
              <span>Off</span>
            </Localized>
          }
        />
      </FormField>

      <FormField>
        <Localized id="configure-general-embedLinks-enableYouTubeEmbeds">
          <Label component="legend">Enable YouTube embeds</Label>
        </Localized>
        <OnOffField
          name="embedLinks.youtubeEnabled"
          disabled={disabled}
          onLabel={
            <Localized id="configure-general-embedLinks-On">
              <span>On</span>
            </Localized>
          }
          offLabel={
            <Localized id="configure-general-embedLinks-Off">
              <span>Off</span>
            </Localized>
          }
        />
      </FormField>
    </ConfigBox>
  );
};

export default EmbedLinksConfig;
