import React, { useMemo } from "react";
import { useForm } from "react-final-form";
import { graphql } from "react-relay";

import {
  purgeMetadata,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { HorizontalGutter } from "coral-ui/components";

import { AdvancedConfigContainer_settings } from "coral-admin/__generated__/AdvancedConfigContainer_settings.graphql";

import CommentStreamLiveUpdatesContainer from "./CommentStreamLiveUpdatesContainer";
import CustomCSSConfig from "./CustomCSSConfig";
import EmbedCodeContainer from "./EmbedCodeContainer";
import PermittedDomainsConfig from "./PermittedDomainsConfig";
import StoryCreationConfig from "./StoryCreationConfig";

interface Props {
  submitting: boolean;
  settings: AdvancedConfigContainer_settings;
}

const AdvancedConfigContainer: React.FunctionComponent<Props> = ({
  settings,
  submitting,
}) => {
  const form = useForm();
  useMemo(() => form.initialize(purgeMetadata(settings)), []);
  return (
    <HorizontalGutter size="double" data-testid="configure-advancedContainer">
      {!settings.multisite && <EmbedCodeContainer settings={settings} />}
      <CustomCSSConfig disabled={submitting} />
      <CommentStreamLiveUpdatesContainer
        disabled={submitting}
        settings={settings}
      />
      <PermittedDomainsConfig disabled={submitting} />
      <StoryCreationConfig disabled={submitting} />
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment AdvancedConfigContainer_settings on Settings {
      ...CustomCSSConfig_formValues @relay(mask: false)
      ...PermittedDomainsConfig_formValues @relay(mask: false)
      ...CommentStreamLiveUpdates_formValues @relay(mask: false)
      ...StoryCreationConfig_formValues @relay(mask: false)

      ...EmbedCodeContainer_settings
      ...CommentStreamLiveUpdatesContainer_settings
      multisite
    }
  `,
})(AdvancedConfigContainer);

export default enhanced;
