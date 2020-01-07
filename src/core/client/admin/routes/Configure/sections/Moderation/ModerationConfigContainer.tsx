import React, { useMemo } from "react";
import { useForm } from "react-final-form";
import { graphql } from "react-relay";

import {
  purgeMetadata,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { HorizontalGutter } from "coral-ui/components";

import { ModerationConfigContainer_settings as SettingsData } from "coral-admin/__generated__/ModerationConfigContainer_settings.graphql";

import AkismetConfig from "./AkismetConfig";
import NewCommentersConfig from "./NewCommentersConfig";
import PerspectiveConfig from "./PerspectiveConfig";
import PreModerationConfig from "./PreModerationConfig";
import RecentCommentHistoryConfig from "./RecentCommentHistoryConfig";

interface Props {
  submitting: boolean;
  settings: SettingsData;
}

export const ModerationConfigContainer: React.FunctionComponent<Props> = ({
  settings,
  submitting,
}) => {
  const form = useForm();
  useMemo(() => form.initialize(purgeMetadata(settings)), []);
  return (
    <HorizontalGutter size="double" data-testid="configure-moderationContainer">
      <PreModerationConfig disabled={submitting} />
      <NewCommentersConfig disabled={submitting} />
      <RecentCommentHistoryConfig disabled={submitting} />
      <PerspectiveConfig disabled={submitting} />
      <AkismetConfig disabled={submitting} />
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment ModerationConfigContainer_settings on Settings {
      ...AkismetConfig_formValues @relay(mask: false)
      ...PerspectiveConfig_formValues @relay(mask: false)
      ...PreModerationConfig_formValues @relay(mask: false)
      ...RecentCommentHistoryConfig_formValues @relay(mask: false)
      ...NewCommentersConfigContainer_settings @relay(mask: false)
    }
  `,
})(ModerationConfigContainer);

export default enhanced;
