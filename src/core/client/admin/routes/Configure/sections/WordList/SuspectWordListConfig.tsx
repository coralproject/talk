import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import {
  FormField,
  HorizontalGutter,
  InputDescription,
  InputLabel,
  Typography,
} from "coral-ui/components";

import Header from "../../Header";
import SectionContent from "../../SectionContent";
import WordListTextArea from "./WordListTextArea";

import styles from "./SuspectWordListConfig.css";

interface Props {
  disabled: boolean;
}

const SuspectWordListConfig: FunctionComponent<Props> = ({ disabled }) => (
  <HorizontalGutter size="oneAndAHalf">
    <Localized id="configure-wordList-suspect-bannedWordsAndPhrases">
      <Header>Suspect words and phrases</Header>
    </Localized>
    <SectionContent>
      <Localized
        id="configure-wordList-suspect-explanation"
        strong={<strong />}
      >
        <Typography variant="bodyShort">
          Comments containing a word or phrase in the Suspect Words List are
          placed into the Reported Queue for moderator review and are published
          (if comments are not pre-moderated).
        </Typography>
      </Localized>

      <FormField>
        <Localized id="configure-wordList-suspect-wordList">
          <InputLabel htmlFor="configure-wordlist-suspect">
            Suspect word list
          </InputLabel>
        </Localized>
        <Localized id="configure-wordList-suspect-wordListDetailInstructions">
          <InputDescription>
            Separate suspect words or phrases with a new line. Words/phrases are
            not case sensitive.
          </InputDescription>
        </Localized>
        <div>
          <WordListTextArea
            id="configure-wordlist-suspect"
            name={"wordList.suspect"}
            disabled={disabled}
            className={styles.textArea}
          />
        </div>
      </FormField>
    </SectionContent>
  </HorizontalGutter>
);

export default SuspectWordListConfig;
