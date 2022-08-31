import React, { useMemo } from "react";
import { useForm } from "react-final-form";
import { graphql } from "react-relay";

import {
  purgeMetadata,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { HorizontalGutter } from "coral-ui/components/v2";

import { GeneralConfigContainer_settings as SettingsData } from "coral-admin/__generated__/GeneralConfigContainer_settings.graphql";

import AnnouncementConfigContainer from "./AnnouncementConfigContainer";
import BadgeConfig from "./BadgeConfig";
import ClosedStreamMessageConfig from "./ClosedStreamMessageConfig";
import ClosingCommentStreamsConfig from "./ClosingCommentStreamsConfig";
import CommentEditingConfig from "./CommentEditingConfig";
import CommentLengthConfig from "./CommentLengthConfig";
import FlattenRepliesConfig from "./FlattenRepliesConfig";
import GuidelinesConfig from "./GuidelinesConfig";
import LocaleConfig from "./LocaleConfig";
import MediaLinksConfig from "./MediaLinksConfig";
import MemberBioConfig from "./MemberBioConfig";
import ReactionConfigContainer from "./ReactionConfigContainer";
import RTEConfig from "./RTEConfig";
import SitewideCommentingConfig from "./SitewideCommentingConfig";

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
      <FlattenRepliesConfig disabled={submitting} />
      <SitewideCommentingConfig disabled={submitting} />
      <AnnouncementConfigContainer disabled={submitting} settings={settings} />
      <GuidelinesConfig disabled={submitting} />
      <RTEConfig disabled={submitting} />
      <CommentLengthConfig disabled={submitting} />
      <CommentEditingConfig disabled={submitting} />
      <ClosingCommentStreamsConfig disabled={submitting} />
      <ClosedStreamMessageConfig disabled={submitting} />
      <ReactionConfigContainer disabled={submitting} settings={settings} />
      <BadgeConfig disabled={submitting} />
      <MemberBioConfig disabled={submitting} />
      <MediaLinksConfig disabled={submitting} />
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment GeneralConfigContainer_settings on Settings {
      ...AnnouncementConfigContainer_settings
      ...FlattenRepliesConfig_formValues @relay(mask: false)
      ...LocaleConfig_formValues @relay(mask: false)
      ...GuidelinesConfig_formValues @relay(mask: false)
      ...CommentLengthConfig_formValues @relay(mask: false)
      ...CommentEditingConfig_formValues @relay(mask: false)
      ...ClosedStreamMessageConfig_formValues @relay(mask: false)
      ...ClosingCommentStreamsConfig_formValues @relay(mask: false)
      ...SitewideCommentingConfig_formValues @relay(mask: false)
      ...ReactionConfig_formValues @relay(mask: false)
      ...BadgeConfig_formValues @relay(mask: false)
      ...RTEConfig_formValues @relay(mask: false)
      ...MediaLinksConfig_formValues @relay(mask: false)
      ...MemberBioConfig_formValues @relay(mask: false)
      ...ReactionConfigContainer_settings
    }
  `,
})(GeneralConfigContainer);

export default enhanced;
