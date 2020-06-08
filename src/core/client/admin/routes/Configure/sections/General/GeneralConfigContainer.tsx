import React, { useMemo } from "react";
import { useForm } from "react-final-form";
import { graphql } from "react-relay";

import {
  purgeMetadata,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { HorizontalGutter } from "coral-ui/components";

import { GeneralConfigContainer_settings as SettingsData } from "coral-admin/__generated__/GeneralConfigContainer_settings.graphql";

import AnnouncementConfigContainer from "./AnnouncementConfigContainer";
import ClosedStreamMessageConfig from "./ClosedStreamMessageConfig";
import ClosingCommentStreamsConfig from "./ClosingCommentStreamsConfig";
import CommentEditingConfig from "./CommentEditingConfig";
import CommentLengthConfig from "./CommentLengthConfig";
import GuidelinesConfig from "./GuidelinesConfig";
import LocaleConfig from "./LocaleConfig";
import ReactionConfigContainer from "./ReactionConfigContainer";
import RTEConfig from "./RTEConfig";
import SitewideCommentingConfig from "./SitewideCommentingConfig";
import StaffConfig from "./StaffConfig";

import styles from "./GeneralConfigContainer.css";

interface Props {
  submitting: boolean;
  settings: SettingsData;
}

const GeneralConfigContainer: React.FunctionComponent<Props> = ({
  settings,
  submitting,
}) => {
  const form = useForm();
  useMemo(() => form.initialize(purgeMetadata(settings)), []);
  return (
    <HorizontalGutter
      size="double"
      data-testid="configure-generalContainer"
      className={styles.root}
    >
      <LocaleConfig disabled={submitting} />
      <SitewideCommentingConfig disabled={submitting} />
      <AnnouncementConfigContainer disabled={submitting} settings={settings} />
      <GuidelinesConfig disabled={submitting} />
      <RTEConfig disabled={submitting} />
      <CommentLengthConfig disabled={submitting} />
      <CommentEditingConfig disabled={submitting} />
      <ClosingCommentStreamsConfig disabled={submitting} />
      <ClosedStreamMessageConfig disabled={submitting} />
      <ReactionConfigContainer disabled={submitting} settings={settings} />
      <StaffConfig disabled={submitting} />
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment GeneralConfigContainer_settings on Settings {
      ...AnnouncementConfigContainer_settings
      ...LocaleConfig_formValues @relay(mask: false)
      ...GuidelinesConfig_formValues @relay(mask: false)
      ...CommentLengthConfig_formValues @relay(mask: false)
      ...CommentEditingConfig_formValues @relay(mask: false)
      ...ClosedStreamMessageConfig_formValues @relay(mask: false)
      ...ClosingCommentStreamsConfig_formValues @relay(mask: false)
      ...SitewideCommentingConfig_formValues @relay(mask: false)
      ...ReactionConfig_formValues @relay(mask: false)
      ...StaffConfig_formValues @relay(mask: false)
      ...RTEConfig_formValues @relay(mask: false)

      ...ReactionConfigContainer_settings
    }
  `,
})(GeneralConfigContainer);

export default enhanced;
