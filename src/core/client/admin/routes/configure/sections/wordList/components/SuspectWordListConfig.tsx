import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { ExternalLink } from "talk-framework/lib/i18n/components";
import {
  FormField,
  HorizontalGutter,
  InputDescription,
  InputLabel,
  Typography,
} from "talk-ui/components";

import Header from "../../../components/Header";
import WordListTextArea from "./WordListTextArea";

import styles from "./SuspectWordListConfig.css";

interface Props {
  disabled: boolean;
}

const SuspectWordListConfig: StatelessComponent<Props> = ({ disabled }) => (
  <HorizontalGutter size="oneAndAHalf">
    <Localized id="configure-wordList-suspect-bannedWordsAndPhrases">
      <Header>Suspect Words and Phrases</Header>
    </Localized>
    <Localized id="configure-wordList-suspect-explanation" strong={<strong />}>
      <Typography variant="detail">
        Comments containing a word or phrase in the Suspect Words List are
        placed into the Reported Queue for moderator review and are published
        (if comments are not pre-moderated).
      </Typography>
    </Localized>

    <FormField>
      <Localized id="configure-wordList-suspect-wordList">
        <InputLabel htmlFor="configure-wordlist-suspect">
          Suspect Word List
        </InputLabel>
      </Localized>
      <Localized
        id="configure-wordList-suspect-wordListDetail"
        strong={<strong />}
        externalLink={<ExternalLink href="#" />}
      >
        <InputDescription>
          Separate suspect words or phrases with a new line. Attempting to copy
          and paste a comma separated list? Learn how to convert your list to a
          new line separated list.
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
  </HorizontalGutter>
);

export default SuspectWordListConfig;
