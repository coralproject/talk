import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import { HorizontalGutter } from "coral-ui/components";

import BannedWordListConfigContainer from "./BannedWordListConfigContainer";
import SuspectWordListConfigContainer from "./SuspectWordListConfigContainer";

interface Props {
  disabled: boolean;
  settings: PropTypesOf<typeof SuspectWordListConfigContainer>["settings"] &
    PropTypesOf<typeof BannedWordListConfigContainer>["settings"];
  onInitValues: (values: any) => void;
}

const WordListConfig: FunctionComponent<Props> = ({
  disabled,
  settings,
  onInitValues,
}) => (
  <HorizontalGutter size="double" data-testid="configure-wordListContainer">
    <BannedWordListConfigContainer
      disabled={disabled}
      settings={settings}
      onInitValues={onInitValues}
    />
    <SuspectWordListConfigContainer
      disabled={disabled}
      settings={settings}
      onInitValues={onInitValues}
    />
  </HorizontalGutter>
);

export default WordListConfig;
