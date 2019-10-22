import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { FormField, Label } from "coral-admin/ui/components";
import { HorizontalGutter } from "coral-ui/components";

import Description from "../../Description";
import Header from "../../Header";
import HelperText from "../../HelperText";
import SectionContent from "../../SectionContent";
import WordListTextArea from "./WordListTextArea";

import styles from "./BannedWordListConfig.css";

interface Props {
  disabled: boolean;
}

const BannedWordListConfig: FunctionComponent<Props> = ({ disabled }) => (
  <HorizontalGutter spacing={3}>
    <Localized id="configure-wordList-banned-bannedWordsAndPhrases">
      <Header>Banned words and phrases</Header>
    </Localized>
    <SectionContent>
      <Localized id="configure-wordList-banned-explanation" strong={<strong />}>
        <Description>
          Comments containing a word or phrase in the banned words list are
          automatically rejected and are not published.
        </Description>
      </Localized>

      <FormField>
        <HorizontalGutter spacing={1}>
          <Localized id="configure-wordList-banned-wordList">
            <Label htmlFor="configure-wordlist-banned">Banned word list</Label>
          </Localized>
          <Localized id="configure-wordList-banned-wordListDetailInstructions">
            <HelperText>
              Separate banned words or phrases with a new line. Words/phrases
              are not case sensitive.
            </HelperText>
          </Localized>
        </HorizontalGutter>
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
