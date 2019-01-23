import React, { StatelessComponent } from "react";

import { PropTypesOf } from "talk-framework/types";
import { HorizontalGutter } from "talk-ui/components";

import BannedWordListConfigContainer from "../containers/BannedWordListConfigContainer";
import SuspectWordListConfigContainer from "../containers/SuspectWordListConfigContainer";

interface Props {
  disabled: boolean;
  settings: PropTypesOf<typeof SuspectWordListConfigContainer>["settings"] &
    PropTypesOf<typeof BannedWordListConfigContainer>["settings"];
  onInitValues: (values: any) => void;
}

const WordList: StatelessComponent<Props> = ({
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

export default WordList;
