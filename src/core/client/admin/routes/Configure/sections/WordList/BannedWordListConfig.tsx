import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { ExternalLink } from "coral-framework/lib/i18n/components";
import {
  FormField,
  HorizontalGutter,
  InputDescription,
  InputLabel,
  Typography,
} from "coral-ui/components";

import Header from "../../Header";
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
    <Localized id="configure-wordList-banned-explanation" strong={<strong />}>
      <Typography variant="bodyCopy">
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
      <Localized
        id="configure-wordList-banned-wordListDetail"
        strong={<strong />}
        externalLink={<ExternalLink href="#" />}
      >
        <InputDescription>
          Separate banned words or phrases with a new line. Attempting to copy
          and paste a comma separated list? Learn how to convert your list to a
          new line separated list.
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
  </HorizontalGutter>
);

export default BannedWordListConfig;
