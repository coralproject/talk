import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import {
  FormField,
  FormFieldDescription,
  FormFieldHeader,
  HelperText,
  Label,
} from "coral-ui/components/v2";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import WordListTextArea from "./WordListTextArea";

import styles from "./SuspectWordListConfig.css";

interface Props {
  disabled: boolean;
}

const SuspectWordListConfig: FunctionComponent<Props> = ({ disabled }) => (
  <ConfigBox
    title={
      <Localized id="configure-wordList-suspect-bannedWordsAndPhrases">
        <Header container="h2">Suspect words and phrases</Header>
      </Localized>
    }
  >
    <Localized id="configure-wordList-suspect-explanation" strong={<strong />}>
      <FormFieldDescription>
        Comments containing a word or phrase in the Suspect Words List are
        placed into the Reported Queue for moderator review and are published
        (if comments are not pre-moderated).
      </FormFieldDescription>
    </Localized>

    <FormField>
      <FormFieldHeader>
        <Localized id="configure-wordList-suspect-wordList">
          <Label htmlFor="configure-wordlist-suspect">Suspect word list</Label>
        </Localized>
        <Localized id="configure-wordList-suspect-wordListDetailInstructions">
          <HelperText>
            Separate suspect words or phrases with a new line. Words/phrases are
            not case sensitive.
          </HelperText>
        </Localized>
      </FormFieldHeader>
      <WordListTextArea
        id="configure-wordlist-suspect"
        name={"wordList.suspect"}
        disabled={disabled}
        className={styles.textArea}
      />
    </FormField>
  </ConfigBox>
);

export default SuspectWordListConfig;
