import React, { useMemo } from "react";
import { useForm } from "react-final-form";
import { graphql, useFragment } from "react-relay";

import { purgeMetadata } from "coral-framework/lib/relay";
import { HorizontalGutter } from "coral-ui/components/v2";

import { WordListConfigContainer_settings$key as SettingsData } from "coral-admin/__generated__/WordListConfigContainer_settings.graphql";

import BannedWordListConfig from "./BannedWordListConfig";
import SuspectWordListConfig from "./SuspectWordListConfig";

interface Props {
  submitting: boolean;
  settings: SettingsData;
}

const WordListConfigContainer: React.FunctionComponent<Props> = ({
  settings,
  submitting,
}) => {
  const settingsData = useFragment(
    graphql`
      fragment WordListConfigContainer_settings on Settings {
        ...SuspectWordListConfig_formValues @relay(mask: false)
        ...BannedWordListConfig_formValues @relay(mask: false)
      }
    `,
    settings
  );

  const form = useForm();
  useMemo(() => form.initialize(purgeMetadata(settingsData)), [
    form,
    settingsData,
  ]);
  return (
    <HorizontalGutter size="double" data-testid="configure-wordListContainer">
      <BannedWordListConfig disabled={submitting} />
      <SuspectWordListConfig
        disabled={submitting}
        premoderateSuspectWords={settingsData.premoderateSuspectWords}
      />
    </HorizontalGutter>
  );
};

export default WordListConfigContainer;
