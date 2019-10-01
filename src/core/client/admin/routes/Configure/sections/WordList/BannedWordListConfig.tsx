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

import styles from "./BannedWordListConfig.css";

interface Props {
  disabled: boolean;
}

const BannedWordListConfig: FunctionComponent<Props> = ({ disabled }) => (
  <HorizontalGutter size="oneAndAHalf">
    <Localized id="configure-wordList-banned-bannedWordsAndPhrases">
      <Header>Banned words and phrases</Header>
    </Localized>
    <SectionContent>
      <Localized id="configure-wordList-banned-explanation" strong={<strong />}>
        <Typography variant="bodyShort">
          Comments containing a word or phrase in the banned words list are
          automatically rejected and are not published.
        </Typography>
      </Localized>

      <FormField>
        <Localized id="configure-wordList-banned-wordList">
          <InputLabel htmlFor="configure-wordlist-banned">
            Banned word list
          </InputLabel>
        </Localized>
        <Localized id="configure-wordList-banned-wordListDetailInstructions">
          <InputDescription>
            Separate banned words or phrases with a new line. Words/phrases are
            not case sensitive.
          </InputDescription>
        </Localized>
        <div>
          <WordListTextArea
            id="configure-wordlist-banned"
            name={"wordList.banned"}
            disabled={disabled}
            className={styles.textArea}
          />
        </div>
      </FormField>
    </SectionContent>
  </HorizontalGutter>
);

export default BannedWordListConfig;
