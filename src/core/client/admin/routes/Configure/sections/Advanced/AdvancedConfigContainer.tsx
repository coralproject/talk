import React, { useMemo } from "react";
import { useForm } from "react-final-form";
import { graphql } from "react-relay";

import {
  purgeMetadata,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { HorizontalGutter } from "coral-ui/components/v2";

import { AdvancedConfigContainer_settings } from "coral-admin/__generated__/AdvancedConfigContainer_settings.graphql";

import AMPConfig from "./AMPConfig";
import CommentStreamLiveUpdatesContainer from "./CommentStreamLiveUpdatesContainer";
import CustomCSSConfig from "./CustomCSSConfig";
import ForReviewQueueConfig from "./ForReviewQueueConfig";
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
      <CustomCSSConfig disabled={submitting} />
      <CommentStreamLiveUpdatesContainer
        disabled={submitting}
        settings={settings}
      />
      <StoryCreationConfig disabled={submitting} />
      <AMPConfig disabled={submitting} />
      <ForReviewQueueConfig disabled={submitting} />
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment AdvancedConfigContainer_settings on Settings {
      ...CustomCSSConfig_formValues @relay(mask: false)
      ...CommentStreamLiveUpdates_formValues @relay(mask: false)
      ...StoryCreationConfig_formValues @relay(mask: false)
      ...CommentStreamLiveUpdatesContainer_settings
      ...AMPConfig_formValues @relay(mask: false)
      ...ForReviewQueueConfig_formValues @relay(mask: false)
    }
  `,
})(AdvancedConfigContainer);

export default enhanced;
