import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

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

import styles from "./BannedWordListConfig.css";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment BannedWordListConfig_formValues on Settings {
    wordList {
      banned
    }
  }
`;

interface Props {
  disabled: boolean;
}

const BannedWordListConfig: FunctionComponent<Props> = ({ disabled }) => (
  <ConfigBox
    title={
      <Localized id="configure-wordList-banned-bannedWordsAndPhrases">
        <Header container="h2">Banned words and phrases</Header>
      </Localized>
    }
  >
    <Localized
      id="configure-wordList-banned-explanation"
      elems={{ strong: <strong /> }}
    >
      <FormFieldDescription>
        Comments containing a word or phrase in the banned words list are
        automatically rejected and are not published.
      </FormFieldDescription>
    </Localized>

    <FormField>
      <FormFieldHeader>
        <Localized id="configure-wordList-banned-wordList">
          <Label htmlFor="configure-wordlist-banned">Banned word list</Label>
        </Localized>
        <Localized id="configure-wordList-banned-wordListDetailInstructions">
          <HelperText>
            Separate banned words or phrases with a new line. Words/phrases are
            not case sensitive.
          </HelperText>
        </Localized>
      </FormFieldHeader>
      <WordListTextArea
        id="configure-wordlist-banned"
        name={"wordList.banned"}
        disabled={disabled}
        className={styles.textArea}
      />
    </FormField>
  </ConfigBox>
);

export default BannedWordListConfig;
