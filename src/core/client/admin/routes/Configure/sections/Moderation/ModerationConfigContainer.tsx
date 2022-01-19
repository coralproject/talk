import { useRouter } from "found";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-final-form";
import { graphql } from "react-relay";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import {
  purgeMetadata,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { HorizontalGutter } from "coral-ui/components/v2";

import { ModerationConfigContainer_settings as SettingsData } from "coral-admin/__generated__/ModerationConfigContainer_settings.graphql";

import AkismetConfig from "./AkismetConfig";
import NewCommentersConfig from "./NewCommentersConfig";
import PerspectiveConfig from "./PerspectiveConfig";
import PreModerationConfigContainer from "./PreModerationConfigContainer";
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

  const router = useRouter();
  const { window } = useCoralContext();
  useEffect(() => {
    // If sublink in left nav is clicked, we want to scroll the corresponding anchor link into view
    const anchorLinkId = router.match.location.hash.replace("#", "");
    // eslint-disable-next-line no-unused-expressions
    window.document.getElementById(anchorLinkId)?.scrollIntoView();
  }, [router]);

  return (
    <HorizontalGutter size="double" data-testid="configure-moderationContainer">
      <PreModerationConfigContainer disabled={submitting} settings={settings} />
      <PerspectiveConfig disabled={submitting} />
      <AkismetConfig disabled={submitting} />
      <NewCommentersConfig disabled={submitting} settings={settings} />
      <RecentCommentHistoryConfig disabled={submitting} />
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment ModerationConfigContainer_settings on Settings {
      ...AkismetConfig_formValues @relay(mask: false)
      ...PerspectiveConfig_formValues @relay(mask: false)
      ...PreModerationConfigContainer_formValues @relay(mask: false)
      ...PreModerationConfigContainer_settings
      ...RecentCommentHistoryConfig_formValues @relay(mask: false)
      ...NewCommentersConfigContainer_formValues @relay(mask: false)
      ...NewCommentersConfig_settings
    }
  `,
})(ModerationConfigContainer);

export default enhanced;
