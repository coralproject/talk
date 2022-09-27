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

import styles from "./SuspectWordListConfig.css";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment SuspectWordListConfig_formValues on Settings {
    wordList {
      suspect
    }
    premoderateSuspectWords
  }
`;

interface Props {
  disabled: boolean;
  premoderateSuspectWords?: boolean;
}

const SuspectWordListConfig: FunctionComponent<Props> = ({
  disabled,
  premoderateSuspectWords,
}) => (
  <ConfigBox
    title={
      <Localized id="configure-wordList-suspect-bannedWordsAndPhrases">
        <Header container="h2">Suspect words and phrases</Header>
      </Localized>
    }
  >
    {premoderateSuspectWords ? (
      <Localized
        id="configure-wordList-suspect-explanationSuspectWordsList"
        elems={{ strong: <strong /> }}
      >
        <FormFieldDescription>
          Comments containing a word or phrase in the Suspect Words List are
          placed into the Pending Queue for moderator review and are not
          published unless approved by a moderator.
        </FormFieldDescription>
      </Localized>
    ) : (
      <Localized
        id="configure-wordList-suspect-explanation"
        elems={{ strong: <strong /> }}
      >
        <FormFieldDescription>
          Comments containing a word or phrase in the Suspect Words List are
          placed into the Reported Queue for moderator review and are published
          (if comments are not pre-moderated).
        </FormFieldDescription>
      </Localized>
    )}

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
