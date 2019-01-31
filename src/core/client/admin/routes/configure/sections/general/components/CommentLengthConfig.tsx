import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { Field } from "react-final-form";

import { validatePositiveWholeNumber } from "talk-framework/lib/validation";
import {
  FormField,
  HorizontalGutter,
  InputLabel,
  TextField,
  Typography,
  ValidationMessage,
} from "talk-ui/components";

import Header from "../../../components/Header";
import OnOffField from "../../../components/OnOffField";

import { formatEmpty, parseEmptyAsNull } from "talk-framework/lib/form";
import styles from "./CommentLengthConfig.css";

interface Props {
  disabled: boolean;
}

const CommentLengthConfig: StatelessComponent<Props> = ({ disabled }) => (
  <HorizontalGutter size="oneAndAHalf" container="fieldset">
    <Localized id="configure-general-commentLength-title">
      <Header container="legend">Comment Length</Header>
    </Localized>
    <Localized
      id="configure-general-commentLength-setLimit"
      strong={<strong />}
    >
      <Typography variant="detail">
        Set a limit on the length of comments sitewide
      </Typography>
    </Localized>

    <FormField>
      <Localized id="configure-general-commentLength-limitCommentLength">
        <InputLabel>Limit Comment Length</InputLabel>
      </Localized>
      <OnOffField name="charCount.enabled" disabled={disabled} />
    </FormField>

    <FormField>
      <Localized id="configure-general-commentLength-minCommentLength">
        <InputLabel htmlFor="configure-general-commentLength-min">
          Minimum Comment Length
        </InputLabel>
      </Localized>
      <Field
        name="charCount.min"
        validate={validatePositiveWholeNumber}
        parse={parseEmptyAsNull}
        format={formatEmpty}
      >
        {({ input, meta }) => (
          <>
            <TextField
              id="configure-general-commentLength-min"
              className={styles.commentLengthTextInput}
              name={input.name}
              onChange={input.onChange}
              value={input.value}
              disabled={disabled}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              adornment={
                <Localized id="configure-general-commentLength-characters">
                  <Typography variant="bodyCopy">Characters</Typography>
                </Localized>
              }
              placeholder={"E.g. 2"}
              textAlignCenter
            />
            {meta.touched &&
              (meta.error || meta.submitError) && (
                <ValidationMessage>
                  {meta.error || meta.submitError}
                </ValidationMessage>
              )}
          </>
        )}
      </Field>
    </FormField>
    <FormField>
      <Localized id="configure-general-commentLength-maxCommentLength">
        <InputLabel htmlFor="configure-general-commentLength-max">
          Maximum Comment Length
        </InputLabel>
      </Localized>
      <Field
        name="charCount.max"
        validate={validatePositiveWholeNumber}
        parse={parseEmptyAsNull}
        format={formatEmpty}
      >
        {({ input, meta }) => (
          <>
            <TextField
              id="configure-general-commentLength-max"
              className={styles.commentLengthTextInput}
              name={input.name}
              onChange={input.onChange}
              value={input.value}
              disabled={disabled}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              adornment={
                <Localized id="configure-general-commentLength-characters">
                  <Typography variant="bodyCopy">Characters</Typography>
                </Localized>
              }
              placeholder={"E.g. 1000"}
              textAlignCenter
            />
            {meta.touched &&
              (meta.error || meta.submitError) && (
                <ValidationMessage>
                  {meta.error || meta.submitError}
                </ValidationMessage>
              )}
          </>
        )}
      </Field>
    </FormField>
  </HorizontalGutter>
);

export default CommentLengthConfig;
